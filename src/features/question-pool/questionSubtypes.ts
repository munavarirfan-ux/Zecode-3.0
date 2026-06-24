import type { QuestionSubtype, QuestionType } from "./types";

export type SubtypeOption = {
  id: QuestionSubtype;
  label: string;
};

export const SUBTYPE_OPTIONS_BY_TYPE: Record<QuestionType, SubtypeOption[]> = {
  coding: [
    { id: "backend", label: "Backend" },
    { id: "frontend", label: "Frontend" },
  ],
  database: [],
  mcq: [],
  comprehension: [],
  "open-ended": [],
  "fill-blank": [],
  debug: [],
};

const _allSubtypeIds = Object.values(SUBTYPE_OPTIONS_BY_TYPE).flatMap((opts) =>
  opts.map((o) => o.id),
);

export const ALL_QUESTION_SUBTYPES = _allSubtypeIds as [
  QuestionSubtype,
  ...QuestionSubtype[],
];

export function getSubtypeOptions(type: QuestionType): SubtypeOption[] {
  return SUBTYPE_OPTIONS_BY_TYPE[type];
}

export function typeRequiresSubtype(type: QuestionType): boolean {
  return getSubtypeOptions(type).length > 0;
}

export function isSubtypeForType(type: QuestionType, subtype: string): subtype is QuestionSubtype {
  return SUBTYPE_OPTIONS_BY_TYPE[type].some((o) => o.id === subtype);
}

export function parseSubtypeParam(
  type: QuestionType,
  raw?: string,
): QuestionSubtype | undefined {
  if (!raw) return undefined;
  return isSubtypeForType(type, raw) ? raw : undefined;
}

export function getSubtypeLabel(subtype: QuestionSubtype): string {
  for (const options of Object.values(SUBTYPE_OPTIONS_BY_TYPE)) {
    const match = options.find((o) => o.id === subtype);
    if (match) return match.label;
  }
  return subtype;
}
