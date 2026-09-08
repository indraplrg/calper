import {
  PLAYSTATION_PACKAGE_GROUPS,
  findPlaystationPackage,
  priceToInput,
} from '../data/catalog.js'
import { formatRupiah } from '../utils/billing.js'
import AmountInput from './AmountInput.jsx'
import { PlusIcon, TrashIcon } from './Icons.jsx'

function TimeExtensionList({
  extensions,
  basePackageId,
  onAdd,
  onRemove,
  onUpdate,
}) {
  const basePackage = findPlaystationPackage(basePackageId)
  const visibleGroupIds = new Set([
    basePackage?.groupId,
    ...extensions.map(
      (extension) => findPlaystationPackage(extension.packageId)?.groupId,
    ),
  ])
  const packageGroups = basePackage
    ? PLAYSTATION_PACKAGE_GROUPS.filter(
        (group) => visibleGroupIds.has(group.id),
      )
    : PLAYSTATION_PACKAGE_GROUPS

  function selectPackage(extensionId, packageId) {
    const selectedPackage = findPlaystationPackage(packageId)

    if (selectedPackage) {
      onUpdate(extensionId, {
        packageId,
        hours: String(selectedPackage.duration),
        amount: priceToInput(selectedPackage.price),
      })
      return
    }

    onUpdate(extensionId, {
      packageId,
      hours: packageId === 'custom' ? '1' : '',
      amount: '',
    })
  }

  return (
    <section className="rounded-2xl border border-ink/10 bg-[#f7f4ed] p-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-black text-ink">Tambah jam</h3>
          <p className="mt-0.5 text-xs leading-5 text-muted">
            Pilih paket waktu tambahan atau gunakan harga manual.
          </p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-xl bg-ink px-3 text-xs font-bold text-paper-light transition hover:bg-[#2a3732] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <PlusIcon className="size-3.5" />
          Tambah
        </button>
      </div>

      {extensions.length > 0 && (
        <div className="mt-3 space-y-2.5 border-t border-ink/10 pt-3">
          {extensions.map((extension, index) => {
            const selectedPackage = findPlaystationPackage(extension.packageId)

            return (
              <div
                key={extension.id}
                className="rounded-xl border border-ink/10 bg-paper-light p-2.5"
              >
                <div className="flex items-center gap-2">
                  <select
                    value={extension.packageId || ''}
                    onChange={(event) =>
                      selectPackage(extension.id, event.target.value)
                    }
                    className="min-h-11 min-w-0 flex-1 rounded-lg border border-ink/15 bg-white px-3 text-sm font-bold text-ink outline-none transition focus:border-accent focus:ring-3 focus:ring-accent/10"
                    aria-label={`Paket tambah jam ${index + 1}`}
                  >
                    <option value="">Pilih tarif tambahan</option>
                    {packageGroups.map((group) => (
                      <optgroup key={group.id} label={group.label}>
                        {group.packages.map((item) => (
                          <option key={item.id} value={item.id}>
                            +{item.duration} jam · {formatRupiah(item.price)}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                    <option value="custom">Jam & harga manual</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => onRemove(extension.id)}
                    className="grid size-11 shrink-0 place-items-center rounded-lg text-muted transition hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-red-500"
                    aria-label={`Hapus tambah jam ${index + 1}`}
                  >
                    <TrashIcon className="size-4" />
                  </button>
                </div>

                {selectedPackage && (
                  <div className="mt-2 flex items-center justify-between rounded-lg bg-[#edf3e9] px-3 py-2 text-xs">
                    <span className="font-semibold text-[#557044]">
                      Tambah {selectedPackage.duration} jam
                    </span>
                    <strong className="number-display text-ink">
                      {formatRupiah(selectedPackage.price)}
                    </strong>
                  </div>
                )}

                {extension.packageId === 'custom' && (
                  <div className="mt-2 grid grid-cols-[5.5rem_minmax(0,1fr)] gap-2">
                    <label className="rounded-xl border border-ink/15 bg-white px-2.5 py-1.5">
                      <span className="block text-[0.55rem] font-black tracking-wide text-muted uppercase">
                        Jam
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={extension.hours}
                        onChange={(event) =>
                          onUpdate(extension.id, {
                            hours: event.target.value
                              .replace(/\D/g, '')
                              .slice(0, 2),
                          })
                        }
                        className="number-input w-full bg-transparent text-center text-base font-black text-ink outline-none"
                        aria-label={`Jumlah jam tambahan ${index + 1}`}
                      />
                    </label>
                    <AmountInput
                      value={extension.amount}
                      onChange={(value) =>
                        onUpdate(extension.id, { amount: value })
                      }
                      label={`Total harga tambah jam ${index + 1}`}
                      placeholder="Contoh: 15k"
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default TimeExtensionList
