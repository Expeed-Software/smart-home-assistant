"use client";

import { useState } from "react";
import { House } from "lucide-react";
import { Command } from "@/components/command";
import { Decisions } from "@/components/decisions";
import { buttonVariants } from "@/components/ui/button";
import { useHome } from "@/hooks/use-home";
import type { TActionError, TActionRequest, TActionResponse } from "@/lib/types";

/** Where the source code lives. */
const REPO_URL = "https://github.com/Expeed-Software/smart-home-control";

/**
 * The right panel: the app's name, the command box, and the decisions underneath.
 * It sends each command with the home as it stands, and applies the devices the
 * API says it changed.
 */
export function Assistant() {
  const { rooms, devices, changeDevices } = useHome();
  const [response, setResponse] = useState<TActionResponse | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Command disables itself while a request is out, so only one is ever in flight.
  // It hands over the command already trimmed and never empty.
  async function submit(command: string) {
    setPending(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch("/api/actions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ command, home: { rooms, devices } } satisfies TActionRequest),
      });
      const payload: unknown = await res.json();
      if (!res.ok) {
        setError((payload as TActionError).message);
        return;
      }
      const next = payload as TActionResponse;
      setResponse(next);
      changeDevices(next.actions);
    } catch {
      setError("Could not reach the app server.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="grid gap-3 border-b border-border p-4">
        <div className="flex items-center gap-2">
          <House className="size-4" />
          <h1 className="flex-1 truncate font-heading text-sm font-medium">Smart Home Assistant</h1>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Source code on GitHub"
            title="Source code on GitHub"
            className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
          >
            <GithubIcon />
          </a>
        </div>
        <Command pending={pending} onSubmit={submit} />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
      <div className="flex-1 overflow-y-auto">
        {response ? (
          <>
            <p className="px-4 pt-4 text-xs text-muted-foreground">
              <span className="font-mono">{response.latencyMs}ms</span> {"·"}{" "}
              <span className="font-mono">{response.tokens}</span> input tokens
            </p>
            <Decisions decisions={response.decisions} />
          </>
        ) : (
          <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
            Ask for something and the decisions show up here.
          </div>
        )}
      </div>
    </div>
  );
}

/** The GitHub mark. lucide-react ships no brand icons, so it is drawn here. */
function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-4">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-1.97c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}
