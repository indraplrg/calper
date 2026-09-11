import { useEffect, useRef, useState } from 'react'
import {
  createBackupFilename,
  createWorkspaceBackup,
  parseWorkspaceBackup,
} from '../utils/backup.js'
import {
  DownloadIcon,
  MoreIcon,
  ResetIcon,
  UploadIcon,
} from './Icons.jsx'

function DataMenu({ workspace, onImport, onReset }) {
  const [isOpen, setIsOpen] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const triggerRef = useRef(null)
  const menuRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return undefined

    function closeOnOutsideClick(event) {
      const clickedTrigger = triggerRef.current?.contains(event.target)
      const clickedMenu = menuRef.current?.contains(event.target)
      if (!clickedTrigger && !clickedMenu) setIsOpen(false)
    }

    function closeOnEscape(event) {
      if (event.key === 'Escape') {
        setIsOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)

    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [isOpen])

  function exportData() {
    const backup = createWorkspaceBackup(workspace)
    const fileContent = JSON.stringify(backup, null, 2)
    const blob = new Blob([fileContent], { type: 'application/json' })
    const downloadUrl = URL.createObjectURL(blob)
    const downloadLink = document.createElement('a')

    downloadLink.href = downloadUrl
    downloadLink.download = createBackupFilename()
    document.body.appendChild(downloadLink)
    downloadLink.click()
    downloadLink.remove()
    URL.revokeObjectURL(downloadUrl)
    setFeedback({ type: 'success', message: 'Backup JSON berhasil dibuat.' })
  }

  async function importData(event) {
    const input = event.target
    const file = input.files?.[0]
    if (!file) return

    try {
      const importedWorkspace = parseWorkspaceBackup(await file.text())
      const confirmed = window.confirm(
        'Import akan mengganti seluruh data yang ada saat ini. Lanjutkan?',
      )

      if (!confirmed) return
      onImport(importedWorkspace)
      setFeedback({ type: 'success', message: 'Data berhasil dipulihkan.' })
    } catch (error) {
      setFeedback({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'File backup tidak dapat dibaca.',
      })
    } finally {
      input.value = ''
    }
  }

  function resetData() {
    if (onReset()) setIsOpen(false)
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((currentState) => !currentState)}
        className="grid size-11 place-items-center rounded-full border border-ink/15 bg-paper-light/85 text-ink shadow-sm transition hover:border-ink/30 hover:bg-paper-light focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent"
        aria-label="Buka menu data"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <MoreIcon className="size-5" />
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute top-[calc(100%+0.6rem)] right-0 z-50 w-[min(16rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-ink/15 bg-paper-light p-2 shadow-[0_16px_40px_rgba(23,33,30,0.2)]"
          role="menu"
          aria-label="Kelola data"
        >
          <p className="px-2.5 pt-1.5 pb-2 text-[0.62rem] font-black tracking-[0.15em] text-muted uppercase">
            Kelola data
          </p>
          <button
            type="button"
            onClick={exportData}
            className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-bold text-ink transition hover:bg-[#edf0e8] focus-visible:outline-2 focus-visible:outline-accent"
            role="menuitem"
          >
            <DownloadIcon className="size-4 text-muted" />
            Backup JSON
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-bold text-ink transition hover:bg-[#edf0e8] focus-visible:outline-2 focus-visible:outline-accent"
            role="menuitem"
          >
            <UploadIcon className="size-4 text-muted" />
            Import JSON
          </button>
          <div className="my-1 border-t border-ink/10" />
          <button
            type="button"
            onClick={resetData}
            className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-bold text-red-700 transition hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-500"
            role="menuitem"
          >
            <ResetIcon className="size-4" />
            Reset semua data
          </button>

          {feedback && (
            <p
              className={`mt-2 rounded-xl px-3 py-2.5 text-xs font-semibold ${
                feedback.type === 'error'
                  ? 'bg-red-50 text-red-700'
                  : 'bg-[#e4efdc] text-[#456336]'
              }`}
              role="status"
            >
              {feedback.message}
            </p>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        onChange={importData}
        className="hidden"
        aria-label="Pilih file backup JSON"
      />
    </>
  )
}

export default DataMenu
