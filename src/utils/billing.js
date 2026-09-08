const rupiahFormatter = new Intl.NumberFormat('id-ID', {
  maximumFractionDigits: 0,
  useGrouping: true,
})

const paymentMethods = [
  { method: 'cash', label: 'Cash' },
  { method: 'qris', label: 'QRIS' },
  { method: 'dp_cash', label: 'DP Cash' },
  { method: 'dp_qris', label: 'DP QRIS' },
]

function normalizeSeparators(value, hasMultiplier) {
  const hasDot = value.includes('.')
  const hasComma = value.includes(',')

  if (hasDot && hasComma) {
    return value.replace(/\./g, '').replace(',', '.')
  }

  if (hasComma) {
    if (!hasMultiplier && /^\d{1,3}(,\d{3})+$/.test(value)) {
      return value.replace(/,/g, '')
    }
    return value.replace(',', '.')
  }

  if (hasDot) {
    if (hasMultiplier && /^\d+\.\d{1,2}$/.test(value)) {
      return value
    }
    if (/^\d{1,3}(\.\d{3})+$/.test(value)) {
      return value.replace(/\./g, '')
    }
  }

  return value
}

export function parseRupiah(input) {
  if (typeof input === 'number') {
    return Number.isFinite(input) ? Math.abs(Math.round(input)) : 0
  }

  const originalValue = String(input || '').trim().toLowerCase()
  if (!originalValue) return 0

  const suffix = originalValue.match(/(juta|jt|ribu|rb|k)\s*$/)?.[1]
  const multiplier = suffix
    ? suffix === 'juta' || suffix === 'jt'
      ? 1_000_000
      : 1_000
    : 1
  const numericValue = originalValue
    .replace(/rp\.?/g, '')
    .replace(/(juta|jt|ribu|rb|k)\s*$/, '')
    .replace(/\s/g, '')
    .replace(/[^\d.,-]/g, '')
    .replace(/^[.,]+/, '')

  if (!numericValue) return 0

  const normalizedValue = normalizeSeparators(
    numericValue.replace(/-/g, ''),
    multiplier > 1,
  )
  const parsedValue = Number(normalizedValue)

  if (!Number.isFinite(parsedValue)) return 0
  return Math.abs(Math.round(parsedValue * multiplier))
}

export function formatRupiah(value) {
  return `Rp ${rupiahFormatter.format(Math.round(value || 0))}`
}

export function calculateBilling(basePrice, adjustments, payments) {
  const baseAmount = parseRupiah(basePrice)
  const adjustmentLines = adjustments
    .filter((item) => String(item.amount).trim())
    .map((item, index) => ({
      id: item.id,
      name: item.name.trim() || `Penyesuaian ${index + 1}`,
      operator: item.operator,
      amount: parseRupiah(item.amount),
    }))
  const adjustmentTotal = adjustmentLines.reduce(
    (total, item) =>
      total + (item.operator === '-' ? -item.amount : item.amount),
    0,
  )
  const totalDue = Math.max(0, baseAmount + adjustmentTotal)

  const paymentTotals = payments.reduce(
    (totals, payment) => {
      if (!String(payment.amount).trim()) return totals
      if (!(payment.method in totals)) return totals
      totals[payment.method] += parseRupiah(payment.amount)
      return totals
    },
    { cash: 0, qris: 0, dp_cash: 0, dp_qris: 0 },
  )
  const hasPayment = payments.some((payment) =>
    String(payment.amount).trim(),
  )
  const paymentBreakdown = paymentMethods
    .map((payment) => ({
      ...payment,
      amount: paymentTotals[payment.method],
    }))
    .filter((payment) =>
      payments.some(
        (entry) =>
          entry.method === payment.method && String(entry.amount).trim(),
      ),
    )
  const totalPaid = Object.values(paymentTotals).reduce(
    (total, amount) => total + amount,
    0,
  )
  const balance = totalPaid - totalDue
  const hasAnyInput =
    Boolean(String(basePrice).trim()) ||
    adjustmentLines.length > 0 ||
    hasPayment

  let status = 'empty'
  let settlementAmount = 0

  if (hasAnyInput && !hasPayment) {
    status = 'unpaid'
    settlementAmount = totalDue
  } else if (hasPayment && balance > 0) {
    status = 'change'
    settlementAmount = balance
  } else if (hasPayment && balance < 0) {
    status = 'short'
    settlementAmount = Math.abs(balance)
  } else if (hasPayment) {
    status = 'paid'
  }

  return {
    baseAmount,
    adjustmentLines,
    totalDue,
    paymentBreakdown,
    totalPaid,
    status,
    settlementAmount,
  }
}
