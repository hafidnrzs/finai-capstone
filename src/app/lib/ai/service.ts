import { IAIProvider } from "./interface";
import { geminiAdapter } from "./gemini-adapter";
// import { replicateAdapter } from './replicate-adapter'; // You can uncomment this when you build it

let aiProvider: IAIProvider;

// This is the "switch". It reads your .env file and selects the correct adapter.
// It defaults to Gemini if the variable is not set.
if (process.env.AI_PROVIDER === "replicate") {
  console.log("Initializing Replicate AI provider...");
  // aiProvider = replicateAdapter; // Assign the replicate adapter here
  // For now, we'll fall back to Gemini as Replicate isn't fully implemented for insights
  aiProvider = geminiAdapter;
} else {
  console.log("Initializing Gemini AI provider...");
  aiProvider = geminiAdapter;
}

// Export a single, unified provider.
// Your API routes will import this object to perform any AI task.
export { aiProvider };
