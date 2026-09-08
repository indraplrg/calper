import { useState } from 'react'
import AddSectionCard from './components/AddSectionCard.jsx'
import AppHeader from './components/AppHeader.jsx'
import BillingStatusFilter from './components/BillingStatusFilter.jsx'
import DataMenu from './components/DataMenu.jsx'
import RecapView from './components/RecapView.jsx'
import SectionSearch from './components/SectionSearch.jsx'
import TransactionSection from './components/TransactionSection.jsx'
import usePersistentWorkspace from './hooks/usePersistentWorkspace.js'

const menuContent = {
  billing: {
    eyebrow: 'Menu Billing',
    title: 'Rekap billing',
    description: 'Gabungkan billing utama, pesanan tambahan, dan pembayaran pelanggan.',
    addLabel: 'Billing baru',
    addTitle: 'Tambah billing baru',
    addDescription: 'Billing baru akan dimulai dari kosong.',
  },
  fnb: {
    eyebrow: 'Menu F&B Order',
    title: 'Pesanan F&B',
    description: 'Catat pesanan makanan atau minuman yang dibayar terpisah.',
    addLabel: 'F&B baru',
    addTitle: 'Tambah F&B order baru',
    addDescription: 'Pesanan baru akan dimulai dari kosong.',
  },
  recap: {
    eyebrow: 'Menu Recap',
    title: 'Recap hari ini',
    description: 'Lihat total pemasukan Cash dan QRIS dari seluruh transaksi hari ini.',
  },
}

