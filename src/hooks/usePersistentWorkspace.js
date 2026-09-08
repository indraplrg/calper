import { useEffect, useState } from 'react'
import {
  createInitialWorkspace,
  createTransactionRecord,
  loadWorkspace,
  normalizeWorkspace,
  saveWorkspace,
} from '../utils/workspace.js'

function usePersistentWorkspace() {
  const [workspace, setWorkspace] = useState(loadWorkspace)

  useEffect(() => {
    saveWorkspace(workspace)
  }, [workspace])

  function setActiveMenu(activeMenu) {
    setWorkspace((currentWorkspace) => ({
      ...currentWorkspace,
      activeMenu,
    }))
  }

  function addRecord(collection, prefix) {
    const newRecord = createTransactionRecord(prefix)
    setWorkspace((currentWorkspace) => ({
      ...currentWorkspace,
      [collection]: [...currentWorkspace[collection], newRecord],
    }))
    return newRecord.id
  }

  function updateRecord(collection, recordId, changes) {
    setWorkspace((currentWorkspace) => ({
      ...currentWorkspace,
      [collection]: currentWorkspace[collection].map((record) =>
        record.id === recordId ? { ...record, ...changes } : record,
      ),
    }))
  }

  function removeRecord(collection, recordId) {
    setWorkspace((currentWorkspace) => {
      if (currentWorkspace[collection].length <= 1) return currentWorkspace

      return {
        ...currentWorkspace,
        [collection]: currentWorkspace[collection].filter(
          (record) => record.id !== recordId,
        ),
      }
    })
  }

  return {
    ...workspace,
    workspaceData: workspace,
    setActiveMenu,
    resetWorkspace: () => setWorkspace(createInitialWorkspace()),
    replaceWorkspace: (nextWorkspace) =>
      setWorkspace(normalizeWorkspace(nextWorkspace)),
    addBillingSection: () => addRecord('billingSections', 'billing'),
    updateBillingSection: (recordId, changes) =>
      updateRecord('billingSections', recordId, changes),
    removeBillingSection: (recordId) =>
      removeRecord('billingSections', recordId),
    addFnbOrder: () => addRecord('fnbOrders', 'fnb'),
    updateFnbOrder: (recordId, changes) =>
      updateRecord('fnbOrders', recordId, changes),
    removeFnbOrder: (recordId) => removeRecord('fnbOrders', recordId),
  }
}

export default usePersistentWorkspace
