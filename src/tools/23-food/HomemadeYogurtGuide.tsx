import { useState } from 'react'

const milkGuide: Record<string, { heatTemp: string; coolTemp: string; culture: string; setTime: string; note: string }> = {
  'Whole':   { heatTemp: '82°C (180°F)', coolTemp: '43°C (110°F)', culture: '2 tbsp live yogurt per liter', setTime: '6–8 hours', note: 'Best results — fat content produces thick, creamy yogurt without straining.' },
  '2%':      { heatTemp: '82°C (180°F)', coolTemp: '43°C (110°F)', culture: '2 tbsp live yogurt per liter', setTime: '6–10 hours', note: 'Good balance of creaminess and lower fat. May need longer setting time.' },
  'Skim':    { heatTemp: '82°C (180°F)', coolTemp: '43°C (110°F)', culture: '2 tbsp live yogurt per liter', setTime: '8–12 hours', note: 'Thinner texture. Add 2 tbsp dry milk powder per liter for thicker result.' },
  'Coconut': { heatTemp: '74°C (165°F)', coolTemp: '40°C (104°F)', culture: '2 tbsp live yogurt or vegan starter', setTime: '10–14 hours', note: 'Dairy-free option. Use full-fat coconut milk in cans for best texture. Add tapioca starch as thickener if needed.' },
}

export default function HomemadeYogurtGuide() {
  const [milkType, setMilkType] = useState('Whole')
  const [qty, setQty] = useState(2)
  const g = milkGuide[milkType]
  const culture = `${(qty * 2).toFixed(0)} tbsp live yogurt`

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Homemade Yogurt Guide</h2>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium block mb-1">Milk Type</label>
          <select value={milkType} onChange={(e) => setMilkType(e.target.value)} className="w-full border rounded p-2">
            {Object.keys(milkGuide).map((k) => <option key={k}>{k}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Quantity (cups)</label>
          <input type="number" min={1} max={16} value={qty} onChange={(e) => setQty(Number(e.target.value))}
            className="w-full border rounded p-2" />
        </div>
      </div>
      <div className="p-3 bg-gray-100 rounded space-y-3 text-sm">
        <p className="font-medium">{milkType} Milk — {qty} cup{qty !== 1 ? 's' : ''}</p>
        <div className="space-y-2">
          {[
            ['Step 1: Heat milk to', g.heatTemp],
            ['Step 2: Cool milk to', g.coolTemp],
            ['Step 3: Add culture', culture],
            ['Step 4: Incubate for', g.setTime],
            ['Step 5: Refrigerate', '4+ hours until cold'],
          ].map(([step, detail]) => (
            <div key={step as string} className="flex gap-2 bg-white rounded p-2">
              <span className="text-gray-500 text-xs w-40 flex-shrink-0">{step}</span>
              <span className="font-medium text-xs">{detail}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-600 bg-yellow-50 rounded p-2">{g.note}</p>
      </div>
    </div>
  )
}
