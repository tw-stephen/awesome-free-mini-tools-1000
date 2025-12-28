import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface ClassItem {
  id: string
  name: string
  teacher: string
  room: string
  color: string
}

interface ScheduleSlot {
  day: number
  period: number
  classId: string | null
}

export default function ClassSchedule() {
  const { t } = useTranslation()
  const [classes, setClasses] = useState<ClassItem[]>([])
  const [schedule, setSchedule] = useState<ScheduleSlot[]>([])
  const [mode, setMode] = useState<'view' | 'addClass' | 'editSchedule'>('view')
  const [newClass, setNewClass] = useState({ name: '', teacher: '', room: '', color: '#3b82f6' })
  const [selectedSlot, setSelectedSlot] = useState<{ day: number; period: number } | null>(null)

  const days = [
    t('tools.classSchedule.monday'),
    t('tools.classSchedule.tuesday'),
    t('tools.classSchedule.wednesday'),
    t('tools.classSchedule.thursday'),
    t('tools.classSchedule.friday'),
  ]

  const periods = [1, 2, 3, 4, 5, 6, 7, 8]
  const colors = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

  useEffect(() => {
    const savedClasses = localStorage.getItem('class-schedule-classes')
    const savedSchedule = localStorage.getItem('class-schedule')
    if (savedClasses) {
      try { setClasses(JSON.parse(savedClasses)) } catch (e) { console.error(e) }
    }
    if (savedSchedule) {
      try { setSchedule(JSON.parse(savedSchedule)) } catch (e) { console.error(e) }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('class-schedule-classes', JSON.stringify(classes))
    localStorage.setItem('class-schedule', JSON.stringify(schedule))
  }, [classes, schedule])

  const addClass = () => {
    if (!newClass.name.trim()) return
    const classItem: ClassItem = {
      id: Date.now().toString(),
      ...newClass,
    }
    setClasses([...classes, classItem])
    setNewClass({ name: '', teacher: '', room: '', color: '#3b82f6' })
    setMode('view')
  }

  const deleteClass = (id: string) => {
    setClasses(classes.filter(c => c.id !== id))
    setSchedule(schedule.filter(s => s.classId !== id))
  }

  const getSlot = (day: number, period: number) => {
    return schedule.find(s => s.day === day && s.period === period)
  }

  const setSlotClass = (day: number, period: number, classId: string | null) => {
    const existing = schedule.find(s => s.day === day && s.period === period)
    if (existing) {
      if (classId) {
        setSchedule(schedule.map(s =>
          s.day === day && s.period === period ? { ...s, classId } : s
        ))
      } else {
        setSchedule(schedule.filter(s => !(s.day === day && s.period === period)))
      }
    } else if (classId) {
      setSchedule([...schedule, { day, period, classId }])
    }
    setSelectedSlot(null)
  }

  const getClassById = (id: string) => classes.find(c => c.id === id)

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setMode('addClass')}
          className="flex-1 py-2 bg-blue-500 text-white rounded font-medium text-sm"
        >
          + {t('tools.classSchedule.addClass')}
        </button>
        <button
          onClick={() => setMode(mode === 'editSchedule' ? 'view' : 'editSchedule')}
          className={`flex-1 py-2 rounded font-medium text-sm ${mode === 'editSchedule' ? 'bg-green-500 text-white' : 'bg-slate-100'}`}
        >
          {mode === 'editSchedule' ? t('tools.classSchedule.done') : t('tools.classSchedule.editSchedule')}
        </button>
      </div>

      {mode === 'addClass' && (
        <div className="card p-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.classSchedule.className')} *
            </label>
            <input
              type="text"
              value={newClass.name}
              onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('tools.classSchedule.teacher')}
              </label>
              <input
                type="text"
                value={newClass.teacher}
                onChange={(e) => setNewClass({ ...newClass, teacher: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('tools.classSchedule.room')}
              </label>
              <input
                type="text"
                value={newClass.room}
                onChange={(e) => setNewClass({ ...newClass, room: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.classSchedule.color')}
            </label>
            <div className="flex gap-2">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => setNewClass({ ...newClass, color })}
                  className={`w-8 h-8 rounded ${newClass.color === color ? 'ring-2 ring-offset-2 ring-slate-400' : ''}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setMode('view')} className="flex-1 py-2 bg-slate-100 rounded">
              {t('common.cancel')}
            </button>
            <button onClick={addClass} disabled={!newClass.name.trim()} className="flex-1 py-2 bg-blue-500 text-white rounded disabled:opacity-50">
              {t('tools.classSchedule.add')}
            </button>
          </div>
        </div>
      )}

      {classes.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.classSchedule.yourClasses')}</h3>
          <div className="flex flex-wrap gap-2">
            {classes.map(cls => (
              <div key={cls.id} className="flex items-center gap-1 px-2 py-1 rounded text-white text-sm" style={{ backgroundColor: cls.color }}>
                {cls.name}
                <button onClick={() => deleteClass(cls.id)} className="ml-1">×</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4 overflow-x-auto">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr>
              <th className="p-1 text-xs text-slate-500"></th>
              {days.map((day, i) => (
                <th key={i} className="p-1 text-xs text-slate-700">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periods.map(period => (
              <tr key={period}>
                <td className="p-1 text-xs text-slate-500 text-center">{period}</td>
                {days.map((_, day) => {
                  const slot = getSlot(day, period)
                  const cls = slot?.classId ? getClassById(slot.classId) : null

                  return (
                    <td key={day} className="p-1">
                      {mode === 'editSchedule' ? (
                        <div
                          onClick={() => setSelectedSlot({ day, period })}
                          className="h-12 rounded border-2 border-dashed border-slate-200 cursor-pointer flex items-center justify-center text-xs"
                          style={cls ? { backgroundColor: cls.color, borderStyle: 'solid', color: 'white' } : {}}
                        >
                          {cls?.name || '+'}
                        </div>
                      ) : cls ? (
                        <div
                          className="h-12 rounded flex flex-col items-center justify-center text-xs text-white p-1"
                          style={{ backgroundColor: cls.color }}
                        >
                          <div className="font-medium">{cls.name}</div>
                          {cls.room && <div className="text-[10px] opacity-75">{cls.room}</div>}
                        </div>
                      ) : (
                        <div className="h-12" />
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedSlot && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-2">
            {days[selectedSlot.day]} - {t('tools.classSchedule.period')} {selectedSlot.period}
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSlotClass(selectedSlot.day, selectedSlot.period, null)}
              className="px-3 py-1 bg-slate-100 rounded text-sm"
            >
              {t('tools.classSchedule.clear')}
            </button>
            {classes.map(cls => (
              <button
                key={cls.id}
                onClick={() => setSlotClass(selectedSlot.day, selectedSlot.period, cls.id)}
                className="px-3 py-1 rounded text-sm text-white"
                style={{ backgroundColor: cls.color }}
              >
                {cls.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
