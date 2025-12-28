import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface Alarm {
  id: number
  time: string
  label: string
  enabled: boolean
  repeat: string[]
  triggered: boolean
}

export default function AlarmClock() {
  const { t } = useTranslation()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [alarms, setAlarms] = useState<Alarm[]>([])
  const [newTime, setNewTime] = useState('')
  const [newLabel, setNewLabel] = useState('')
  const [newRepeat, setNewRepeat] = useState<string[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [activeAlarm, setActiveAlarm] = useState<Alarm | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      setCurrentTime(now)

      const currentTimeStr = now.toTimeString().slice(0, 5)
      const currentDay = days[now.getDay()]

      alarms.forEach((alarm) => {
        if (
          alarm.enabled &&
          !alarm.triggered &&
          alarm.time === currentTimeStr &&
          (alarm.repeat.length === 0 || alarm.repeat.includes(currentDay))
        ) {
          setActiveAlarm(alarm)
          playAlarmSound()
          setAlarms((prev) =>
            prev.map((a) =>
              a.id === alarm.id ? { ...a, triggered: true } : a
            )
          )
        }
      })

      // Reset triggered status after the minute passes
      if (now.getSeconds() === 0) {
        setAlarms((prev) =>
          prev.map((a) => ({ ...a, triggered: false }))
        )
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [alarms])

  const playAlarmSound = () => {
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      const ctx = audioContextRef.current

      const playBeep = (time: number) => {
        const oscillator = ctx.createOscillator()
        const gainNode = ctx.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(ctx.destination)

        oscillator.frequency.value = 800
        oscillator.type = 'sine'

        gainNode.gain.setValueAtTime(0.3, time)
        gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.3)

        oscillator.start(time)
        oscillator.stop(time + 0.3)
      }

      // Play multiple beeps
      for (let i = 0; i < 5; i++) {
        playBeep(ctx.currentTime + i * 0.5)
      }
    } catch (e) {
      console.log('Audio not supported')
    }
  }

  const stopAlarm = () => {
    setActiveAlarm(null)
    if (audioContextRef.current) {
      audioContextRef.current.close()
    }
  }

  const snoozeAlarm = () => {
    if (activeAlarm) {
      // Snooze for 5 minutes
      const snoozeTime = new Date()
      snoozeTime.setMinutes(snoozeTime.getMinutes() + 5)
      const snoozeTimeStr = snoozeTime.toTimeString().slice(0, 5)

      setAlarms((prev) => [
        ...prev,
        {
          id: Date.now(),
          time: snoozeTimeStr,
          label: `${activeAlarm.label} (Snoozed)`,
          enabled: true,
          repeat: [],
          triggered: false,
        },
      ])
    }
    stopAlarm()
  }

  const addAlarm = () => {
    if (!newTime) return

    setAlarms([
      ...alarms,
      {
        id: Date.now(),
        time: newTime,
        label: newLabel || t('tools.alarmClock.alarm'),
        enabled: true,
        repeat: newRepeat,
        triggered: false,
      },
    ])
    setNewTime('')
    setNewLabel('')
    setNewRepeat([])
    setShowAdd(false)
  }

  const toggleAlarm = (id: number) => {
    setAlarms(
      alarms.map((alarm) =>
        alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
      )
    )
  }

  const deleteAlarm = (id: number) => {
    setAlarms(alarms.filter((alarm) => alarm.id !== id))
  }

  const toggleRepeatDay = (day: string) => {
    if (newRepeat.includes(day)) {
      setNewRepeat(newRepeat.filter((d) => d !== day))
    } else {
      setNewRepeat([...newRepeat, day])
    }
  }

  const formatTime12 = (time24: string) => {
    const [hours, minutes] = time24.split(':').map(Number)
    const period = hours >= 12 ? 'PM' : 'AM'
    const hours12 = hours % 12 || 12
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`
  }

  return (
    <div className="space-y-4">
      {activeAlarm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center animate-pulse">
            <div className="text-6xl mb-4">⏰</div>
            <div className="text-3xl font-bold text-slate-800 mb-2">
              {formatTime12(activeAlarm.time)}
            </div>
            <div className="text-lg text-slate-600 mb-6">
              {activeAlarm.label}
            </div>
            <div className="flex gap-3">
              <button
                onClick={snoozeAlarm}
                className="flex-1 py-3 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600"
              >
                {t('tools.alarmClock.snooze')}
              </button>
              <button
                onClick={stopAlarm}
                className="flex-1 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
              >
                {t('tools.alarmClock.dismiss')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card p-6">
        <div className="text-center mb-6">
          <div className="text-5xl font-mono font-bold text-slate-800">
            {currentTime.toLocaleTimeString()}
          </div>
          <div className="text-slate-500 mt-1">
            {currentTime.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>

        <button
          onClick={() => setShowAdd(!showAdd)}
          className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
        >
          + {t('tools.alarmClock.addAlarm')}
        </button>

        {showAdd && (
          <div className="mt-4 p-4 bg-slate-50 rounded-lg">
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  {t('tools.alarmClock.time')}
                </label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  {t('tools.alarmClock.label')}
                </label>
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder={t('tools.alarmClock.alarmLabel')}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  {t('tools.alarmClock.repeat')}
                </label>
                <div className="flex gap-1">
                  {days.map((day) => (
                    <button
                      key={day}
                      onClick={() => toggleRepeatDay(day)}
                      className={`w-10 h-10 rounded-full text-xs font-medium ${
                        newRepeat.includes(day)
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {day.charAt(0)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={addAlarm}
                  className="flex-1 py-2 bg-green-500 text-white rounded font-medium hover:bg-green-600"
                >
                  {t('tools.alarmClock.save')}
                </button>
                <button
                  onClick={() => setShowAdd(false)}
                  className="flex-1 py-2 bg-slate-200 text-slate-700 rounded font-medium hover:bg-slate-300"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {alarms.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.alarmClock.alarms')}
          </h3>
          <div className="space-y-3">
            {alarms.map((alarm) => (
              <div
                key={alarm.id}
                className={`p-3 rounded-lg border ${
                  alarm.enabled
                    ? 'bg-white border-slate-200'
                    : 'bg-slate-50 border-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={alarm.enabled ? '' : 'opacity-50'}>
                    <div className="text-2xl font-mono font-bold">
                      {formatTime12(alarm.time)}
                    </div>
                    <div className="text-sm text-slate-500">{alarm.label}</div>
                    {alarm.repeat.length > 0 && (
                      <div className="text-xs text-blue-500 mt-1">
                        {alarm.repeat.join(', ')}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleAlarm(alarm.id)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        alarm.enabled ? 'bg-green-500' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition-transform shadow ${
                          alarm.enabled ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => deleteAlarm(alarm.id)}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.alarmClock.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.alarmClock.tip1')}</li>
          <li>{t('tools.alarmClock.tip2')}</li>
          <li>{t('tools.alarmClock.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
