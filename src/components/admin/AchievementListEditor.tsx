"use client";

import { Plus, X } from "lucide-react";

interface AchievementListEditorProps {
  achievements: string[];
  onChange: (achievements: string[]) => void;
}

export function AchievementListEditor({ achievements, onChange }: AchievementListEditorProps) {
  function updateAt(index: number, value: string) {
    const next = [...achievements];
    next[index] = value;
    onChange(next);
  }

  function removeAt(index: number) {
    onChange(achievements.filter((_, i) => i !== index));
  }

  function add() {
    onChange([...achievements, ""]);
  }

  return (
    <div className="space-y-2">
      {achievements.map((achievement, index) => (
        <div key={index} className="flex gap-2">
          <input
            value={achievement}
            onChange={(e) => updateAt(index, e.target.value)}
            placeholder="e.g. Cut deploy time by 40%"
            className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 transition-shadow focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <button
            type="button"
            onClick={() => removeAt(index)}
            aria-label="Remove achievement"
            className="rounded-md p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 rounded-md px-1 py-1 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        <Plus className="h-3.5 w-3.5" /> Add achievement
      </button>
    </div>
  );
}
