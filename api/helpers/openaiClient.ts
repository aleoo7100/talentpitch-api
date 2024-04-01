import OpenAI from "openai";

// Create a new instance of the OpenAI class with your API key
const openai = new OpenAI({
  apiKey: process.env.GPT_SECRET,
});

// Function to generate a completion with the GPT-3.5 model by getting the prompt from props
export async function createCompletion(prompt: string) {
  try {
    // Create a completion with the GPT-3.5 model and 4096 max tokens
    const gptResponse = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      max_tokens: 4096,
    });
    // Return the completion content in string format
    return gptResponse.choices[0].message.content;
  } catch (error) {
    return error;
  }
}
