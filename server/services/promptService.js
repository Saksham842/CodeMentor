function buildContextString(ctx) {
  if (!ctx) return "";
  const lines = [];
  if (ctx.name) lines.push(`Project: ${ctx.name}`);
  if (ctx.stack) {
    for (const [k, v] of Object.entries(ctx.stack)) {
      if (v && v.length > 0) lines.push(`${k}: ${v.join(", ")}`);
    }
  }
  if (ctx.stats) lines.push(`Files: ${ctx.stats.files || 0} | LOC: ${ctx.stats.loc || 0}`);
  return lines.join("\n");
}

const SYSTEM_PROMPTS = {
  chat: (ctx) => `You are CodeMentor AI.\n${ctx || ""}\nAnswer questions with precision. Cite file paths in [brackets].`,
  analyze: (ctx) => `You are an expert onboarding mentor.\n${ctx || ""}\nExplain files and logic step-by-step.`,
  search: (ctx) => `You are a semantic code search engine.\n${ctx || ""}\nOutput JSON array: [{"file":"path","lineRange":"12-45","relevance":95,"preview":"code","reason":"why"}].`,
  quiz: (ctx) => `You are the Grand Quizmaster.\n${ctx || ""}\nGenerate 5 questions. Mix MCQ and open. Output JSON array.`,
  interview: (persona, ctx) => `You are ${persona}.\n${ctx || ""}\nEvaluate critically. Provide evaluation and follow-up.`,
  defense: (intensity, ctx) => `You are a rigorous engineer.\n${ctx || ""}\nChallenge level ${intensity}/10.`,
  resume: (ctx) => `You are a resume writer.\n${ctx || ""}\nGenerate 5 ATS-optimized bullet points (STAR format).`,
  security: (ctx) => `You are a security engineer.\n${ctx || ""}\nGenerate VULNERABLE CODE, FIXED CODE, EXPLANATION.`,
  review: (ctx) => `You are the Council.\n${ctx || ""}\nWrite review: 1. Summary 2. Architecture 3. Security 4. Performance 5. Score 6. 3 Improvements.`,
};

module.exports = { SYSTEM_PROMPTS, buildContextString };
