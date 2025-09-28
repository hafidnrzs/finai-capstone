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
    type: "expense" | "income",
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
      Kamu adalah pelatih keuangan yang ramah dan suportif bernama FinAI.
      Analisa ringkasan keuangan bulanan pengguna berikut.
      
      Data Pengguna:
      - Total Pemasukan: ${totalIncome}
      - Total Pengeluaran: ${totalExpenses}
      - Kategori Pengeluaran Terbesar: ${topExpenses
        .map((e) => `${e.category} (${e.amount})`)
        .join(", ")}

      Instruksi:
      1. Jika total pengeluaran lebih dari 90% pemasukan, sampaikan kekhawatiran secara halus tentang tingginya pengeluaran dan tunjukkan kategori pengeluaran terbesar sebagai area penghematan.
      2. Jika pemasukan jauh lebih besar dari pengeluaran (misal lebih dari dua kali lipat), beri pujian atas arus kas dan kebiasaan menabung yang baik.
      3. Jika tidak, berikan tips netral dan bermanfaat terkait kategori pengeluaran terbesar.
      4. Jawaban maksimal dua kalimat, langsung ke poin, dan gunakan bahasa yang menyemangati.

      Insight:`;

    const response = await this.genAI.models.generateContent({
      model: this.model,
      contents: prompt,
    });
    let result = response.text?.trim() || "";
    if (result.startsWith('"') && result.endsWith('"')) {
      result = result.slice(1, -1);
    }
    return result;
  }
}

export const geminiAdapter = new GeminiAdapter();
