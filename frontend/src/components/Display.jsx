function Display({ expression, result, onChange, onKeyDown }) {
  return (
    <div className="display">
      <input
        className="display-expression"
        value={expression}
        onChange={onChange}
        onKeyDown={onKeyDown}
        inputMode="decimal"
        aria-label="calculator-input"
      />
      <div className="display-result">{result}</div>
    </div>
  )
}

export default Display
