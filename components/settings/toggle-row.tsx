"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function ToggleRow({
  title,
  description,
  enabled: initialEnabled
}: {
  title: string;
  description: string;
  enabled: boolean;
}) {
  const [enabled, setEnabled] = useState(initialEnabled);

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border/70 bg-card/70 p-4">
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
      <button
        type="button"
        aria-pressed={enabled}
        onClick={() => setEnabled((current) => !current)}
        className={cn("relative h-7 w-12 rounded-full transition-colors", enabled ? "bg-primary" : "bg-muted")}
      >
        <span
          className={cn(
            "absolute top-1 h-5 w-5 rounded-full bg-white transition-transform",
            enabled ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
}
