import AmountInput from './AmountInput.jsx'
import { PlusIcon, TrashIcon } from './Icons.jsx'

function AdjustmentList({
  items,
  title,
  description,
  addLabel,
  namePlaceholder,
  onAdd,
  onRemove,
  onUpdate,
}) {
  return (
    <section className="border-t border-ink/10 pt-5">
      <div className="mb-3 flex items-start gap-3">
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-ink text-[0.66rem] font-black text-paper-light">
          1
        </span>
        <div>
          <h3 className="text-sm font-black text-ink">{title}</h3>
          <p className="mt-0.5 text-xs leading-5 text-muted">
            {description}
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="rounded-2xl border border-ink/10 bg-[#f7f4ed] p-3"
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="w-6 shrink-0 text-center text-[0.65rem] font-black text-muted">
                {String(index + 1).padStart(2, '0')}
              </span>
              <input
                type="text"
                value={item.name}
                onChange={(event) => onUpdate(item.id, 'name', event.target.value)}
                className="min-h-10 min-w-0 flex-1 border-b border-ink/15 bg-transparent px-1 text-base font-semibold text-ink outline-none transition placeholder:font-normal placeholder:text-muted/55 focus:border-accent"
                placeholder={namePlaceholder}
                aria-label={`Nama penyesuaian ${index + 1}`}
              />
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  className="grid size-10 shrink-0 place-items-center rounded-xl text-muted transition hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                  aria-label={`Hapus penyesuaian ${index + 1}`}
                >
                  <TrashIcon className="size-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-[7.25rem_minmax(0,1fr)] gap-2">
              <label>
                <span className="sr-only">Operator penyesuaian {index + 1}</span>
                <select
                  value={item.operator}
                  onChange={(event) => onUpdate(item.id, 'operator', event.target.value)}
                  className="min-h-12 w-full rounded-xl border border-ink/15 bg-paper-light px-3 text-base font-bold text-ink outline-none transition focus:border-accent focus:ring-3 focus:ring-accent/10"
                >
                  <option value="+">+ Tambah</option>
                  <option value="-">− Kurangi</option>
                </select>
              </label>
              <AmountInput
                value={item.amount}
                onChange={(value) => onUpdate(item.id, 'amount', value)}
                label={`Nominal penyesuaian ${index + 1}`}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-ink/25 bg-paper-light/60 px-4 text-sm font-bold text-ink transition hover:border-accent hover:text-accent focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <PlusIcon className="size-4" />
        {addLabel}
      </button>
    </section>
  )
}

export default AdjustmentList
