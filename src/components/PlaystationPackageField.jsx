import {
  PLAYSTATION_PACKAGE_GROUPS,
  findPlaystationPackage,
  priceToInput,
} from '../data/catalog.js'
import { formatRupiah } from '../utils/billing.js'
import AmountInput from './AmountInput.jsx'

function PlaystationPackageField({ packageId, basePrice, onChange }) {
  const selectedPackage = findPlaystationPackage(packageId)

  function selectPackage(nextPackageId) {
    const nextPackage = findPlaystationPackage(nextPackageId)

    if (nextPackage) {
      onChange({
        packageId: nextPackage.id,
        basePrice: priceToInput(nextPackage.price),
      })
      return
    }

    onChange({
      packageId: nextPackageId,
      basePrice: '',
    })
  }

  return (
    <div className="sm:col-span-2">
      <label className="block">
        <span className="mb-1.5 block text-xs font-black text-ink">
          Paket PlayStation
        </span>
        <select
          value={packageId || ''}
          onChange={(event) => selectPackage(event.target.value)}
          className="min-h-12 w-full rounded-xl border border-ink/15 bg-[#f7f4ed] px-3.5 text-base font-bold text-ink outline-none transition focus:border-accent focus:ring-3 focus:ring-accent/10"
        >
          <option value="">Pilih paket PS</option>
          {PLAYSTATION_PACKAGE_GROUPS.map((group) => (
            <optgroup key={group.id} label={group.label}>
              {group.packages.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.duration} jam · {formatRupiah(item.price)}
                </option>
              ))}
            </optgroup>
          ))}
          <option value="custom">Harga manual / lainnya</option>
        </select>
      </label>

      {selectedPackage && (
        <div className="mt-2 flex items-center justify-between rounded-xl border border-[#cbd9c3] bg-[#edf3e9] px-3.5 py-2.5 text-sm">
          <span className="font-semibold text-[#557044]">
            {selectedPackage.groupLabel} · {selectedPackage.duration} jam
          </span>
          <strong className="number-display text-ink">
            {formatRupiah(selectedPackage.price)}
          </strong>
        </div>
      )}

      {packageId === 'custom' && (
        <div className="mt-2">
          <AmountInput
            value={basePrice}
            onChange={(value) => onChange({ packageId: 'custom', basePrice: value })}
            label="Harga PlayStation manual"
            placeholder="Contoh: 15k"
          />
        </div>
      )}
    </div>
  )
}

export default PlaystationPackageField
