import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Substitution {
  ingredient: string
  category: string
  substitutes: {
    name: string
    ratio: string
    notes: string
  }[]
}

const substitutions: Substitution[] = [
  {
    ingredient: 'Butter',
    category: 'Dairy',
    substitutes: [
      { name: 'Coconut oil', ratio: '1:1', notes: 'Adds slight coconut flavor' },
      { name: 'Applesauce', ratio: '1:1', notes: 'For baking, reduces fat' },
      { name: 'Greek yogurt', ratio: '1/2 cup yogurt per 1 cup butter', notes: 'Keeps moisture in baked goods' },
      { name: 'Avocado', ratio: '1:1', notes: 'For baking, adds healthy fats' },
      { name: 'Olive oil', ratio: '3/4 cup oil per 1 cup butter', notes: 'Best for savory dishes' },
    ],
  },
  {
    ingredient: 'Eggs',
    category: 'Dairy',
    substitutes: [
      { name: 'Flax egg', ratio: '1 tbsp flax + 3 tbsp water per egg', notes: 'Let sit 5 min to gel' },
      { name: 'Chia egg', ratio: '1 tbsp chia + 3 tbsp water per egg', notes: 'Let sit 5 min to gel' },
      { name: 'Mashed banana', ratio: '1/4 cup per egg', notes: 'Adds sweetness, good for baking' },
      { name: 'Applesauce', ratio: '1/4 cup per egg', notes: 'Adds moisture and sweetness' },
      { name: 'Silken tofu', ratio: '1/4 cup per egg', notes: 'Blend smooth, neutral flavor' },
    ],
  },
  {
    ingredient: 'Milk',
    category: 'Dairy',
    substitutes: [
      { name: 'Almond milk', ratio: '1:1', notes: 'Slightly nutty flavor' },
      { name: 'Oat milk', ratio: '1:1', notes: 'Creamy, good for baking' },
      { name: 'Coconut milk', ratio: '1:1', notes: 'Adds richness and coconut flavor' },
      { name: 'Soy milk', ratio: '1:1', notes: 'Most similar protein content' },
      { name: 'Water + butter', ratio: '1 cup water + 1 tbsp butter per cup milk', notes: 'In a pinch' },
    ],
  },
  {
    ingredient: 'Heavy Cream',
    category: 'Dairy',
    substitutes: [
      { name: 'Coconut cream', ratio: '1:1', notes: 'Adds coconut flavor' },
      { name: 'Milk + butter', ratio: '3/4 cup milk + 1/3 cup butter per cup', notes: 'Good for cooking' },
      { name: 'Evaporated milk', ratio: '1:1', notes: 'Less rich but works' },
      { name: 'Cashew cream', ratio: '1:1', notes: 'Blend soaked cashews smooth' },
    ],
  },
  {
    ingredient: 'All-Purpose Flour',
    category: 'Baking',
    substitutes: [
      { name: 'Whole wheat flour', ratio: '3/4 cup per 1 cup AP', notes: 'Denser result' },
      { name: 'Almond flour', ratio: '1:1', notes: 'Gluten-free, denser' },
      { name: 'Oat flour', ratio: '1:1', notes: 'Blend oats fine, slightly sweet' },
      { name: 'Coconut flour', ratio: '1/4 cup per 1 cup AP', notes: 'Very absorbent, add liquid' },
    ],
  },
  {
    ingredient: 'Sugar (Granulated)',
    category: 'Sweeteners',
    substitutes: [
      { name: 'Honey', ratio: '3/4 cup per 1 cup sugar', notes: 'Reduce liquid by 1/4 cup' },
      { name: 'Maple syrup', ratio: '3/4 cup per 1 cup sugar', notes: 'Reduce liquid slightly' },
      { name: 'Coconut sugar', ratio: '1:1', notes: 'Caramel-like flavor' },
      { name: 'Stevia', ratio: '1 tsp per 1 cup sugar', notes: 'Very concentrated' },
    ],
  },
  {
    ingredient: 'Brown Sugar',
    category: 'Sweeteners',
    substitutes: [
      { name: 'White sugar + molasses', ratio: '1 cup sugar + 1 tbsp molasses', notes: 'Best substitute' },
      { name: 'Maple syrup', ratio: '3/4 cup per 1 cup', notes: 'Reduce liquid slightly' },
      { name: 'Coconut sugar', ratio: '1:1', notes: 'Similar flavor profile' },
    ],
  },
  {
    ingredient: 'Baking Powder',
    category: 'Leavening',
    substitutes: [
      { name: 'Baking soda + cream of tartar', ratio: '1/4 tsp soda + 1/2 tsp cream of tartar per 1 tsp', notes: 'Mix fresh' },
      { name: 'Self-rising flour', ratio: 'Replace AP flour with self-rising', notes: 'Contains baking powder already' },
    ],
  },
  {
    ingredient: 'Buttermilk',
    category: 'Dairy',
    substitutes: [
      { name: 'Milk + lemon juice', ratio: '1 cup milk + 1 tbsp lemon juice', notes: 'Let sit 5 min' },
      { name: 'Milk + vinegar', ratio: '1 cup milk + 1 tbsp vinegar', notes: 'Let sit 5 min' },
      { name: 'Yogurt + milk', ratio: '3/4 cup yogurt + 1/4 cup milk', notes: 'Stir to combine' },
    ],
  },
  {
    ingredient: 'Sour Cream',
    category: 'Dairy',
    substitutes: [
      { name: 'Greek yogurt', ratio: '1:1', notes: 'Slightly tangier' },
      { name: 'Cottage cheese', ratio: '1:1', notes: 'Blend smooth first' },
      { name: 'Coconut cream + lemon', ratio: '1 cup cream + 1 tbsp lemon', notes: 'Dairy-free option' },
    ],
  },
  {
    ingredient: 'Soy Sauce',
    category: 'Condiments',
    substitutes: [
      { name: 'Coconut aminos', ratio: '1:1', notes: 'Sweeter, less sodium' },
      { name: 'Tamari', ratio: '1:1', notes: 'Gluten-free option' },
      { name: 'Worcestershire + water', ratio: '1 tbsp + 1 tbsp water per 2 tbsp soy sauce', notes: 'Different flavor profile' },
    ],
  },
  {
    ingredient: 'Honey',
    category: 'Sweeteners',
    substitutes: [
      { name: 'Maple syrup', ratio: '1:1', notes: 'Different flavor' },
      { name: 'Agave nectar', ratio: '1:1', notes: 'More neutral flavor' },
      { name: 'Brown rice syrup', ratio: '1 1/4 cup per 1 cup honey', notes: 'Less sweet' },
    ],
  },
]

