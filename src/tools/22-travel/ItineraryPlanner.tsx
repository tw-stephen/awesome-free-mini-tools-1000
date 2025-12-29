import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Activity {
  id: number
  time: string
  title: string
  location: string
  duration: number
  notes: string
  category: string
}

interface Day {
  id: number
  date: string
  activities: Activity[]
}

const activityCategories = [
  { id: 'transport', name: 'Transportation', icon: '✈️' },
  { id: 'accommodation', name: 'Check-in/out', icon: '🏨' },
  { id: 'food', name: 'Food & Dining', icon: '🍽️' },
  { id: 'attraction', name: 'Attractions', icon: '🏛️' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️' },
  { id: 'activity', name: 'Activities', icon: '🎭' },
  { id: 'rest', name: 'Rest/Free time', icon: '☕' },
]

export default function ItineraryPlanner() {
  const { t } = useTranslation()
  const [tripName, setTripName] = useState('')
  const [days, setDays] = useState<Day[]>([])
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [showActivityForm, setShowActivityForm] = useState(false)
  const [newActivity, setNewActivity] = useState({
    time: '09:00',
    title: '',
    location: '',
    duration: 60,
    notes: '',
    category: 'attraction',
  })

  const addDay = () => {
    const lastDate = days.length > 0
      ? new Date(days[days.length - 1].date)
      : new Date()
    lastDate.setDate(lastDate.getDate() + 1)

    const newDay: Day = {
      id: Date.now(),
      date: lastDate.toISOString().split('T')[0],
      activities: [],
    }
    setDays([...days, newDay])
    setSelectedDay(newDay.id)
  }

  const removeDay = (dayId: number) => {
    setDays(days.filter(d => d.id !== dayId))
    if (selectedDay === dayId) {
      setSelectedDay(days.length > 1 ? days[0].id : null)
    }
  }

  const addActivity = () => {
    if (!selectedDay || !newActivity.title.trim()) return

    const activity: Activity = {
      ...newActivity,
      id: Date.now(),
    }

    setDays(days.map(day => {
      if (day.id === selectedDay) {
        return {
          ...day,
          activities: [...day.activities, activity].sort((a, b) => a.time.localeCompare(b.time)),
        }
      }
      return day
    }))

    setNewActivity({
      time: '09:00',
      title: '',
      location: '',
      duration: 60,
      notes: '',
      category: 'attraction',
    })
    setShowActivityForm(false)
  }

  const removeActivity = (dayId: number, activityId: number) => {
    setDays(days.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          activities: day.activities.filter(a => a.id !== activityId),
        }
      }
      return day
    }))
  }

  const currentDay = days.find(d => d.id === selectedDay)

  const exportItinerary = () => {
    let text = `${tripName || 'Trip'} Itinerary\n${'='.repeat(40)}\n\n`

    days.forEach((day, index) => {
      text += `Day ${index + 1}: ${new Date(day.date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })}\n`
      text += `${'-'.repeat(30)}\n`

      day.activities.forEach(activity => {
        const cat = activityCategories.find(c => c.id === activity.category)
        text += `${activity.time} ${cat?.icon || ''} ${activity.title}\n`
        if (activity.location) text += `   Location: ${activity.location}\n`
        if (activity.duration) text += `   Duration: ${activity.duration} min\n`
        if (activity.notes) text += `   Notes: ${activity.notes}\n`
        text += '\n'
      })
      text += '\n'
    })

    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `itinerary-${tripName || 'trip'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <input
          type="text"
          value={tripName}
          onChange={e => setTripName(e.target.value)}
          placeholder={t('tools.itineraryPlanner.tripName')}
          className="w-full px-3 py-2 border border-slate-300 rounded text-lg font-medium"
        />
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.itineraryPlanner.days')}</h3>
          <button
            onClick={addDay}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            + {t('tools.itineraryPlanner.addDay')}
          </button>
        </div>
        {days.length === 0 ? (
          <div className="text-center text-slate-500 py-4">
            {t('tools.itineraryPlanner.noDays')}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {days.map((day, index) => (
              <button
                key={day.id}
                onClick={() => setSelectedDay(day.id)}
                className={`px-3 py-2 rounded relative ${
                  selectedDay === day.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 hover:bg-slate-200'
                }`}
              >
                <div className="font-medium">Day {index + 1}</div>
                <div className="text-xs opacity-80">
                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <span className="absolute -top-1 -right-1 bg-slate-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {day.activities.length}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {currentDay && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-medium">
                Day {days.findIndex(d => d.id === currentDay.id) + 1}
              </h3>
              <input
                type="date"
                value={currentDay.date}
                onChange={e => {
                  setDays(days.map(d =>
                    d.id === currentDay.id ? { ...d, date: e.target.value } : d
                  ))
                }}
                className="text-sm text-slate-500 border-none bg-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowActivityForm(true)}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
              >
                + {t('tools.itineraryPlanner.addActivity')}
              </button>
              <button
                onClick={() => removeDay(currentDay.id)}
                className="px-3 py-1 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200"
              >
                {t('tools.itineraryPlanner.removeDay')}
              </button>
            </div>
          </div>

          {showActivityForm && (
            <div className="p-4 bg-slate-50 rounded mb-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="time"
                  value={newActivity.time}
                  onChange={e => setNewActivity({ ...newActivity, time: e.target.value })}
                  className="px-3 py-2 border border-slate-300 rounded"
                />
                <select
                  value={newActivity.category}
                  onChange={e => setNewActivity({ ...newActivity, category: e.target.value })}
                  className="px-3 py-2 border border-slate-300 rounded"
                >
                  {activityCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                value={newActivity.title}
                onChange={e => setNewActivity({ ...newActivity, title: e.target.value })}
                placeholder={t('tools.itineraryPlanner.activityTitle')}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
              <input
                type="text"
                value={newActivity.location}
                onChange={e => setNewActivity({ ...newActivity, location: e.target.value })}
                placeholder={t('tools.itineraryPlanner.location')}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500">{t('tools.itineraryPlanner.duration')} (min)</label>
                  <input
                    type="number"
                    value={newActivity.duration}
                    onChange={e => setNewActivity({ ...newActivity, duration: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500">{t('tools.itineraryPlanner.notes')}</label>
                  <input
                    type="text"
                    value={newActivity.notes}
                    onChange={e => setNewActivity({ ...newActivity, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={addActivity}
                  disabled={!newActivity.title.trim()}
                  className="flex-1 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-slate-300"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowActivityForm(false)}
                  className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {currentDay.activities.length === 0 ? (
              <div className="text-center text-slate-500 py-4">
                {t('tools.itineraryPlanner.noActivities')}
              </div>
            ) : (
              currentDay.activities.map(activity => {
                const cat = activityCategories.find(c => c.id === activity.category)
                return (
                  <div key={activity.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded">
                    <div className="text-center">
                      <div className="text-2xl">{cat?.icon}</div>
                      <div className="text-sm font-medium text-blue-600">{activity.time}</div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{activity.title}</div>
                      {activity.location && (
                        <div className="text-sm text-slate-500">📍 {activity.location}</div>
                      )}
                      {activity.duration > 0 && (
                        <div className="text-sm text-slate-500">⏱️ {activity.duration} min</div>
                      )}
                      {activity.notes && (
                        <div className="text-sm text-slate-400 mt-1">{activity.notes}</div>
                      )}
                    </div>
                    <button
                      onClick={() => removeActivity(currentDay.id, activity.id)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      x
                    </button>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}

      {days.length > 0 && (
        <button
          onClick={exportItinerary}
          className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {t('tools.itineraryPlanner.export')}
        </button>
      )}
    </div>
  )
}
