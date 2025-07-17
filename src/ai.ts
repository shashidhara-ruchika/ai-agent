import OpenAI from "openai";

const token = process.env["GITHUB_TOKEN"];

if (!token) {
  throw new Error("GITHUB_TOKEN is not set");
}

const endpoint = "https://models.github.ai/inference";

export const openai = new OpenAI({
  baseURL: endpoint,
  apiKey: token,
});
