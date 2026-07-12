import { useState } from 'react'
import Button from './Button'
import Display from './Display'
import { calculateExpression } from '../services/calculatorService'

const buttons = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', 'C', '+']

const isOperator = (ch) => ['+', '-', '*', '/', '.'].includes(ch)

function Calculator() {
  const [expression, setExpression] = useState('')
  const [result, setResult] = useState('0')
  const [lastEvaluated, setLastEvaluated] = useState(false)
  const [lastOperation, setLastOperation] = useState(null)
  const [history, setHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)

  const evaluate = async (expr) => {
    if (!expr) return
    try {
      const response = await calculateExpression(expr)
      setResult(response.result)

      // push to history (keep most recent first)
      setHistory((prev) => [{ expr: String(expr), result: response.result }, ...prev].slice(0, 10))

      // derive last operation (operator and right-hand operand) from the evaluated expr
      const m = String(expr).trim().match(/([+\-*/])\s*([0-9.]+)\s*$/)
      if (m) {
        setLastOperation({ op: m[1], operand: m[2] })
      } else {
        setLastOperation(null)
      }

      // set expression to the numeric result so user can continue from it
      setExpression(String(response.result))
      setLastEvaluated(true)
    } catch (err) {
      setResult('Error')
      setLastEvaluated(false)
      setLastOperation(null)
    }
  }

  const appendValue = (value) => {
    // if the last action produced a result, allow continuing from it
    if (lastEvaluated) {
      if (isOperator(value)) {
        setExpression((prev) => String(prev) + value)
      } else {
        // start a new expression when typing a number after evaluation
        setExpression(String(value))
        setLastOperation(null)
      }
      setLastEvaluated(false)
      setResult('0')
      return
    }

    setExpression((prev) => {
      if (!prev && isOperator(value) && value !== '-') {
        // prevent leading +,*,/ but allow leading -
        return prev
      }

      const last = prev.slice(-1)

      if (isOperator(last) && isOperator(value)) {
        // replace last operator with new one (prevents consecutive operators)
        return prev.slice(0, -1) + value
      }

      // prevent multiple decimals in the current number segment
      if (value === '.') {
        const parts = prev.split(/[-+/*]/)
        const current = parts[parts.length - 1]
        if ((current || '').includes('.')) return prev
      }

      return prev + value
    })
    setResult('0')
  }

  const handleButtonClick = (value) => {
    if (value === 'C') {
      setExpression('')
      setResult('0')
      return
    }

    if (value === '=') {
      // if just evaluated and we have a last operation, repeat it
      if (lastEvaluated && lastOperation) {
        const nextExpr = String(expression) + lastOperation.op + lastOperation.operand
        evaluate(nextExpr)
        return
      }

      evaluate(expression)
      return
    }

    appendValue(value)
  }

  const handleInputChange = (e) => {
    // sanitize input by stripping invalid chars then set
    const raw = e.target.value
    const allowed = raw.replace(/[^0-9+\-*/().\s]/g, '')
    setExpression(allowed)
    setLastEvaluated(false)
  }

  const handleKeyDown = (e) => {
    const { key } = e
    if (key === 'Enter') {
      e.preventDefault()
      evaluate(expression)
      return
    }

    if (key === 'Escape') {
      setExpression('')
      setResult('0')
      return
    }

    // allow number and operator keys (let display input handle sanitization)
    if (/^[0-9+\-*/().]$/.test(key)) {
      // let the input update
      return
    }

    // block other keys
    if (key.length === 1) e.preventDefault()
  }

  return (
    <div className="calculator-card">
      <div className="header-row">
        <h1>Mini Calculator</h1>
        <div className="header-controls">
          <button type="button" className="history-toggle" onClick={() => setShowHistory((s) => !s)} aria-pressed={showHistory}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
              <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M21 12a9 9 0 1 0-2.5 6.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{showHistory ? 'Hide' : 'History'}</span>
          </button>
          <button type="button" className="clear-history" onClick={() => setHistory([])}>Clear</button>
        </div>
      </div>

      {showHistory && (
        <div className="history-panel">
          {history.length === 0 && <div className="history-empty">No recent calculations</div>}
          {history.map((h, i) => (
            <button
              key={i}
              type="button"
              className="history-item-btn"
              onClick={() => {
                setExpression(h.expr)
                setResult(h.result)
                setLastEvaluated(true)
                setShowHistory(false)
              }}
            >
              <span className="expr">{h.expr}</span>
              <span className="res">{h.result}</span>
            </button>
          ))}
        </div>
      )}

      <Display expression={expression} result={result} onChange={handleInputChange} onKeyDown={handleKeyDown} />
      <div className="button-grid">
        {buttons.map((label) => (
          <Button
            key={label}
            label={label}
            onClick={handleButtonClick}
            variant={label === 'C' ? 'clear' : 'default'}
          />
        ))}
        <Button label="=" onClick={handleButtonClick} variant="equals" />
      </div>
    </div>
  )
}

export default Calculator
