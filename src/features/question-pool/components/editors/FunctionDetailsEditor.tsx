"use client";

import { Plus, Trash2 } from "lucide-react";
import * as Switch from "@radix-ui/react-switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { FunctionParameter } from "../../types";
import { RETURN_TYPES } from "../../types";

function newParamId() {
  return `p-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function FunctionDetailsEditor({
  functionName,
  returnType,
  parameters,
  onPatch,
}: {
  functionName: string;
  returnType: string;
  parameters: FunctionParameter[];
  onPatch: (patch: {
    functionName?: string;
    returnType?: string;
    parameters?: FunctionParameter[];
  }) => void;
}) {
  const updateParam = (id: string, patch: Partial<FunctionParameter>) => {
    onPatch({
      parameters: parameters.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    });
  };

  const removeParam = (id: string) => {
    onPatch({ parameters: parameters.filter((p) => p.id !== id) });
  };

  const addParam = () => {
    onPatch({
      parameters: [
        ...parameters,
        { id: newParamId(), name: "", type: "string", required: true },
      ],
    });
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-text">Function name</label>
          <input
            value={functionName}
            onChange={(e) => onPatch({ functionName: e.target.value })}
            placeholder="e.g. twoSum"
            className={cn(
              "h-9 w-full rounded-[10px] border border-[rgba(15,23,42,0.08)] bg-white/90 px-3 font-mono text-[13px] outline-none",
              "focus-visible:ring-2 focus-visible:ring-accent/20 dark:border-white/[0.08] dark:bg-white/[0.04]",
            )}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-text">Return type</label>
          <Select value={returnType} onValueChange={(v) => onPatch({ returnType: v })}>
            <SelectTrigger
              className="h-9 w-full rounded-[10px] border-[rgba(15,23,42,0.08)] bg-white/90 font-mono text-[13px] dark:border-white/[0.08] dark:bg-white/[0.04]"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RETURN_TYPES.map((t) => (
                <SelectItem key={t} value={t} className="font-mono text-[12px]">
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-[12px] font-semibold text-text">Parameters</h3>

        {parameters.length > 0 && (
          <div className="space-y-2">
            {parameters.map((param) => (
              <div
                key={param.id}
                className="flex items-center gap-2 rounded-[10px] border border-[rgba(15,23,42,0.08)] bg-white/80 p-2.5 dark:bg-white/[0.03]"
              >
                <input
                  value={param.name}
                  onChange={(e) => updateParam(param.id, { name: e.target.value })}
                  placeholder="name"
                  className={cn(
                    "h-8 flex-1 rounded-[8px] border border-[rgba(15,23,42,0.08)] bg-surface px-2.5 font-mono text-[12px] outline-none",
                    "focus-visible:ring-2 focus-visible:ring-accent/20",
                  )}
                />
                <input
                  value={param.type}
                  onChange={(e) => updateParam(param.id, { type: e.target.value })}
                  placeholder="type"
                  className={cn(
                    "h-8 w-28 rounded-[8px] border border-[rgba(15,23,42,0.08)] bg-surface px-2.5 font-mono text-[12px] outline-none",
                    "focus-visible:ring-2 focus-visible:ring-accent/20",
                  )}
                />
                <label className="flex items-center gap-1.5 text-[10px] text-muted">
                  Required
                  <Switch.Root
                    checked={param.required}
                    onCheckedChange={(required) => updateParam(param.id, { required })}
                    className="relative h-4 w-7 rounded-full bg-[rgba(15,23,42,0.12)] data-[state=checked]:bg-accent"
                  >
                    <Switch.Thumb className="block h-3 w-3 translate-x-0.5 rounded-full bg-white transition-transform data-[state=checked]:translate-x-3.5" />
                  </Switch.Root>
                </label>
                <button
                  type="button"
                  onClick={() => removeParam(param.id)}
                  className="rounded-[8px] p-1.5 text-muted hover:text-red-600"
                  aria-label="Remove parameter"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={addParam}
          className="inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-dashed border-[rgba(15,23,42,0.12)] px-3 text-[12px] font-medium text-accent hover:bg-[rgba(124,58,237,0.06)]"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Parameter
        </button>
      </div>

    </div>
  );
}
