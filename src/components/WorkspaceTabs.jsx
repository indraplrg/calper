import { ChartIcon, FoodIcon, ReceiptIcon } from './Icons.jsx'

const tabs = [
  { id: 'billing', label: 'Billing', icon: ReceiptIcon },
  { id: 'fnb', label: 'F&B Order', icon: FoodIcon },
  { id: 'recap', label: 'Recap', icon: ChartIcon },
]

function WorkspaceTabs({ activeMenu, onMenuChange }) {
  return (
    <nav
      className="grid grid-cols-3 gap-1 rounded-xl border border-ink/10 bg-ink/5 p-1"
      aria-label="Menu workspace"
    >
      {tabs.map(({ id, label, icon }) => {
        const isActive = activeMenu === id
        const TabIcon = icon

        return (
          <button
            key={id}
            type="button"
            onClick={() => onMenuChange(id)}
            className={`flex min-h-10 items-center justify-center gap-1.5 rounded-lg px-1.5 text-xs font-bold transition focus-visible:outline-3 focus-visible:outline-offset-1 focus-visible:outline-accent sm:gap-2 sm:px-3 sm:text-sm ${
              isActive
                ? 'bg-paper-light text-ink shadow-sm'
                : 'text-muted hover:bg-paper-light/50 hover:text-ink'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            <TabIcon className={`size-4 ${isActive ? 'text-accent' : ''}`} />
            {label}
          </button>
        )
      })}
    </nav>
  )
}

export default WorkspaceTabs
