import { normalizeWorkspace } from './workspace.js'

const BACKUP_FORMAT = 'calper-workspace-backup'
const BACKUP_VERSION = 1

export function createWorkspaceBackup(workspace) {
  const normalizedWorkspace = normalizeWorkspace(workspace)

  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    workspace: normalizedWorkspace,
  }
}

export function createBackupFilename(exportedAt = new Date()) {
  const year = exportedAt.getFullYear()
  const month = String(exportedAt.getMonth() + 1).padStart(2, '0')
  const day = String(exportedAt.getDate()).padStart(2, '0')

  return `calper-backup-${year}-${month}-${day}.json`
}

export function parseWorkspaceBackup(fileContent) {
  let backup

  try {
    backup = JSON.parse(fileContent)
  } catch {
    throw new Error('File bukan JSON yang valid.')
  }

  if (
    backup?.format !== BACKUP_FORMAT ||
    backup?.version !== BACKUP_VERSION ||
    !backup.workspace ||
    typeof backup.workspace !== 'object'
  ) {
    throw new Error('Format file bukan backup Calper yang valid.')
  }

  return normalizeWorkspace(backup.workspace)
}
