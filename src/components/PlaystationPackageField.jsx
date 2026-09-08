import {
  PLAYSTATION_PACKAGE_GROUPS,
  findPlaystationPackage,
  priceToInput,
} from '../data/catalog.js'
import AmountInput from './AmountInput.jsx'

function PlaystationPackageField({
  packageGroupId,
  packageId,
  basePrice,
  onChange,
}) {
  const selectedPackage = findPlaystationPackage(packageId)
  const selectedGroupId = selectedPackage?.groupId || packageGroupId || ''
  const selectedGroup = PLAYSTATION_PACKAGE_GROUPS.find(
    (group) => group.id === selectedGroupId,
  )

  function selectGroup(nextGroupId) {
    onChange({
      packageGroupId: nextGroupId,
      packageId: '',
      basePrice: '',
    })
  }

  function selectPackage(nextPackageId) {
    const nextPackage = findPlaystationPackage(nextPackageId)

    if (nextPackage) {
      onChange({
        packageGroupId: nextPackage.groupId,
        packageId: nextPackage.id,
        basePrice: priceToInput(nextPackage.price),
      })
      return
    }

    onChange({
      packageGroupId: selectedGroupId,
      packageId: nextPackageId,
      basePrice: '',
    })
  }

  return (
    <div className="sm:col-span-2">
      <span className="mb-1.5 block text-xs font-black text-ink">
        Paket PlayStation
      </span>
      <div className="grid grid-cols-2 gap-2">
        <label className="min-w-0">
          <span className="sr-only">Jenis PlayStation</span>
          <select
            value={selectedGroupId}
            onChange={(event) => selectGroup(event.target.value)}
            className="min-h-12 w-full rounded-xl border border-ink/15 bg-[#f7f4ed] px-3 text-sm font-bold text-ink outline-none transition focus:border-accent focus:ring-3 focus:ring-accent/10 sm:text-base"
          >
            <option value="">Pilih jenis</option>
            {PLAYSTATION_PACKAGE_GROUPS.map((group) => (
              <option key={group.id} value={group.id}>
                {group.label}
              </option>
            ))}
          </select>
        </label>

        <label className="min-w-0">
          <span className="sr-only">Durasi dan harga paket</span>
          <select
            value={selectedPackage?.id || (packageId === 'custom' ? 'custom' : '')}
            onChange={(event) => selectPackage(event.target.value)}
            disabled={!selectedGroup}
            className="min-h-12 w-full rounded-xl border border-ink/15 bg-[#f7f4ed] px-3 text-sm font-bold text-ink outline-none transition focus:border-accent focus:ring-3 focus:ring-accent/10 disabled:cursor-not-allowed disabled:bg-ink/5 disabled:text-muted sm:text-base"
          >
            <option value="">
              {selectedGroup ? 'Pilih paket' : 'Pilih jenis dulu'}
            </option>
            {selectedGroup?.packages.map((item) => (
              <option key={item.id} value={item.id}>
                {item.duration} jam · {priceToInput(item.price)}
              </option>
            ))}
            {selectedGroup && <option value="custom">Harga manual</option>}
          </select>
        </label>
      </div>

      {packageId === 'custom' && (
        <div className="mt-2">
          <AmountInput
            value={basePrice}
            onChange={(value) =>
              onChange({
                packageGroupId: selectedGroupId,
                packageId: 'custom',
                basePrice: value,
              })
            }
            label="Harga PlayStation manual"
            placeholder="Contoh: 15k"
          />
        </div>
      )}
    </div>
  )
}

export default PlaystationPackageField
