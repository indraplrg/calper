import { PlusIcon } from './Icons.jsx'

function AddSectionCard({ onAddSection, title, description }) {
  return (
    <button
      type="button"
      onClick={onAddSection}
      className="group flex min-h-28 w-full items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-ink/20 bg-paper-light/40 px-5 py-6 text-left transition hover:border-accent/70 hover:bg-paper-light/75 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-accent"
      aria-label={title}
    >
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-ink/15 bg-paper-light text-ink shadow-[0_3px_0_rgba(23,33,30,0.16)] transition-transform duration-300 group-hover:rotate-6 group-hover:text-accent">
        <PlusIcon className="size-5" />
      </span>
      <span>
        <span className="block font-display text-xl font-semibold text-ink">
          {title}
        </span>
        <span className="mt-1 block text-xs leading-5 text-muted">
          {description}
        </span>
      </span>
    </button>
  )
}

export default AddSectionCard
