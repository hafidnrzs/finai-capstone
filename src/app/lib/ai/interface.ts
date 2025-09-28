// A summary of monthly data we'll send to the AI
export interface MonthlySummary {
  totalIncome: number;
  totalExpenses: number;
  topExpenses: { category: string; amount: number }[];
}

export interface IAIProvider {
  categorize(description: string, type: "expense" | "income"): Promise<string>;
  generateInsight(summary: MonthlySummary): Promise<string>;
}
