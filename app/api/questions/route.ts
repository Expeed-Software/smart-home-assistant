import { TypeSafeClient } from "@typesafe-ai/sdk";

/**
 * Thin proxy to Jev. The client builds the questions and passes them straight
 * through; all this adds is the API key, which must never reach the browser.
 */
export async function POST(req: Request) {
  if (!process.env.TYPESAFE_API_KEY) {
    return Response.json(
      { error: "TYPESAFE_API_KEY is not set in environment variables." },
      { status: 503 },
    );
  }

  try {
    const { state, questions } = await req.json();
    const client = new TypeSafeClient();
    const result = await client.systemOne({ state, questions });
    return Response.json(result);
  } catch (error) {
    const status =
      typeof error === "object" && error !== null && "status" in error
        ? Number((error as { status: unknown }).status) || 500
        : 500;
    const message =
      error instanceof Error
        ? error.message
        : "Request to Typesafe API failed.";
    return Response.json({ error: message }, { status });
  }
}
