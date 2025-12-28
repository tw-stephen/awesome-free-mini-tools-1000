import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Table {
  id: string
  name: string
  seats: number
  guests: string[]
}

interface Guest {
  id: string
  name: string
  tableId: string | null
}

export default function SeatingChartGenerator() {
  const { t } = useTranslation()
  const [tables, setTables] = useState<Table[]>([])
  const [guests, setGuests] = useState<Guest[]>([])
  const [newTableName, setNewTableName] = useState('')
  const [newTableSeats, setNewTableSeats] = useState(8)
  const [newGuestName, setNewGuestName] = useState('')
  const [draggedGuest, setDraggedGuest] = useState<Guest | null>(null)

  useEffect(() => {
    const savedTables = localStorage.getItem('seating-tables')
    const savedGuests = localStorage.getItem('seating-guests')
    if (savedTables) setTables(JSON.parse(savedTables))
    if (savedGuests) setGuests(JSON.parse(savedGuests))
  }, [])

  const saveTables = (updated: Table[]) => {
    setTables(updated)
    localStorage.setItem('seating-tables', JSON.stringify(updated))
  }

  const saveGuests = (updated: Guest[]) => {
    setGuests(updated)
    localStorage.setItem('seating-guests', JSON.stringify(updated))
  }

  const addTable = () => {
    if (!newTableName) return
    const newTable: Table = {
      id: Date.now().toString(),
      name: newTableName,
      seats: newTableSeats,
      guests: []
    }
    saveTables([...tables, newTable])
    setNewTableName('')
    setNewTableSeats(8)
  }

  const addGuest = () => {
    if (!newGuestName) return
    const newGuest: Guest = {
      id: Date.now().toString(),
      name: newGuestName,
      tableId: null
    }
    saveGuests([...guests, newGuest])
    setNewGuestName('')
  }

  const assignGuest = (guestId: string, tableId: string | null) => {
    const guest = guests.find(g => g.id === guestId)
    if (!guest) return

    if (tableId) {
      const table = tables.find(t => t.id === tableId)
      if (!table) return
      const tableGuests = guests.filter(g => g.tableId === tableId)
      if (tableGuests.length >= table.seats) return
    }

    const updatedGuests = guests.map(g =>
      g.id === guestId ? { ...g, tableId } : g
    )
    saveGuests(updatedGuests)
  }

  const deleteTable = (id: string) => {
    saveTables(tables.filter(t => t.id !== id))
    const updatedGuests = guests.map(g =>
      g.tableId === id ? { ...g, tableId: null } : g
    )
    saveGuests(updatedGuests)
  }

  const deleteGuest = (id: string) => {
    saveGuests(guests.filter(g => g.id !== id))
  }

  const getTableGuests = (tableId: string) => {
    return guests.filter(g => g.tableId === tableId)
  }

  const unassignedGuests = guests.filter(g => g.tableId === null)

  const handleDragStart = (guest: Guest) => {
    setDraggedGuest(guest)
  }

  const handleDrop = (tableId: string | null) => {
    if (draggedGuest) {
      assignGuest(draggedGuest.id, tableId)
      setDraggedGuest(null)
    }
  }

  const clearAll = () => {
    saveTables([])
    saveGuests([])
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.seatingChartGenerator.addTable')}
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTableName}
            onChange={(e) => setNewTableName(e.target.value)}
            placeholder={t('tools.seatingChartGenerator.tableName')}
            className="flex-1 px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="number"
            value={newTableSeats}
            onChange={(e) => setNewTableSeats(parseInt(e.target.value) || 8)}
            min={1}
            max={20}
            className="w-20 px-3 py-2 border border-slate-300 rounded"
          />
          <button
            onClick={addTable}
            disabled={!newTableName}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            +
          </button>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.seatingChartGenerator.addGuest')}
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newGuestName}
            onChange={(e) => setNewGuestName(e.target.value)}
            placeholder={t('tools.seatingChartGenerator.guestName')}
            className="flex-1 px-3 py-2 border border-slate-300 rounded"
          />
          <button
            onClick={addGuest}
            disabled={!newGuestName}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            +
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.seatingChartGenerator.tables')} ({tables.length})
          </h3>
          <div className="space-y-3">
            {tables.map(table => {
              const tableGuests = getTableGuests(table.id)
              return (
                <div
                  key={table.id}
                  className="p-3 bg-slate-50 rounded"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(table.id)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-medium">{table.name}</span>
                      <span className="text-xs text-slate-500 ml-2">
                        {tableGuests.length}/{table.seats}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteTable(table.id)}
                      className="text-red-400 hover:text-red-600 text-sm"
                    >
                      ×
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {tableGuests.map(guest => (
                      <span
                        key={guest.id}
                        draggable
                        onDragStart={() => handleDragStart(guest)}
                        className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded cursor-move"
                      >
                        {guest.name}
                      </span>
                    ))}
                    {tableGuests.length === 0 && (
                      <span className="text-xs text-slate-400 italic">
                        {t('tools.seatingChartGenerator.dropHere')}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
            {tables.length === 0 && (
              <p className="text-center text-slate-500 py-4">
                {t('tools.seatingChartGenerator.noTables')}
              </p>
            )}
          </div>
        </div>

        <div
          className="card p-4"
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(null)}
        >
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.seatingChartGenerator.unassigned')} ({unassignedGuests.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {unassignedGuests.map(guest => (
              <div
                key={guest.id}
                draggable
                onDragStart={() => handleDragStart(guest)}
                className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded cursor-move"
              >
                <span className="text-sm">{guest.name}</span>
                <button
                  onClick={() => deleteGuest(guest.id)}
                  className="text-red-400 hover:text-red-600 text-xs"
                >
                  ×
                </button>
              </div>
            ))}
            {unassignedGuests.length === 0 && guests.length > 0 && (
              <p className="text-center text-slate-500 py-4 w-full">
                {t('tools.seatingChartGenerator.allAssigned')}
              </p>
            )}
            {guests.length === 0 && (
              <p className="text-center text-slate-500 py-4 w-full">
                {t('tools.seatingChartGenerator.noGuests')}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 card p-4 bg-blue-50 text-center">
          <div className="text-2xl font-bold text-blue-600">{guests.length}</div>
          <div className="text-xs text-slate-600">{t('tools.seatingChartGenerator.totalGuests')}</div>
        </div>
        <div className="flex-1 card p-4 bg-green-50 text-center">
          <div className="text-2xl font-bold text-green-600">
            {tables.reduce((sum, t) => sum + t.seats, 0)}
          </div>
          <div className="text-xs text-slate-600">{t('tools.seatingChartGenerator.totalSeats')}</div>
        </div>
        <div className="flex-1 card p-4 bg-purple-50 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {guests.length - unassignedGuests.length}
          </div>
          <div className="text-xs text-slate-600">{t('tools.seatingChartGenerator.seated')}</div>
        </div>
      </div>

      {(tables.length > 0 || guests.length > 0) && (
        <button
          onClick={clearAll}
          className="w-full py-2 bg-red-100 text-red-600 rounded"
        >
          {t('tools.seatingChartGenerator.clearAll')}
        </button>
      )}
    </div>
  )
}
