import WorkspaceTabs from './WorkspaceTabs.jsx'
import { ReceiptIcon, StorageIcon } from './Icons.jsx'

function AppHeader({ activeMenu, onMenuChange }) {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-3xl px-3 sm:px-6">
        <div className="flex h-14 items-center justify-between gap-3 px-1 sm:h-16">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-ink text-paper-light shadow-[0_3px_0_#aeb8a8]">
              <ReceiptIcon className="size-[1.15rem]" />
            </span>
            <span className="text-base font-black tracking-[-0.04em] text-ink sm:text-lg">
              CAL<span className="text-accent">/</span>PER
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[0.66rem] font-bold text-muted sm:text-xs">
            <StorageIcon className="size-4 text-[#63834f]" />
            <span className="sm:hidden">Auto-save</span>
            <span className="hidden sm:inline">Tersimpan otomatis</span>
          </div>
        </div>

        <WorkspaceTabs activeMenu={activeMenu} onMenuChange={onMenuChange} />
      </div>
    </header>
  )
}

export default AppHeader
