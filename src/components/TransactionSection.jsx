import { calculateBilling } from '../utils/billing.js'
import {
  createAdjustment,
  createPayment,
  getLocalDateKey,
} from '../utils/workspace.js'
import AdjustmentList from './AdjustmentList.jsx'
import AmountInput from './AmountInput.jsx'
import BillingSummary from './BillingSummary.jsx'
import { TrashIcon } from './Icons.jsx'
import PaymentList from './PaymentList.jsx'

const variantContent = {
  billing: {
    cardLabel: 'Billing',
    emptyName: 'Belum diberi nama',
    nameLabel: 'Nama section',
    namePlaceholder: 'Contoh: PS 03 - Meja 2',
    priceLabel: 'Harga seharusnya',
    priceAriaLabel: 'Harga yang seharusnya dibayar',
    pricePlaceholder: '50.000',
    summaryBaseLabel: 'Harga seharusnya',
    adjustmentTitle: 'Penyesuaian tagihan',
    adjustmentDescription: 'Tambahkan item atau koreksi, lalu atur Qty jika jumlahnya lebih dari satu.',
    adjustmentAddLabel: 'Tambah penyesuaian',
    adjustmentPlaceholder: 'Nama item, contoh: Indomie goreng',
  },
  fnb: {
    cardLabel: 'F&B Order',
    emptyName: 'TRX belum diisi',
    nameLabel: 'TRX',
    namePlaceholder: 'Contoh: TRX 001',
    adjustmentTitle: 'Tambah pesanan',
    adjustmentDescription: 'Masukkan harga satuan, lalu atur Qty sesuai jumlah pesanan.',
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
  const summary = calculateBilling(
    isBilling ? record.basePrice : '',
    record.adjustments,
    record.payments,
  )

  function addAdjustment() {
    onUpdate({
      adjustments: [...record.adjustments, createAdjustment('adjustment')],
    })
  }

  function updateAdjustment(adjustmentId, field, value) {
    onUpdate({
      adjustments: record.adjustments.map((item) =>
        item.id === adjustmentId ? { ...item, [field]: value } : item,
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
              receivedOn:
                field === 'amount'
                  ? String(value).trim()
                    ? payment.receivedOn || getLocalDateKey()
                    : ''
                  : payment.receivedOn,
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
              {content.priceLabel}
            </span>
            <AmountInput
              value={record.basePrice}
              onChange={(value) => onUpdate({ basePrice: value })}
              label={content.priceAriaLabel}
              placeholder={content.pricePlaceholder}
            />
          </label>
        )}
      </div>

      <div className="space-y-5">
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
          title={isBilling ? 'Hasil rekap' : 'Total pembayaran'}
          baseLabel={content.summaryBaseLabel}
          showBaseLine={isBilling}
          emptyItemsText={
            isBilling
              ? 'Belum ada penyesuaian tagihan.'
              : 'Belum ada pesanan.'
          }
        />
      </div>
    </article>
  )
}

export default TransactionSection
