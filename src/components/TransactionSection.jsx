import {
  BILLING_STATUSES,
  findPlaystationPackage,
} from '../data/catalog.js'
import { calculateBilling } from '../utils/billing.js'
import {
  createAdjustment,
  createPayment,
  createTimeExtension,
} from '../utils/workspace.js'
import AdjustmentList from './AdjustmentList.jsx'
import BillingSummary from './BillingSummary.jsx'
import { TrashIcon } from './Icons.jsx'
import PaymentList from './PaymentList.jsx'
import PlaystationPackageField from './PlaystationPackageField.jsx'
import TimeExtensionList from './TimeExtensionList.jsx'

const variantContent = {
  billing: {
    cardLabel: 'Billing',
    emptyName: 'Belum diberi nama',
    nameLabel: 'Nama section',
    namePlaceholder: 'Contoh: PS 03 - Meja 2',
    summaryBaseLabel: 'Harga seharusnya',
    adjustmentTitle: 'Tambahan makanan',
    adjustmentDescription: 'Pilih makanan atau minuman, lalu atur Qty jika jumlahnya lebih dari satu.',
    adjustmentAddLabel: 'Tambah makanan',
    adjustmentPlaceholder: 'Nama item, contoh: Indomie goreng',
  },
  fnb: {
    cardLabel: 'F&B Order',
    emptyName: 'TRX belum diisi',
    nameLabel: 'TRX',
    namePlaceholder: 'Contoh: TRX 001',
    adjustmentTitle: 'Tambah pesanan',
    adjustmentDescription: 'Pilih tipe dan menu, lalu atur Qty sesuai jumlah pesanan.',
    adjustmentAddLabel: 'Tambah pesanan',
    adjustmentPlaceholder: 'Nama barang, contoh: Indomie goreng',
  },
}

