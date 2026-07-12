// Try backend first, fall back to local evaluator silently.
const BACKEND_URL = 'http://127.0.0.1:8080/calculate'

function evaluateLocal(cleaned) {
  // Use a restricted Function evaluation after validation.
  // Wrap in parentheses to allow unary minus at start.
  // eslint-disable-next-line no-new-func
  const result = Function('"use strict"; return (' + cleaned + ')')()
  if (typeof result !== 'number' || !isFinite(result)) throw new Error('Invalid calculation')
  const out = Number.isInteger(result) ? result : parseFloat(result.toFixed(8))
  return { expression: cleaned, result: out }
}

export async function calculateExpression(expression) {
  const cleaned = String(expression).trim()
  if (!cleaned) throw new Error('Empty expression')

  // Allow only digits, whitespace, parentheses and basic operators
  if (!/^[0-9+\-*/().\s]+$/.test(cleaned)) {
    throw new Error('Invalid characters in expression')
  }

  // Try backend silently
  try {
    const resp = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expression: cleaned }),
    })

    if (resp.ok) {
      const json = await resp.json()
      // backend returns {expression, result}
      if (json && typeof json.result !== 'undefined') return json
    }
    // otherwise fall through to local evaluation
  } catch (e) {
    // network failed — fallback to local
  }

  try {
    return evaluateLocal(cleaned)
  } catch (err) {
    throw new Error('Invalid expression')
  }
}
