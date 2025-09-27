import { ITransactionCategorizer } from './categorizer';
import { geminiAdapter } from './gemini-adapter';
import { replicateAdapter } from './replicate-adapter';

let categorizer: ITransactionCategorizer;

// This is the switch. It reads the .env file and chooses the adapter.
if (process.env.AI_PROVIDER === 'gemini') {
  console.log("Using Gemini AI adapter.");
  categorizer = geminiAdapter;
} else {
  console.log("Using Replicate AI adapter.");
  categorizer = replicateAdapter;
}

export { categorizer };