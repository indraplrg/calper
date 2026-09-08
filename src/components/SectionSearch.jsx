function SectionSearch({ variant, records, value, onChange }) {
  const isBilling = variant === 'billing'

  return (
    <label className="block rounded-2xl border border-ink/10 bg-paper-light/75 p-3 shadow-sm backdrop-blur-sm">
      <span className="mb-1.5 block text-[0.65rem] font-black tracking-[0.14em] text-muted uppercase">
        {isBilling ? 'Cari nama section' : 'Cari TRX'}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-12 w-full rounded-xl border border-ink/15 bg-paper-light px-3.5 text-base font-bold text-ink outline-none transition focus:border-accent focus:ring-3 focus:ring-accent/10"
      >
        <option value="all">
          {isBilling ? 'Semua section billing' : 'Semua F&B order'}
        </option>
        {records.map((record, index) => (
          <option key={record.id} value={record.id}>
            {record.name.trim() ||
              `${isBilling ? 'Billing' : 'F&B Order'} ${String(index + 1).padStart(2, '0')}`}
          </option>
        ))}
      </select>
    </label>
  )
}

export default SectionSearch
