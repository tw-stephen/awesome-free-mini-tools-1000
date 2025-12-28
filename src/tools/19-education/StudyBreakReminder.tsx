import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Session {
  id: number
  startTime: Date
  endTime: Date
  studyMinutes: number
  breakMinutes: number
}

export default function StudyBreakReminder() {
  const { t } = useTranslation()
  const [studyDuration, setStudyDuration] = useState(25)
  const [breakDuration, setBreakDuration] = useState(5)
  const [longBreakDuration, setLongBreakDuration] = useState(15)
  const [sessionsBeforeLongBreak, setSessionsBeforeLongBreak] = useState(4)
  const [running, setRunning] = useState(false)
  const [onBreak, setOnBreak] = useState(false)
  const [timeLeft, setTimeLeft] = useState(studyDuration * 60)
  const [completedSessions, setCompletedSessions] = useState(0)
  const [sessions, setSessions] = useState<Session[]>([])
  const [currentSessionStart, setCurrentSessionStart] = useState<Date | null>(null)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    if (running && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (running && timeLeft === 0) {
      playNotification()
      if (onBreak) {
        // Break ended, start study
        setOnBreak(false)
        setTimeLeft(studyDuration * 60)
        setCurrentSessionStart(new Date())
      } else {
        // Study ended, start break
        const newCompletedSessions = completedSessions + 1
        setCompletedSessions(newCompletedSessions)

        // Log session
        if (currentSessionStart) {
          setSessions([...sessions, {
            id: Date.now(),
            startTime: currentSessionStart,
            endTime: new Date(),
            studyMinutes: studyDuration,
            breakMinutes: newCompletedSessions % sessionsBeforeLongBreak === 0 ? longBreakDuration : breakDuration,
          }])
        }

        setOnBreak(true)
        // Long break or short break?
        if (newCompletedSessions % sessionsBeforeLongBreak === 0) {
          setTimeLeft(longBreakDuration * 60)
        } else {
          setTimeLeft(breakDuration * 60)
        }
      }
    }
    return () => clearInterval(timer)
  }, [running, timeLeft, onBreak, studyDuration, breakDuration, longBreakDuration, completedSessions, sessionsBeforeLongBreak, currentSessionStart, sessions])

  const playNotification = () => {
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleShAj9NpUABAV5j/')
      audio.play().catch(() => {})
    } catch {}

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(onBreak ? 'Break Over!' : 'Time for a Break!', {
        body: onBreak ? 'Time to get back to studying!' : 'Stand up, stretch, and rest your eyes.',
      })
    }
  }

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }

  const start = () => {
    requestNotificationPermission()
    setRunning(true)
    setOnBreak(false)
    setTimeLeft(studyDuration * 60)
    setCurrentSessionStart(new Date())
  }

  const pause = () => setRunning(false)
  const resume = () => setRunning(true)

  const reset = () => {
    setRunning(false)
    setOnBreak(false)
    setTimeLeft(studyDuration * 60)
    setCurrentSessionStart(null)
  }

  const skip = () => {
    if (onBreak) {
      setOnBreak(false)
      setTimeLeft(studyDuration * 60)
      setCurrentSessionStart(new Date())
    } else {
      playNotification()
      setCompletedSessions(prev => prev + 1)
      setOnBreak(true)
      setTimeLeft((completedSessions + 1) % sessionsBeforeLongBreak === 0 ? longBreakDuration * 60 : breakDuration * 60)
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getTotalStudyTime = (): number => {
    return sessions.reduce((sum, s) => sum + s.studyMinutes, 0)
  }

  const getProgress = (): number => {
    const total = onBreak
      ? (completedSessions % sessionsBeforeLongBreak === 0 ? longBreakDuration : breakDuration) * 60
      : studyDuration * 60
    return ((total - timeLeft) / total) * 100
  }

  if (running || timeLeft !== studyDuration * 60) {
    return (
      <div className="space-y-4">
        <div className={`card p-8 text-center ${onBreak ? 'bg-green-50' : 'bg-blue-50'}`}>
          <div className={`text-sm font-medium mb-2 ${onBreak ? 'text-green-600' : 'text-blue-600'}`}>
            {onBreak ? 'BREAK TIME' : 'STUDY TIME'}
          </div>
          <div className={`text-6xl font-bold mb-4 font-mono ${onBreak ? 'text-green-600' : 'text-blue-600'}`}>
            {formatTime(timeLeft)}
          </div>

          <div className="w-full h-3 bg-slate-200 rounded-full mb-4">
            <div
              className={`h-3 rounded-full transition-all ${onBreak ? 'bg-green-500' : 'bg-blue-500'}`}
              style={{ width: `${getProgress()}%` }}
            />
          </div>

          <div className="flex justify-center gap-4 text-sm">
            <div>
              <span className="text-slate-500">Sessions: </span>
              <span className="font-medium">{completedSessions}</span>
            </div>
            <div>
              <span className="text-slate-500">Until long break: </span>
              <span className="font-medium">{sessionsBeforeLongBreak - (completedSessions % sessionsBeforeLongBreak)}</span>
            </div>
          </div>
        </div>

        {onBreak && (
          <div className="card p-4 bg-green-100">
            <h3 className="font-medium text-green-700 mb-2">Break Activities</h3>
            <ul className="text-sm text-green-600 space-y-1">
              <li>• Stand up and stretch</li>
              <li>• Look away from screen (20-20-20 rule)</li>
              <li>• Get water or a healthy snack</li>
              <li>• Take a short walk</li>
            </ul>
          </div>
        )}

        <div className="flex gap-2">
          {running ? (
            <button
              onClick={pause}
              className="flex-1 py-3 bg-yellow-500 text-white rounded hover:bg-yellow-600 font-medium"
            >
              Pause
            </button>
          ) : (
            <button
              onClick={resume}
              className="flex-1 py-3 bg-green-500 text-white rounded hover:bg-green-600 font-medium"
            >
              Resume
            </button>
          )}
          <button
            onClick={skip}
            className="flex-1 py-3 bg-slate-200 rounded hover:bg-slate-300 font-medium"
          >
            Skip {onBreak ? 'Break' : 'to Break'}
          </button>
        </div>

        <button
          onClick={reset}
          className="w-full py-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
        >
          End Session
        </button>

        {sessions.length > 0 && (
          <div className="card p-4">
            <h3 className="font-medium mb-2">Today's Sessions</h3>
            <div className="text-2xl font-bold text-blue-600 mb-2">{getTotalStudyTime()} min</div>
            <div className="space-y-1 text-sm max-h-[100px] overflow-y-auto">
              {[...sessions].reverse().map(s => (
                <div key={s.id} className="flex justify-between text-slate-500">
                  <span>{s.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span>{s.studyMinutes} min study</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.studyBreakReminder.studyDuration')}</h3>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {[15, 25, 45, 60].map(mins => (
            <button
              key={mins}
              onClick={() => setStudyDuration(mins)}
              className={`py-2 rounded ${
                studyDuration === mins ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {mins} min
            </button>
          ))}
        </div>
        <input
          type="range"
          value={studyDuration}
          onChange={(e) => setStudyDuration(parseInt(e.target.value))}
          min={5}
          max={90}
          className="w-full"
        />
        <div className="text-center text-sm text-slate-500">{studyDuration} minutes</div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.studyBreakReminder.breakDuration')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-500 block mb-1">Short Break</label>
            <div className="flex gap-1">
              {[3, 5, 10].map(mins => (
                <button
                  key={mins}
                  onClick={() => setBreakDuration(mins)}
                  className={`flex-1 py-2 rounded text-sm ${
                    breakDuration === mins ? 'bg-green-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">Long Break</label>
            <div className="flex gap-1">
              {[15, 20, 30].map(mins => (
                <button
                  key={mins}
                  onClick={() => setLongBreakDuration(mins)}
                  className={`flex-1 py-2 rounded text-sm ${
                    longBreakDuration === mins ? 'bg-green-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.studyBreakReminder.sessions')}</h3>
        <div className="flex gap-2">
          {[2, 3, 4, 5].map(n => (
            <button
              key={n}
              onClick={() => setSessionsBeforeLongBreak(n)}
              className={`flex-1 py-2 rounded ${
                sessionsBeforeLongBreak === n ? 'bg-purple-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="text-sm text-slate-500 text-center mt-2">
          Long break after every {sessionsBeforeLongBreak} study sessions
        </div>
      </div>

      <button
        onClick={start}
        className="w-full py-4 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium text-lg"
      >
        {t('tools.studyBreakReminder.start')}
      </button>

      <div className="card p-4 bg-blue-50">
        <h3 className="font-medium text-blue-700 mb-2">{t('tools.studyBreakReminder.tips')}</h3>
        <ul className="text-sm text-blue-600 space-y-1">
          <li>• The Pomodoro Technique: 25 min work, 5 min break</li>
          <li>• Take longer breaks every few sessions</li>
          <li>• Stay hydrated during breaks</li>
          <li>• Enable notifications for reminders</li>
        </ul>
      </div>
    </div>
  )
}
