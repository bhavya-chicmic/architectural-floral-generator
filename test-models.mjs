import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  // Note: ListModels is not directly exposed on the client instance in some versions,
  // but let's try to access it via fetching or the specific model logic if possible.
  // Actually, the SDK doesn't always expose listModels simply.
  // Let's try a simple generation with "gemini-1.5-flash" to verify if it works in isolation.
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello");
    console.log("gemini-1.5-flash works:", result.response.text());
  } catch (e) {
    console.error("gemini-1.5-flash failed:", e.message);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent("Hello");
    console.log("gemini-2.0-flash-exp works:", result.response.text());
  } catch (e) {
    console.error("gemini-2.0-flash-exp failed:", e.message);
  }
}

listModels();
