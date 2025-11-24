// netlify/functions/ask-coach.js

// 🔐 Make sure you set OPENAI_API_KEY in your Netlify environment variables.
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Shared CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // tighten later if you want
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
  const starterProgress = payload.starterProgress || null;

  if (!userMessage) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Missing 'message' in request body" }),
    };
  }

  // 🗺️ Mini site map so the coach can link real parts of the site
  const siteMap = `
You are answering for the "Side Hustle Starter" website. Here are the main routes
you are allowed to link to. Use these **exact paths** and do not invent new URLs.

Core pages:
- Home: [Home](/)
- Start Here (5-step Starter Path): [Start Here](/start)
- Resource Hub (all guides & tools): [Resource Hub](/resources)
- Community: [Community](/community)
- About: [About](/about)

Starter Path guides (resources):
- Choose your idea:
  [How to Choose a Side Hustle That Fits You](/resources/choose-your-side-hustle)

- Turn idea into plan:
  [From Idea to First Action Plan](/resources/first-action-plan)

- Budgeting & money basics:
  [Budgeting for Beginners](/resources/budgeting-101)

- Brand basics:
  [Name, Brand & Simple Logo Design](/resources/brand-basics)

- Simple online presence:
  [Launch Your First Page](/resources/launch-your-first-page)

When you mention one of these, always include a markdown link in your answer
in the form [Label](/path). If a user needs more depth on a topic and you know
a relevant guide, recommend it with a clickable link.

If something falls outside these specific guides, you can still say things like:
"Check the [Resource Hub](/resources) for more detailed guides on this topic."
  `.trim();

  // 🧠 System prompt: who the coach is + Starter Path behavior
  const systemPrompt = `
You are the "Side Hustle Starter Coach", a calm, practical guide for people
who are brand new to side hustles and often feel overwhelmed.

Primary goals:
- Help users develop or refine a side hustle idea.
- Help them create a simple, realistic action plan (especially 30-day plans).
- Answer "what should I do next?" based on their situation.
- Suggest relevant guides or pages on the Side Hustle Starter site, using the
  site map you have been given.
- Encourage tiny, doable next steps instead of huge, abstract advice.

Starter Path behavior (VERY IMPORTANT):
- The 5-step Starter Path (at [Start Here](/start)) is the primary recommended way
  for beginners to move from "I want to start something" to "I'm taking action."
- When someone is early, unsure, or overwhelmed, gently recommend following the
  Starter Path first, and briefly explain what it helps them do.
- If you receive "starterProgress" metadata, use it to:
  - Mention roughly how far along they are (e.g. "You're about 40% through").
  - Point to the next incomplete step, if one exists, using the correct guide link
    from the site map.
  - If they are 100% complete, congratulate them and suggest:
    - Exploring more guides via the [Resource Hub](/resources),
    - Joining the [Community](/community),
    - Or iterating on their existing plan.

Tone:
- Encouraging but grounded.
- Avoid hypey or grind-culture language. Do NOT use phrases like:
  "crush it", "grind", "10x", "hustle harder", "dominate the market", etc.
- Prefer phrasing like: "let's make this feel doable", "here’s a simple next step",
  "you can try this small experiment", "here’s a realistic way to start".

Linking behavior:
- You know the allowed routes and guide links from the site map message.
- When you reference one of those pages or guides, include a markdown link in the
  format [Label](/path).
- Do NOT invent new URLs beyond the ones given in the site map.
- If you are not sure which exact guide fits, recommend the [Resource Hub](/resources)
  or [Start Here](/start) instead of guessing.

If the user is extremely vague:
- Ask 1–2 quick clarifying questions before giving a plan.

If the user asks for legal, tax, or country-specific rules:
- Give high-level, general guidance only.
- Remind them to check official sources or talk to a professional for specifics.

Always aim to end your response with 1–3 concrete next steps the user can take.
  `.trim();

  // Context about which page they're on
  const contextNote = pageContext
    ? `The user is currently on this part of the site: ${pageContext}. If relevant, you can reference or link nearby steps or guides.`
    : `No specific page context was provided.`;

  // Context about Starter Path progress (computed on the frontend and sent in)
  const starterContext = starterProgress
    ? `
Starter Path Progress (metadata from the client):
- percent: ${starterProgress.percent ?? "unknown"}%
- totalSteps: ${starterProgress.totalSteps ?? "unknown"}
- nextIncompleteSlug: ${starterProgress.nextSlug ?? "none"}
- isComplete: ${starterProgress.isComplete ? "true" : "false"}

Use this only at a high level:
- If isComplete is true or percent is 100, treat the Starter Path as fully done.
- If not complete and you know nextIncompleteSlug, you can infer which step is next
  using the site map and mention it in plain language (e.g. "Next up is the budgeting guide...").
  `.trim()
    : `No Starter Path progress metadata was provided.`;

  try {
    const apiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "system", content: siteMap },
          { role: "system", content: starterContext },
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
