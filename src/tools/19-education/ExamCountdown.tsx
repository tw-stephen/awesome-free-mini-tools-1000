import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Exam {
  id: number
  name: string
  subject: string
  date: string
  time: string
  location: string
  notes: string
}

export default function ExamCountdown() {
  const { t } = useTranslation()
  const [exams, setExams] = useState<Exam[]>([])
  const [showForm, setShowForm] = useState(false)
  const [newExam, setNewExam] = useState({
    name: '',
    subject: '',
    date: '',
    time: '',
    location: '',
    notes: '',
  })
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const addExam = () => {
    if (!newExam.name || !newExam.date) return
    setExams([...exams, { ...newExam, id: Date.now() }])
    setNewExam({ name: '', subject: '', date: '', time: '', location: '', notes: '' })
    setShowForm(false)
  }

  const removeExam = (id: number) => {
    setExams(exams.filter(e => e.id !== id))
  }

  const getTimeRemaining = (date: string, time: string) => {
    const examDate = new Date(`${date}${time ? 'T' + time : 'T00:00'}`)
    const diff = examDate.getTime() - now.getTime()

    if (diff <= 0) return { expired: true, days: 0, hours: 0, minutes: 0, seconds: 0 }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return { expired: false, days, hours, minutes, seconds }
  }

  const sortedExams = [...exams].sort((a, b) => {
    const dateA = new Date(`${a.date}${a.time ? 'T' + a.time : ''}`)
    const dateB = new Date(`${b.date}${b.time ? 'T' + b.time : ''}`)
    return dateA.getTime() - dateB.getTime()
  })

  const upcomingExams = sortedExams.filter(e => !getTimeRemaining(e.date, e.time).expired)
  const pastExams = sortedExams.filter(e => getTimeRemaining(e.date, e.time).expired)

  const getUrgencyColor = (days: number) => {
    if (days === 0) return 'bg-red-500'
    if (days <= 3) return 'bg-orange-500'
    if (days <= 7) return 'bg-yellow-500'
    return 'bg-blue-500'
  }

  return (
    <div className="space-y-4">
      {upcomingExams.length > 0 && (
        <div className="card p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <div className="text-sm opacity-75">Next Exam</div>
          <div className="text-xl font-bold">{upcomingExams[0].name}</div>
          {upcomingExams[0].subject && (
            <div className="text-sm opacity-75">{upcomingExams[0].subject}</div>
          )}
          {(() => {
            const time = getTimeRemaining(upcomingExams[0].date, upcomingExams[0].time)
            return (
              <div className="grid grid-cols-4 gap-2 mt-4">
                <div className="text-center p-2 bg-white/20 rounded">
                  <div className="text-2xl font-bold">{time.days}</div>
                  <div className="text-xs">Days</div>
                </div>
                <div className="text-center p-2 bg-white/20 rounded">
                  <div className="text-2xl font-bold">{time.hours}</div>
                  <div className="text-xs">Hours</div>
                </div>
                <div className="text-center p-2 bg-white/20 rounded">
                  <div className="text-2xl font-bold">{time.minutes}</div>
                  <div className="text-xs">Minutes</div>
                </div>
                <div className="text-center p-2 bg-white/20 rounded">
                  <div className="text-2xl font-bold">{time.seconds}</div>
                  <div className="text-xs">Seconds</div>
                </div>
              </div>
            )
          })()}
        </div>
      )}

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
        >
          + {t('tools.examCountdown.add')}
        </button>
      )}

      {showForm && (
        <div className="card p-4 border-2 border-blue-300">
          <h3 className="font-medium mb-3">{t('tools.examCountdown.add')}</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={newExam.name}
              onChange={(e) => setNewExam({ ...newExam, name: e.target.value })}
              placeholder="Exam name"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="text"
              value={newExam.subject}
              onChange={(e) => setNewExam({ ...newExam, subject: e.target.value })}
              placeholder="Subject (optional)"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={newExam.date}
                onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded"
              />
              <input
                type="time"
                value={newExam.time}
                onChange={(e) => setNewExam({ ...newExam, time: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <input
              type="text"
              value={newExam.location}
              onChange={(e) => setNewExam({ ...newExam, location: e.target.value })}
              placeholder="Location (optional)"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <textarea
              value={newExam.notes}
              onChange={(e) => setNewExam({ ...newExam, notes: e.target.value })}
              placeholder="Notes (topics to study, etc.)"
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={addExam}
                disabled={!newExam.name || !newExam.date}
                className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300"
              >
                Add Exam
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {upcomingExams.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium">{t('tools.examCountdown.upcoming')} ({upcomingExams.length})</h3>
          {upcomingExams.map(exam => {
            const time = getTimeRemaining(exam.date, exam.time)
            return (
              <div key={exam.id} className="card p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getUrgencyColor(time.days)}`} />
                      <span className="font-medium">{exam.name}</span>
                    </div>
                    {exam.subject && (
                      <div className="text-sm text-slate-500 ml-5">{exam.subject}</div>
                    )}
                    <div className="text-sm text-slate-500 ml-5">
                      {new Date(exam.date).toLocaleDateString()}
                      {exam.time && ` at ${exam.time}`}
                      {exam.location && ` • ${exam.location}`}
                    </div>
                    {exam.notes && (
                      <div className="text-xs text-slate-400 ml-5 mt-1">{exam.notes}</div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">
                      {time.days > 0 ? `${time.days}d` : ''} {time.hours}h {time.minutes}m
                    </div>
                    <button
                      onClick={() => removeExam(exam.id)}
                      className="text-red-400 hover:text-red-600 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {pastExams.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium text-slate-400">{t('tools.examCountdown.past')} ({pastExams.length})</h3>
          {pastExams.map(exam => (
            <div key={exam.id} className="card p-3 opacity-50">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">{exam.name}</span>
                  <span className="text-sm text-slate-500 ml-2">
                    {new Date(exam.date).toLocaleDateString()}
                  </span>
                </div>
                <button
                  onClick={() => removeExam(exam.id)}
                  className="text-red-400 hover:text-red-600"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {exams.length === 0 && !showForm && (
        <div className="card p-8 text-center text-slate-500">
          Add exams to start your countdown
        </div>
      )}
    </div>
  )
}
