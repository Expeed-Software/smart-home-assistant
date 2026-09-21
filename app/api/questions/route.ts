import { TypeSafeClient } from "@typesafe-ai/sdk";

/**
 * Thin proxy to Jev. The client builds the questions and passes them straight
 * through; all this adds is the API key, which must never reach the browser.
 */
export async function POST(req: Request) {
  if (!process.env.TYPESAFE_API_KEY) {
    return Response.json(
      { error: "TYPESAFE_API_KEY is not set in environment." },
      { status: 500 },
    );
  }

  try {
    const { state, questions } = await req.json();
    const client = new TypeSafeClient();
    const result = await client.systemOne({ state, questions });
    return Response.json(result);
  } catch {
    return Response.json(
      { error: "Request to Typesafe API failed." },
      { status: 500 },
    );
  }
}
