import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function BirthdayCountdown() {
  const { t } = useTranslation()
  const [birthdate, setBirthdate] = useState('')
  const [name, setName] = useState('')
  const [savedBirthdays, setSavedBirthdays] = useState<{ name: string; date: string }[]>([])
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const saved = localStorage.getItem('birthday-countdown')
    if (saved) {
      try {
        setSavedBirthdays(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load birthdays')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('birthday-countdown', JSON.stringify(savedBirthdays))
  }, [savedBirthdays])

  useEffect(() => {
    if (!birthdate) return

    const timer = setInterval(() => {
      const now = new Date()
      const bday = new Date(birthdate)
      const thisYearBday = new Date(now.getFullYear(), bday.getMonth(), bday.getDate())

      if (thisYearBday < now) {
        thisYearBday.setFullYear(now.getFullYear() + 1)
      }

      const diff = thisYearBday.getTime() - now.getTime()
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setCountdown({ days, hours, minutes, seconds })
    }, 1000)

    return () => clearInterval(timer)
  }, [birthdate])

  const calculateAge = (date: string) => {
    const now = new Date()
    const bday = new Date(date)
    let age = now.getFullYear() - bday.getFullYear()
    const m = now.getMonth() - bday.getMonth()
    if (m < 0 || (m === 0 && now.getDate() < bday.getDate())) {
      age--
    }
    return age
  }

  const getNextBirthday = (date: string) => {
    const now = new Date()
    const bday = new Date(date)
    const thisYearBday = new Date(now.getFullYear(), bday.getMonth(), bday.getDate())
    if (thisYearBday < now) {
      thisYearBday.setFullYear(now.getFullYear() + 1)
    }
    return thisYearBday
  }

  const getDaysUntil = (date: string) => {
    const now = new Date()
    const nextBday = getNextBirthday(date)
    return Math.ceil((nextBday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  }

  const saveBirthday = () => {
    if (!name || !birthdate) return
    setSavedBirthdays([...savedBirthdays, { name, date: birthdate }])
    setName('')
  }

  const removeBirthday = (index: number) => {
    setSavedBirthdays(savedBirthdays.filter((_, i) => i !== index))
  }

  const sortedBirthdays = [...savedBirthdays].sort((a, b) => getDaysUntil(a.date) - getDaysUntil(b.date))
  const upcomingAge = birthdate ? calculateAge(birthdate) + 1 : 0

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.birthdayCountdown.enterBirthday')}</h3>
        <div className="space-y-3">
          <input
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>
      </div>

      {birthdate && (
        <div className="card p-6 bg-gradient-to-r from-pink-100 to-purple-100">
          <h3 className="text-center text-lg font-medium text-slate-700 mb-4">
            {t('tools.birthdayCountdown.turningAge', { age: upcomingAge })}
          </h3>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="bg-white rounded-lg p-3 shadow">
              <div className="text-3xl font-bold text-pink-600">{countdown.days}</div>
              <div className="text-xs text-slate-500">{t('tools.birthdayCountdown.days')}</div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow">
              <div className="text-3xl font-bold text-purple-600">{countdown.hours}</div>
              <div className="text-xs text-slate-500">{t('tools.birthdayCountdown.hours')}</div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow">
              <div className="text-3xl font-bold text-pink-600">{countdown.minutes}</div>
              <div className="text-xs text-slate-500">{t('tools.birthdayCountdown.minutes')}</div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow">
              <div className="text-3xl font-bold text-purple-600">{countdown.seconds}</div>
              <div className="text-xs text-slate-500">{t('tools.birthdayCountdown.seconds')}</div>
            </div>
          </div>
          <div className="text-center mt-4 text-sm text-slate-600">
            {t('tools.birthdayCountdown.currentAge')}: {calculateAge(birthdate)}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.birthdayCountdown.saveBirthday')}</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 px-3 py-2 border border-slate-300 rounded"
            placeholder={t('tools.birthdayCountdown.personName')}
          />
          <button
            onClick={saveBirthday}
            className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
          >
            {t('tools.birthdayCountdown.save')}
          </button>
        </div>
      </div>

      {sortedBirthdays.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.birthdayCountdown.savedBirthdays')}</h3>
          <div className="space-y-2">
            {sortedBirthdays.map((bday, index) => {
              const daysUntil = getDaysUntil(bday.date)
              const age = calculateAge(bday.date)
              const isToday = daysUntil === 0
              const isSoon = daysUntil <= 7

              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded ${
                    isToday ? 'bg-yellow-100 border border-yellow-300' :
                    isSoon ? 'bg-pink-50' : 'bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="font-medium">{bday.name}</div>
                    <div className="text-sm text-slate-500">
                      {new Date(bday.date).toLocaleDateString()} - {age} {t('tools.birthdayCountdown.yearsOld')}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-medium ${
                      isToday ? 'text-yellow-600' : isSoon ? 'text-pink-600' : 'text-slate-600'
                    }`}>
                      {isToday ? t('tools.birthdayCountdown.today') : `${daysUntil} ${t('tools.birthdayCountdown.daysAway')}`}
                    </span>
                    <button
                      onClick={() => removeBirthday(index)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      x
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.birthdayCountdown.funFacts')}</h3>
        {birthdate && (
          <ul className="text-sm text-slate-600 space-y-1">
            <li>- {t('tools.birthdayCountdown.bornOn')} {new Date(birthdate).toLocaleDateString('en-US', { weekday: 'long' })}</li>
            <li>- {t('tools.birthdayCountdown.daysLived')}: {Math.floor((new Date().getTime() - new Date(birthdate).getTime()) / (1000 * 60 * 60 * 24)).toLocaleString()}</li>
            <li>- {t('tools.birthdayCountdown.weeksLived')}: {Math.floor((new Date().getTime() - new Date(birthdate).getTime()) / (1000 * 60 * 60 * 24 * 7)).toLocaleString()}</li>
          </ul>
        )}
      </div>
    </div>
  )
}
