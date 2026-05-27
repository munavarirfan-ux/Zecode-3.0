"use client";

import { Database, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { DATABASE_SCHEMAS } from "../../mockData";
import type { DatabaseSchemaId } from "../../types";

export function SchemaPickerCards({
  value,
  onChange,
}: {
  value: DatabaseSchemaId | "";
  onChange: (id: DatabaseSchemaId) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        {DATABASE_SCHEMAS.map((schema) => {
          const active = value === schema.id;
          return (
            <button
              key={schema.id}
              type="button"
              onClick={() => onChange(schema.id)}
              className={cn(
                "rounded-[14px] border p-4 text-left transition-all",
                active
                  ? "border-[var(--qp-type-database)] bg-[color-mix(in_srgb,var(--qp-type-database)_10%,transparent)] shadow-[0_0_0_1px_color-mix(in_srgb,var(--qp-type-database)_35%,transparent)]"
                  : "border-[rgba(15,23,42,0.08)] hover:border-[rgba(6,182,212,0.35)]",
              )}
            >
              <Database className="h-5 w-5 text-[var(--qp-type-database)]" strokeWidth={1.5} />
              <p className="mt-2 text-[13px] font-semibold text-text">{schema.label}</p>
              <p className="mt-0.5 font-mono text-[10px] text-muted">{schema.id}</p>
              <p className="mt-2 text-[10px] text-text-secondary/70">
                {schema.tables.length} tables
              </p>
            </button>
          );
        })}
      </div>
      <label
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-[12px] border border-dashed border-[rgba(15,23,42,0.12)]",
          "px-4 py-6 text-center hover:border-[rgba(6,182,212,0.35)] hover:bg-[rgba(6,182,212,0.04)]",
        )}
      >
        <Upload className="h-5 w-5 text-muted" />
        <span className="mt-2 text-[12px] font-medium text-text">Upload custom schema</span>
        <input type="file" accept=".sql,.json" className="sr-only" />
      </label>
    </div>
  );
}
