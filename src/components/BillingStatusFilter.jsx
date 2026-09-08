import { BILLING_STATUSES } from '../data/catalog.js'

function BillingStatusFilter({ records, value, onChange }) {
  const filters = [
    { id: 'all', label: 'Semua', count: records.length },
    ...BILLING_STATUSES.map((status) => ({
      ...status,
      count: records.filter((record) => record.status === status.id).length,
    })),
  ]

  return (
    <div
      className="grid grid-cols-4 gap-1 rounded-xl border border-ink/10 bg-ink/5 p-1"
      aria-label="Filter status billing"
    >
      {filters.map((filter) => {
        const isActive = value === filter.id

        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => onChange(filter.id)}
            className={`min-h-11 rounded-lg px-1 py-1.5 text-[0.68rem] font-bold transition sm:text-xs ${
              isActive
                ? 'bg-paper-light text-ink shadow-sm'
                : 'text-muted hover:bg-paper-light/55 hover:text-ink'
            }`}
            aria-pressed={isActive}
          >
            <span className="block">{filter.label}</span>
            <span
              className={`mt-0.5 inline-block rounded-full px-1.5 text-[0.58rem] ${
                isActive ? 'bg-accent/12 text-accent' : 'bg-ink/7'
              }`}
            >
              {filter.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default BillingStatusFilter
