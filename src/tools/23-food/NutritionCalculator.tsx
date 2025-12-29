import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface FoodItem {
  name: string
  servingSize: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  sugar: number
}

interface SelectedFood {
  id: number
  food: FoodItem
  servings: number
}

const foodDatabase: FoodItem[] = [
  // Proteins
  { name: 'Chicken Breast (cooked)', servingSize: '100g', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0 },
  { name: 'Salmon (cooked)', servingSize: '100g', calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, sugar: 0 },
  { name: 'Egg', servingSize: '1 large', calories: 78, protein: 6, carbs: 0.6, fat: 5, fiber: 0, sugar: 0.6 },
  { name: 'Beef (lean, cooked)', servingSize: '100g', calories: 250, protein: 26, carbs: 0, fat: 15, fiber: 0, sugar: 0 },
  { name: 'Tofu (firm)', servingSize: '100g', calories: 144, protein: 17, carbs: 3, fat: 9, fiber: 2, sugar: 0 },

  // Grains
  { name: 'White Rice (cooked)', servingSize: '1 cup', calories: 206, protein: 4.3, carbs: 45, fat: 0.4, fiber: 0.6, sugar: 0 },
  { name: 'Brown Rice (cooked)', servingSize: '1 cup', calories: 216, protein: 5, carbs: 45, fat: 1.8, fiber: 3.5, sugar: 0 },
  { name: 'Pasta (cooked)', servingSize: '1 cup', calories: 221, protein: 8, carbs: 43, fat: 1.3, fiber: 2.5, sugar: 0.8 },
  { name: 'Bread (white)', servingSize: '1 slice', calories: 79, protein: 2.7, carbs: 15, fat: 1, fiber: 0.6, sugar: 1.4 },
  { name: 'Oatmeal (cooked)', servingSize: '1 cup', calories: 166, protein: 6, carbs: 28, fat: 3.6, fiber: 4, sugar: 0.6 },

  // Dairy
  { name: 'Milk (whole)', servingSize: '1 cup', calories: 149, protein: 8, carbs: 12, fat: 8, fiber: 0, sugar: 12 },
  { name: 'Milk (skim)', servingSize: '1 cup', calories: 83, protein: 8, carbs: 12, fat: 0.2, fiber: 0, sugar: 12 },
  { name: 'Greek Yogurt (plain)', servingSize: '1 cup', calories: 100, protein: 17, carbs: 6, fat: 0.7, fiber: 0, sugar: 4 },
  { name: 'Cheddar Cheese', servingSize: '30g', calories: 113, protein: 7, carbs: 0.4, fat: 9, fiber: 0, sugar: 0.1 },

  // Fruits
  { name: 'Apple', servingSize: '1 medium', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4, sugar: 19 },
  { name: 'Banana', servingSize: '1 medium', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, sugar: 14 },
  { name: 'Orange', servingSize: '1 medium', calories: 62, protein: 1.2, carbs: 15, fat: 0.2, fiber: 3.1, sugar: 12 },
  { name: 'Strawberries', servingSize: '1 cup', calories: 49, protein: 1, carbs: 12, fat: 0.5, fiber: 3, sugar: 7 },

  // Vegetables
  { name: 'Broccoli (cooked)', servingSize: '1 cup', calories: 55, protein: 3.7, carbs: 11, fat: 0.6, fiber: 5.1, sugar: 2.2 },
  { name: 'Spinach (raw)', servingSize: '1 cup', calories: 7, protein: 0.9, carbs: 1.1, fat: 0.1, fiber: 0.7, sugar: 0.1 },
  { name: 'Carrot', servingSize: '1 medium', calories: 25, protein: 0.6, carbs: 6, fat: 0.1, fiber: 1.7, sugar: 2.9 },
  { name: 'Sweet Potato (baked)', servingSize: '1 medium', calories: 103, protein: 2.3, carbs: 24, fat: 0.1, fiber: 3.8, sugar: 7.4 },

  // Snacks & Others
  { name: 'Almonds', servingSize: '1 oz (23 nuts)', calories: 164, protein: 6, carbs: 6, fat: 14, fiber: 3.5, sugar: 1.2 },
  { name: 'Peanut Butter', servingSize: '2 tbsp', calories: 188, protein: 8, carbs: 6, fat: 16, fiber: 2, sugar: 3 },
  { name: 'Avocado', servingSize: '1/2 medium', calories: 161, protein: 2, carbs: 9, fat: 15, fiber: 7, sugar: 0.7 },
  { name: 'Olive Oil', servingSize: '1 tbsp', calories: 119, protein: 0, carbs: 0, fat: 14, fiber: 0, sugar: 0 },
]

