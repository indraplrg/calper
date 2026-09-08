import AmountInput from './AmountInput.jsx'
import { PlusIcon, TrashIcon } from './Icons.jsx'

function PaymentList({
  payments,
  allowDepositMethods = false,
  onAdd,
  onRemove,
  onUpdate,
}) {
  return (
    <section className="border-t border-ink/10 pt-5">
      <div className="mb-3 flex items-start gap-3">
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-ink text-[0.66rem] font-black text-paper-light">
          2
        </span>
        <div>
          <h3 className="text-sm font-black text-ink">Metode pembayaran</h3>
          <p className="mt-0.5 text-xs leading-5 text-muted">
            Tambah baris jika pelanggan melakukan split bill.
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {payments.map((payment, index) => (
          <div
            key={payment.id}
            className="grid grid-cols-[7.25rem_minmax(0,1fr)_2.5rem] items-center gap-2 rounded-2xl border border-ink/10 bg-[#f7f4ed] p-3"
          >
            <label>
              <span className="sr-only">Metode pembayaran {index + 1}</span>
              <select
                value={payment.method}
                onChange={(event) => onUpdate(payment.id, 'method', event.target.value)}
                className="min-h-12 w-full rounded-xl border border-ink/15 bg-paper-light px-3 text-base font-bold text-ink outline-none transition focus:border-accent focus:ring-3 focus:ring-accent/10"
              >
                <option value="cash">Cash</option>
                <option value="qris">QRIS</option>
                {allowDepositMethods && (
                  <>
                    <option value="dp_cash">DP Cash</option>
                    <option value="dp_qris">DP QRIS</option>
                  </>
                )}
              </select>
            </label>

            <AmountInput
              value={payment.amount}
              onChange={(value) => onUpdate(payment.id, 'amount', value)}
              label={`Nominal pembayaran ${index + 1}`}
            />

            {payments.length > 1 ? (
              <button
                type="button"
                onClick={() => onRemove(payment.id)}
                className="grid size-10 place-items-center rounded-xl text-muted transition hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                aria-label={`Hapus pembayaran ${index + 1}`}
              >
                <TrashIcon className="size-4" />
              </button>
            ) : (
              <span className="size-10" aria-hidden="true" />
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-ink/25 bg-paper-light/60 px-4 text-sm font-bold text-ink transition hover:border-accent hover:text-accent focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <PlusIcon className="size-4" />
        Tambah pembayaran
      </button>
    </section>
  )
}

export default PaymentList
