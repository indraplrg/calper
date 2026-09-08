import { calculateRecapHistory } from './recap.js'
import {
  getLocalDateKey,
  normalizeWorkspace,
} from './workspace.js'

const BACKUP_FORMAT = 'calper-workspace-backup'
const BACKUP_VERSION = 1

export function createWorkspaceBackup(workspace, exportedAt = new Date()) {
  const normalizedWorkspace = normalizeWorkspace(workspace)

  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt: exportedAt.toISOString(),
    exportedOn: getLocalDateKey(exportedAt),
    workspace: normalizedWorkspace,
    recapHistory: calculateRecapHistory(
      normalizedWorkspace.billingSections,
      normalizedWorkspace.fnbOrders,
    ),
  }
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
