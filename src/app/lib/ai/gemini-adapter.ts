import { GoogleGenAI } from "@google/genai";
import { IAIProvider, MonthlySummary } from "./interface";

// Define the category lists based on your schema's 'type'
const EXPENSE_CATEGORIES =
  "[Shopping, Transportation, Food & Drink, Bills & Utilities, Health, Entertainment, Other]";
const INCOME_CATEGORIES = "[Salary, Gigs, Refund, Other]";

class GeminiAdapter implements IAIProvider {
  private genAI: GoogleGenAI;
  private model: string;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set");
    }
    this.genAI = new GoogleGenAI({});
    this.model = "gemini-2.0-flash-lite";
  }

  // The 'categorize' function now accepts the transaction 'type'
  async categorize(
    description: string,
    type: "expense" | "income"
  ): Promise<string> {
    // Dynamically select the category list and construct the prompt
    const categoryList =
      type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
    const prompt = `
      You are an expert financial assistant. Your task is to categorize an ${type.toUpperCase()} transaction.
      
      Choose the single best category from this specific list: ${categoryList}.
      
      Transaction Description: "${description}"
      
      Instructions:
      - Analyze the description carefully.
      - Respond with ONLY the category name from the list provided.
      - If no category is a good fit, respond with "Other".

      Category:`;

    const response = await this.genAI.models.generateContent({
      model: this.model,
      contents: prompt,
    });
    const category = response.text?.trim();

    return category || "Other";
  }

  async generateInsight(summary: MonthlySummary): Promise<string> {
    const { totalIncome, totalExpenses, topExpenses } = summary;

    const prompt = `
      You are a friendly and encouraging financial coach named FinAI.
      Analyze the user's financial summary for the current month.
      
      User's Data:
      - Total Income: ${totalIncome}
      - Total Expenses: ${totalExpenses}
      - Top Spending Categories: ${topExpenses
        .map((e) => `${e.category} (${e.amount})`)
        .join(", ")}

      Instructions:
      1.  If total expenses are more than 90% of income, gently express concern about the high spending. Point to the largest expense category as a potential area to save.
      2.  If total income is significantly higher than expenses (e.g., more than double), praise the user for their excellent cash flow and saving habits.
      3.  Otherwise, provide a neutral, helpful tip related to their biggest spending category.
      4.  Keep the response to one or two encouraging sentences. Address the user directly.

      Your Insight:`;

    const response = await this.genAI.models.generateContent({
      model: this.model,
      contents: prompt,
    });
    return response.text?.trim() || "";
  }
}

export const geminiAdapter = new GeminiAdapter();
