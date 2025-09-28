import Replicate from "replicate";
import { IAIProvider, MonthlySummary } from "./interface";

const EXPENSE_CATEGORIES =
  "[Shopping, Transportation, Food & Drink, Bills & Utilities, Health, Entertainment, Other]";
const INCOME_CATEGORIES = "[Salary, Gigs, Refund, Other]";

class ReplicateAdapter implements IAIProvider {
  private replicate: Replicate;

  constructor() {
    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error("REPLICATE_API_TOKEN is not set");
    }
    this.replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });
  }

  async categorize(
    description: string,
    type: "expense" | "income",
  ): Promise<string> {
    const modelIdentifier =
      "ibm-granite/granite-3.3-8b-instruct:618ecbe80773609e96ea19d8c96e708f6f2b368bb89be8fad509983194466bf8";
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

    const output = await this.replicate.run(modelIdentifier, {
      input: { prompt },
    });

    return (output as string[]).join("").trim() || "Other";
  }

  async generateInsight(summary: MonthlySummary): Promise<string> {
    const { totalIncome, totalExpenses, topExpenses } = summary;

    const modelIdentifier =
      "ibm-granite/granite-3.3-8b-instruct:618ecbe80773609e96ea19d8c96e708f6f2b368bb89be8fad509983194466bf8";
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

    const output = await this.replicate.run(modelIdentifier, {
      input: { prompt },
    });
    let result = (output as string[]).join("").trim();
    if (result.startsWith('"') && result.endsWith('"')) {
      result = result.slice(1, -1);
    }
    return result;
  }
}

export const replicateAdapter = new ReplicateAdapter();
