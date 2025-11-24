// netlify/functions/ask-coach.js

// Simple Netlify function that forwards a chat request to OpenAI
// and returns a single assistant reply.

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

exports.handler = async function (event) {
  // Basic method check
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  if (!OPENAI_API_KEY) {
    console.error("Missing OPENAI_API_KEY env var");
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Server misconfigured: missing OPENAI_API_KEY",
      }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch (err) {
    console.error("Invalid JSON body", err);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON body" }),
    };
  }

  const { message, pageContext, starterProgress } = body || {};
  const userMessage = (message || "").trim();

  if (!userMessage) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing 'message' field" }),
    };
  }

  // Build a friendly system prompt for the coach
  const systemPrompt = `
You are the Side Hustle Starter Coach, a calm and practical assistant for new entrepreneurs.

Tone:
- Supportive, clear, and grounded.
- Avoid grind-culture language ("crush it", "10x", "grind", "hustle harder").
- No hypey marketing speak.

Your job:
- Help people clarify or refine their side hustle idea.
- Help them create a small, realistic action plan.
- Suggest what to do next in a way that feels doable.
- When relevant, point them to guides on the site using these URLs:
  - Starter Path overview: /start
  - Resource hub: /resources
  - Example guides (only if relevant):
    - Choose your side hustle: /resources/choose-your-side-hustle
    - First action plan: /resources/first-action-plan
    - Budgeting basics: /resources/budgeting-setup
    - Brand basics: /resources/brand-basics
    - Launch your first page: /resources/launch-your-first-page

Starter Path behavior:
- If the user sounds brand new or unsure where to begin, strongly recommend the Starter Path at /start.
- If the request mentions "what next" or "what step next", try to frame your answer as:
  1) A small next step
  2) A pointer to a relevant guide (URL)
- If starterProgress is provided, you may refer to:
  - which step they're on,
  - which steps are done,
  - and which would be a good next step.

Always:
- Give concrete next actions they can do in the next 24–72 hours.
- Keep answers tightly focused on their situation; do not dump long generic lectures.
  `.trim();

  // Make a short context message from starterProgress, if provided
  let contextSnippet = "";
  if (starterProgress && typeof starterProgress === "object") {
    try {
      const { percent, doneSlugs, nextSlug } = starterProgress;
      contextSnippet =
        `Starter Path progress: ${percent}% complete.\n` +
        `Completed steps: ${Array.isArray(doneSlugs) && doneSlugs.length ? doneSlugs.join(", ") : "none"}.\n` +
        `Next suggested step: ${nextSlug || "unknown"}.\n`;
    } catch (_) {
      // ignore if weird
      contextSnippet = "";
    }
  }

  const pageInfo = pageContext
    ? `User is currently on page: ${pageContext}\n`
    : "";

  const contextMessage = [
    pageInfo || "",
    contextSnippet || "",
    "Use this context only to tailor your answer; do not repeat it verbatim.",
  ]
    .join("")
    .trim();

  const messages = [
    { role: "system", content: systemPrompt },
    ...(contextMessage
      ? [{ role: "system", content: contextMessage }]
      : []),
    { role: "user", content: userMessage },
  ];

  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("OpenAI error", response.status, text);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "OpenAI API error",
          detail: text,
        }),
      };
    }

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response right now.";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    console.error("Error calling OpenAI", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Unexpected server error",
      }),
    };
  }
};
