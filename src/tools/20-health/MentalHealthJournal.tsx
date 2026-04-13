import { useState } from 'react'

const moodEmoji = ['😢', '😟', '😐', '😊', '😄']

interface Entry { mood: number; text: string; time: string }

export default function MentalHealthJournal() {
  const [mood, setMood] = useState(3)
  const [text, setText] = useState('')
  const [entries, setEntries] = useState<Entry[]>([])

  const log = () => {
    if (!text.trim()) return
    const time = new Date().toLocaleString()
    setEntries([{ mood, text, time }, ...entries].slice(0, 5))
    setText('')
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Mental Health Journal</h2>
      <div>
        <label className="text-sm font-medium block mb-1">How are you feeling?</label>
        <div className="flex gap-2">
          {moodEmoji.map((e, i) => (
            <button key={i} onClick={() => setMood(i + 1)}
              className={`text-2xl p-2 rounded border-2 transition-all ${mood === i + 1 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
              {e}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-1">Selected: {moodEmoji[mood - 1]} (Level {mood}/5)</p>
      </div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3}
        className="w-full border rounded p-2 text-sm" placeholder="Write your thoughts here..." />
      <button onClick={log} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Log Entry</button>
      {entries.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Recent Entries</p>
          {entries.map((e, i) => (
            <div key={i} className="p-2 bg-gray-100 rounded text-sm">
              <div className="flex justify-between"><span>{moodEmoji[e.mood - 1]} Level {e.mood}</span><span className="text-xs text-gray-500">{e.time}</span></div>
              <p className="mt-1 text-gray-700 truncate">{e.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
