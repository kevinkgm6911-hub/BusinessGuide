// netlify/functions/ask-coach.js

// 🔐 Make sure you set OPENAI_API_KEY in your Netlify environment variables.
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Small helper: shared CORS headers so you can call this from your frontend
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // you can tighten this later
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

exports.handler = async function (event, context) {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  if (!OPENAI_API_KEY) {
    console.error("Missing OPENAI_API_KEY env var");
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: "Server not configured: missing API key",
      }),
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch (err) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Invalid JSON body" }),
    };
  }

  const userMessage = (payload.message || "").trim();
  const pageContext = payload.pageContext || null; // e.g. "/start" or a guide slug

  if (!userMessage) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Missing 'message' in request body" }),
    };
  }

  // 🧠 System prompt: who the coach is + what it should / shouldn't do
  const systemPrompt = `
You are the "Side Hustle Starter Coach", a calm, practical guide for people
who are brand new to side hustles and often feel overwhelmed.

Your goals:
- Help users develop or refine a side hustle idea.
- Help them create a simple, realistic action plan (especially 30-day plans).
- Answer "what should I do next?" based on their situation.
- Suggest relevant types of guides they might find on the Side Hustle Starter site 
  (for example: idea selection, validation, budgeting, brand basics, simple launch pages).
- Encourage tiny, doable next steps instead of huge, abstract advice.

Tone:
- Encouraging but grounded.
- Avoid hypey or grind-culture language. Do NOT use phrases like:
  "crush it", "grind", "10x", "hustle harder", "dominate the market", etc.
- Prefer phrasing like: "let's make this feel doable", "here’s a simple next step",
  "you can try this small experiment", "here’s a realistic way to start".

If you recommend resources on the site:
- You do NOT know the full list of URLs.
- Keep it general, like:
  - "Check the 'Start Here' path at /start."
  - "Look in the Resource Hub at /resources for a budgeting or pricing guide."
  - "Look for a validation or idea-testing guide in the Resource Hub."
- Do not invent precise URLs or promise that a specific titled guide definitely exists.

If the user is extremely vague:
- Ask 1–2 quick clarifying questions before giving a plan.

If the user asks for legal, tax, or country-specific rules:
- Give high-level, general guidance only.
- Remind them to check official sources or talk to a professional for specifics.

Always aim to end your response with 1–3 concrete next steps the user can take.
  `.trim();

  // Optional: light context string (not required, but can be helpful)
  const contextNote = pageContext
    ? `The user is currently on this part of the site: ${pageContext}.`
    : `No specific page context was provided.`;

  try {
    // Call OpenAI's Chat Completions API
    const apiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // you can change model later if you want
        messages: [
          { role: "system", content: systemPrompt },
          { role: "system", content: contextNote },
          { role: "user", content: userMessage },
        ],
        max_tokens: 700,
        temperature: 0.6,
      }),
    });

    if (!apiRes.ok) {
      const errorText = await apiRes.text();
      console.error("OpenAI API error:", apiRes.status, errorText);
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
    const answer =
      data.choices &&
      data.choices[0] &&
      data.choices[0].message &&
      data.choices[0].message.content
        ? data.choices[0].message.content.trim()
        : "Sorry, I couldn't generate a response. Please try again.";

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ answer }),
    };
  } catch (err) {
    console.error("ask-coach function error:", err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: "Unexpected server error",
      }),
    };
  }
};