function TransactionSection({
  id,
  index,
  variant,
  record,
  canRemove,
  onUpdate,
  onRemove,
}) {
  const content = variantContent[variant]
  const isBilling = variant === 'billing'
  const selectedPackage = findPlaystationPackage(record.packageId)
  const timeExtensions = record.timeExtensions || []
  const summary = calculateBilling(
    isBilling ? record.basePrice : '',
    record.adjustments,
    record.payments,
    isBilling ? timeExtensions : [],
  )

  function addAdjustment() {
    onUpdate({
      adjustments: [...record.adjustments, createAdjustment('adjustment')],
    })
  }

  function updateAdjustment(adjustmentId, changes) {
    onUpdate({
      adjustments: record.adjustments.map((item) =>
        item.id === adjustmentId ? { ...item, ...changes } : item,
      ),
    })
  }

  function removeAdjustment(adjustmentId) {
    onUpdate({
      adjustments: record.adjustments.filter(
        (item) => item.id !== adjustmentId,
      ),
    })
  }

  function addTimeExtension() {
    onUpdate({
      timeExtensions: [
        ...timeExtensions,
        createTimeExtension('time-extension'),
      ],
    })
  }

  function updateTimeExtension(extensionId, changes) {
    onUpdate({
      timeExtensions: timeExtensions.map((extension) =>
        extension.id === extensionId
          ? { ...extension, ...changes }
          : extension,
      ),
    })
  }

  function removeTimeExtension(extensionId) {
    onUpdate({
      timeExtensions: timeExtensions.filter(
        (extension) => extension.id !== extensionId,
      ),
    })
  }

  function addPayment() {
    onUpdate({ payments: [...record.payments, createPayment('payment')] })
  }

  function updatePayment(paymentId, field, value) {
    onUpdate({
      payments: record.payments.map((payment) =>
        payment.id === paymentId
          ? {
              ...payment,
              [field]: value,
            }
          : payment,
      ),
    })
  }

  function removePayment(paymentId) {
    onUpdate({
      payments: record.payments.filter(
        (payment) => payment.id !== paymentId,
      ),
    })
  }

  return (
    <article
      id={id}
      className="billing-card scroll-mt-32 rounded-[1.4rem] border border-ink/15 bg-paper-light p-3 shadow-[0_8px_26px_rgba(23,33,30,0.07),0_3px_0_rgba(23,33,30,0.13)] sm:p-5"
      style={{ '--card-index': index }}
      aria-label={`${content.cardLabel} ${index + 1}`}
    >
      <header className="mb-5 flex items-center justify-between gap-3 px-1 pt-1">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="shrink-0 rounded-full border border-ink/15 bg-[#edf0e8] px-2.5 py-1 text-[0.62rem] font-black tracking-[0.12em] text-muted uppercase">
            {content.cardLabel} {String(index + 1).padStart(2, '0')}
          </span>
          <span className="truncate text-xs font-semibold text-muted">
            {record.name || content.emptyName}
          </span>
        </div>

        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="grid size-10 shrink-0 place-items-center rounded-xl text-muted transition hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
            aria-label={`Hapus ${record.name || `${content.cardLabel} ${index + 1}`}`}
            title={`Hapus ${content.cardLabel}`}
          >
            <TrashIcon className="size-[1.1rem]" />
          </button>
        )}
      </header>

      <div className={`mb-5 grid gap-4 ${isBilling ? 'sm:grid-cols-2' : ''}`}>
        <label className="block min-w-0">
          <span className="mb-1.5 block text-xs font-black text-ink">
            {content.nameLabel}
          </span>
          <input
            type="text"
            value={record.name}
            onChange={(event) => onUpdate({ name: event.target.value })}
            maxLength="60"
            className="record-name-input min-h-12 w-full rounded-xl border border-ink/15 bg-[#f7f4ed] px-3.5 text-base font-semibold text-ink outline-none transition placeholder:font-normal placeholder:text-muted/55 focus:border-accent focus:ring-3 focus:ring-accent/10"
            placeholder={content.namePlaceholder}
          />
        </label>

        {isBilling && (
          <label className="block min-w-0">
            <span className="mb-1.5 block text-xs font-black text-ink">
              Status billing
            </span>
            <select
              value={record.status || 'active'}
              onChange={(event) => onUpdate({ status: event.target.value })}
              className="min-h-12 w-full rounded-xl border border-ink/15 bg-[#f7f4ed] px-3.5 text-base font-bold text-ink outline-none transition focus:border-accent focus:ring-3 focus:ring-accent/10"
            >
              {BILLING_STATUSES.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.label}
                </option>
              ))}
            </select>
          </label>
        )}

        {isBilling && (
          <PlaystationPackageField
            packageGroupId={record.packageGroupId}
            packageId={record.packageId}
            basePrice={record.basePrice}
            onChange={onUpdate}
          />
        )}
      </div>

      <div className="space-y-5">
        {isBilling && (
          <TimeExtensionList
            extensions={timeExtensions}
            basePackageId={record.packageId}
            onAdd={addTimeExtension}
            onRemove={removeTimeExtension}
            onUpdate={updateTimeExtension}
          />
        )}

        <AdjustmentList
          items={record.adjustments}
          title={content.adjustmentTitle}
          description={content.adjustmentDescription}
          addLabel={content.adjustmentAddLabel}
          namePlaceholder={content.adjustmentPlaceholder}
          onAdd={addAdjustment}
          onRemove={removeAdjustment}
          onUpdate={updateAdjustment}
        />

        <PaymentList
          payments={record.payments}
          allowDepositMethods={isBilling}
          onAdd={addPayment}
          onRemove={removePayment}
          onUpdate={updatePayment}
        />

        <BillingSummary
          summary={summary}
          title={isBilling ? 'Pembayaran' : 'Total pembayaran'}
          baseLabel={
            selectedPackage
              ? `${selectedPackage.groupLabel} · ${selectedPackage.duration} jam`
              : content.summaryBaseLabel
          }
          showBaseLine={isBilling}
          emptyItemsText={
            isBilling
              ? 'Belum ada tambahan makanan.'
              : 'Belum ada pesanan.'
          }
        />
      </div>
    </article>
  )
}

export default TransactionSection
