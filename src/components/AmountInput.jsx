function AmountInput({
  value,
  onChange,
  label,
  placeholder = '0',
  readOnly = false,
}) {
  return (
    <div
      className={`flex min-h-12 min-w-0 items-center rounded-xl border border-ink/15 transition ${
        readOnly
          ? 'bg-[#edf0e8]'
          : 'bg-paper-light focus-within:border-accent focus-within:ring-3 focus-within:ring-accent/10'
      }`}
    >
      <span className="shrink-0 border-r border-ink/10 px-3 text-sm font-bold text-muted">
        Rp
      </span>
      <input
        type="text"
        inputMode="text"
        autoComplete="off"
        autoCapitalize="none"
        spellCheck="false"
        readOnly={readOnly}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="number-input min-w-0 flex-1 bg-transparent px-3 py-2.5 text-right text-base font-bold text-ink outline-none placeholder:text-muted/40 read-only:text-muted"
        placeholder={placeholder}
        aria-label={label}
      />
    </div>
  )
}

export default AmountInput
