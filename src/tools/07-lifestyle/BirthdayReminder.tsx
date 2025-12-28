import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Birthday {
  id: number
  name: string
  month: number
  day: number
  year?: number
  notes?: string
}

export default function BirthdayReminder() {
  const { t } = useTranslation()
  const [birthdays, setBirthdays] = useState<Birthday[]>([])
  const [newBirthday, setNewBirthday] = useState({
    name: '',
    month: new Date().getMonth() + 1,
    day: 1,
    year: '',
    notes: '',
  })
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'thisMonth'>('upcoming')

  useEffect(() => {
    const saved = localStorage.getItem('birthday-reminder')
    if (saved) {
      try {
        setBirthdays(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load birthdays')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('birthday-reminder', JSON.stringify(birthdays))
  }, [birthdays])

  const addBirthday = () => {
    if (!newBirthday.name) return
    setBirthdays([
      ...birthdays,
      {
        id: Date.now(),
        name: newBirthday.name,
        month: newBirthday.month,
        day: newBirthday.day,
        year: newBirthday.year ? parseInt(newBirthday.year) : undefined,
        notes: newBirthday.notes || undefined,
      },
    ])
    setNewBirthday({ name: '', month: new Date().getMonth() + 1, day: 1, year: '', notes: '' })
  }

  const removeBirthday = (id: number) => {
    setBirthdays(birthdays.filter(b => b.id !== id))
  }

  const getDaysUntil = (month: number, day: number) => {
    const today = new Date()
    const thisYear = today.getFullYear()
    let nextBirthday = new Date(thisYear, month - 1, day)

    if (nextBirthday < today) {
      nextBirthday = new Date(thisYear + 1, month - 1, day)
    }

    const diffTime = nextBirthday.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const getAge = (year?: number) => {
    if (!year) return null
    const today = new Date()
    return today.getFullYear() - year
  }

  const filteredBirthdays = useMemo(() => {
    const today = new Date()
    const currentMonth = today.getMonth() + 1

    let filtered = [...birthdays]

    if (filter === 'thisMonth') {
      filtered = filtered.filter(b => b.month === currentMonth)
    } else if (filter === 'upcoming') {
      filtered = filtered.filter(b => getDaysUntil(b.month, b.day) <= 30)
    }

    return filtered.sort((a, b) => {
      const daysA = getDaysUntil(a.month, a.day)
      const daysB = getDaysUntil(b.month, b.day)
      return daysA - daysB
    })
  }, [birthdays, filter])

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ]

  const getDaysInMonth = (month: number) => {
    return new Date(2024, month, 0).getDate()
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.birthdayReminder.addBirthday')}
        </h3>
        <div className="space-y-3">
          <input
            type="text"
            value={newBirthday.name}
            onChange={(e) => setNewBirthday({ ...newBirthday, name: e.target.value })}
            placeholder={t('tools.birthdayReminder.name')}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <div className="grid grid-cols-3 gap-2">
            <select
              value={newBirthday.month}
              onChange={(e) => setNewBirthday({ ...newBirthday, month: parseInt(e.target.value) })}
              className="px-3 py-2 border border-slate-300 rounded text-sm"
            >
              {months.map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </select>
            <select
              value={newBirthday.day}
              onChange={(e) => setNewBirthday({ ...newBirthday, day: parseInt(e.target.value) })}
              className="px-3 py-2 border border-slate-300 rounded text-sm"
            >
              {Array.from({ length: getDaysInMonth(newBirthday.month) }, (_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
            <input
              type="number"
              value={newBirthday.year}
              onChange={(e) => setNewBirthday({ ...newBirthday, year: e.target.value })}
              placeholder={t('tools.birthdayReminder.year')}
              className="px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <input
            type="text"
            value={newBirthday.notes}
            onChange={(e) => setNewBirthday({ ...newBirthday, notes: e.target.value })}
            placeholder={t('tools.birthdayReminder.notes')}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <button
            onClick={addBirthday}
            className="w-full py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
          >
            + {t('tools.birthdayReminder.add')}
          </button>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          {(['upcoming', 'thisMonth', 'all'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 rounded text-sm ${
                filter === f ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {t(`tools.birthdayReminder.${f}`)}
            </button>
          ))}
        </div>

        {filteredBirthdays.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            {t('tools.birthdayReminder.noBirthdays')}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredBirthdays.map(birthday => {
              const daysUntil = getDaysUntil(birthday.month, birthday.day)
              const age = getAge(birthday.year)
              const isToday = daysUntil === 0

              return (
                <div
                  key={birthday.id}
                  className={`p-3 rounded-lg ${
                    isToday ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {birthday.name}
                        {isToday && <span className="text-xl">🎂</span>}
                      </div>
                      <div className="text-sm text-slate-500">
                        {months[birthday.month - 1]} {birthday.day}
                        {birthday.year && `, ${birthday.year}`}
                        {age && ` (${t('tools.birthdayReminder.turnsAge', { age: age + (isToday ? 0 : 1) })})`}
                      </div>
                      {birthday.notes && (
                        <div className="text-xs text-slate-400 mt-1">{birthday.notes}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`text-sm font-medium ${
                        isToday ? 'text-yellow-600' :
                        daysUntil <= 7 ? 'text-red-500' :
                        daysUntil <= 30 ? 'text-orange-500' :
                        'text-slate-500'
                      }`}>
                        {isToday ? t('tools.birthdayReminder.today') :
                         daysUntil === 1 ? t('tools.birthdayReminder.tomorrow') :
                         `${daysUntil} ${t('tools.birthdayReminder.daysLeft')}`}
                      </div>
                      <button
                        onClick={() => removeBirthday(birthday.id)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.birthdayReminder.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.birthdayReminder.tip1')}</li>
          <li>{t('tools.birthdayReminder.tip2')}</li>
          <li>{t('tools.birthdayReminder.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
