import {
  FNB_MENU_GROUPS,
  findFnbMenuItem,
  priceToInput,
} from '../data/catalog.js'
import {
  formatRupiah,
  parseQuantity,
  parseRupiah,
} from '../utils/billing.js'
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
  function selectMenuGroup(itemId, menuGroupId) {
    onUpdate(itemId, {
      menuGroupId,
      catalogItemId: menuGroupId === 'custom' ? 'custom' : '',
      name: '',
      amount: '',
      operator: '+',
    })
  }

  function selectMenuItem(itemId, menuGroupId, catalogItemId) {
    const catalogItem = findFnbMenuItem(catalogItemId)

    if (catalogItem) {
      onUpdate(itemId, {
        menuGroupId: catalogItem.groupId,
        catalogItemId,
        name: catalogItem.name,
        amount: priceToInput(catalogItem.price),
        operator: '+',
      })
      return
    }

    onUpdate(itemId, {
      menuGroupId,
      catalogItemId: '',
      name: '',
      amount: '',
      operator: '+',
    })
  }

  function changeQuantity(item, difference) {
    const nextQuantity = Math.max(
      1,
      Math.min(999, parseQuantity(item.quantity) + difference),
    )
    onUpdate(item.id, { quantity: String(nextQuantity) })
  }

  return (
    <section className="border-t border-ink/10 pt-5">
      <div className="mb-3 flex items-start gap-3">
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-ink text-[0.66rem] font-black text-paper-light">
          1
        </span>
        <div>
          <h3 className="text-sm font-black text-ink">{title}</h3>
          <p className="mt-0.5 text-xs leading-5 text-muted">{description}</p>
        </div>
      </div>

      <div className="space-y-2.5">
        {items.map((item, index) => {
          const catalogItem = findFnbMenuItem(item.catalogItemId)
          const selectedGroupId =
            catalogItem?.groupId ||
            (item.catalogItemId === 'custom'
              ? 'custom'
              : item.menuGroupId || '')
          const selectedGroup = FNB_MENU_GROUPS.find(
            (group) => group.id === selectedGroupId,
          )
          const isCustomItem = selectedGroupId === 'custom'
          const hasSelectedItem = Boolean(
            catalogItem ||
              (isCustomItem &&
                (String(item.name).trim() || String(item.amount).trim())),
          )

          return (
            <div
              key={item.id}
              className="rounded-2xl border border-ink/10 bg-[#f7f4ed] p-2 sm:p-3"
            >
              <div
                className={`grid items-center gap-1 sm:gap-2 ${
                  items.length > 1
                    ? 'grid-cols-[4rem_minmax(0,1fr)_3.75rem_2rem] sm:grid-cols-[7rem_minmax(0,1fr)_6rem_2.5rem]'
                    : 'grid-cols-[4rem_minmax(0,1fr)_3.75rem] sm:grid-cols-[7rem_minmax(0,1fr)_6rem]'
                }`}
              >
                <label className="min-w-0">
                  <span className="sr-only">Tipe item {index + 1}</span>
                  <select
                    value={selectedGroupId}
                    onChange={(event) =>
                      selectMenuGroup(item.id, event.target.value)
                    }
                    className="min-h-11 w-full rounded-xl border border-ink/15 bg-paper-light px-1 text-[0.68rem] font-bold text-ink outline-none transition focus:border-accent focus:ring-3 focus:ring-accent/10 sm:px-3 sm:text-sm"
                  >
                    <option value="">Pilih tipe</option>
                    {FNB_MENU_GROUPS.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.label}
                      </option>
                    ))}
                    <option value="custom">Manual</option>
                  </select>
                </label>

                {isCustomItem ? (
                  <input
                    type="text"
                    value={item.name}
                    onChange={(event) =>
                      onUpdate(item.id, { name: event.target.value })
                    }
                    className="min-h-11 min-w-0 rounded-xl border border-ink/15 bg-paper-light px-1.5 text-xs font-semibold text-ink outline-none transition placeholder:font-normal placeholder:text-muted/55 focus:border-accent focus:ring-3 focus:ring-accent/10 sm:px-3 sm:text-sm"
                    placeholder={namePlaceholder}
                    aria-label={`Nama item manual ${index + 1}`}
                  />
                ) : (
                  <label className="min-w-0">
                    <span className="sr-only">Pilih menu {index + 1}</span>
                    <select
                      value={catalogItem?.id || ''}
                      onChange={(event) =>
                        selectMenuItem(
                          item.id,
                          selectedGroupId,
                          event.target.value,
                        )
                      }
                      disabled={!selectedGroup}
                      className="min-h-11 w-full rounded-xl border border-ink/15 bg-paper-light px-1.5 text-xs font-bold text-ink outline-none transition focus:border-accent focus:ring-3 focus:ring-accent/10 disabled:cursor-not-allowed disabled:bg-ink/5 disabled:text-muted sm:px-3 sm:text-sm"
                    >
                      <option value="">
                        {selectedGroup ? 'Pilih menu' : 'Pilih tipe dulu'}
                      </option>
                      {selectedGroup?.items.map((menuItem) => (
                        <option key={menuItem.id} value={menuItem.id}>
                          {menuItem.name}
                        </option>
                      ))}
                    </select>
                  </label>
                )}

                <AmountInput
                  value={item.amount}
                  onChange={(value) => onUpdate(item.id, { amount: value })}
                  label={`Harga satuan item ${index + 1}`}
                  placeholder="-"
                  disabled={!isCustomItem}
                  compact
                />

                {items.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    className="grid size-8 shrink-0 place-items-center rounded-xl text-muted transition hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 sm:size-10"
                    aria-label={`Hapus item ${index + 1}`}
                  >
                    <TrashIcon className="size-4" />
                  </button>
                ) : null}
              </div>

              {hasSelectedItem && (
                <div className="mt-2 flex items-center justify-between gap-3 rounded-xl border border-ink/10 bg-paper-light px-3 py-2">
                  <div className="min-w-0">
                    <p className="text-[0.6rem] font-black tracking-[0.12em] text-muted uppercase">
                      Subtotal
                    </p>
                    <p className="number-display mt-0.5 truncate text-sm font-black text-ink">
                      {formatRupiah(
                        parseRupiah(item.amount) *
                          parseQuantity(item.quantity),
                      )}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => changeQuantity(item, -1)}
                      disabled={parseQuantity(item.quantity) <= 1}
                      className="grid size-9 place-items-center rounded-lg border border-ink/15 bg-[#f1eee6] text-lg font-bold text-ink transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-35"
                      aria-label={`Kurangi jumlah ${item.name || `item ${index + 1}`}`}
                    >
                      −
                    </button>
                    <label className="w-12 text-center">
                      <span className="block text-[0.55rem] font-black tracking-wide text-muted uppercase">
                        Qty
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={item.quantity ?? '1'}
                        onChange={(event) =>
                          onUpdate(item.id, {
                            quantity: event.target.value
                              .replace(/\D/g, '')
                              .slice(0, 3),
                          })
                        }
                        onBlur={() => {
                          if (!String(item.quantity ?? '').trim()) {
                            onUpdate(item.id, { quantity: '1' })
                          }
                        }}
                        className="number-input w-full bg-transparent text-center text-base font-black text-ink outline-none"
                        aria-label={`Jumlah ${item.name || `item ${index + 1}`}`}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => changeQuantity(item, 1)}
                      disabled={parseQuantity(item.quantity) >= 999}
                      className="grid size-9 place-items-center rounded-lg border border-ink bg-ink text-lg font-bold text-paper-light transition hover:bg-[#2a3732] disabled:cursor-not-allowed disabled:opacity-35"
                      aria-label={`Tambah jumlah ${item.name || `item ${index + 1}`}`}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
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
