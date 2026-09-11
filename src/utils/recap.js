import { calculateBilling, parseRupiah } from './billing.js'

const cashMethods = new Set(['cash', 'dp_cash'])
const qrisMethods = new Set(['qris', 'dp_qris'])
const supportedMethods = new Set([...cashMethods, ...qrisMethods])
const changeDeductionOrder = ['cash', 'qris']

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

export function calculateRecap(billingSections, fnbOrders) {
  const paymentBreakdown = { cash: 0, dp_cash: 0, qris: 0, dp_qris: 0 }
  const totals = { cash: 0, qris: 0, rental: 0, fnb: 0 }

  function addPayments(record, basePrice) {
    return getNetPayments(record, basePrice).reduce((total, payment) => {
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
    const receivedAmount = addPayments(record, record.basePrice)
    const rentalAmount =
      receivedAmount === summary.totalDue
        ? rentalDue
        : Math.round(receivedAmount * rentalRatio)

    totals.rental += rentalAmount
    totals.fnb += receivedAmount - rentalAmount
  }

  for (const record of fnbOrders) {
    totals.fnb += addPayments(record, '')
  }

  return {
    ...totals,
    total: totals.cash + totals.qris,
    paymentBreakdown,
  }
}
