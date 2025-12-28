import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Person {
  id: number
  name: string
  title: string
  department: string
  managerId: number | null
}

export default function OrgChartMaker() {
  const { t } = useTranslation()
  const [orgName, setOrgName] = useState('')
  const [people, setPeople] = useState<Person[]>([
    { id: 1, name: 'CEO', title: 'Chief Executive Officer', department: 'Executive', managerId: null },
  ])

  const addPerson = (managerId: number | null = null) => {
    setPeople([...people, {
      id: Date.now(),
      name: '',
      title: '',
      department: '',
      managerId
    }])
  }

  const updatePerson = (id: number, field: keyof Person, value: string | number | null) => {
    setPeople(people.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    ))
  }

  const removePerson = (id: number) => {
    const hasReports = people.some(p => p.managerId === id)
    if (hasReports) {
      alert('Remove direct reports first')
      return
    }
    if (people.length > 1) {
      setPeople(people.filter(p => p.id !== id))
    }
  }

  const getDirectReports = (managerId: number): Person[] => {
    return people.filter(p => p.managerId === managerId)
  }

  const getTopLevel = (): Person[] => {
    return people.filter(p => p.managerId === null)
  }

  const renderPerson = (person: Person, level: number = 0): JSX.Element => {
    const reports = getDirectReports(person.id)
    return (
      <div key={person.id} className="flex flex-col items-center">
        <div className={`p-3 border-2 rounded-lg bg-white min-w-[150px] text-center ${
          level === 0 ? 'border-blue-500 bg-blue-50' : 'border-slate-300'
        }`}>
          <input
            type="text"
            value={person.name}
            onChange={(e) => updatePerson(person.id, 'name', e.target.value)}
            placeholder="Name"
            className="w-full text-center font-medium border-none bg-transparent focus:outline-none"
          />
          <input
            type="text"
            value={person.title}
            onChange={(e) => updatePerson(person.id, 'title', e.target.value)}
            placeholder="Title"
            className="w-full text-center text-sm text-slate-500 border-none bg-transparent focus:outline-none"
          />
          <input
            type="text"
            value={person.department}
            onChange={(e) => updatePerson(person.id, 'department', e.target.value)}
            placeholder="Department"
            className="w-full text-center text-xs text-slate-400 border-none bg-transparent focus:outline-none"
          />
          <div className="flex justify-center gap-1 mt-2">
            <button
              onClick={() => addPerson(person.id)}
              className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
            >
              + Report
            </button>
            {people.length > 1 && !getDirectReports(person.id).length && (
              <button
                onClick={() => removePerson(person.id)}
                className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                Remove
              </button>
            )}
          </div>
        </div>

        {reports.length > 0 && (
          <>
            <div className="w-0.5 h-4 bg-slate-300" />
            <div className="flex gap-4">
              {reports.map((report, i) => (
                <div key={report.id} className="flex flex-col items-center">
                  {reports.length > 1 && (
                    <div className="flex items-center">
                      {i === 0 && <div className="w-1/2" />}
                      <div className={`h-0.5 bg-slate-300 ${
                        i === 0 ? 'w-1/2' : i === reports.length - 1 ? 'w-1/2' : 'w-full'
                      }`} style={{ minWidth: '20px' }} />
                      {i === reports.length - 1 && <div className="w-1/2" />}
                    </div>
                  )}
                  <div className="w-0.5 h-4 bg-slate-300" />
                  {renderPerson(report, level + 1)}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    )
  }

  const generateTextChart = (person: Person, indent: string = ''): string => {
    let text = `${indent}${person.name || '[Name]'}`
    if (person.title) text += ` - ${person.title}`
    if (person.department) text += ` (${person.department})`
    text += '\\n'

    const reports = getDirectReports(person.id)
    reports.forEach((report, i) => {
      const isLast = i === reports.length - 1
      const prefix = isLast ? '└── ' : '├── '
      const childIndent = indent + (isLast ? '    ' : '│   ')
      text += indent + prefix + generateTextChart(report, childIndent).trim() + '\\n'
    })

    return text
  }

  const generateOrgChart = (): string => {
    let text = `ORGANIZATION CHART\\n${'='.repeat(50)}\\n`
    text += `Organization: ${orgName || '[Organization Name]'}\\n\\n`

    getTopLevel().forEach(person => {
      text += generateTextChart(person)
    })

    return text
  }

  const copyChart = () => {
    navigator.clipboard.writeText(generateOrgChart())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="text-sm text-slate-500 block mb-1">{t('tools.orgChartMaker.organization')}</label>
        <input
          type="text"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          placeholder="Organization name"
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">{t('tools.orgChartMaker.chart')}</h3>
          <button
            onClick={() => addPerson(null)}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            + Add Top Level
          </button>
        </div>
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-8 justify-center min-w-max p-4">
            {getTopLevel().map(person => renderPerson(person))}
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.orgChartMaker.summary')}</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-slate-50 rounded">
            <p className="text-2xl font-bold">{people.length}</p>
            <p className="text-sm text-slate-500">Total People</p>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded">
            <p className="text-2xl font-bold">{getTopLevel().length}</p>
            <p className="text-sm text-slate-500">Top Level</p>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded">
            <p className="text-2xl font-bold">
              {new Set(people.map(p => p.department).filter(d => d)).size}
            </p>
            <p className="text-sm text-slate-500">Departments</p>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.orgChartMaker.textView')}</h3>
        <pre className="bg-slate-100 p-4 rounded text-sm whitespace-pre-wrap font-mono">
          {generateOrgChart()}
        </pre>
        <button
          onClick={copyChart}
          className="w-full mt-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('tools.orgChartMaker.copy')}
        </button>
      </div>
    </div>
  )
}