function App() {
  const workspace = usePersistentWorkspace()
  const [selectedRecords, setSelectedRecords] = useState({
    billing: 'all',
    fnb: 'all',
  })
  const [billingStatusFilter, setBillingStatusFilter] = useState('all')
  const content = menuContent[workspace.activeMenu]
  const isRecapMenu = workspace.activeMenu === 'recap'
  const records =
    workspace.activeMenu === 'billing'
      ? workspace.billingSections
      : workspace.activeMenu === 'fnb'
        ? workspace.fnbOrders
        : []
  const selectedRecord = isRecapMenu
    ? 'all'
    : selectedRecords[workspace.activeMenu]
  const hasSelectedRecord = records.some(
    (record) => record.id === selectedRecord,
  )
  const activeFilter = hasSelectedRecord ? selectedRecord : 'all'
  const statusFilteredRecords =
    workspace.activeMenu === 'billing' &&
    activeFilter === 'all' &&
    billingStatusFilter !== 'all'
      ? records.filter((record) => record.status === billingStatusFilter)
      : records
  const visibleRecords =
    activeFilter === 'all'
      ? statusFilteredRecords
      : records.filter((record) => record.id === activeFilter)

  function addRecord() {
    const currentMenu = workspace.activeMenu
    const id =
      currentMenu === 'billing'
        ? workspace.addBillingSection()
        : workspace.addFnbOrder()

    setSelectedRecords((currentRecords) => ({
      ...currentRecords,
      [currentMenu]: id,
    }))
    if (currentMenu === 'billing') setBillingStatusFilter('active')

    requestAnimationFrame(() => {
      const newRecord = document.getElementById(id)
      newRecord?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      const nameInput = newRecord?.querySelector('.record-name-input')
      nameInput?.focus()
      nameInput?.select()
    })
  }

  function updateRecord(recordId, changes) {
    if (workspace.activeMenu === 'billing') {
      workspace.updateBillingSection(recordId, changes)
      return
    }

    workspace.updateFnbOrder(recordId, changes)
  }

  function removeRecord(recordId) {
    if (workspace.activeMenu === 'billing') {
      workspace.removeBillingSection(recordId)
    } else {
      workspace.removeFnbOrder(recordId)
    }

    if (activeFilter === recordId) {
      setSelectedRecords((currentRecords) => ({
        ...currentRecords,
        [workspace.activeMenu]: 'all',
      }))
    }
  }

  function changeRecordFilter(recordId) {
    setSelectedRecords((currentRecords) => ({
      ...currentRecords,
      [workspace.activeMenu]: recordId,
    }))
    if (workspace.activeMenu === 'billing' && recordId !== 'all') {
      setBillingStatusFilter('all')
    }
  }

  function changeBillingStatusFilter(status) {
    setBillingStatusFilter(status)
    setSelectedRecords((currentRecords) => ({
      ...currentRecords,
      billing: 'all',
    }))
  }

  function resetAllData() {
    const confirmed = window.confirm(
      'Reset seluruh data? Semua Billing, F&B Order, dan recap akan dihapus. Aplikasi akan menyisakan satu Billing kosong dan satu F&B Order kosong. Export backup terlebih dahulu jika data masih diperlukan.',
    )

    if (!confirmed) return false
    workspace.resetWorkspace()
    setSelectedRecords({ billing: 'all', fnb: 'all' })
    setBillingStatusFilter('all')
    return true
  }

  function importAllData(importedWorkspace) {
    workspace.replaceWorkspace(importedWorkspace)
    setSelectedRecords({ billing: 'all', fnb: 'all' })
    setBillingStatusFilter('all')
  }

  return (
    <div className="page-shell min-h-screen overflow-x-hidden">
      <AppHeader
        activeMenu={workspace.activeMenu}
        onMenuChange={workspace.setActiveMenu}
      />

      <main
        id="workspace"
        className="relative mx-auto w-full max-w-3xl scroll-mt-28 px-3 pt-7 pb-16 sm:px-6 sm:pt-10"
      >
        <div className="mb-5 flex items-end justify-between gap-3 px-1">
          <div className="min-w-0">
            <p className="mb-1 text-[0.68rem] font-bold tracking-[0.22em] text-accent uppercase">
              {content.eyebrow}
            </p>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {content.title}
            </h1>
            <p className="mt-2 max-w-md text-sm leading-6 text-muted">
              {content.description}
            </p>
          </div>
          <div className="relative mb-1 flex shrink-0 items-center gap-2">
            {!isRecapMenu && (
              <button
                type="button"
                onClick={addRecord}
                className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full bg-ink px-3.5 text-sm font-bold text-paper-light shadow-[0_2px_0_#aeb8a8] transition hover:bg-[#26332e] active:translate-y-0.5 active:shadow-none"
              >
                <span className="text-lg leading-none">+</span>
                <span className="hidden sm:inline">{content.addLabel}</span>
                <span className="sm:hidden">Baru</span>
              </button>
            )}
            <DataMenu
              workspace={workspace.workspaceData}
              onImport={importAllData}
              onReset={resetAllData}
            />
          </div>
        </div>

        {isRecapMenu ? (
          <div className="space-y-5">
            <RecapView
              billingSections={workspace.billingSections}
              fnbOrders={workspace.fnbOrders}
            />
          </div>
        ) : (
          <div className="space-y-5">
            <SectionSearch
              variant={workspace.activeMenu}
              records={records}
              value={activeFilter}
              onChange={changeRecordFilter}
            />

            {workspace.activeMenu === 'billing' && (
              <BillingStatusFilter
                records={records}
                value={billingStatusFilter}
                onChange={changeBillingStatusFilter}
              />
            )}

            {workspace.activeMenu === 'billing' &&
              visibleRecords.length === 0 && (
                <div className="rounded-2xl border border-dashed border-ink/20 bg-paper-light/55 px-5 py-8 text-center text-sm text-muted">
                  Belum ada billing pada status ini.
                </div>
              )}

            {visibleRecords.map((record) => {
              const recordIndex = records.findIndex(
                (item) => item.id === record.id,
              )

              return (
                <TransactionSection
                  key={record.id}
                  id={record.id}
                  index={recordIndex}
                  variant={workspace.activeMenu}
                  record={record}
                  canRemove={records.length > 1}
                  onUpdate={(changes) => updateRecord(record.id, changes)}
                  onRemove={() => removeRecord(record.id)}
                />
              )
            })}

            <AddSectionCard
              onAddSection={addRecord}
              title={content.addTitle}
              description={content.addDescription}
            />
          </div>
        )}
      </main>

      <footer className="relative border-t border-ink/10 px-4 py-6 text-center text-xs leading-6 text-muted">
        <p>
          Nominal dapat ditulis sebagai <strong>50000</strong>,{' '}
          <strong>50.000</strong>, atau <strong>50k</strong>. Data tersimpan
          otomatis di perangkat ini.
        </p>
      </footer>
    </div>
  )
}

export default App
