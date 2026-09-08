function AmountInput({ value, onChange, label, placeholder = '0' }) {
  return (
    <div className="flex min-h-12 min-w-0 items-center rounded-xl border border-ink/15 bg-paper-light transition focus-within:border-accent focus-within:ring-3 focus-within:ring-accent/10">
      <span className="shrink-0 border-r border-ink/10 px-3 text-sm font-bold text-muted">
        Rp
      </span>
      <input
        type="text"
        inputMode="numeric"
        autoComplete="off"
        spellCheck="false"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="number-input min-w-0 flex-1 bg-transparent px-3 py-2.5 text-right text-base font-bold text-ink outline-none placeholder:text-muted/40"
        placeholder={placeholder}
        aria-label={label}
      />
    </div>
  )
}

export default AmountInput
