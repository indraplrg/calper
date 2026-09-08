export const WORKSPACE_STORAGE_KEY = 'calper-workspace-v1'

export function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function createId(prefix) {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function createAdjustment(prefix = 'adjustment') {
  return { id: createId(prefix), name: '', operator: '+', amount: '' }
}

export function createPayment(prefix = 'payment') {
  return {
    id: createId(prefix),
    method: 'cash',
    amount: '',
    receivedOn: '',
  }
}

export function createTransactionRecord(prefix) {
  return {
    id: createId(prefix),
    name: '',
    basePrice: '',
    adjustments: [createAdjustment(`${prefix}-adjustment`)],
    payments: [createPayment(`${prefix}-payment`)],
  }
}

export function createInitialWorkspace() {
  return {
    version: 1,
    activeMenu: 'billing',
    billingSections: [
      {
        id: 'billing-initial',
        name: '',
        basePrice: '',
        adjustments: [
          {
            id: 'billing-adjustment-initial',
            name: '',
            operator: '+',
            amount: '',
          },
        ],
        payments: [
          {
            id: 'billing-payment-initial',
            method: 'cash',
            amount: '',
            receivedOn: '',
          },
        ],
      },
    ],
    fnbOrders: [
      {
        id: 'fnb-initial',
        name: '',
        basePrice: '',
        adjustments: [
          {
            id: 'fnb-adjustment-initial',
            name: '',
            operator: '+',
            amount: '',
          },
        ],
        payments: [
          {
            id: 'fnb-payment-initial',
            method: 'cash',
            amount: '',
            receivedOn: '',
          },
        ],
      },
    ],
  }
}

function normalizeAdjustment(item, fallbackId) {
  return {
    id: String(item?.id || fallbackId),
    name: typeof item?.name === 'string' ? item.name : '',
    operator: item?.operator === '-' ? '-' : '+',
    amount: typeof item?.amount === 'string' ? item.amount : '',
  }
}

const depositMethods = new Set(['dp_cash', 'dp_qris'])

function normalizePayment(payment, fallbackId, allowDepositMethods) {
  const isBaseMethod = payment?.method === 'cash' || payment?.method === 'qris'
  const isDepositMethod =
    allowDepositMethods && depositMethods.has(payment?.method)

  const amount = typeof payment?.amount === 'string' ? payment.amount : ''
  const savedDate =
    typeof payment?.receivedOn === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(payment.receivedOn)
      ? payment.receivedOn
      : ''

  return {
    id: String(payment?.id || fallbackId),
    method:
      isBaseMethod || isDepositMethod ? payment.method : 'cash',
    amount,
    receivedOn: amount.trim() ? savedDate || getLocalDateKey() : '',
  }
}

function normalizeRecord(
  record,
  fallbackId,
  { allowDepositMethods = false, clearBasePrice = false } = {},
) {
  const adjustments = Array.isArray(record?.adjustments)
    ? record.adjustments
    : []
  const payments = Array.isArray(record?.payments) ? record.payments : []

  return {
    id: String(record?.id || fallbackId),
    name: typeof record?.name === 'string' ? record.name : '',
    basePrice:
      !clearBasePrice && typeof record?.basePrice === 'string'
        ? record.basePrice
        : '',
    adjustments:
      adjustments.length > 0
        ? adjustments.map((item, index) =>
            normalizeAdjustment(item, `${fallbackId}-adjustment-${index + 1}`),
          )
        : [normalizeAdjustment(null, `${fallbackId}-adjustment-1`)],
    payments:
      payments.length > 0
        ? payments.map((payment, index) =>
            normalizePayment(
              payment,
              `${fallbackId}-payment-${index + 1}`,
              allowDepositMethods,
            ),
          )
        : [
            normalizePayment(
              null,
              `${fallbackId}-payment-1`,
              allowDepositMethods,
            ),
          ],
  }
}

export function normalizeWorkspace(value) {
  const fallback = createInitialWorkspace()
  if (!value || typeof value !== 'object') return fallback

  const billingSections = Array.isArray(value.billingSections)
    ? value.billingSections
    : []
  const fnbOrders = Array.isArray(value.fnbOrders) ? value.fnbOrders : []

  return {
    version: 1,
    activeMenu: ['billing', 'fnb', 'recap'].includes(value.activeMenu)
      ? value.activeMenu
      : 'billing',
    billingSections:
      billingSections.length > 0
        ? billingSections.map((record, index) =>
            normalizeRecord(record, `billing-saved-${index + 1}`, {
              allowDepositMethods: true,
            }),
          )
        : fallback.billingSections,
    fnbOrders:
      fnbOrders.length > 0
        ? fnbOrders.map((record, index) =>
            normalizeRecord(record, `fnb-saved-${index + 1}`, {
              clearBasePrice: true,
            }),
          )
        : fallback.fnbOrders,
  }
}

export function loadWorkspace(storage) {
  const targetStorage =
    storage || (typeof window !== 'undefined' ? window.localStorage : null)
  if (!targetStorage) return createInitialWorkspace()

  try {
    const storedValue = targetStorage.getItem(WORKSPACE_STORAGE_KEY)
    return storedValue
      ? normalizeWorkspace(JSON.parse(storedValue))
      : createInitialWorkspace()
  } catch {
    return createInitialWorkspace()
  }
}

export function saveWorkspace(workspace, storage) {
  const targetStorage =
    storage || (typeof window !== 'undefined' ? window.localStorage : null)
  if (!targetStorage) return false

  try {
    targetStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(workspace))
    return true
  } catch {
    return false
  }
}
