import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type RACIValue = 'R' | 'A' | 'C' | 'I' | ''

interface Task {
  id: number
  name: string
}

interface Person {
  id: number
  name: string
}

export default function RACIMatrix() {
  const { t } = useTranslation()
  const [projectName, setProjectName] = useState('')
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, name: 'Requirements Gathering' },
    { id: 2, name: 'Design' },
    { id: 3, name: 'Development' },
    { id: 4, name: 'Testing' },
    { id: 5, name: 'Deployment' },
  ])
  const [people, setPeople] = useState<Person[]>([
    { id: 1, name: 'Product Manager' },
    { id: 2, name: 'Designer' },
    { id: 3, name: 'Developer' },
    { id: 4, name: 'QA Engineer' },
  ])
  const [assignments, setAssignments] = useState<Record<string, RACIValue>>({})

  const addTask = () => {
    setTasks([...tasks, { id: Date.now(), name: '' }])
  }

  const addPerson = () => {
    setPeople([...people, { id: Date.now(), name: '' }])
  }

  const updateTask = (id: number, name: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, name } : t))
  }

  const updatePerson = (id: number, name: string) => {
    setPeople(people.map(p => p.id === id ? { ...p, name } : p))
  }

  const removeTask = (id: number) => {
    if (tasks.length > 1) setTasks(tasks.filter(t => t.id !== id))
  }

  const removePerson = (id: number) => {
    if (people.length > 1) setPeople(people.filter(p => p.id !== id))
  }

  const getKey = (taskId: number, personId: number): string => `${taskId}-${personId}`

  const setAssignment = (taskId: number, personId: number, value: RACIValue) => {
    const key = getKey(taskId, personId)
    setAssignments({ ...assignments, [key]: value })
  }

  const getAssignment = (taskId: number, personId: number): RACIValue => {
    return assignments[getKey(taskId, personId)] || ''
  }

  const raciColors: Record<RACIValue, string> = {
    'R': 'bg-blue-500 text-white',
    'A': 'bg-red-500 text-white',
    'C': 'bg-yellow-500 text-white',
    'I': 'bg-green-500 text-white',
    '': 'bg-slate-100',
  }

  const raciLabels: Record<RACIValue, string> = {
    'R': 'Responsible',
    'A': 'Accountable',
    'C': 'Consulted',
    'I': 'Informed',
    '': 'None',
  }

  const cycleValue = (current: RACIValue): RACIValue => {
    const order: RACIValue[] = ['', 'R', 'A', 'C', 'I']
    const idx = order.indexOf(current)
    return order[(idx + 1) % order.length]
  }

  const validateMatrix = (): string[] => {
    const issues: string[] = []
    tasks.forEach(task => {
      const taskAssignments = people.map(p => getAssignment(task.id, p.id))
      const hasResponsible = taskAssignments.includes('R')
      const accountableCount = taskAssignments.filter(a => a === 'A').length

      if (!hasResponsible && task.name) {
        issues.push(`"${task.name}" has no Responsible person`)
      }
      if (accountableCount > 1 && task.name) {
        issues.push(`"${task.name}" has multiple Accountable (should be 1)`)
      }
    })
    return issues
  }

  const generateMatrix = (): string => {
    let text = `RACI MATRIX\\n${'='.repeat(50)}\\n`
    text += `Project: ${projectName || '[Project Name]'}\\n\\n`

    text += 'Legend:\\n'
    text += 'R = Responsible (does the work)\\n'
    text += 'A = Accountable (owner/approver)\\n'
    text += 'C = Consulted (provides input)\\n'
    text += 'I = Informed (kept up to date)\\n\\n'

    const maxTaskLen = Math.max(...tasks.map(t => t.name.length), 15)
    const personWidth = 12

    text += 'Task'.padEnd(maxTaskLen + 2)
    people.forEach(p => {
      text += (p.name || 'Person').slice(0, personWidth).padEnd(personWidth)
    })
    text += '\\n'
    text += '─'.repeat(maxTaskLen + 2 + people.length * personWidth) + '\\n'

    tasks.forEach(task => {
      text += (task.name || 'Task').padEnd(maxTaskLen + 2)
      people.forEach(p => {
        const value = getAssignment(task.id, p.id) || '-'
        text += value.padEnd(personWidth)
      })
      text += '\\n'
    })

    const issues = validateMatrix()
    if (issues.length > 0) {
      text += '\\n⚠️ VALIDATION ISSUES\\n'
      issues.forEach(i => text += `• ${i}\\n`)
    }

    return text
  }

  const copyMatrix = () => {
    navigator.clipboard.writeText(generateMatrix())
  }

  const issues = validateMatrix()

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="text-sm text-slate-500 block mb-1">{t('tools.raciMatrix.project')}</label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Project name"
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      <div className="card p-4">
        <div className="flex gap-4 text-sm mb-4">
          <span className="flex items-center gap-1">
            <span className="w-6 h-6 bg-blue-500 text-white rounded flex items-center justify-center text-xs">R</span>
            Responsible
          </span>
          <span className="flex items-center gap-1">
            <span className="w-6 h-6 bg-red-500 text-white rounded flex items-center justify-center text-xs">A</span>
            Accountable
          </span>
          <span className="flex items-center gap-1">
            <span className="w-6 h-6 bg-yellow-500 text-white rounded flex items-center justify-center text-xs">C</span>
            Consulted
          </span>
          <span className="flex items-center gap-1">
            <span className="w-6 h-6 bg-green-500 text-white rounded flex items-center justify-center text-xs">I</span>
            Informed
          </span>
        </div>
      </div>

      <div className="card p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">
                <div className="flex items-center gap-2">
                  {t('tools.raciMatrix.tasks')}
                  <button
                    onClick={addTask}
                    className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded"
                  >
                    +
                  </button>
                </div>
              </th>
              {people.map((person) => (
                <th key={person.id} className="p-2 min-w-[100px]">
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={person.name}
                      onChange={(e) => updatePerson(person.id, e.target.value)}
                      placeholder="Person"
                      className="w-full text-center text-xs px-1 py-1 border-b border-transparent hover:border-slate-300 focus:border-blue-500"
                    />
                    <button
                      onClick={() => removePerson(person.id)}
                      className="text-red-400 hover:text-red-600 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                </th>
              ))}
              <th className="p-2">
                <button
                  onClick={addPerson}
                  className="px-2 py-1 text-xs bg-slate-100 rounded hover:bg-slate-200"
                >
                  + Person
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-b">
                <td className="p-2">
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={task.name}
                      onChange={(e) => updateTask(task.id, e.target.value)}
                      placeholder="Task name"
                      className="flex-1 px-2 py-1 border border-slate-200 rounded text-sm"
                    />
                    <button
                      onClick={() => removeTask(task.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      ✕
                    </button>
                  </div>
                </td>
                {people.map((person) => {
                  const value = getAssignment(task.id, person.id)
                  return (
                    <td key={person.id} className="p-2 text-center">
                      <button
                        onClick={() => setAssignment(task.id, person.id, cycleValue(value))}
                        className={`w-10 h-10 rounded font-bold ${raciColors[value]}`}
                        title={raciLabels[value]}
                      >
                        {value || '-'}
                      </button>
                    </td>
                  )
                })}
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={addTask}
          className="w-full mt-3 py-2 border-2 border-dashed border-slate-300 rounded text-slate-500 hover:border-blue-500 hover:text-blue-500"
        >
          + {t('tools.raciMatrix.addTask')}
        </button>
      </div>

      {issues.length > 0 && (
        <div className="card p-4 bg-yellow-50 border-yellow-200">
          <h4 className="font-medium text-yellow-800 mb-2">⚠️ {t('tools.raciMatrix.validation')}</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            {issues.map((issue, i) => (
              <li key={i}>• {issue}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.raciMatrix.export')}</h3>
        <pre className="bg-slate-100 p-4 rounded text-sm whitespace-pre-wrap font-mono overflow-x-auto">
          {generateMatrix()}
        </pre>
        <button
          onClick={copyMatrix}
          className="w-full mt-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('tools.raciMatrix.copy')}
        </button>
      </div>
    </div>
  )
}
