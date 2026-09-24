import { TypeSafeClient } from "@typesafe-ai/sdk";
import { applyAnswers } from "./apply-answers";
import { buildDecisions } from "./build-decisions";
import { buildQuestions, optionsOf } from "./build-questions";
import { MAX_COMMAND_LENGTH } from "@/lib/constants";
import type { TActionError, TActionRequest, TActionResponse } from "@/lib/types";

const client = new TypeSafeClient({
  // Five questions in one call; the 10s default is tight.
  timeout: 20_000,
  // One retry only - someone waiting to turn a light off would rather fail fast.
  retry: { maxRetries: 1 },
});

function errorResponse(message: string, status: number) {
  return Response.json({ message } satisfies TActionError, { status });
}

/** The request body, or null when it is not a command and a home. */
async function readRequest(req: Request): Promise<TActionRequest | null> {
  let body: Partial<TActionRequest>;
  try {
    body = await req.json();
  } catch {
    return null;
  }
  const { command, home } = body ?? {};
  if (typeof command !== "string" || command.trim().length === 0) return null;
  if (command.length > MAX_COMMAND_LENGTH) return null;
  if (!home || !Array.isArray(home.rooms) || !Array.isArray(home.devices)) return null;
  return { command, home };
}

export async function POST(req: Request) {
  const request = await readRequest(req);
  if (!request) return errorResponse("That request could not be read.", 400);

  // The questions are built here, from the home - the caller never supplies them.
  // The systemOne state is the command and the home; the questions only name the
  // rooms and devices they offer.
  const { command, home } = request;
  const options = optionsOf(home);
  const questions = buildQuestions(options);

  // Measured around the round trip only, because SystemOneResult carries no timing
  // of its own. This includes SDK retries, which is honest for a UI claiming speed.
  const started = performance.now();
  try {
    const result = await client.systemOne(
      { state: { command, home }, questions },
      { signal: req.signal },
    );
    const latencyMs = Math.round(performance.now() - started);

    // Worked out here, so the browser just shows the decisions and applies the
    // changed devices.
    return Response.json({
      latencyMs,
      tokens: result.usage.input_tokens,
      decisions: buildDecisions(questions, result.answers, options),
      actions: applyAnswers(result.answers, home),
    } satisfies TActionResponse);
  } catch (error) {
    // The details stay in the server log; the browser only needs to know it failed.
    console.error(error);
    return errorResponse("Something went wrong. Please try again.", 500);
  }
}
