import { useState } from 'react'

const snacks: Record<string, string[]> = {
  Sweet: [
    'Dark chocolate (70%+) with almond butter',
    'Banana slices with peanut butter and a drizzle of honey',
    'Greek yogurt with granola and mixed berries',
  ],
  Savory: [
    'Hummus with cucumber slices and whole grain crackers',
    'Cheese cubes with grapes and a handful of walnuts',
    'Avocado on rice cakes with everything bagel seasoning',
  ],
  Healthy: [
    'Apple slices with almond butter and chia seeds',
    'Handful of mixed nuts and seeds with a piece of fruit',
    'Carrots and celery with tzatziki or guacamole',
  ],
  Quick: [
    'String cheese and a handful of grapes',
    'Hard-boiled egg with a sprinkle of salt and paprika',
    'Rice cakes with peanut butter and banana',
  ],
}

export default function SnackIdeaGenerator() {
  const [type, setType] = useState('Healthy')
  const [ideas, setIdeas] = useState<string[]>([])

  const generate = () => setIdeas(snacks[type])

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Snack Idea Generator</h2>
      <div>
        <label className="text-sm font-medium block mb-1">Snack Type</label>
        <select value={type} onChange={(e) => { setType(e.target.value); setIdeas([]) }} className="w-full border rounded p-2">
          {Object.keys(snacks).map((k) => <option key={k}>{k}</option>)}
        </select>
      </div>
      <button onClick={generate} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Generate Ideas
      </button>
      {ideas.length > 0 && (
        <div className="p-3 bg-gray-100 rounded space-y-2">
          <p className="font-medium text-sm">{type} Snack Ideas</p>
          {ideas.map((idea, i) => (
            <div key={i} className="flex gap-2 p-2 bg-white rounded text-sm">
              <span className="text-orange-500 font-bold flex-shrink-0">{i + 1}.</span>
              <span>{idea}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
