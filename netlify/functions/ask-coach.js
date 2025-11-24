// netlify/functions/ask-coach.js

// 🔐 ENV VARS — make sure you set these in Netlify
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

import { createClient } from "@supabase/supabase-js";

// Full-power server-side Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Shared CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  if (!OPENAI_API_KEY) {
    console.error("Missing OPENAI_API_KEY");
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Missing API key" }),
    };
  }

  // ------------------------------
  // 1) Parse JSON body
  // ------------------------------
  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Invalid JSON body" }),
    };
  }

  const userMessage = (payload.message || "").trim();
  const pageContext = payload.pageContext || null;
  const starterProgress = payload.starterProgress || null;
  const mode = payload.mode || "guest"; // "guest" or "account"

  if (!userMessage) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Missing message" }),
    };
  }

  // ------------------------------
  // 2) AUTH — verify JWT from frontend
  // ------------------------------
  const authHeader = event.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  let userId = null;
  if (token) {
    const { data, error } = await supabase.auth.getUser(token);
    if (!error && data?.user) {
      userId = data.user.id;
    }
  }

  // ------------------------------
  // 3) Load existing memory (if user is authenticated)
  // ------------------------------
  let memoryText = "";
  if (userId) {
    const { data: memRows, error: memErr } = await supabase
      .from("coach_memory")
      .select("memory")
      .eq("user_id", userId)
      .limit(1)
      .maybeSingle();

    if (!memErr && memRows?.memory) {
      memoryText = memRows.memory;
    }
  }

  // ------------------------------
  // 4) Build system prompts (unchanged)
  // ------------------------------
  const siteMap = `
You are answering for the "Side Hustle Starter" website...
(keeping your full site map text exactly as you pasted)
  `.trim();

  const systemPrompt = `
You are the "Side Hustle Starter Coach", a calm, practical guide...
(keeping your full system prompt exactly)
  `.trim();

  const contextNote = pageContext
    ? `The user is currently on this part of the site: ${pageContext}.`
    : `No specific page context was provided.`;

  const starterContext = starterProgress
    ? `
Starter Path Progress:
- percent: ${starterProgress.percent ?? "unknown"}%
- totalSteps: ${starterProgress.totalSteps ?? "unknown"}
- nextIncompleteSlug: ${starterProgress.nextSlug ?? "none"}
- isComplete: ${starterProgress.isComplete ? "true" : "false"}
    `.trim()
    : `No Starter Path progress metadata was provided.`;

  // ------------------------------
  // 5) Construct memory prompt
  // ------------------------------
  const memoryPrompt = userId
    ? `
You are allowed to use the following persistent memory about the user.
This memory is private for this specific user:

${memoryText || "(no memory stored yet)"}

You may reference their preferences, situation, or context ONLY if it appears here.
    `.trim()
    : `
The user is not logged in. Treat this as a stateless guest conversation.
Do NOT invent memory.
    `.trim();

  // ------------------------------
  // 6) Call OpenAI
  // ------------------------------
  let answer;
  try {
    const apiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.6,
        max_tokens: 700,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "system", content: siteMap },
          { role: "system", content: memoryPrompt },
          { role: "system", content: starterContext },
          { role: "system", content: contextNote },
          { role: "user", content: userMessage },
        ],
      }),
    });

    if (!apiRes.ok) {
      const errorText = await apiRes.text();
      console.error("OpenAI error:", errorText);
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({
          error: "LLM API error",
          detail: errorText,
        }),
      };
    }

    const data = await apiRes.json();
    answer =
      data?.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I couldn't generate a response.";
  } catch (err) {
    console.error("LLM fetch error:", err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "LLM request failed" }),
    };
  }

  // ------------------------------
  // 7) Update memory (only if logged in)
  // ------------------------------
  if (userId) {
    // Light "memory summary" strategy:
    const memoryUpdatePrompt = `
Given the following existing memory:

${memoryText || "(empty)"}

And the new user message:

"${userMessage}"

And your reply:

"${answer}"

Update the memory. Keep it short, factual, first-person about the user.
Do NOT store sensitive info. Do NOT include private data.
Focus on preferences, goals, interests, long-term plans.
    `.trim();

    try {
      const memRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          max_tokens: 200,
          temperature: 0.3,
          messages: [
            { role: "system", content: "You rewrite and maintain user memory." },
            { role: "user", content: memoryUpdatePrompt },
          ],
        }),
      });

      const memJson = await memRes.json();
      const newMemory =
        memJson?.choices?.[0]?.message?.content?.trim() || memoryText;

      // Store in Supabase
      await supabase.from("coach_memory").upsert({
        user_id: userId,
        memory: newMemory,
      });
    } catch (err) {
      console.error("Memory update error:", err);
      // Fail silently — user should still get their answer
    }
  }

  // ------------------------------
  // 8) Return response to frontend
  // ------------------------------
  return {
    statusCode: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({ answer }),
  };
};
