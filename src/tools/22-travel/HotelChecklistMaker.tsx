import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ChecklistItem {
  id: string
  name: string
  category: string
  checked: boolean
}

const defaultChecklists = {
  checkIn: [
    { id: 'ci1', name: 'Verify reservation details', category: 'checkIn', checked: false },
    { id: 'ci2', name: 'Check room number and floor', category: 'checkIn', checked: false },
    { id: 'ci3', name: 'Get WiFi password', category: 'checkIn', checked: false },
    { id: 'ci4', name: 'Confirm checkout time', category: 'checkIn', checked: false },
    { id: 'ci5', name: 'Ask about breakfast hours', category: 'checkIn', checked: false },
    { id: 'ci6', name: 'Note front desk hours', category: 'checkIn', checked: false },
  ],
  roomInspection: [
    { id: 'ri1', name: 'Check AC/heating works', category: 'roomInspection', checked: false },
    { id: 'ri2', name: 'Test all lights', category: 'roomInspection', checked: false },
    { id: 'ri3', name: 'Check TV remote works', category: 'roomInspection', checked: false },
    { id: 'ri4', name: 'Test shower/hot water', category: 'roomInspection', checked: false },
    { id: 'ri5', name: 'Check for clean towels', category: 'roomInspection', checked: false },
    { id: 'ri6', name: 'Test safe if available', category: 'roomInspection', checked: false },
    { id: 'ri7', name: 'Check window locks', category: 'roomInspection', checked: false },
    { id: 'ri8', name: 'Verify minibar contents', category: 'roomInspection', checked: false },
    { id: 'ri9', name: 'Check for bed bugs', category: 'roomInspection', checked: false },
    { id: 'ri10', name: 'Note any damage', category: 'roomInspection', checked: false },
  ],
  safety: [
    { id: 's1', name: 'Locate fire exits', category: 'safety', checked: false },
    { id: 's2', name: 'Check door locks work', category: 'safety', checked: false },
    { id: 's3', name: 'Use deadbolt/chain lock', category: 'safety', checked: false },
    { id: 's4', name: 'Note emergency numbers', category: 'safety', checked: false },
    { id: 's5', name: 'Check smoke detector', category: 'safety', checked: false },
  ],
  checkOut: [
    { id: 'co1', name: 'Check all drawers', category: 'checkOut', checked: false },
    { id: 'co2', name: 'Check bathroom', category: 'checkOut', checked: false },
    { id: 'co3', name: 'Check under bed', category: 'checkOut', checked: false },
    { id: 'co4', name: 'Check safe', category: 'checkOut', checked: false },
    { id: 'co5', name: 'Check closet/hangers', category: 'checkOut', checked: false },
    { id: 'co6', name: 'Retrieve all chargers', category: 'checkOut', checked: false },
    { id: 'co7', name: 'Review final bill', category: 'checkOut', checked: false },
    { id: 'co8', name: 'Return room key', category: 'checkOut', checked: false },
  ],
}

const categoryInfo = [
  { id: 'checkIn', name: 'Check-In', icon: '🏨' },
  { id: 'roomInspection', name: 'Room Inspection', icon: '🔍' },
  { id: 'safety', name: 'Safety', icon: '🛡️' },
  { id: 'checkOut', name: 'Check-Out', icon: '🚪' },
]

