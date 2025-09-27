import { NextResponse } from "next/server";
import { categorizer } from "@/app/lib/ai/service";

export async function POST(req: Request) {
  try {
    // Get the transaction description from the request body
    const { description } = await req.json();

    if (!description) {
      return NextResponse.json(
        { error: "Transaction description is required" },
        { status: 400 }
      );
    }

    // Use the adapter without knowing the AI API
    const category = await categorizer.categorize(description);

    return NextResponse.json({ category });
  } catch (error) {
    console.error("Replicate API Error:", error);
    return NextResponse.json(
      { error: "Failed to categorize transaction" },
      { status: 500 }
    );
  }
}
