import { calculateBilling, parseRupiah } from './billing.js'
import { getLocalDateKey } from './workspace.js'

const cashMethods = new Set(['cash', 'dp_cash'])
const qrisMethods = new Set(['qris', 'dp_qris'])
const supportedMethods = new Set([...cashMethods, ...qrisMethods])
const changeDeductionOrder = ['cash', 'dp_cash', 'qris', 'dp_qris']

function getNetPayments(record, basePrice) {
  const payments = record.payments
    .filter((payment) => supportedMethods.has(payment.method))
    .map((payment) => ({
      ...payment,
      netAmount: parseRupiah(payment.amount),
    }))
  const totalPaid = payments.reduce(
    (total, payment) => total + payment.netAmount,
    0,
  )
  const totalDue = calculateBilling(
    basePrice,
    record.adjustments,
    record.payments,
    record.timeExtensions,
  ).totalDue
  let remainingChange = Math.max(0, totalPaid - totalDue)

  // Cash is where change is normally returned, so deduct it before QRIS.
  for (const method of changeDeductionOrder) {
    for (let index = payments.length - 1; index >= 0; index -= 1) {
      const payment = payments[index]
      if (payment.method !== method || remainingChange === 0) continue

      const deduction = Math.min(payment.netAmount, remainingChange)
      payment.netAmount -= deduction
      remainingChange -= deduction
    }
  }

  return payments
}

export function calculateDailyRecap(
  billingSections,
  fnbOrders,
  dateKey = getLocalDateKey(),
) {
  const billingPayments = billingSections.flatMap((record) => {
    const summary = calculateBilling(
      record.basePrice,
      record.adjustments,
      record.payments,
      record.timeExtensions,
    )
    const rentalDue =
      summary.baseAmount +
      summary.timeExtensionLines.reduce(
        (total, extension) => total + extension.amount,
        0,
      )
    const rentalRatio = summary.totalDue > 0 ? rentalDue / summary.totalDue : 0

    return getNetPayments(record, record.basePrice).map((payment) => ({
      ...payment,
      source: 'billing',
      rentalRatio,
    }))
  })
  const fnbPayments = fnbOrders.flatMap((record) =>
    getNetPayments(record, '').map((payment) => ({
      ...payment,
      source: 'fnb',
    })),
  )
  const payments = [...billingPayments, ...fnbPayments]

  const totals = payments.reduce(
    (currentTotals, payment) => {
      if (payment.receivedOn !== dateKey) return currentTotals

      const amount = payment.netAmount
      if (cashMethods.has(payment.method)) currentTotals.cash += amount
      if (qrisMethods.has(payment.method)) currentTotals.qris += amount
      if (payment.source === 'billing') {
        const rentalAmount = Math.round(amount * payment.rentalRatio)
        currentTotals.rental += rentalAmount
        currentTotals.fnb += amount - rentalAmount
      } else {
        currentTotals.fnb += amount
      }
      return currentTotals
    },
    { cash: 0, qris: 0, rental: 0, fnb: 0 },
  )

  return {
    ...totals,
    total: totals.cash + totals.qris,
  }
}

export function formatRecapDate(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month - 1, day))
}

export function calculateRecapHistory(billingSections, fnbOrders) {
  const dateKeys = new Set([getLocalDateKey()])

  for (const record of [...billingSections, ...fnbOrders]) {
    for (const payment of record.payments) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(payment.receivedOn)) {
        dateKeys.add(payment.receivedOn)
      }
    }
  }

  return [...dateKeys]
    .sort((firstDate, secondDate) => secondDate.localeCompare(firstDate))
    .map((date) => ({
      date,
      ...calculateDailyRecap(billingSections, fnbOrders, date),
    }))
}

export { getLocalDateKey }
