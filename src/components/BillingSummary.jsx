import { formatRupiah } from '../utils/billing.js'

const statusContent = {
  empty: {
    label: 'Menunggu nominal',
    className: 'bg-white/8 text-paper-light',
    dotClassName: 'bg-paper-light/35',
  },
  unpaid: {
    label: 'Sisa tagihan',
    className: 'bg-[#f5dfaa] text-ink',
    dotClassName: 'bg-[#d7922f]',
  },
  short: {
    label: 'Kurang bayar',
    className: 'bg-[#ffd5c9] text-[#7f2f1d]',
    dotClassName: 'bg-accent',
  },
  change: {
    label: 'Kembalian',
    className: 'bg-[#dcebcf] text-[#29431f]',
    dotClassName: 'bg-[#6a9848]',
  },
  paid: {
    label: 'Pembayaran pas',
    className: 'bg-[#dcebcf] text-[#29431f]',
    dotClassName: 'bg-[#6a9848]',
  },
}

function SummaryRow({ label, value, sign, muted = false }) {
  return (
    <div className={`flex items-start justify-between gap-4 py-1.5 ${muted ? 'text-paper-light/55' : ''}`}>
      <span className="min-w-0 truncate">{label}</span>
      <span className="number-display shrink-0 font-semibold">
        {sign && <span className="mr-1 text-paper-light/45">{sign}</span>}
        {value}
      </span>
    </div>
  )
}

function BillingSummary({
  summary,
  title,
  baseLabel,
  showBaseLine = true,
  emptyItemsText,
}) {
  const status = statusContent[summary.status]

  return (
    <section className="overflow-hidden rounded-2xl bg-ink text-paper-light shadow-[0_4px_0_#aeb8a8]">
      <div className="px-4 pt-5 pb-4 sm:px-5">
        <div className="mb-4 flex items-center gap-3">
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-paper-light text-[0.66rem] font-black text-ink">
            3
          </span>
          <div>
            <h3 className="text-sm font-black">{title}</h3>
            <p className="mt-0.5 text-xs text-paper-light/50">
              Diperbarui otomatis dari semua input.
            </p>
          </div>
        </div>

        <div className="text-sm">
          {showBaseLine && (
            <SummaryRow
              label={baseLabel}
              value={formatRupiah(summary.baseAmount)}
            />
          )}

          {summary.adjustmentLines.map((item) => (
            <SummaryRow
              key={item.id}
              label={
                item.quantity > 1
                  ? `${item.name} × ${item.quantity}`
                  : item.name
              }
              sign={item.operator === '+' ? '+' : '−'}
              value={formatRupiah(item.amount)}
              muted
            />
          ))}

          {summary.adjustmentLines.length === 0 && (
            <p className="py-1.5 text-xs text-paper-light/35">
              {emptyItemsText}
            </p>
          )}

          <div className="my-3 border-t border-dashed border-paper-light/20" />
          <div className="flex items-end justify-between gap-4">
            <span className="text-[0.65rem] font-black tracking-[0.16em] text-paper-light/50 uppercase">
              Total tagihan
            </span>
            <strong className="number-display text-xl tracking-tight sm:text-2xl">
              {formatRupiah(summary.totalDue)}
            </strong>
          </div>
        </div>

        <div className="mt-5 border-t border-paper-light/10 pt-4">
          <p className="mb-2 text-[0.62rem] font-black tracking-[0.17em] text-paper-light/40 uppercase">
            Pembayaran diterima
          </p>

          {summary.paymentBreakdown.length > 0 ? (
            <div className="text-sm">
              {summary.paymentBreakdown.map((payment) => (
                <SummaryRow
                  key={payment.method}
                  label={payment.label}
                  value={formatRupiah(payment.amount)}
                />
              ))}
              <SummaryRow
                label="Total diterima"
                value={formatRupiah(summary.totalPaid)}
                muted
              />
            </div>
          ) : (
            <p className="text-xs text-paper-light/35">Belum ada pembayaran.</p>
          )}
        </div>
      </div>

      <div className={`m-2 mt-0 rounded-xl px-4 py-3.5 ${status.className}`}>
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-2 text-xs font-black tracking-wide uppercase">
            <span className={`size-2 rounded-full ${status.dotClassName}`} />
            {status.label}
          </span>
          <strong className="number-display text-lg tracking-tight">
            {formatRupiah(summary.settlementAmount)}
          </strong>
        </div>
      </div>
    </section>
  )
}

export default BillingSummary
