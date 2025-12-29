import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Ingredient {
  id: number
  amount: number
  unit: string
  name: string
}

const units = ['cups', 'tbsp', 'tsp', 'oz', 'lb', 'g', 'kg', 'ml', 'L', 'pieces', 'slices', 'cloves']

export default function RecipeScaler() {
  const { t } = useTranslation()
  const [recipeName, setRecipeName] = useState('')
  const [originalServings, setOriginalServings] = useState(4)
  const [targetServings, setTargetServings] = useState(4)
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [newIngredient, setNewIngredient] = useState({ amount: 0, unit: 'cups', name: '' })

  const scaleFactor = targetServings / originalServings

  const addIngredient = () => {
    if (!newIngredient.name.trim() || newIngredient.amount <= 0) return
    setIngredients([...ingredients, { ...newIngredient, id: Date.now() }])
    setNewIngredient({ amount: 0, unit: 'cups', name: '' })
  }

  const removeIngredient = (id: number) => {
    setIngredients(ingredients.filter(i => i.id !== id))
  }

  const formatScaledAmount = (amount: number) => {
    const scaled = amount * scaleFactor

    // Convert to fractions for common cooking amounts
    const fractions: Record<number, string> = {
      0.125: '1/8',
      0.25: '1/4',
      0.333: '1/3',
      0.375: '3/8',
      0.5: '1/2',
      0.625: '5/8',
      0.667: '2/3',
      0.75: '3/4',
      0.875: '7/8',
    }

    const wholePart = Math.floor(scaled)
    const decimalPart = scaled - wholePart

    // Check if decimal part matches a common fraction
    for (const [decimal, fraction] of Object.entries(fractions)) {
      if (Math.abs(decimalPart - parseFloat(decimal)) < 0.05) {
        if (wholePart === 0) return fraction
        return `${wholePart} ${fraction}`
      }
    }

    // Otherwise return decimal
    if (scaled < 0.1) return scaled.toFixed(2)
    if (scaled < 1) return scaled.toFixed(1)
    return scaled.toFixed(1).replace(/\.0$/, '')
  }

  const quickScale = (factor: number) => {
    setTargetServings(originalServings * factor)
  }

  const exportRecipe = () => {
    let text = `${recipeName || 'Recipe'}\n${'='.repeat(40)}\n`
    text += `Original: ${originalServings} servings\n`
    text += `Scaled: ${targetServings} servings (${scaleFactor.toFixed(2)}x)\n\n`
    text += `Ingredients:\n`

    ingredients.forEach(ing => {
      text += `- ${formatScaledAmount(ing.amount)} ${ing.unit} ${ing.name}\n`
    })

    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${recipeName || 'recipe'}-scaled.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <input
          type="text"
          value={recipeName}
          onChange={e => setRecipeName(e.target.value)}
          placeholder={t('tools.recipeScaler.recipeName')}
          className="w-full px-3 py-2 border border-slate-300 rounded text-lg font-medium"
        />
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.recipeScaler.servings')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-500">{t('tools.recipeScaler.original')}</label>
            <input
              type="number"
              value={originalServings}
              onChange={e => setOriginalServings(parseInt(e.target.value) || 1)}
              min={1}
              className="w-full px-3 py-2 border border-slate-300 rounded text-xl text-center"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500">{t('tools.recipeScaler.target')}</label>
            <input
              type="number"
              value={targetServings}
              onChange={e => setTargetServings(parseInt(e.target.value) || 1)}
              min={1}
              className="w-full px-3 py-2 border border-slate-300 rounded text-xl text-center"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <button
            onClick={() => quickScale(0.5)}
            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-sm"
          >
            Half (0.5x)
          </button>
          <button
            onClick={() => quickScale(1.5)}
            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-sm"
          >
            1.5x
          </button>
          <button
            onClick={() => quickScale(2)}
            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-sm"
          >
            Double (2x)
          </button>
          <button
            onClick={() => quickScale(3)}
            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-sm"
          >
            Triple (3x)
          </button>
        </div>
      </div>

      <div className="card p-4 text-center bg-blue-50">
        <div className="text-sm text-slate-500">{t('tools.recipeScaler.scaleFactor')}</div>
        <div className="text-3xl font-bold text-blue-600">{scaleFactor.toFixed(2)}x</div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.recipeScaler.addIngredient')}</h3>
        <div className="flex gap-2">
          <input
            type="number"
            value={newIngredient.amount || ''}
            onChange={e => setNewIngredient({ ...newIngredient, amount: parseFloat(e.target.value) || 0 })}
            placeholder="Amount"
            step={0.25}
            className="w-20 px-3 py-2 border border-slate-300 rounded"
          />
          <select
            value={newIngredient.unit}
            onChange={e => setNewIngredient({ ...newIngredient, unit: e.target.value })}
            className="px-3 py-2 border border-slate-300 rounded"
          >
            {units.map(u => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
          <input
            type="text"
            value={newIngredient.name}
            onChange={e => setNewIngredient({ ...newIngredient, name: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && addIngredient()}
            placeholder={t('tools.recipeScaler.ingredientName')}
            className="flex-1 px-3 py-2 border border-slate-300 rounded"
          />
          <button
            onClick={addIngredient}
            disabled={!newIngredient.name.trim() || newIngredient.amount <= 0}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300"
          >
            Add
          </button>
        </div>
      </div>

      {ingredients.length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.recipeScaler.ingredients')}</h3>
          <div className="space-y-2">
            {ingredients.map(ing => (
              <div key={ing.id} className="flex items-center justify-between p-3 bg-slate-50 rounded">
                <div className="flex items-center gap-4">
                  <div className="text-slate-400 text-sm w-24">
                    {ing.amount} {ing.unit}
                  </div>
                  <div className="font-medium text-blue-600 w-24">
                    {formatScaledAmount(ing.amount)} {ing.unit}
                  </div>
                  <div>{ing.name}</div>
                </div>
                <button
                  onClick={() => removeIngredient(ing.id)}
                  className="text-red-400 hover:text-red-600"
                >
                  x
                </button>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200 text-sm text-slate-500">
            <span>{t('tools.recipeScaler.originalAmount')}</span>
            <span>{t('tools.recipeScaler.scaledAmount')}</span>
          </div>
        </div>
      )}

      {ingredients.length > 0 && (
        <button
          onClick={exportRecipe}
          className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {t('tools.recipeScaler.export')}
        </button>
      )}

      <div className="card p-4 bg-yellow-50">
        <h3 className="font-medium mb-2">{t('tools.recipeScaler.tips')}</h3>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>- {t('tools.recipeScaler.tip1')}</li>
          <li>- {t('tools.recipeScaler.tip2')}</li>
          <li>- {t('tools.recipeScaler.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