export default function HotelChecklistMaker() {
  const { t } = useTranslation()
  const [hotelName, setHotelName] = useState('')
  const [roomNumber, setRoomNumber] = useState('')
  const [checkInDate, setCheckInDate] = useState('')
  const [checkOutDate, setCheckOutDate] = useState('')
  const [items, setItems] = useState<ChecklistItem[]>([])
  const [activeCategory, setActiveCategory] = useState('checkIn')
  const [newItemName, setNewItemName] = useState('')

  const loadDefaultChecklist = () => {
    const allItems: ChecklistItem[] = []
    Object.values(defaultChecklists).forEach(categoryItems => {
      categoryItems.forEach(item => {
        allItems.push({ ...item, checked: false })
      })
    })
    setItems(allItems)
  }

  const toggleItem = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ))
  }

  const addCustomItem = () => {
    if (!newItemName.trim()) return
    const newItem: ChecklistItem = {
      id: `custom-${Date.now()}`,
      name: newItemName.trim(),
      category: activeCategory,
      checked: false,
    }
    setItems([...items, newItem])
    setNewItemName('')
  }

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const getCategoryItems = (categoryId: string) => {
    return items.filter(item => item.category === categoryId)
  }

  const getCategoryProgress = (categoryId: string) => {
    const categoryItems = getCategoryItems(categoryId)
    if (categoryItems.length === 0) return 0
    const checkedCount = categoryItems.filter(item => item.checked).length
    return (checkedCount / categoryItems.length) * 100
  }

  const totalProgress = items.length > 0
    ? (items.filter(item => item.checked).length / items.length) * 100
    : 0

  const exportChecklist = () => {
    let text = `Hotel Checklist\n${'='.repeat(40)}\n`
    if (hotelName) text += `Hotel: ${hotelName}\n`
    if (roomNumber) text += `Room: ${roomNumber}\n`
    if (checkInDate) text += `Check-in: ${checkInDate}\n`
    if (checkOutDate) text += `Check-out: ${checkOutDate}\n`
    text += '\n'

    categoryInfo.forEach(cat => {
      const categoryItems = getCategoryItems(cat.id)
      if (categoryItems.length > 0) {
        text += `${cat.icon} ${cat.name}\n`
        text += `${'-'.repeat(20)}\n`
        categoryItems.forEach(item => {
          text += `[${item.checked ? 'x' : ' '}] ${item.name}\n`
        })
        text += '\n'
      }
    })

    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hotel-checklist-${hotelName || 'stay'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.hotelChecklistMaker.hotelDetails')}</h3>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            value={hotelName}
            onChange={e => setHotelName(e.target.value)}
            placeholder={t('tools.hotelChecklistMaker.hotelName')}
            className="px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="text"
            value={roomNumber}
            onChange={e => setRoomNumber(e.target.value)}
            placeholder={t('tools.hotelChecklistMaker.roomNumber')}
            className="px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="date"
            value={checkInDate}
            onChange={e => setCheckInDate(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="date"
            value={checkOutDate}
            onChange={e => setCheckOutDate(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded"
          />
        </div>
      </div>

      {items.length === 0 && (
        <button
          onClick={loadDefaultChecklist}
          className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('tools.hotelChecklistMaker.loadDefault')}
        </button>
      )}

      {items.length > 0 && (
        <>
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500">{t('tools.hotelChecklistMaker.overallProgress')}</span>
              <span className="font-bold">
                {items.filter(i => i.checked).length}/{items.length}
              </span>
            </div>
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all"
                style={{ width: `${totalProgress}%` }}
              />
            </div>
          </div>

          <div className="card p-4">
            <div className="flex flex-wrap gap-2">
              {categoryInfo.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-2 rounded flex items-center gap-2 ${
                    activeCategory === cat.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                  <span className={`text-xs px-1.5 rounded-full ${
                    activeCategory === cat.id ? 'bg-white/20' : 'bg-slate-200'
                  }`}>
                    {Math.round(getCategoryProgress(cat.id))}%
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newItemName}
                onChange={e => setNewItemName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCustomItem()}
                placeholder={t('tools.hotelChecklistMaker.addCustomItem')}
                className="flex-1 px-3 py-2 border border-slate-300 rounded"
              />
              <button
                onClick={addCustomItem}
                disabled={!newItemName.trim()}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-slate-300"
              >
                Add
              </button>
            </div>

            <div className="space-y-2">
              {getCategoryItems(activeCategory).map(item => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-2 rounded ${
                    item.checked ? 'bg-green-50' : 'bg-slate-50'
                  }`}
                >
                  <label className="flex items-center gap-2 cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleItem(item.id)}
                      className="w-5 h-5"
                    />
                    <span className={item.checked ? 'line-through text-slate-400' : ''}>
                      {item.name}
                    </span>
                  </label>
                  {item.id.startsWith('custom-') && (
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-400 hover:text-red-600 px-2"
                    >
                      x
                    </button>
                  )}
                </div>
              ))}
              {getCategoryItems(activeCategory).length === 0 && (
                <div className="text-center text-slate-500 py-4">
                  {t('tools.hotelChecklistMaker.noItems')}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={exportChecklist}
            className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600"
          >
            {t('tools.hotelChecklistMaker.export')}
          </button>
        </>
      )}
    </div>
  )
}
