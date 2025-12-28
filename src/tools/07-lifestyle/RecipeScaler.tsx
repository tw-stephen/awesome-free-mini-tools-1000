import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Ingredient {
  id: number
  amount: string
  unit: string
  name: string
}

export default function RecipeScaler() {
  const { t } = useTranslation()
  const [originalServings, setOriginalServings] = useState('4')
  const [targetServings, setTargetServings] = useState('4')
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: 1, amount: '2', unit: 'cups', name: 'Flour' },
    { id: 2, amount: '1', unit: 'cup', name: 'Sugar' },
    { id: 3, amount: '3', unit: '', name: 'Eggs' },
    { id: 4, amount: '0.5', unit: 'tsp', name: 'Salt' },
  ])
  const [newIngredient, setNewIngredient] = useState({ amount: '', unit: '', name: '' })

  const scaleFactor = useMemo(() => {
    const orig = parseFloat(originalServings) || 1
    const target = parseFloat(targetServings) || 1
    return target / orig
  }, [originalServings, targetServings])

  const scaledIngredients = useMemo(() => {
    return ingredients.map(ing => {
      const amount = parseFloat(ing.amount) || 0
      const scaled = amount * scaleFactor

      // Format nicely
      let formatted: string
      if (scaled === Math.floor(scaled)) {
        formatted = scaled.toString()
      } else if (scaled < 1) {
        // Convert to fractions for small amounts
        const fractions: Record<string, string> = {
          '0.25': '1/4',
          '0.33': '1/3',
          '0.5': '1/2',
          '0.67': '2/3',
          '0.75': '3/4',
        }
        const rounded = scaled.toFixed(2)
        formatted = fractions[rounded] || scaled.toFixed(2)
      } else {
        const whole = Math.floor(scaled)
        const decimal = scaled - whole
        if (decimal < 0.1) {
          formatted = whole.toString()
        } else if (Math.abs(decimal - 0.5) < 0.1) {
          formatted = `${whole} 1/2`
        } else if (Math.abs(decimal - 0.25) < 0.1) {
          formatted = `${whole} 1/4`
        } else if (Math.abs(decimal - 0.75) < 0.1) {
          formatted = `${whole} 3/4`
        } else {
          formatted = scaled.toFixed(1)
        }
      }

      return { ...ing, scaledAmount: formatted }
    })
  }, [ingredients, scaleFactor])

  const addIngredient = () => {
    if (!newIngredient.name) return
    setIngredients([
      ...ingredients,
      {
        id: Date.now(),
        amount: newIngredient.amount || '1',
        unit: newIngredient.unit,
        name: newIngredient.name,
      },
    ])
    setNewIngredient({ amount: '', unit: '', name: '' })
  }

  const removeIngredient = (id: number) => {
    setIngredients(ingredients.filter(i => i.id !== id))
  }

  const updateIngredient = (id: number, field: keyof Ingredient, value: string) => {
    setIngredients(ingredients.map(ing =>
      ing.id === id ? { ...ing, [field]: value } : ing
    ))
  }

  const commonUnits = ['', 'cups', 'cup', 'tbsp', 'tsp', 'oz', 'g', 'kg', 'ml', 'L', 'lb']

  const quickScale = (factor: number) => {
    const orig = parseFloat(originalServings) || 1
    setTargetServings(String(orig * factor))
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.recipeScaler.originalServings')}
            </label>
            <input
              type="number"
              value={originalServings}
              onChange={(e) => setOriginalServings(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.recipeScaler.targetServings')}
            </label>
            <input
              type="number"
              value={targetServings}
              onChange={(e) => setTargetServings(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          {[0.5, 1, 1.5, 2, 3].map(factor => (
            <button
              key={factor}
              onClick={() => quickScale(factor)}
              className="flex-1 py-2 bg-slate-100 rounded text-sm hover:bg-slate-200"
            >
              ×{factor}
            </button>
          ))}
        </div>

        {scaleFactor !== 1 && (
          <div className="mt-3 p-2 bg-blue-50 rounded text-center">
            <span className="text-sm text-blue-700">
              {t('tools.recipeScaler.scaleFactor')}: <strong>×{scaleFactor.toFixed(2)}</strong>
            </span>
          </div>
        )}
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.recipeScaler.ingredients')}
        </h3>

        <div className="space-y-2 mb-4">
          {scaledIngredients.map(ing => (
            <div
              key={ing.id}
              className="flex items-center gap-2 p-2 bg-slate-50 rounded"
            >
              <input
                type="text"
                value={ing.amount}
                onChange={(e) => updateIngredient(ing.id, 'amount', e.target.value)}
                className="w-16 px-2 py-1 border border-slate-200 rounded text-sm text-center"
              />
              <select
                value={ing.unit}
                onChange={(e) => updateIngredient(ing.id, 'unit', e.target.value)}
                className="w-20 px-2 py-1 border border-slate-200 rounded text-sm"
              >
                {commonUnits.map(u => (
                  <option key={u} value={u}>{u || '-'}</option>
                ))}
              </select>
              <input
                type="text"
                value={ing.name}
                onChange={(e) => updateIngredient(ing.id, 'name', e.target.value)}
                className="flex-1 px-2 py-1 border border-slate-200 rounded text-sm"
              />
              <span className="text-lg">→</span>
              <div className="w-24 text-center font-medium text-green-600">
                {ing.scaledAmount} {ing.unit}
              </div>
              <button
                onClick={() => removeIngredient(ing.id)}
                className="text-slate-400 hover:text-red-500"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newIngredient.amount}
            onChange={(e) => setNewIngredient({ ...newIngredient, amount: e.target.value })}
            placeholder={t('tools.recipeScaler.amount')}
            className="w-16 px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <select
            value={newIngredient.unit}
            onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
            className="w-20 px-3 py-2 border border-slate-300 rounded text-sm"
          >
            {commonUnits.map(u => (
              <option key={u} value={u}>{u || '-'}</option>
            ))}
          </select>
          <input
            type="text"
            value={newIngredient.name}
            onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && addIngredient()}
            placeholder={t('tools.recipeScaler.ingredientName')}
            className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <button
            onClick={addIngredient}
            className="px-4 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
          >
            +
          </button>
        </div>
      </div>

      {scaledIngredients.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.recipeScaler.scaledRecipe')} ({targetServings} {t('tools.recipeScaler.servings')})
          </h3>
          <ul className="space-y-1 text-sm">
            {scaledIngredients.map(ing => (
              <li key={ing.id} className="flex gap-2">
                <span className="font-medium text-green-600 w-20">
                  {ing.scaledAmount} {ing.unit}
                </span>
                <span>{ing.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.recipeScaler.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.recipeScaler.tip1')}</li>
          <li>{t('tools.recipeScaler.tip2')}</li>
          <li>{t('tools.recipeScaler.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
