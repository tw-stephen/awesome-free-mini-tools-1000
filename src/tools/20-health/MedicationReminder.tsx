import { useState } from 'react'

interface Reminder { name: string; dosage: string; frequency: string }

export default function MedicationReminder() {
  const [name, setName] = useState('')
  const [dosage, setDosage] = useState('')
  const [frequency, setFrequency] = useState('Once daily')
  const [reminders, setReminders] = useState<Reminder[]>([])

  const freqOptions = ['Once daily', 'Twice daily', 'Three times daily', 'Every 8 hours', 'Every 12 hours', 'Weekly', 'As needed']

  const add = () => {
    if (!name.trim() || !dosage.trim()) return
    setReminders([...reminders, { name, dosage, frequency }])
    setName('')
    setDosage('')
  }

  const remove = (i: number) => setReminders(reminders.filter((_, idx) => idx !== i))

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Medication Reminder</h2>
      <div className="grid grid-cols-2 gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)}
          className="border rounded p-2 text-sm" placeholder="Medication name" />
        <input value={dosage} onChange={(e) => setDosage(e.target.value)}
          className="border rounded p-2 text-sm" placeholder="Dosage (e.g. 500mg)" />
      </div>
      <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="w-full border rounded p-2 text-sm">
        {freqOptions.map((f) => <option key={f}>{f}</option>)}
      </select>
      <button onClick={add} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Add Reminder
      </button>
      {reminders.length > 0 && (
        <div className="space-y-2">
          {reminders.map((r, i) => (
            <div key={i} className="flex justify-between items-center p-2 bg-gray-100 rounded text-sm">
              <div>
                <p className="font-medium">{r.name} — {r.dosage}</p>
                <p className="text-xs text-gray-500">🕐 {r.frequency}</p>
              </div>
              <button onClick={() => remove(i)} className="text-red-500 hover:text-red-700 text-xs">Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
