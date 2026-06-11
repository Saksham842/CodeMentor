import { useState } from "react";

export function useGrok(path) {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (body) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to execute AI request");
      }
      const data = await res.json();
      setResult(data.result);
      return data.result;
    } catch (err) {
      const errMsg = err.message || "An error occurred during query";
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, error, execute, setResult };
}
