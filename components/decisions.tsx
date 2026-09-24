"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "cn";
import type { TChoice, TDecision } from "@/lib/types";

/**
 * The decisions from the latest answer - what was decided, how sure the model was,
 * and the choices it weighed.
 */
export function Decisions({ decisions }: { decisions: TDecision[] }) {
  return (
    <div className="grid gap-2 p-4">
      {decisions.map((decision) => (
        <DecisionCard key={decision.question} decision={decision} />
      ))}
    </div>
  );
}

function DecisionCard({ decision }: { decision: TDecision }) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="flex items-baseline gap-2 text-sm">
          <span className="flex-1 text-foreground">{decision.question}</span>
          <span className="font-mono text-xs text-muted-foreground">
            {percent(decision.confidence)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-1.5">
        {decision.choices.map((choice) => (
          <ChoiceRow
            key={choice.label}
            choice={choice}
            selected={choice.label === decision.choice}
          />
        ))}
      </CardContent>
    </Card>
  );
}

function ChoiceRow({ choice, selected }: { choice: TChoice; selected: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "w-40 shrink-0 truncate text-xs",
          selected ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {choice.label}
      </span>
      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
        <span
          className={cn(
            "block h-full rounded-full",
            selected ? "bg-primary" : "bg-muted-foreground/40",
          )}
          style={{ width: percent(choice.probability) }}
        />
      </span>
      <span className="w-9 shrink-0 text-right font-mono text-xs text-muted-foreground">
        {percent(choice.probability)}
      </span>
    </div>
  );
}

function percent(value: number): string {
  return `${Math.round(value * 100)}%`;
}
