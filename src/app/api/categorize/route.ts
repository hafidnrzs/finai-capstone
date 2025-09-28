import { NextResponse } from "next/server";
import { aiProvider } from "@/app/lib/ai/service";

export async function POST(req: Request) {
  try {
    // 1. Get both description and transactionType from the request body
    const { description, transactionType } = await req.json();

    // 2. Validate that both required fields are present
    if (!description || !transactionType) {
      return NextResponse.json(
        { error: "Description and transactionType are required" },
        { status: 400 },
      );
    }

    // 3. Validate the transactionType value
    if (transactionType !== "expense" && transactionType !== "income") {
      return NextResponse.json(
        { error: 'Invalid transactionType. Must be "expense" or "income".' },
        { status: 400 },
      );
    }

    // 4. Pass both arguments to the categorizer service
    const category = await aiProvider.categorize(description, transactionType);

    return NextResponse.json({ category });
  } catch (error) {
    console.error("AI API Error:", error);
    // Be careful not to leak sensitive error details in production
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: "Failed to categorize transaction", details: errorMessage },
      { status: 500 },
    );
  }
}
