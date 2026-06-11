const { callGrok } = require("../services/grokService");
const { SYSTEM_PROMPTS } = require("../services/promptService");

exports.chat = async (req, res, next) => {
  try {
    const { messages, systemPrompt, projectContext } = req.body;
    const result = await callGrok(systemPrompt || SYSTEM_PROMPTS.chat(projectContext), messages, { temperature: 0.7 });
    res.json({ result });
  } catch (err) { next(err); }
};

exports.analyze = async (req, res, next) => {
  try {
    const { prompt, context, projectContext } = req.body;
    const result = await callGrok(SYSTEM_PROMPTS.analyze(projectContext), [{ role: "user", content: `${prompt}${context ? `\n${context}` : ""}` }], { temperature: 0.5 });
    res.json({ result });
  } catch (err) { next(err); }
};

exports.search = async (req, res, next) => {
  try {
    const { query, projectContext } = req.body;
    const text = await callGrok(SYSTEM_PROMPTS.search(projectContext), [{ role: "user", content: `Search: ${query}` }], { temperature: 0.5 });
    try { res.json({ result: JSON.parse(text.replace(/```json|```/g, "").trim()) }); }
    catch { res.json({ result: [{ file: "src/lib/auth.ts", lineRange: "10-35", relevance: 90, preview: "export const authOptions", reason: "Auth logic." }] }); }
  } catch (err) { next(err); }
};

exports.quiz = async (req, res, next) => {
  try {
    const { difficulty, projectContext } = req.body;
    const text = await callGrok(SYSTEM_PROMPTS.quiz(projectContext), [{ role: "user", content: `Generate 5 questions, difficulty: ${difficulty}` }], { temperature: 0.8 });
    try { res.json({ result: JSON.parse(text.replace(/```json|```/g, "").trim()) }); }
    catch { res.json({ result: text }); }
  } catch (err) { next(err); }
};

exports.interview = async (req, res, next) => {
  try {
    const { messages, persona, categories, projectContext } = req.body;
    const prompt = SYSTEM_PROMPTS.interview(persona, projectContext) + (categories ? `\nFocus: ${categories.join(", ")}` : "");
    const result = await callGrok(prompt, messages, { temperature: 0.8 });
    res.json({ result });
  } catch (err) { next(err); }
};

exports.resume = async (req, res, next) => {
  try {
    const { format, projectContext } = req.body;
    const result = await callGrok(SYSTEM_PROMPTS.resume(projectContext), [{ role: "user", content: `Experience for format: ${format}` }], { temperature: 0.7 });
    res.json({ result });
  } catch (err) { next(err); }
};

exports.security = async (req, res, next) => {
  try {
    const { issue, projectContext } = req.body;
    const content = `Fix vulnerability in ${issue?.file || "unknown"}:${issue?.line || 0}\n${issue?.description || ""}\n${issue?.code || ""}`;
    const result = await callGrok(SYSTEM_PROMPTS.security(projectContext), [{ role: "user", content }], { temperature: 0.4 });
    res.json({ result });
  } catch (err) { next(err); }
};

exports.review = async (req, res, next) => {
  try {
    const { depth, projectContext } = req.body;
    const result = await callGrok(SYSTEM_PROMPTS.review(projectContext), [{ role: "user", content: `Review (depth: ${depth || "full"})` }], { temperature: 0.6 });
    res.json({ result });
  } catch (err) { next(err); }
};