export default function NutritionCalculator() {
  const { t } = useTranslation()
  const [selectedFoods, setSelectedFoods] = useState<SelectedFood[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  const filteredFoods = foodDatabase.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const addFood = (food: FoodItem) => {
    setSelectedFoods([...selectedFoods, { id: Date.now(), food, servings: 1 }])
    setSearchTerm('')
  }

  const updateServings = (id: number, servings: number) => {
    if (servings <= 0) {
      setSelectedFoods(selectedFoods.filter(sf => sf.id !== id))
    } else {
      setSelectedFoods(selectedFoods.map(sf =>
        sf.id === id ? { ...sf, servings } : sf
      ))
    }
  }

  const removeFood = (id: number) => {
    setSelectedFoods(selectedFoods.filter(sf => sf.id !== id))
  }

  const calculateTotals = () => {
    return selectedFoods.reduce(
      (totals, sf) => ({
        calories: totals.calories + sf.food.calories * sf.servings,
        protein: totals.protein + sf.food.protein * sf.servings,
        carbs: totals.carbs + sf.food.carbs * sf.servings,
        fat: totals.fat + sf.food.fat * sf.servings,
        fiber: totals.fiber + sf.food.fiber * sf.servings,
        sugar: totals.sugar + sf.food.sugar * sf.servings,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 }
    )
  }

  const totals = calculateTotals()

  const getMacroPercentages = () => {
    const totalMacroCalories = totals.protein * 4 + totals.carbs * 4 + totals.fat * 9
    if (totalMacroCalories === 0) return { protein: 0, carbs: 0, fat: 0 }
    return {
      protein: ((totals.protein * 4) / totalMacroCalories) * 100,
      carbs: ((totals.carbs * 4) / totalMacroCalories) * 100,
      fat: ((totals.fat * 9) / totalMacroCalories) * 100,
    }
  }

  const macroPercentages = getMacroPercentages()

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.nutritionCalculator.searchFood')}</h3>
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder={t('tools.nutritionCalculator.searchPlaceholder')}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
        {searchTerm && (
          <div className="mt-2 max-h-48 overflow-y-auto">
            {filteredFoods.map((food, idx) => (
              <button
                key={idx}
                onClick={() => addFood(food)}
                className="w-full text-left p-2 hover:bg-slate-100 rounded flex justify-between"
              >
                <span>{food.name}</span>
                <span className="text-sm text-slate-500">{food.calories} cal / {food.servingSize}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedFoods.length > 0 && (
        <>
          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.nutritionCalculator.selectedFoods')}</h3>
            <div className="space-y-2">
              {selectedFoods.map(sf => (
                <div key={sf.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                  <div className="flex-1">
                    <div className="font-medium">{sf.food.name}</div>
                    <div className="text-xs text-slate-500">{sf.food.servingSize}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateServings(sf.id, sf.servings - 0.5)}
                      className="w-7 h-7 bg-slate-200 rounded"
                    >
                      -
                    </button>
                    <span className="w-12 text-center">{sf.servings}</span>
                    <button
                      onClick={() => updateServings(sf.id, sf.servings + 0.5)}
                      className="w-7 h-7 bg-slate-200 rounded"
                    >
                      +
                    </button>
                    <span className="w-16 text-right text-sm text-blue-600">
                      {Math.round(sf.food.calories * sf.servings)} cal
                    </span>
                    <button
                      onClick={() => removeFood(sf.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      x
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <div className="text-center mb-4">
              <div className="text-sm opacity-80">{t('tools.nutritionCalculator.totalCalories')}</div>
              <div className="text-4xl font-bold">{Math.round(totals.calories)}</div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{totals.protein.toFixed(1)}g</div>
                <div className="text-xs opacity-80">{t('tools.nutritionCalculator.protein')}</div>
                <div className="text-xs">{macroPercentages.protein.toFixed(0)}%</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{totals.carbs.toFixed(1)}g</div>
                <div className="text-xs opacity-80">{t('tools.nutritionCalculator.carbs')}</div>
                <div className="text-xs">{macroPercentages.carbs.toFixed(0)}%</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{totals.fat.toFixed(1)}g</div>
                <div className="text-xs opacity-80">{t('tools.nutritionCalculator.fat')}</div>
                <div className="text-xs">{macroPercentages.fat.toFixed(0)}%</div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.nutritionCalculator.macroBreakdown')}</h3>
            <div className="h-4 rounded-full overflow-hidden flex">
              <div
                className="bg-red-400"
                style={{ width: `${macroPercentages.protein}%` }}
                title={`Protein: ${macroPercentages.protein.toFixed(1)}%`}
              />
              <div
                className="bg-blue-400"
                style={{ width: `${macroPercentages.carbs}%` }}
                title={`Carbs: ${macroPercentages.carbs.toFixed(1)}%`}
              />
              <div
                className="bg-yellow-400"
                style={{ width: `${macroPercentages.fat}%` }}
                title={`Fat: ${macroPercentages.fat.toFixed(1)}%`}
              />
            </div>
            <div className="flex justify-between text-xs mt-2">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-red-400 rounded"></span> Protein
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-blue-400 rounded"></span> Carbs
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-yellow-400 rounded"></span> Fat
              </span>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.nutritionCalculator.additionalNutrients')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-sm text-slate-500">{t('tools.nutritionCalculator.fiber')}</div>
                <div className="font-bold">{totals.fiber.toFixed(1)}g</div>
              </div>
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-sm text-slate-500">{t('tools.nutritionCalculator.sugar')}</div>
                <div className="font-bold">{totals.sugar.toFixed(1)}g</div>
              </div>
            </div>
          </div>
        </>
      )}

      {selectedFoods.length === 0 && (
        <div className="card p-8 text-center text-slate-500">
          <div className="text-4xl mb-2">🥗</div>
          {t('tools.nutritionCalculator.noFoods')}
        </div>
      )}
    </div>
  )
}
