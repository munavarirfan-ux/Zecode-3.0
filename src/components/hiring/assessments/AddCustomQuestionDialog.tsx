"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type {
  QuestionDifficulty,
  QuestionPoolCategory,
  SelectedAssessmentQuestion,
} from "@/lib/hiring/assessments/types";
import { PROGRAMMING_LANGUAGES } from "@/lib/hiring/assessments/types";

const NESTED_DIALOG_Z = "z-[240]";
const inputClass = "text-[13px] focus-visible:ring-2 focus-visible:ring-accent/25";
const DIFFICULTIES: QuestionDifficulty[] = ["Easy", "Medium", "Hard", "Expert"];

type CodingTrack = "frontend" | "backend";

function emptyForm(category: QuestionPoolCategory) {
  return {
    title: "",
    body: "",
    difficulty: "Medium" as QuestionDifficulty,
    marks: 10,
    weightage: 1,
    language: "JavaScript",
    options: "",
    correctAnswer: "",
    passage: "",
    expectedOutput: "",
    testCases: "",
    codingTrack: null as CodingTrack | null,
  };
}

function resolveTitle(
  form: ReturnType<typeof emptyForm>,
  category: QuestionPoolCategory,
): string {
  const explicit = form.title.trim();
  if (explicit) return explicit;

  const bodyLine = form.body.trim().split("\n").find((l) => l.trim())?.trim();
  if (bodyLine) return bodyLine.slice(0, 200);

  if (category === "MCQ") {
    const opt = form.options.trim().split("\n").find((l) => l.trim())?.trim();
    if (opt) return opt.slice(0, 200);
  }

  if (category === "Comprehension" && form.passage.trim()) {
    return form.passage.trim().slice(0, 80) + "…";
  }

  if (category === "Debug Snippet" && form.body.trim()) {
    return "Debug snippet question";
  }

  return "";
}

function canSubmit(
  form: ReturnType<typeof emptyForm>,
  category: QuestionPoolCategory,
  needsCodingTrack: boolean,
): boolean {
  if (needsCodingTrack) return false;
  const title = resolveTitle(form, category);
  if (!title) return false;

  switch (category) {
    case "Coding":
      return Boolean(form.body.trim());
    case "Database":
      return Boolean(form.body.trim());
    case "MCQ":
      return Boolean(form.options.trim() && form.correctAnswer.trim());
    case "Comprehension":
      return Boolean(form.passage.trim());
    case "Open Ended":
      return Boolean(form.body.trim() || form.title.trim());
    case "Fill in the Blanks":
      return Boolean(form.body.trim() && form.correctAnswer.trim());
    case "Debug Snippet":
      return Boolean(form.body.trim());
    default:
      return true;
  }
}

