import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Person {
  id: number
  name: string
  items: { name: string; amount: number }[]
}

export default function BillSplitter() {
  const { t } = useTranslation()
  const [people, setPeople] = useState<Person[]>([
    { id: 1, name: 'Person 1', items: [] },
    { id: 2, name: 'Person 2', items: [] },
  ])
  const [sharedCosts, setSharedCosts] = useState('')
  const [tipPercent, setTipPercent] = useState(15)
  const [newItemName, setNewItemName] = useState('')
  const [newItemAmount, setNewItemAmount] = useState('')
  const [selectedPerson, setSelectedPerson] = useState(1)

  const addPerson = () => {
    const id = Date.now()
    setPeople([...people, { id, name: `Person ${people.length + 1}`, items: [] }])
  }

  const removePerson = (id: number) => {
    if (people.length <= 2) return
    setPeople(people.filter(p => p.id !== id))
  }

  const addItem = () => {
    const amount = parseFloat(newItemAmount)
    if (!newItemName || isNaN(amount) || amount <= 0) return

    setPeople(people.map(p =>
      p.id === selectedPerson
        ? { ...p, items: [...p.items, { name: newItemName, amount }] }
        : p
    ))
    setNewItemName('')
    setNewItemAmount('')
  }

  const removeItem = (personId: number, itemIndex: number) => {
    setPeople(people.map(p =>
      p.id === personId
        ? { ...p, items: p.items.filter((_, i) => i !== itemIndex) }
        : p
    ))
  }

  const result = useMemo(() => {
    const shared = parseFloat(sharedCosts) || 0
    const sharedPerPerson = shared / people.length

    return people.map(p => {
      const personalTotal = p.items.reduce((sum, item) => sum + item.amount, 0)
      const subtotal = personalTotal + sharedPerPerson
      const tip = subtotal * (tipPercent / 100)
      const total = subtotal + tip
      return { id: p.id, name: p.name, personalTotal, sharedPortion: sharedPerPerson, tip, total }
    })
  }, [people, sharedCosts, tipPercent])

  const grandTotal = result.reduce((sum, r) => sum + r.total, 0)

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        <div className="flex gap-2">
          <input
            type="number"
            value={sharedCosts}
            onChange={(e) => setSharedCosts(e.target.value)}
            placeholder={t('tools.billSplitter.sharedCosts')}
            className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <select
            value={tipPercent}
            onChange={(e) => setTipPercent(parseInt(e.target.value))}
            className="px-3 py-2 border border-slate-300 rounded text-sm"
          >
            <option value="0">0% tip</option>
            <option value="10">10% tip</option>
            <option value="15">15% tip</option>
            <option value="18">18% tip</option>
            <option value="20">20% tip</option>
          </select>
        </div>

        <div className="flex gap-2">
          <select
            value={selectedPerson}
            onChange={(e) => setSelectedPerson(parseInt(e.target.value))}
            className="px-3 py-2 border border-slate-300 rounded text-sm"
          >
            {people.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder={t('tools.billSplitter.itemName')}
            className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <input
            type="number"
            value={newItemAmount}
            onChange={(e) => setNewItemAmount(e.target.value)}
            placeholder="$"
            className="w-20 px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <button
            onClick={addItem}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            +
          </button>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-slate-700">{t('tools.billSplitter.people')}</h3>
          <button
            onClick={addPerson}
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            + {t('tools.billSplitter.addPerson')}
          </button>
        </div>

        <div className="space-y-3">
          {people.map(person => (
            <div key={person.id} className="p-3 bg-slate-50 rounded">
              <div className="flex justify-between items-center mb-2">
                <input
                  type="text"
                  value={person.name}
                  onChange={(e) => setPeople(people.map(p =>
                    p.id === person.id ? { ...p, name: e.target.value } : p
                  ))}
                  className="font-medium bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500"
                />
                {people.length > 2 && (
                  <button
                    onClick={() => removePerson(person.id)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    ×
                  </button>
                )}
              </div>

              {person.items.length > 0 && (
                <div className="space-y-1 mb-2">
                  {person.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span>{item.name}</span>
                      <div className="flex items-center gap-2">
                        <span>${item.amount.toFixed(2)}</span>
                        <button
                          onClick={() => removeItem(person.id, i)}
                          className="text-slate-400 hover:text-red-500 text-xs"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="text-right text-sm font-medium text-blue-600">
                {t('tools.billSplitter.owes')}: ${result.find(r => r.id === person.id)?.total.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4 bg-green-50">
        <div className="text-center">
          <div className="text-sm text-slate-600">{t('tools.billSplitter.grandTotal')}</div>
          <div className="text-2xl font-bold text-green-600">${grandTotal.toFixed(2)}</div>
        </div>
      </div>
    </div>
  )
}
