import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Persona {
  id: number
  name: string
  photo: string
  age: string
  occupation: string
  income: string
  location: string
  education: string
  goals: string[]
  frustrations: string[]
  motivations: string[]
  preferredChannels: string[]
  quote: string
}

export default function CustomerPersona() {
  const { t } = useTranslation()
  const [personas, setPersonas] = useState<Persona[]>([])
  const [activePersona, setActivePersona] = useState<Persona | null>(null)
  const [showForm, setShowForm] = useState(false)

  const avatars = ['👤', '👩', '👨', '👩‍💼', '👨‍💼', '👩‍💻', '👨‍💻', '👩‍🎓', '👨‍🎓', '🧑‍🔬']

  const addPersona = (persona: Omit<Persona, 'id'>) => {
    const newPersona = { ...persona, id: Date.now() }
    setPersonas([...personas, newPersona])
    setActivePersona(newPersona)
    setShowForm(false)
  }

  const deletePersona = (id: number) => {
    setPersonas(personas.filter(p => p.id !== id))
    if (activePersona?.id === id) {
      setActivePersona(personas[0] || null)
    }
  }

  const generateReport = (): string => {
    let report = `CUSTOMER PERSONAS\n${'='.repeat(50)}\n`
    report += `Date: ${new Date().toLocaleDateString()}\n\n`

    personas.forEach((p, i) => {
      report += `${'─'.repeat(40)}\n`
      report += `PERSONA ${i + 1}: ${p.name}\n`
      report += `${'─'.repeat(40)}\n`
      report += `Age: ${p.age}\n`
      report += `Occupation: ${p.occupation}\n`
      report += `Income: ${p.income}\n`
      report += `Location: ${p.location}\n`
      report += `Education: ${p.education}\n\n`
      report += `Quote: "${p.quote}"\n\n`
      report += `Goals:\n${p.goals.map(g => `  • ${g}`).join('\n')}\n\n`
      report += `Frustrations:\n${p.frustrations.map(f => `  • ${f}`).join('\n')}\n\n`
      report += `Motivations:\n${p.motivations.map(m => `  • ${m}`).join('\n')}\n\n`
      report += `Preferred Channels:\n${p.preferredChannels.map(c => `  • ${c}`).join('\n')}\n\n`
    })

    return report
  }

  const copyReport = () => {
    navigator.clipboard.writeText(generateReport())
  }

  const PersonaForm = () => {
    const [form, setForm] = useState<Omit<Persona, 'id'>>({
      name: '',
      photo: '👤',
      age: '',
      occupation: '',
      income: '',
      location: '',
      education: '',
      goals: [''],
      frustrations: [''],
      motivations: [''],
      preferredChannels: [],
      quote: '',
    })

    const updateArrayField = (field: 'goals' | 'frustrations' | 'motivations', index: number, value: string) => {
      const newArr = [...form[field]]
      newArr[index] = value
      setForm({ ...form, [field]: newArr })
    }

    const addArrayItem = (field: 'goals' | 'frustrations' | 'motivations') => {
      setForm({ ...form, [field]: [...form[field], ''] })
    }

    const channels = ['Email', 'Social Media', 'Phone', 'In-Person', 'Website', 'App', 'Chat']

    return (
      <div className="card p-4 border-2 border-blue-300">
        <h3 className="font-medium mb-3">{t('tools.customerPersona.create')}</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {avatars.map(avatar => (
                <button
                  key={avatar}
                  onClick={() => setForm({ ...form, photo: avatar })}
                  className={`text-2xl p-1 rounded ${form.photo === avatar ? 'bg-blue-100 ring-2 ring-blue-500' : ''}`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Persona name" className="px-3 py-2 border border-slate-300 rounded" />
            <input type="text" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="Age range (e.g., 25-35)" className="px-3 py-2 border border-slate-300 rounded" />
            <input type="text" value={form.occupation} onChange={(e) => setForm({ ...form, occupation: e.target.value })} placeholder="Occupation" className="px-3 py-2 border border-slate-300 rounded" />
            <input type="text" value={form.income} onChange={(e) => setForm({ ...form, income: e.target.value })} placeholder="Income level" className="px-3 py-2 border border-slate-300 rounded" />
            <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Location" className="px-3 py-2 border border-slate-300 rounded" />
            <input type="text" value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })} placeholder="Education" className="px-3 py-2 border border-slate-300 rounded" />
          </div>
          <input type="text" value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} placeholder="Characteristic quote..." className="w-full px-3 py-2 border border-slate-300 rounded" />

          <div>
            <label className="text-sm text-slate-500">Goals</label>
            {form.goals.map((g, i) => (
              <input key={i} type="text" value={g} onChange={(e) => updateArrayField('goals', i, e.target.value)} placeholder="Goal..." className="w-full px-3 py-2 border border-slate-300 rounded mt-1" />
            ))}
            <button onClick={() => addArrayItem('goals')} className="text-sm text-blue-500 mt-1">+ Add goal</button>
          </div>

          <div>
            <label className="text-sm text-slate-500">Frustrations</label>
            {form.frustrations.map((f, i) => (
              <input key={i} type="text" value={f} onChange={(e) => updateArrayField('frustrations', i, e.target.value)} placeholder="Frustration..." className="w-full px-3 py-2 border border-slate-300 rounded mt-1" />
            ))}
            <button onClick={() => addArrayItem('frustrations')} className="text-sm text-blue-500 mt-1">+ Add frustration</button>
          </div>

          <div>
            <label className="text-sm text-slate-500">Preferred Channels</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {channels.map(channel => (
                <button
                  key={channel}
                  onClick={() => setForm({
                    ...form,
                    preferredChannels: form.preferredChannels.includes(channel)
                      ? form.preferredChannels.filter(c => c !== channel)
                      : [...form.preferredChannels, channel]
                  })}
                  className={`px-3 py-1 rounded text-sm ${
                    form.preferredChannels.includes(channel)
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  {channel}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => addPersona(form)} disabled={!form.name} className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300">Create Persona</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300">Cancel</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {personas.length > 0 && (
        <div className="flex gap-2 overflow-x-auto">
          {personas.map(p => (
            <button
              key={p.id}
              onClick={() => setActivePersona(p)}
              className={`flex items-center gap-2 px-4 py-2 rounded whitespace-nowrap ${
                activePersona?.id === p.id ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <span className="text-xl">{p.photo}</span>
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      )}

      {!showForm && (
        <button onClick={() => setShowForm(true)} className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium">
          + {t('tools.customerPersona.create')}
        </button>
      )}

      {showForm && <PersonaForm />}

      {activePersona && (
        <div className="card p-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-5xl">{activePersona.photo}</span>
              <div>
                <h3 className="text-xl font-bold">{activePersona.name}</h3>
                <p className="text-slate-500">{activePersona.occupation}</p>
              </div>
            </div>
            <button onClick={() => deletePersona(activePersona.id)} className="text-red-500 hover:text-red-600 text-sm">Delete</button>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4 text-sm">
            <div className="p-2 bg-slate-50 rounded"><span className="text-slate-500">Age:</span> {activePersona.age}</div>
            <div className="p-2 bg-slate-50 rounded"><span className="text-slate-500">Income:</span> {activePersona.income}</div>
            <div className="p-2 bg-slate-50 rounded"><span className="text-slate-500">Location:</span> {activePersona.location}</div>
            <div className="p-2 bg-slate-50 rounded"><span className="text-slate-500">Education:</span> {activePersona.education}</div>
          </div>

          {activePersona.quote && (
            <blockquote className="p-3 bg-blue-50 rounded mb-4 italic">"{activePersona.quote}"</blockquote>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-green-600 mb-2">Goals</h4>
              <ul className="space-y-1">{activePersona.goals.filter(g => g).map((g, i) => <li key={i} className="text-sm">• {g}</li>)}</ul>
            </div>
            <div>
              <h4 className="font-medium text-red-600 mb-2">Frustrations</h4>
              <ul className="space-y-1">{activePersona.frustrations.filter(f => f).map((f, i) => <li key={i} className="text-sm">• {f}</li>)}</ul>
            </div>
          </div>

          {activePersona.preferredChannels.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Preferred Channels</h4>
              <div className="flex gap-1">{activePersona.preferredChannels.map(c => <span key={c} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">{c}</span>)}</div>
            </div>
          )}
        </div>
      )}

      {personas.length > 0 && (
        <button onClick={copyReport} className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600 font-medium">
          {t('tools.customerPersona.export')}
        </button>
      )}
    </div>
  )
}
