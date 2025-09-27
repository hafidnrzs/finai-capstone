import { GoogleGenAI } from "@google/genai";
import { ITransactionCategorizer } from "./categorizer";

class GeminiAdapter implements ITransactionCategorizer {
  private genAI: GoogleGenAI;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set");
    }
    this.genAI = new GoogleGenAI({});
  }

  async categorize(description: string): Promise<string> {
    const response = await this.genAI.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: `
      Categorize the transaction description into one of these categories: 
      [Shopping, Transportation, Food & Drink, Bills & Utilities, Health, Entertainment, Income, Other].
      Transaction: "${description}"
      Respond with only the category name. If there is no match, categorize as Other.
      Category:`,
    });
    const category = response.text ?? "Other";

    return category;
  }
}

export const geminiAdapter = new GeminiAdapter();
