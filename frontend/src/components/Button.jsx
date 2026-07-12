function Button({ label, onClick, variant = 'default' }) {
  return (
    <button type="button" className={`calc-button ${variant}`} onClick={() => onClick(label)}>
      {label}
    </button>
  )
}

export default Button
