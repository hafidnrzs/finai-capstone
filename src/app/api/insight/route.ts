import { NextResponse } from "next/server";
import { aiProvider } from "@/app/lib/ai/service"; // We'll create this service file next

export async function POST(req: Request) {
  try {
    // The frontend will send the summary data to be analyzed
    const summary = await req.json();

    if (!summary) {
      return NextResponse.json(
        { error: "Monthly summary data is required" },
        { status: 400 }
      );
    }

    // Call the new insight generation method
    const insight = await aiProvider.generateInsight(summary);

    return NextResponse.json({ insight });
  } catch (error) {
    console.error("Insight API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate insight" },
      { status: 500 }
    );
  }
}
