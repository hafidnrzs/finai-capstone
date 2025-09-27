// Any AI service we use must have a function that matches this signature.
export interface ITransactionCategorizer {
  categorize(description: string): Promise<string>;
}
