import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Chore {
  id: number
  name: string
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly'
  lastDone?: string
  assignee?: string
}

export default function ChoreTracker() {
  const { t } = useTranslation()
  const [chores, setChores] = useState<Chore[]>([])
  const [showAddChore, setShowAddChore] = useState(false)
  const [newChore, setNewChore] = useState({
    name: '',
    frequency: 'weekly' as Chore['frequency'],
    assignee: '',
  })
  const [members, setMembers] = useState<string[]>(['Me'])
  const [newMember, setNewMember] = useState('')

  const commonChores = [
    'Vacuum floors', 'Mop floors', 'Clean bathroom', 'Do laundry',
    'Wash dishes', 'Take out trash', 'Water plants', 'Dust furniture',
    'Clean kitchen', 'Grocery shopping', 'Change bed sheets', 'Clean windows',
  ]

  useEffect(() => {
    const saved = localStorage.getItem('chore-tracker')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setChores(data.chores || [])
        setMembers(data.members || ['Me'])
      } catch (e) {
        console.error('Failed to load chores')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('chore-tracker', JSON.stringify({ chores, members }))
  }, [chores, members])

  const addChore = () => {
    if (!newChore.name) return
    const chore: Chore = {
      id: Date.now(),
      name: newChore.name,
      frequency: newChore.frequency,
      assignee: newChore.assignee || undefined,
    }
    setChores([...chores, chore])
    setNewChore({ name: '', frequency: 'weekly', assignee: '' })
    setShowAddChore(false)
  }

  const markDone = (id: number) => {
    setChores(chores.map(chore =>
      chore.id === id ? { ...chore, lastDone: new Date().toISOString().split('T')[0] } : chore
    ))
  }

  const deleteChore = (id: number) => {
    setChores(chores.filter(chore => chore.id !== id))
  }

  const addMember = () => {
    if (!newMember || members.includes(newMember)) return
    setMembers([...members, newMember])
    setNewMember('')
  }

  const removeMember = (member: string) => {
    if (member === 'Me') return
    setMembers(members.filter(m => m !== member))
    setChores(chores.map(chore =>
      chore.assignee === member ? { ...chore, assignee: undefined } : chore
    ))
  }

  const getDaysUntilDue = (chore: Chore) => {
    if (!chore.lastDone) return 0

    const lastDone = new Date(chore.lastDone)
    const frequencyDays: Record<Chore['frequency'], number> = {
      daily: 1,
      weekly: 7,
      biweekly: 14,
      monthly: 30,
    }
    const nextDue = new Date(lastDone.getTime() + frequencyDays[chore.frequency] * 24 * 60 * 60 * 1000)
    const today = new Date()
    return Math.ceil((nextDue.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }

  const sortedChores = useMemo(() => {
    return [...chores].sort((a, b) => getDaysUntilDue(a) - getDaysUntilDue(b))
  }, [chores])

  const stats = useMemo(() => {
    const overdue = chores.filter(c => getDaysUntilDue(c) < 0).length
    const dueToday = chores.filter(c => getDaysUntilDue(c) === 0).length
    const upcoming = chores.filter(c => {
      const days = getDaysUntilDue(c)
      return days > 0 && days <= 2
    }).length
    return { total: chores.length, overdue, dueToday, upcoming }
  }, [chores])

  const frequencyLabels: Record<Chore['frequency'], string> = {
    daily: 'Daily',
    weekly: 'Weekly',
    biweekly: 'Bi-weekly',
    monthly: 'Monthly',
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-3 bg-red-50 rounded">
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <div className="text-xs text-slate-500">{t('tools.choreTracker.overdue')}</div>
          </div>
          <div className="p-3 bg-yellow-50 rounded">
            <div className="text-2xl font-bold text-yellow-600">{stats.dueToday}</div>
            <div className="text-xs text-slate-500">{t('tools.choreTracker.today')}</div>
          </div>
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{stats.upcoming}</div>
            <div className="text-xs text-slate-500">{t('tools.choreTracker.upcoming')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{stats.total}</div>
            <div className="text-xs text-slate-500">{t('tools.choreTracker.total')}</div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.choreTracker.members')}
        </h3>
        <div className="flex flex-wrap gap-2 mb-2">
          {members.map(member => (
            <span
              key={member}
              className="px-3 py-1 bg-slate-100 rounded-full text-sm flex items-center gap-1"
            >
              {member}
              {member !== 'Me' && (
                <button
                  onClick={() => removeMember(member)}
                  className="text-slate-400 hover:text-red-500"
                >
                  ×
                </button>
              )}
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addMember()}
            placeholder={t('tools.choreTracker.addMember')}
            className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <button
            onClick={addMember}
            className="px-3 py-2 bg-slate-200 rounded hover:bg-slate-300"
          >
            +
          </button>
        </div>
      </div>

      {!showAddChore ? (
        <button
          onClick={() => setShowAddChore(true)}
          className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
        >
          + {t('tools.choreTracker.addChore')}
        </button>
      ) : (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.choreTracker.addChore')}
          </h3>

          <div className="flex flex-wrap gap-1 mb-3">
            {commonChores.map(chore => (
              <button
                key={chore}
                onClick={() => setNewChore({ ...newChore, name: chore })}
                className="px-2 py-1 bg-slate-100 rounded text-xs hover:bg-slate-200"
              >
                {chore}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <input
              type="text"
              value={newChore.name}
              onChange={(e) => setNewChore({ ...newChore, name: e.target.value })}
              placeholder={t('tools.choreTracker.choreName')}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                value={newChore.frequency}
                onChange={(e) => setNewChore({ ...newChore, frequency: e.target.value as Chore['frequency'] })}
                className="px-3 py-2 border border-slate-300 rounded text-sm"
              >
                {Object.entries(frequencyLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <select
                value={newChore.assignee}
                onChange={(e) => setNewChore({ ...newChore, assignee: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded text-sm"
              >
                <option value="">{t('tools.choreTracker.unassigned')}</option>
                {members.map(member => (
                  <option key={member} value={member}>{member}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={addChore}
                className="flex-1 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
              >
                {t('tools.choreTracker.add')}
              </button>
              <button
                onClick={() => setShowAddChore(false)}
                className="px-4 py-2 bg-slate-200 rounded font-medium hover:bg-slate-300"
              >
                {t('tools.choreTracker.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {sortedChores.length === 0 ? (
        <div className="card p-8 text-center text-slate-500">
          {t('tools.choreTracker.noChores')}
        </div>
      ) : (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.choreTracker.yourChores')}
          </h3>
          <div className="space-y-2">
            {sortedChores.map(chore => {
              const daysUntil = getDaysUntilDue(chore)
              const isOverdue = daysUntil < 0
              const isDueToday = daysUntil === 0
              const isSoon = daysUntil > 0 && daysUntil <= 2

              return (
                <div
                  key={chore.id}
                  className={`p-3 rounded ${
                    isOverdue ? 'bg-red-50 border-2 border-red-200' :
                    isDueToday ? 'bg-yellow-50 border border-yellow-200' :
                    isSoon ? 'bg-blue-50 border border-blue-200' :
                    'bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{chore.name}</div>
                      <div className="text-sm text-slate-500">
                        {frequencyLabels[chore.frequency]}
                        {chore.assignee && ` • ${chore.assignee}`}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteChore(chore.id)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-sm font-medium ${
                      isOverdue ? 'text-red-600' :
                      isDueToday ? 'text-yellow-600' :
                      isSoon ? 'text-blue-600' :
                      'text-green-600'
                    }`}>
                      {isOverdue
                        ? `${Math.abs(daysUntil)} days overdue`
                        : isDueToday
                        ? 'Due today'
                        : !chore.lastDone
                        ? 'Not done yet'
                        : `Due in ${daysUntil} days`}
                    </span>
                    <button
                      onClick={() => markDone(chore.id)}
                      className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                    >
                      ✓ {t('tools.choreTracker.done')}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.choreTracker.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.choreTracker.tip1')}</li>
          <li>{t('tools.choreTracker.tip2')}</li>
          <li>{t('tools.choreTracker.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
