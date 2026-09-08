export const BILLING_STATUSES = [
  { id: 'booking', label: 'Booking' },
  { id: 'active', label: 'Aktif' },
  { id: 'paid', label: 'Lunas' },
]

export const PLAYSTATION_PACKAGE_GROUPS = [
  {
    id: 'ps5-regular',
    label: 'PS5',
    packages: [
      { id: 'ps5-regular-1h', duration: 1, price: 15_000 },
      { id: 'ps5-regular-3h', duration: 3, price: 40_000 },
      { id: 'ps5-regular-5h', duration: 5, price: 65_000 },
    ],
  },
  {
    id: 'ps5-suite',
    label: 'Suite',
    packages: [
      { id: 'ps5-suite-2h', duration: 2, price: 80_000 },
      { id: 'ps5-suite-3h', duration: 3, price: 110_000 },
      { id: 'ps5-suite-4h', duration: 4, price: 150_000 },
      { id: 'ps5-suite-5h', duration: 5, price: 180_000 },
    ],
  },
  {
    id: 'ps4-vip',
    label: 'VIP',
    packages: [
      { id: 'ps4-vip-2h', duration: 2, price: 50_000 },
      { id: 'ps4-vip-3h', duration: 3, price: 70_000 },
      { id: 'ps4-vip-4h', duration: 4, price: 90_000 },
      { id: 'ps4-vip-5h', duration: 5, price: 110_000 },
    ],
  },
  {
    id: 'ps4-regular',
    label: 'PS4',
    packages: [
      { id: 'ps4-regular-1h', duration: 1, price: 10_000 },
      { id: 'ps4-regular-3h', duration: 3, price: 25_000 },
      { id: 'ps4-regular-5h', duration: 5, price: 40_000 },
    ],
  },
]

export const PLAYSTATION_PACKAGES = PLAYSTATION_PACKAGE_GROUPS.flatMap(
  (group) =>
    group.packages.map((item) => ({
      ...item,
      groupId: group.id,
      groupLabel: group.label,
    })),
)

export const FNB_MENU_GROUPS = [
  {
    id: 'makanan',
    label: 'Makanan',
    items: [
      { id: 'chicken-katsu-teriyaki', name: 'Chicken Katsu Teriyaki', price: 25_000 },
      { id: 'chicken-karage-teriyaki', name: 'Chicken Karage Teriyaki', price: 25_000 },
      { id: 'dimsum-kukus', name: 'Dimsum Kukus', price: 20_000 },
      { id: 'french-fries', name: 'French Fries', price: 15_000 },
      { id: 'cireng', name: 'Cireng', price: 15_000 },
      { id: 'nugget', name: 'Nugget', price: 15_000 },
      { id: 'mix-platter', name: 'Mix Platter', price: 20_000 },
      { id: 'indomie-goreng', name: 'Indomie Goreng', price: 10_000 },
      { id: 'indomie-goreng-telur', name: 'Indomie Goreng Telur', price: 13_000 },
      { id: 'indomie-goreng-sosis-telur', name: 'Indomie Goreng Sosis Telur', price: 16_000 },
      { id: 'indomie-kuah', name: 'Indomie Kuah', price: 10_000 },
      { id: 'indomie-kuah-telur', name: 'Indomie Kuah Telur', price: 13_000 },
      { id: 'nasi', name: 'Nasi', price: 5_000 },
    ],
  },
  {
    id: 'minuman',
    label: 'Minuman',
    items: [
      { id: 'chocolate', name: 'Chocolate', price: 15_000 },
      { id: 'matcha', name: 'Matcha', price: 15_000 },
      { id: 'palm-sugar-coffee', name: 'Palm Sugar Coffee', price: 15_000 },
      { id: 'lemon-tea', name: 'Lemon Tea', price: 10_000 },
      { id: 'ice-tea', name: 'Ice Tea', price: 7_000 },
      { id: 'black-coffee', name: 'Black Coffee', price: 7_000 },
      { id: 'butterscotch', name: 'Butterscotch', price: 15_000 },
      { id: 'americano', name: 'Americano', price: 10_000 },
      { id: 'air-mineral', name: 'Air Mineral', price: 5_000 },
    ],
  },
]

export const FNB_MENU_ITEMS = FNB_MENU_GROUPS.flatMap((group) =>
  group.items.map((item) => ({ ...item, groupId: group.id })),
)

export function findPlaystationPackage(packageId) {
  return PLAYSTATION_PACKAGES.find((item) => item.id === packageId)
}

export function findFnbMenuItem(itemId) {
  return FNB_MENU_ITEMS.find((item) => item.id === itemId)
}

export function priceToInput(price) {
  return price % 1_000 === 0 ? `${price / 1_000}k` : String(price)
}
