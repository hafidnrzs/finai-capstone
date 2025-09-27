import { NextResponse } from 'next/server';
import Replicate from 'replicate';

// Instantiate the Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  // 1. Check for API token
  if (!process.env.REPLICATE_API_TOKEN) {
    return NextResponse.json(
      { error: 'Replicate API token is not set' },
      { status: 500 }
    );
  }

  try {
    // 2. Get the transaction description from the request body
    const { description } = await req.json();

    if (!description) {
      return NextResponse.json(
        { error: 'Transaction description is required' },
        { status: 400 }
      );
    }
    
    // 3. Find the exact model identifier on Replicate's website
    // The format is: <owner>/<name>:<version-id>
    // IMPORTANT: You must replace this with the actual model version you want to use.
    const modelIdentifier = "ibm-granite/granite-3.3-8b-instruct:618ecbe80773609e96ea19d8c96e708f6f2b368bb89be8fad509983194466bf8";

    // 4. Construct the prompt for the AI model
    const prompt = `
      Instruction: Categorize the transaction description into one of the following categories.
      Categories: [Shopping, Transportation, Food & Drink, Bills & Utilities, Health, Entertainment, Income]
      Transaction: "${description}"
      Respond with only the English category name.
      Category:
    `;

    // 5. Run the model on Replicate
    const output = await replicate.run(modelIdentifier, {
      input: {
        prompt: prompt,
        max_new_tokens: 20, // Limit the output length
      },
    });

    // 6. Process the output and send it back to the client
    // The output is often an array of strings, so we join it.
    const category = (output as string[]).join("").trim();
    
    return NextResponse.json({ category });

  } catch (error) {
    console.error('Replicate API Error:', error);
    return NextResponse.json({ error: 'Failed to categorize transaction' }, { status: 500 });
  }
}