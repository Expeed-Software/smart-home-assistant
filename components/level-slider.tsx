"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";

/**
 * A one-thumb slider with a live read-out.
 *
 * Two details it exists to get right, in the one place rather than at every call
 * site. The shadcn wrapper counts thumbs from the value it is handed and falls back
 * to [min, max] - two thumbs - for a scalar, so the value has to be an array of one.
 * And the value is committed on release, not on every pointer move: dragging a
 * brightness slider should not update the whole home sixty times a
 * second. While a drag is in progress the dragged value is what is shown, and
 * afterwards the stored value takes over again.
 */
export function LevelSlider({
  label,
  value,
  min,
  max,
  suffix = "",
  onCommit,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix?: string;
  onCommit: (value: number) => void;
}) {
  const [dragged, setDragged] = useState<number | null>(null);
  const shown = dragged ?? value;

  return (
    <div className="grid gap-1.5">
      <div className="flex items-baseline justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className="font-mono">
          {shown}
          {suffix}
        </span>
      </div>
      <Slider
        value={[shown]}
        min={min}
        max={max}
        step={1}
        onValueChange={(next) => setDragged(first(next, shown))}
        onValueCommitted={(next) => {
          setDragged(null);
          onCommit(first(next, shown));
        }}
      />
    </div>
  );
}

function first(value: number | readonly number[], fallback: number): number {
  if (typeof value === "number") return value;
  return value.length > 0 ? value[0] : fallback;
}
