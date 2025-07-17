import OpenAI from "openai";

const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.github.ai/inference";

export const openai = new OpenAI({
  baseURL: endpoint,
  apiKey: token,
});
