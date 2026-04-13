import { useState } from 'react'

const foods: { name: string; proteinPer100g: number; serving: number }[] = [
  { name: 'Firm Tofu', proteinPer100g: 8, serving: 100 },
  { name: 'Lentils (cooked)', proteinPer100g: 9, serving: 100 },
  { name: 'Chickpeas (cooked)', proteinPer100g: 8.9, serving: 100 },
  { name: 'Black Beans (cooked)', proteinPer100g: 8.9, serving: 100 },
  { name: 'Edamame', proteinPer100g: 11, serving: 100 },
  { name: 'Tempeh', proteinPer100g: 19, serving: 100 },
  { name: 'Seitan', proteinPer100g: 25, serving: 100 },
  { name: 'Hemp Seeds (3 tbsp)', proteinPer100g: 31.6, serving: 30 },
  { name: 'Pumpkin Seeds (¼ cup)', proteinPer100g: 19, serving: 30 },
  { name: 'Peanut Butter (2 tbsp)', proteinPer100g: 25, serving: 32 },
]

export default function VeganProteinCalculator() {
  const [selected, setSelected] = useState<Record<number, boolean>>({})

  const toggle = (i: number) => setSelected((s) => ({ ...s, [i]: !s[i] }))
  const total = foods.reduce((sum, f, i) => selected[i] ? sum + (f.proteinPer100g * f.serving / 100) : sum, 0)

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Vegan Protein Calculator</h2>
      <p className="text-sm text-gray-500">Select the vegan protein sources you're eating today:</p>
      <div className="space-y-1">
        {foods.map((f, i) => (
          <label key={i} className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer text-sm">
            <input type="checkbox" checked={!!selected[i]} onChange={() => toggle(i)} className="w-4 h-4" />
            <span className="flex-1">{f.name}</span>
            <span className="text-gray-500">{(f.proteinPer100g * f.serving / 100).toFixed(1)}g protein</span>
          </label>
        ))}
      </div>
      <div className="p-3 bg-gray-100 rounded">
        <p className="font-semibold text-lg">Total Protein: {total.toFixed(1)}g</p>
        <p className="text-xs text-gray-500 mt-1">Daily target: ~0.8–1.6g per kg body weight for active adults.</p>
      </div>
    </div>
  )
}
