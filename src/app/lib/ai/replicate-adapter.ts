import Replicate from "replicate";
import { ITransactionCategorizer } from "./interface";

class ReplicateAdapter implements ITransactionCategorizer {
  private replicate: Replicate;

  constructor() {
    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error("REPLICATE_API_TOKEN is not set");
    }
    this.replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });
  }

  async categorize(description: string): Promise<string> {
    const modelIdentifier =
      "ibm-granite/granite-3.3-8b-instruct:618ecbe80773609e96ea19d8c96e708f6f2b368bb89be8fad509983194466bf8";
    const prompt = `
      Categorize the transaction description into one of these categories: 
      [Shopping, Transportation, Food & Drink, Bills & Utilities, Health, Entertainment, Income, Other].
      Transaction: "${description}"
      Respond with only the English category name. If there is no match, categorize as Other.
      Category:`;

    const output = await this.replicate.run(modelIdentifier, {
      input: { prompt },
    });

    return (output as string[]).join("").trim();
  }
}

export const replicateAdapter = new ReplicateAdapter();
