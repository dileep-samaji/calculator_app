const BACKEND_URL = import.meta.env.DEV
  ? "http://127.0.0.1:8080/calculate"
  : "/calculate";

function evaluateLocal(cleaned) {
  const result = Function('"use strict"; return (' + cleaned + ')')();

  if (typeof result !== "number" || !isFinite(result)) {
    throw new Error("Invalid calculation");
  }

  const out = Number.isInteger(result)
    ? result
    : parseFloat(result.toFixed(8));

  return {
    expression: cleaned,
    result: out,
  };
}

export async function calculateExpression(expression) {
  const cleaned = String(expression).trim();

  if (!cleaned) {
    throw new Error("Empty expression");
  }

  if (!/^[0-9+\-*/().\s]+$/.test(cleaned)) {
    throw new Error("Invalid characters in expression");
  }

  try {
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        expression: cleaned,
      }),
    });

    if (!response.ok) {
      throw new Error("Backend error");
    }

    return await response.json();
  } catch (error) {
    console.warn("Backend unavailable. Using local calculation.");

    try {
      return evaluateLocal(cleaned);
    } catch {
      throw new Error("Invalid expression");
    }
  }
}