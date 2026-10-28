import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
const port = Number(process.env.PORT || 8080);
const providerUrl = (process.env.AI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
const apiKey = process.env.AI_API_KEY;
const model = process.env.AI_MODEL || "gpt-4o-mini";
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "*").split(",").map(v => v.trim());

app.disable("x-powered-by");
app.use(cors({ origin: allowedOrigins.includes("*") ? "*" : allowedOrigins }));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => res.json({ ok: true, service: "medhas-ai-backend", configured: Boolean(apiKey) }));

app.post("/v1/chat/completions", async (req, res) => {
  if (!apiKey) return res.status(503).json({ error: { message: "AI backend is not configured. Set AI_API_KEY in the hosting environment." } });
  const messages = req.body?.messages;
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 30) {
    return res.status(400).json({ error: { message: "messages must be a non-empty array with at most 30 items." } });
  }
  const safeMessages = messages.map(m => ({
    role: ["system", "user", "assistant"].includes(m?.role) ? m.role : "user",
    content: typeof m?.content === "string" ? m.content.slice(0, 12000) : ""
  })).filter(m => m.content.trim());
  try {
    const upstream = await fetch(`${providerUrl}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model, messages: safeMessages, temperature: 0.7 })
    });
    const payload = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      console.error("AI provider error", upstream.status, payload?.error?.message || "No details");
      return res.status(502).json({ error: { message: "The configured AI provider could not complete the request." } });
    }
    return res.json(payload);
  } catch (error) {
    console.error("AI provider connection failed", error instanceof Error ? error.message : "Unknown error");
    return res.status(502).json({ error: { message: "Unable to reach the configured AI provider." } });
  }
});

app.listen(port, "0.0.0.0", () => console.log(`Medhas.ai backend listening on ${port}`));
