// netlify/functions/ask-coach.js
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;
if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

exports.handler = async function (event) {
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

  const { message, pageContext, starterProgress, userId } = body || {};
  const userMessage = (message || "").trim();

  if (!userMessage) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing 'message' field" }),
    };
  }

  // Build base system prompt
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
  - Example guides:
    - Choose your side hustle: /resources/choose-your-side-hustle
    - First action plan: /resources/first-action-plan
    - Budgeting basics: /resources/budgeting-setup
    - Brand basics: /resources/brand-basics
    - Launch your first page: /resources/launch-your-first-page

Starter Path behavior:
- If the user sounds brand new or unsure where to begin, strongly recommend the Starter Path at /start.
- If the request mentions "what next" or "what step next", try to frame your answer as:
  1) A small next step
  2) A pointer to a relevant guide (URL).

Always:
- Give concrete next actions they can do in the next 24–72 hours.
- Keep answers tightly focused on their situation; do not dump long generic lectures.
  `.trim();

  // Build small context snippet
  let contextPieces = [];

  if (pageContext) {
    contextPieces.push(`User is currently on page: ${pageContext}`);
  }

  if (starterProgress && typeof starterProgress === "object") {
    try {
      const { percent, doneSlugs, nextSlug } = starterProgress;
      contextPieces.push(
        `Starter Path progress: ${percent}% complete. Completed steps: ${
          Array.isArray(doneSlugs) && doneSlugs.length
            ? doneSlugs.join(", ")
            : "none"
        }. Next suggested step: ${nextSlug || "unknown"}.`
      );
    } catch {
      // ignore
    }
  }

  // Look up user profile if we can
  let profileSummary = "";
  if (userId && supabase) {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (!error && data) {
        const parts = [];
        if (data.display_name) {
          parts.push(`Name: ${data.display_name}`);
        }
        if (data.experience_level) {
          parts.push(`Experience: ${data.experience_level}`);
        }
        if (data.focus_area) {
          parts.push(`Focus area: ${data.focus_area}`);
        }
        if (data.current_goal) {
          parts.push(`Goal (3–6 months): ${data.current_goal}`);
        }
        if (data.notes) {
          parts.push(`Notes: ${data.notes}`);
        }
        if (parts.length) {
          profileSummary = `User profile: ${parts.join(" | ")}.`;
        }
      }
    } catch (err) {
      console.error("Error fetching user profile", err);
    }
  }

  if (profileSummary) {
    contextPieces.push(profileSummary);
  }

  if (contextPieces.length) {
    contextPieces.push(
      "Use this context only to tailor your answer; do not repeat it verbatim."
    );
  }

  const messages = [
    { role: "system", content: systemPrompt },
    ...(contextPieces.length
      ? [{ role: "system", content: contextPieces.join("\n") }]
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
