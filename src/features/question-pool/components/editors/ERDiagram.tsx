"use client";

import type { DatabaseSchema } from "../../types";

export function ERDiagram({ schema }: { schema: DatabaseSchema | null }) {
  if (!schema) {
    return (
      <div className="flex h-40 items-center justify-center rounded-[12px] border border-dashed border-[rgba(15,23,42,0.1)] text-[12px] text-muted">
        Select a schema to preview tables
      </div>
    );
  }

  const w = 280;
  const h = Math.max(160, schema.tables.length * 44 + 24);

  return (
    <div className="overflow-hidden rounded-[12px] border border-[rgba(15,23,42,0.08)] bg-[rgba(15,23,42,0.02)] p-3 dark:bg-white/[0.02]">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" aria-label={`${schema.label} ER diagram`}>
        {schema.tables.map((table, i) => {
          const y = 12 + i * 44;
          return (
            <g key={table.name}>
              <rect
                x={16}
                y={y}
                width={w - 32}
                height={36}
                rx={8}
                fill="white"
                stroke="rgba(124,58,237,0.25)"
                strokeWidth={1}
              />
              <text x={28} y={y + 14} className="fill-[#1a1626] text-[10px] font-semibold">
                {table.name}
              </text>
              <text x={28} y={y + 28} className="fill-[#9994a8] text-[8px]">
                {table.columns.slice(0, 3).join(", ")}
                {table.columns.length > 3 ? "…" : ""}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