export function AddCustomQuestionDialog({
  open,
  onOpenChange,
  category,
  sortOrder,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: QuestionPoolCategory;
  sortOrder: number;
  onAdd: (question: SelectedAssessmentQuestion) => void;
}) {
  const [form, setForm] = useState(emptyForm(category));
  const needsCodingTrack = category === "Coding" && form.codingTrack === null;
  const submitReady = useMemo(() => canSubmit(form, category, needsCodingTrack), [form, category, needsCodingTrack]);

  useEffect(() => {
    if (open) setForm(emptyForm(category));
  }, [open, category]);

  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  const handleAdd = () => {
    const title = resolveTitle(form, category);
    if (!canSubmit(form, category, needsCodingTrack)) {
      toast.error("Complete required fields", {
        description: needsCodingTrack
          ? "Choose Frontend or Backend to continue."
          : "Add a title or problem statement before adding the question.",
      });
      return;
    }

    const id = `custom-${Date.now()}`;
    const question: SelectedAssessmentQuestion = {
      id: `sel-${id}`,
      poolQuestionId: id,
      title,
      type: category,
      difficulty: form.difficulty,
      marks: form.marks,
      weightage: form.weightage,
      timeLimitMinutes: Math.max(5, Math.round(form.marks * 2)),
      required: true,
      sortOrder,
      isCustom: true,
    };
    onAdd(question);
    onOpenChange(false);
    toast.success("Custom question added");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        overlayClassName={cn(NESTED_DIALOG_Z, "bg-[rgba(15,23,42,0.5)] backdrop-blur-[4px]")}
        className={cn(NESTED_DIALOG_Z, "max-h-[min(90dvh,720px)] max-w-lg overflow-y-auto")}
      >
        <DialogHeader>
          <DialogTitle>Add custom question</DialogTitle>
          <DialogDescription>{category} · define your own question for this assessment</DialogDescription>
        </DialogHeader>

        {needsCodingTrack ? (
          <div className="space-y-3 py-2">
            <p className="text-[12px] font-medium text-text-secondary">Choose coding track</p>
            <div className="grid grid-cols-2 gap-2">
              {(["frontend", "backend"] as const).map((track) => (
                <button
                  key={track}
                  type="button"
                  onClick={() => set({ codingTrack: track })}
                  className={cn(
                    "rounded-xl border px-4 py-3 text-[13px] font-semibold capitalize transition-colors",
                    "border-[rgba(15,23,42,0.08)] hover:border-accent/25 hover:bg-accent/[0.04]",
                  )}
                >
                  {track}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {category === "Comprehension" ? (
              <FormField label="Passage" required>
                <Textarea
                  value={form.passage}
                  onChange={(e) => set({ passage: e.target.value })}
                  rows={4}
                  className={cn(inputClass, "min-h-[96px]")}
                  placeholder="Reading passage text…"
                />
              </FormField>
            ) : null}

            {category !== "Fill in the Blanks" && category !== "Debug Snippet" ? (
              <FormField label={category === "Comprehension" ? "Question" : "Question title"} required>
                <Input
                  value={form.title}
                  onChange={(e) => set({ title: e.target.value })}
                  className={cn(inputClass, "h-10")}
                  placeholder="Question title"
                />
              </FormField>
            ) : null}

            {category === "Coding" ? (
              <>
                <p className="text-[11px] font-medium text-muted capitalize">Track: {form.codingTrack}</p>
                <FormField label="Problem statement" required>
                  <Textarea
                    value={form.body}
                    onChange={(e) => set({ body: e.target.value })}
                    rows={4}
                    className={cn(inputClass, "min-h-[96px]")}
                  />
                </FormField>
                <FormField label="Programming language">
                  <Select value={form.language} onValueChange={(v) => set({ language: v })}>
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-[250]">
                      {PROGRAMMING_LANGUAGES.map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="Test cases">
                  <Textarea
                    value={form.testCases}
                    onChange={(e) => set({ testCases: e.target.value })}
                    rows={3}
                    className={inputClass}
                    placeholder="Input / expected output pairs"
                  />
                </FormField>
                <FormField label="Expected output">
                  <Textarea
                    value={form.expectedOutput}
                    onChange={(e) => set({ expectedOutput: e.target.value })}
                    rows={2}
                    className={inputClass}
                  />
                </FormField>
              </>
            ) : null}

            {category === "Database" ? (
              <FormField label="SQL / problem statement" required>
                <Textarea
                  value={form.body}
                  onChange={(e) => set({ body: e.target.value })}
                  rows={4}
                  className={cn(inputClass, "min-h-[96px]")}
                />
              </FormField>
            ) : null}

            {category === "MCQ" ? (
              <>
                <FormField label="Options" required>
                  <Textarea
                    value={form.options}
                    onChange={(e) => set({ options: e.target.value })}
                    rows={3}
                    className={inputClass}
                    placeholder="One option per line"
                  />
                </FormField>
                <FormField label="Correct answer" required>
                  <Input
                    value={form.correctAnswer}
                    onChange={(e) => set({ correctAnswer: e.target.value })}
                    className={cn(inputClass, "h-10")}
                  />
                </FormField>
              </>
            ) : null}

            {category === "Comprehension" ? (
              <FormField label="Answer type">
                <Input
                  value={form.correctAnswer}
                  onChange={(e) => set({ correctAnswer: e.target.value })}
                  className={cn(inputClass, "h-10")}
                  placeholder="e.g. Short text, MCQ"
                />
              </FormField>
            ) : null}

            {category === "Open Ended" ? (
              <FormField label="Expected answer guideline" required>
                <Textarea
                  value={form.body}
                  onChange={(e) => set({ body: e.target.value })}
                  rows={3}
                  className={inputClass}
                />
              </FormField>
            ) : null}

            {category === "Fill in the Blanks" ? (
              <>
                <FormField label="Question text" required>
                  <Textarea
                    value={form.body}
                    onChange={(e) => set({ body: e.target.value })}
                    rows={3}
                    className={inputClass}
                    placeholder="Text with ___ blanks"
                  />
                </FormField>
                <FormField label="Correct blank answer" required>
                  <Input
                    value={form.correctAnswer}
                    onChange={(e) => set({ correctAnswer: e.target.value })}
                    className={cn(inputClass, "h-10")}
                  />
                </FormField>
              </>
            ) : null}

            {category === "Debug Snippet" ? (
              <>
                <FormField label="Code snippet" required>
                  <Textarea
                    value={form.body}
                    onChange={(e) => set({ body: e.target.value })}
                    rows={5}
                    className={cn(inputClass, "font-mono text-[12px]")}
                  />
                </FormField>
                <FormField label="Bug description">
                  <Textarea
                    value={form.passage}
                    onChange={(e) => set({ passage: e.target.value })}
                    rows={2}
                    className={inputClass}
                  />
                </FormField>
                <FormField label="Expected fix">
                  <Textarea
                    value={form.expectedOutput}
                    onChange={(e) => set({ expectedOutput: e.target.value })}
                    rows={2}
                    className={inputClass}
                  />
                </FormField>
              </>
            ) : null}

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Difficulty">
                <Select value={form.difficulty} onValueChange={(v) => set({ difficulty: v as QuestionDifficulty })}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[250]">
                    {DIFFICULTIES.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Marks">
                <Input
                  type="number"
                  min={1}
                  value={form.marks}
                  onChange={(e) => set({ marks: Number(e.target.value) || 1 })}
                  className={cn(inputClass, "h-10")}
                />
              </FormField>
            </div>
            <FormField label="Weightage">
              <Input
                type="number"
                min={0.1}
                step={0.1}
                value={form.weightage}
                onChange={(e) => set({ weightage: Number(e.target.value) || 1 })}
                className={cn(inputClass, "h-10")}
              />
            </FormField>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {!needsCodingTrack ? (
            <Button
              type="button"
              className="bg-accent text-white hover:bg-accent-hover"
              disabled={!submitReady}
              onClick={handleAdd}
            >
              Add Question
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
