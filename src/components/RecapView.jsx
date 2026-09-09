import { formatRupiah } from '../utils/billing.js'
import {
  calculateDailyRecap,
  formatRecapDate,
  getLocalDateKey,
} from '../utils/recap.js'
import { ChartIcon } from './Icons.jsx'

function PaymentRecapRow({ label, value, details }) {
  return (
    <div className="border-b border-ink/10 py-4 last:border-b-0">
      <div className="flex items-start justify-between gap-4">
        <span className="text-sm leading-5 font-semibold text-muted">
          {label}
        </span>
        <strong className="number-display shrink-0 text-right text-lg tracking-tight text-ink">
          {formatRupiah(value)}
        </strong>
      </div>
      <div className="mt-2 space-y-1">
        {details.map((detail) => (
          <div
            key={detail.label}
            className="flex items-center justify-between gap-4 text-[0.7rem] leading-4 text-muted/70"
          >
            <span>{detail.label}</span>
            <span className="number-display shrink-0 font-semibold">
              {formatRupiah(detail.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function RecapView({ billingSections, fnbOrders }) {
  const dateKey = getLocalDateKey()
  const recap = calculateDailyRecap(billingSections, fnbOrders, dateKey)

  return (
    <section className="overflow-hidden rounded-[1.4rem] border border-ink/15 bg-paper-light shadow-[0_8px_26px_rgba(23,33,30,0.07),0_3px_0_rgba(23,33,30,0.13)]">
      <div className="bg-ink px-5 py-6 text-paper-light sm:px-6">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-2xl bg-paper-light/10 text-[#cfe6bd]">
            <ChartIcon className="size-5" />
          </span>
          <div>
            <p className="text-[0.62rem] font-black tracking-[0.18em] text-paper-light/45 uppercase">
              Pemasukan hari ini
            </p>
            <h2 className="mt-1 font-display text-2xl font-semibold capitalize">
              {formatRecapDate(dateKey)}
            </h2>
          </div>
        </div>
      </div>

      <div className="px-4 py-2 sm:px-6">
        <PaymentRecapRow
          label="Total uang masuk (Cash)"
          value={recap.cash}
          details={[
            { label: 'DP Cash', value: recap.paymentBreakdown.dp_cash },
            { label: 'Cash', value: recap.paymentBreakdown.cash },
          ]}
        />
        <PaymentRecapRow
          label="Total uang masuk (QRIS)"
          value={recap.qris}
          details={[
            { label: 'DP QRIS', value: recap.paymentBreakdown.dp_qris },
            { label: 'QRIS', value: recap.paymentBreakdown.qris },
          ]}
        />
      </div>

      <div className="m-3 mt-2 rounded-2xl bg-[#dcebcf] px-4 py-5 sm:m-4 sm:px-5">
        <p className="text-[0.65rem] font-black tracking-[0.14em] text-[#557044] uppercase">
          Total keseluruhan uang masuk
        </p>
        <div className="mt-2 flex items-end justify-between gap-3">
          <span className="text-xs font-semibold text-[#557044]">Cash + QRIS</span>
          <strong className="number-display text-2xl tracking-tight text-[#29431f] sm:text-3xl">
            {formatRupiah(recap.total)}
          </strong>
        </div>
      </div>

      <p className="px-5 pb-5 text-xs leading-5 text-muted sm:px-6">
        Nominal sudah dikurangi kembalian. Total Cash dan QRIS mencakup
        pembayaran utama serta DP.
      </p>
    </section>
  )
}

export default RecapView
