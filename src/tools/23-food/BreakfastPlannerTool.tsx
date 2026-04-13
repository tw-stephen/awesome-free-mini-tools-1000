import { useState } from 'react'

const plans: Record<string, { items: string[]; tip: string }> = {
  Vegan:       { items: ['Overnight oats with chia seeds and berries', 'Smoothie with banana, spinach, plant milk, and hemp seeds', 'Avocado toast on whole grain bread with nutritional yeast'], tip: 'Tip: Add B12-fortified foods or a supplement daily.' },
  Vegetarian:  { items: ['Greek yogurt parfait with granola and fresh fruit', 'Vegetable omelette with whole grain toast', 'Cottage cheese with pineapple and flax seeds'], tip: 'Tip: Eggs and dairy provide complete proteins for easy morning nutrition.' },
  Keto:        { items: ['Scrambled eggs with bacon and avocado', 'Smoked salmon with cream cheese on cucumber slices', 'Bulletproof coffee + full-fat yogurt with nuts'], tip: 'Tip: Keep net carbs under 20g for breakfast. Skip juice and fruit.' },
  Balanced:    { items: ['Whole grain toast with peanut butter and banana slices', 'Oatmeal with walnuts, blueberries, and a drizzle of honey', 'Veggie scramble with eggs, peppers, and whole grain English muffin'], tip: 'Tip: Aim for protein + fiber + healthy fat at breakfast to sustain energy.' },
}

export default function BreakfastPlannerTool() {
  const [pref, setPref] = useState('Balanced')
  const p = plans[pref]

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Breakfast Planner</h2>
      <div>
        <label className="text-sm font-medium block mb-1">Dietary Preference</label>
        <select value={pref} onChange={(e) => setPref(e.target.value)} className="w-full border rounded p-2">
          {Object.keys(plans).map((k) => <option key={k}>{k}</option>)}
        </select>
      </div>
      <div className="p-3 bg-gray-100 rounded space-y-3">
        <p className="font-medium text-sm">{pref} Breakfast Options</p>
        <ul className="space-y-2">
          {p.items.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span className="text-green-600 font-bold flex-shrink-0">Option {i + 1}:</span>
              <span className="text-gray-700">{item}</span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-gray-600 bg-yellow-50 rounded p-2">{p.tip}</p>
      </div>
    </div>
  )
}
