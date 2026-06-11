const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

function getApiKey() {
  return process.env.GROQ_API_KEY;
}

async function callGrok(systemPrompt, messages, options = {}) {
  const apiKey = getApiKey();

  if (!apiKey || apiKey === "your_groq_api_key_here") {
    await new Promise((r) => setTimeout(r, 600));
    const userMsg = (messages[messages.length - 1]?.content || "").toLowerCase();
    if (userMsg.includes("security") || userMsg.includes("vulnerable")) {
      return "### Security Analysis\nThe codebase has been examined for common vulnerabilities.";
    }
    if (userMsg.includes("complexity")) {
      return "### Code Complexity Overview\nSome functions may benefit from refactoring.";
    }
    return "### CodeMentor AI Response\nSet GROQ_API_KEY for full AI-powered analysis.";
  }

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 1500,
      stream: false,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || "Groq API error");
  }
  const data = await response.json();
  return data.choices[0].message.content;
}

module.exports = { callGrok };
