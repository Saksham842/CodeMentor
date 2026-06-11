const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

export async function callGrok(systemPrompt, messages, options) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey === "your_groq_api_key_here") {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const userQuery = messages[messages.length - 1]?.content.toLowerCase() || "";

    if (userQuery.includes("security") || userQuery.includes("vulnerable")) {
      return `### Security Analysis
The codebase has been examined for common vulnerabilities. Consider reviewing authentication flows, input validation, and dependency security patches.

Recommended actions:
- Audit all authentication endpoints for proper validation
- Ensure all user inputs are sanitized
- Check for known vulnerabilities in dependencies
- Review error handling for information leakage`;
    }

    if (userQuery.includes("complexity") || userQuery.includes("weight")) {
      return `### Code Complexity Overview
The codebase contains functions that may benefit from refactoring. High cyclomatic complexity in core logic functions can be reduced by extracting helper methods and simplifying conditional chains.

Suggested improvements:
- Break down complex functions into smaller, single-purpose utilities
- Use early returns to reduce nesting depth
- Consider strategy pattern for branching logic`;
    }

    return `### CodeMentor AI Response
This is a mock response (no GROQ_API_KEY configured).
Set GROQ_API_KEY in your .env file for full AI-powered analysis.`;
  }

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 1500,
      stream: false,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message ?? "Groq API error");
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function callGrokStream(systemPrompt, messages, onChunk) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey === "your_groq_api_key_here") {
    const words = `Connected. I've analyzed the codebase structure and files. How can I help you understand this project today?`.split(" ");
    for (const word of words) {
      onChunk(word + " ");
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
    return;
  }

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      temperature: 0.7,
      max_tokens: 1500,
      stream: true,
    }),
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const lines = decoder.decode(value).split("\n");
    for (const line of lines) {
      if (line.startsWith("data: ") && line !== "data: [DONE]") {
        try {
          const json = JSON.parse(line.slice(6));
          const chunk = json.choices[0]?.delta?.content ?? "";
          if (chunk) onChunk(chunk);
        } catch {}
      }
    }
  }
}
