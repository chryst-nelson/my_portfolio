"use client";

import { Check } from "lucide-react";
import type { SkillResponse } from "@/lib/api/types";

interface SkillMultiSelectProps {
  skills: SkillResponse[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}

export function SkillMultiSelect({ skills, selectedIds, onChange }: SkillMultiSelectProps) {
  function toggle(id: number) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((existing) => existing !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  }

  if (skills.length === 0) {
    return <p className="text-sm text-slate-500">No skills yet — add some under Skills first.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => {
        const selected = selectedIds.includes(skill.id);
        return (
          <button
            type="button"
            key={skill.id}
            onClick={() => toggle(skill.id)}
            aria-pressed={selected}
            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 ${
              selected
                ? "border-indigo-600 bg-indigo-600 text-white"
                : "border-slate-300 text-slate-700 hover:border-slate-400"
            }`}
          >
            {selected && <Check className="h-3.5 w-3.5" strokeWidth={2.5} />}
            {skill.name}
          </button>
        );
      })}
    </div>
  );
}
