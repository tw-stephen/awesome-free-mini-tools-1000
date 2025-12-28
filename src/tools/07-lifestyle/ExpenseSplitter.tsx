import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Person {
  id: number
  name: string
}

interface Expense {
  id: number
  description: string
  amount: number
  paidBy: number
  splitBetween: number[]
}

export default function ExpenseSplitter() {
  const { t } = useTranslation()
  const [people, setPeople] = useState<Person[]>([
    { id: 1, name: 'Person 1' },
    { id: 2, name: 'Person 2' },
  ])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [newPerson, setNewPerson] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [paidBy, setPaidBy] = useState<number>(1)
  const [splitBetween, setSplitBetween] = useState<number[]>([1, 2])

  const addPerson = () => {
    if (!newPerson.trim()) return
    const person: Person = {
      id: Date.now(),
      name: newPerson.trim(),
    }
    setPeople([...people, person])
    setSplitBetween([...splitBetween, person.id])
    setNewPerson('')
  }

  const removePerson = (id: number) => {
    if (people.length <= 2) return
    setPeople(people.filter(p => p.id !== id))
    setExpenses(expenses.filter(e => e.paidBy !== id))
    setSplitBetween(splitBetween.filter(p => p !== id))
  }

  const addExpense = () => {
    if (!description.trim() || !amount || parseFloat(amount) <= 0) return
    if (splitBetween.length === 0) return
    const expense: Expense = {
      id: Date.now(),
      description: description.trim(),
      amount: parseFloat(amount),
      paidBy,
      splitBetween: [...splitBetween],
    }
    setExpenses([...expenses, expense])
    setDescription('')
    setAmount('')
  }

  const removeExpense = (id: number) => {
    setExpenses(expenses.filter(e => e.id !== id))
  }

  const toggleSplitPerson = (id: number) => {
    if (splitBetween.includes(id)) {
      if (splitBetween.length > 1) {
        setSplitBetween(splitBetween.filter(p => p !== id))
      }
    } else {
      setSplitBetween([...splitBetween, id])
    }
  }

  const settlements = useMemo(() => {
    const balances: Record<number, number> = {}
    people.forEach(p => { balances[p.id] = 0 })

    expenses.forEach(expense => {
      const shareAmount = expense.amount / expense.splitBetween.length
      balances[expense.paidBy] += expense.amount
      expense.splitBetween.forEach(personId => {
        balances[personId] -= shareAmount
      })
    })

    const debtors = Object.entries(balances)
      .filter(([, balance]) => balance < -0.01)
      .map(([id, balance]) => ({ id: parseInt(id), amount: -balance }))
      .sort((a, b) => b.amount - a.amount)

    const creditors = Object.entries(balances)
      .filter(([, balance]) => balance > 0.01)
      .map(([id, balance]) => ({ id: parseInt(id), amount: balance }))
      .sort((a, b) => b.amount - a.amount)

    const result: { from: number; to: number; amount: number }[] = []
    let i = 0, j = 0

    while (i < debtors.length && j < creditors.length) {
      const transfer = Math.min(debtors[i].amount, creditors[j].amount)
      if (transfer > 0.01) {
        result.push({
          from: debtors[i].id,
          to: creditors[j].id,
          amount: transfer,
        })
      }
      debtors[i].amount -= transfer
      creditors[j].amount -= transfer
      if (debtors[i].amount < 0.01) i++
      if (creditors[j].amount < 0.01) j++
    }

    return result
  }, [expenses, people])

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const getPersonName = (id: number) => people.find(p => p.id === id)?.name || ''

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.expenseSplitter.people')}
        </h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {people.map(person => (
            <div
              key={person.id}
              className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
            >
              <span>{person.name}</span>
              {people.length > 2 && (
                <button
                  onClick={() => removePerson(person.id)}
                  className="text-blue-600 hover:text-red-500"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newPerson}
            onChange={(e) => setNewPerson(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addPerson()}
            placeholder={t('tools.expenseSplitter.addPerson')}
            className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <button
            onClick={addPerson}
            className="px-4 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
          >
            +
          </button>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.expenseSplitter.addExpense')}
        </h3>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('tools.expenseSplitter.description')}
              className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={t('tools.expenseSplitter.amount')}
              className="w-32 px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">{t('tools.expenseSplitter.paidBy')}</span>
            <select
              value={paidBy}
              onChange={(e) => setPaidBy(parseInt(e.target.value))}
              className="px-3 py-2 border border-slate-300 rounded text-sm"
            >
              {people.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <span className="text-sm text-slate-600 block mb-2">
              {t('tools.expenseSplitter.splitBetween')}
            </span>
            <div className="flex flex-wrap gap-2">
              {people.map(person => (
                <button
                  key={person.id}
                  onClick={() => toggleSplitPerson(person.id)}
                  className={`px-3 py-1 rounded text-sm ${
                    splitBetween.includes(person.id)
                      ? 'bg-green-500 text-white'
                      : 'bg-slate-200'
                  }`}
                >
                  {person.name}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={addExpense}
            className="w-full py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
          >
            + {t('tools.expenseSplitter.add')}
          </button>
        </div>
      </div>

      {expenses.length > 0 && (
        <>
          <div className="card p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-slate-700">
                {t('tools.expenseSplitter.expenses')}
              </h3>
              <span className="text-sm text-slate-500">
                {t('tools.expenseSplitter.total')}: ${totalExpenses.toFixed(2)}
              </span>
            </div>
            <div className="space-y-2">
              {expenses.map(expense => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-2 bg-slate-50 rounded"
                >
                  <div>
                    <div className="font-medium">{expense.description}</div>
                    <div className="text-xs text-slate-400">
                      {getPersonName(expense.paidBy)} {t('tools.expenseSplitter.paid')} •
                      {t('tools.expenseSplitter.split')} {expense.splitBetween.length}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">${expense.amount.toFixed(2)}</span>
                    <button
                      onClick={() => removeExpense(expense.id)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.expenseSplitter.settlements')}
            </h3>
            {settlements.length === 0 ? (
              <div className="text-center text-slate-500 py-4">
                {t('tools.expenseSplitter.allSettled')}
              </div>
            ) : (
              <div className="space-y-2">
                {settlements.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-yellow-800">
                        {getPersonName(s.from)}
                      </span>
                      <span className="text-yellow-600">→</span>
                      <span className="font-medium text-yellow-800">
                        {getPersonName(s.to)}
                      </span>
                    </div>
                    <span className="font-bold text-yellow-800">
                      ${s.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.expenseSplitter.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.expenseSplitter.tip1')}</li>
          <li>{t('tools.expenseSplitter.tip2')}</li>
          <li>{t('tools.expenseSplitter.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