export default function SubstitutionFinder() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = ['all', 'Dairy', 'Baking', 'Sweeteners', 'Leavening', 'Condiments']

  const filteredSubstitutions = useMemo(() => {
    return substitutions.filter(sub => {
      const matchesSearch = searchTerm === '' ||
        sub.ingredient.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || sub.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder={t('tools.substitutionFinder.search')}
          className="w-full px-3 py-2 border border-slate-300 rounded text-lg"
        />
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.substitutionFinder.categories')}</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedCategory === cat
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredSubstitutions.length === 0 ? (
          <div className="card p-8 text-center text-slate-500">
            {t('tools.substitutionFinder.noResults')}
          </div>
        ) : (
          filteredSubstitutions.map(sub => (
            <div key={sub.ingredient} className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg">{sub.ingredient}</h3>
                <span className="px-2 py-1 bg-slate-100 rounded text-sm text-slate-600">
                  {sub.category}
                </span>
              </div>
              <div className="space-y-2">
                {sub.substitutes.map((s, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded">
                    <div className="flex items-start justify-between">
                      <div className="font-medium">{s.name}</div>
                      <div className="text-sm text-blue-600 font-mono">{s.ratio}</div>
                    </div>
                    <div className="text-sm text-slate-500 mt-1">{s.notes}</div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="card p-4 bg-yellow-50">
        <h3 className="font-medium mb-2">{t('tools.substitutionFinder.tip')}</h3>
        <p className="text-sm text-slate-600">
          {t('tools.substitutionFinder.tipText')}
        </p>
      </div>
    </div>
  )
}
