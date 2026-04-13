import { useState } from 'react'

const pairings: Record<string, { wines: string[]; note: string }> = {
  Beef:    { wines: ['Cabernet Sauvignon', 'Malbec', 'Syrah/Shiraz'], note: 'Rich, full-bodied reds complement the fat and umami in beef. Tannins cut through the richness.' },
  Chicken: { wines: ['Chardonnay', 'Pinot Gris', 'Viognier'], note: 'Medium-bodied whites match chicken\'s mild flavor. Oaked Chardonnay pairs especially well with roasted chicken.' },
  Fish:    { wines: ['Sauvignon Blanc', 'Pinot Grigio', 'Albariño'], note: 'Crisp, acidic whites enhance delicate fish flavors. Avoid heavy reds — tannins clash with fish oils.' },
  Pasta:   { wines: ['Sangiovese (Chianti)', 'Barbera d\'Asti', 'Pinot Noir'], note: 'Match the sauce: tomato-based → Italian reds; cream sauce → Chardonnay; pesto → Vermentino.' },
  Salad:   { wines: ['Sauvignon Blanc', 'Grüner Veltliner', 'Dry Rosé'], note: 'Light, acidic wines mirror the brightness of salad dressings. Avoid tannic reds with leafy greens.' },
  Dessert: { wines: ['Sauternes', 'Moscato d\'Asti', 'Port'], note: 'Wine should be at least as sweet as the dessert. Rich chocolate pairs with Port or Banyuls.' },
}

export default function WineParingGuide() {
  const [food, setFood] = useState('Beef')
  const p = pairings[food]

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Wine Pairing Guide</h2>
      <div>
        <label className="text-sm font-medium block mb-1">Select Food</label>
        <select value={food} onChange={(e) => setFood(e.target.value)} className="w-full border rounded p-2">
          {Object.keys(pairings).map((k) => <option key={k}>{k}</option>)}
        </select>
      </div>
      <div className="p-3 bg-gray-100 rounded space-y-3">
        <p className="font-medium text-sm">Recommended Wines for {food}</p>
        <div className="flex flex-wrap gap-2">
          {p.wines.map((w) => (
            <span key={w} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm font-medium">{w}</span>
          ))}
        </div>
        <p className="text-sm text-gray-700">{p.note}</p>
      </div>
    </div>
  )
}
