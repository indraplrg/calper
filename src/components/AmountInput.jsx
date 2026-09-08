function AmountInput({
  value,
  onChange,
  label,
  placeholder = '0',
  readOnly = false,
  disabled = false,
  compact = false,
}) {
  const isInactive = readOnly || disabled

  return (
    <div
      className={`flex min-w-0 items-center rounded-xl border border-ink/15 transition ${
        compact ? 'min-h-11' : 'min-h-12'
      } ${
        isInactive
          ? 'bg-[#edf0e8]'
          : 'bg-paper-light focus-within:border-accent focus-within:ring-3 focus-within:ring-accent/10'
      }`}
    >
      <span
        className={`shrink-0 border-r border-ink/10 font-bold text-muted ${
          compact ? 'px-1.5 text-xs' : 'px-3 text-sm'
        }`}
      >
        Rp
      </span>
      <input
        type="text"
        inputMode="text"
        autoComplete="off"
        autoCapitalize="none"
        spellCheck="false"
        readOnly={readOnly}
        disabled={disabled}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`number-input min-w-0 flex-1 bg-transparent text-right font-bold text-ink outline-none placeholder:text-muted/40 read-only:text-muted ${
          compact ? 'px-1 py-2 text-sm' : 'px-3 py-2.5 text-base'
        }`}
        placeholder={placeholder}
        aria-label={label}
      />
    </div>
  )
}

export default AmountInput
