import { calculateBilling, parseRupiah } from './billing.js'
import { getLocalDateKey } from './workspace.js'

const cashMethods = new Set(['cash', 'dp_cash'])
const qrisMethods = new Set(['qris', 'dp_qris'])
const supportedMethods = new Set([...cashMethods, ...qrisMethods])
const changeDeductionOrder = ['cash', 'qris']
const dateKeyPattern = /^\d{4}-\d{2}-\d{2}$/

function getNetPayments(record, basePrice) {
  const fallbackDate = getLocalDateKey()
  const payments = record.payments
    .filter((payment) => supportedMethods.has(payment.method))
    .map((payment) => ({
      ...payment,
      netAmount: parseRupiah(payment.amount),
      receivedOn: dateKeyPattern.test(payment.receivedOn)
        ? payment.receivedOn
        : fallbackDate,
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

  // A deposit is always incoming money; deduct change only from final payments.
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
  const paymentBreakdown = { cash: 0, dp_cash: 0, qris: 0, dp_qris: 0 }
  const totals = { cash: 0, qris: 0, rental: 0, fnb: 0 }

  function addDailyPayments(record, basePrice) {
    return getNetPayments(record, basePrice).reduce((total, payment) => {
      if (payment.receivedOn !== dateKey) return total

      const amount = payment.netAmount
      paymentBreakdown[payment.method] += amount
      if (cashMethods.has(payment.method)) totals.cash += amount
      if (qrisMethods.has(payment.method)) totals.qris += amount
      return total + amount
    }, 0)
  }

  for (const record of billingSections) {
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
    const rentalRatio = summary.totalDue > 0 ? rentalDue / summary.totalDue : 1
    const receivedAmount = addDailyPayments(record, record.basePrice)
    const rentalAmount =
      receivedAmount === summary.totalDue
        ? rentalDue
        : Math.round(receivedAmount * rentalRatio)

    totals.rental += rentalAmount
    totals.fnb += receivedAmount - rentalAmount
  }

  for (const record of fnbOrders) {
    totals.fnb += addDailyPayments(record, '')
  }

  return {
    ...totals,
    total: totals.cash + totals.qris,
    paymentBreakdown,
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
      if (dateKeyPattern.test(payment.receivedOn)) {
        dateKeys.add(payment.receivedOn)
      }
    }
  }

  return [...dateKeys]
    .sort((firstDate, secondDate) => secondDate.localeCompare(firstDate))
    .map((date) => {
      const recap = calculateDailyRecap(billingSections, fnbOrders, date)

      return {
        date,
        cash: recap.cash,
        qris: recap.qris,
        rental: recap.rental,
        fnb: recap.fnb,
        total: recap.total,
      }
    })
}

export { getLocalDateKey }
