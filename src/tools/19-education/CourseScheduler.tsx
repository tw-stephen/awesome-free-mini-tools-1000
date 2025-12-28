import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Course {
  id: number
  name: string
  code: string
  instructor: string
  location: string
  day: string
  startTime: string
  endTime: string
  color: string
}

export default function CourseScheduler() {
  const { t } = useTranslation()
  const [courses, setCourses] = useState<Course[]>([])
  const [showForm, setShowForm] = useState(false)
  const [newCourse, setNewCourse] = useState({
    name: '',
    code: '',
    instructor: '',
    location: '',
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:00',
    color: '#3B82F6',
  })

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  const hours = Array.from({ length: 14 }, (_, i) => i + 7) // 7 AM to 8 PM
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4']

  const addCourse = () => {
    if (!newCourse.name.trim()) return
    setCourses([...courses, { ...newCourse, id: Date.now() }])
    setNewCourse({
      name: '',
      code: '',
      instructor: '',
      location: '',
      day: 'Monday',
      startTime: '09:00',
      endTime: '10:00',
      color: colors[courses.length % colors.length],
    })
    setShowForm(false)
  }

  const removeCourse = (id: number) => {
    setCourses(courses.filter(c => c.id !== id))
  }

  const getCoursesForSlot = (day: string, hour: number): Course[] => {
    return courses.filter(c => {
      const startHour = parseInt(c.startTime.split(':')[0])
      const endHour = parseInt(c.endTime.split(':')[0])
      return c.day === day && hour >= startHour && hour < endHour
    })
  }

  const getCourseHeight = (course: Course): number => {
    const startHour = parseInt(course.startTime.split(':')[0])
    const endHour = parseInt(course.endTime.split(':')[0])
    return (endHour - startHour) * 40
  }

  const isFirstSlot = (course: Course, hour: number): boolean => {
    return parseInt(course.startTime.split(':')[0]) === hour
  }

  const exportSchedule = () => {
    let text = 'Course Schedule\n\n'
    days.forEach(day => {
      const dayCourses = courses.filter(c => c.day === day)
      if (dayCourses.length > 0) {
        text += `${day}:\n`
        dayCourses.forEach(c => {
          text += `  ${c.startTime}-${c.endTime}: ${c.name}`
          if (c.code) text += ` (${c.code})`
          if (c.location) text += ` @ ${c.location}`
          text += '\n'
        })
        text += '\n'
      }
    })
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setShowForm(true)}
          className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          + {t('tools.courseScheduler.addCourse')}
        </button>
        <button
          onClick={exportSchedule}
          disabled={courses.length === 0}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-slate-300"
        >
          {t('tools.courseScheduler.export')}
        </button>
      </div>

      {showForm && (
        <div className="card p-4 border-2 border-blue-300">
          <h3 className="font-medium mb-3">{t('tools.courseScheduler.addCourse')}</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={newCourse.name}
                onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                placeholder="Course name"
                className="px-3 py-2 border border-slate-300 rounded"
              />
              <input
                type="text"
                value={newCourse.code}
                onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                placeholder="Course code"
                className="px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={newCourse.instructor}
                onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
                placeholder="Instructor"
                className="px-3 py-2 border border-slate-300 rounded"
              />
              <input
                type="text"
                value={newCourse.location}
                onChange={(e) => setNewCourse({ ...newCourse, location: e.target.value })}
                placeholder="Location"
                className="px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              <select
                value={newCourse.day}
                onChange={(e) => setNewCourse({ ...newCourse, day: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded"
              >
                {days.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <input
                type="time"
                value={newCourse.startTime}
                onChange={(e) => setNewCourse({ ...newCourse, startTime: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded"
              />
              <input
                type="time"
                value={newCourse.endTime}
                onChange={(e) => setNewCourse({ ...newCourse, endTime: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded"
              />
              <div className="flex gap-1">
                {colors.map(c => (
                  <button
                    key={c}
                    onClick={() => setNewCourse({ ...newCourse, color: c })}
                    className={`w-6 h-6 rounded ${newCourse.color === c ? 'ring-2 ring-offset-1 ring-slate-400' : ''}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={addCourse}
                disabled={!newCourse.name.trim()}
                className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300"
              >
                Add Course
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

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr>
              <th className="w-16 p-2 border-b text-left text-xs text-slate-500">Time</th>
              {days.map(day => (
                <th key={day} className="p-2 border-b text-center text-sm">{day.slice(0, 3)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.map(hour => (
              <tr key={hour} className="h-10">
                <td className="p-1 border-r text-xs text-slate-500">
                  {hour.toString().padStart(2, '0')}:00
                </td>
                {days.map(day => {
                  const slotCourses = getCoursesForSlot(day, hour)
                  return (
                    <td key={day} className="p-0 border-r border-b relative">
                      {slotCourses.map(course => (
                        isFirstSlot(course, hour) && (
                          <div
                            key={course.id}
                            className="absolute inset-x-0 mx-0.5 rounded text-white text-xs p-1 overflow-hidden cursor-pointer z-10"
                            style={{
                              backgroundColor: course.color,
                              height: `${getCourseHeight(course)}px`,
                            }}
                            onClick={() => removeCourse(course.id)}
                            title="Click to remove"
                          >
                            <div className="font-medium truncate">{course.name}</div>
                            {course.location && <div className="truncate opacity-75">{course.location}</div>}
                          </div>
                        )
                      ))}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {courses.length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium mb-2">{t('tools.courseScheduler.courses')} ({courses.length})</h3>
          <div className="space-y-1">
            {courses.map(course => (
              <div key={course.id} className="flex items-center justify-between p-2 bg-slate-50 rounded text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: course.color }} />
                  <span className="font-medium">{course.name}</span>
                  {course.code && <span className="text-slate-500">({course.code})</span>}
                </div>
                <span className="text-slate-500">
                  {course.day.slice(0, 3)} {course.startTime}-{course.endTime}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
