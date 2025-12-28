import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface NutritionInfo {
  name: string
  serving: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  sugar: number
  sodium: number
}

export default function NutritionFactsLookup() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFood, setSelectedFood] = useState<NutritionInfo | null>(null)
  const [servings, setServings] = useState(1)

  const foodDatabase: NutritionInfo[] = [
    { name: 'Apple', serving: '1 medium (182g)', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4, sugar: 19, sodium: 2 },
    { name: 'Banana', serving: '1 medium (118g)', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, sugar: 14, sodium: 1 },
    { name: 'Orange', serving: '1 medium (131g)', calories: 62, protein: 1.2, carbs: 15, fat: 0.2, fiber: 3.1, sugar: 12, sodium: 0 },
    { name: 'Chicken Breast', serving: '100g cooked', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, sodium: 74 },
    { name: 'Salmon', serving: '100g cooked', calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, sugar: 0, sodium: 59 },
    { name: 'Egg', serving: '1 large (50g)', calories: 78, protein: 6, carbs: 0.6, fat: 5, fiber: 0, sugar: 0.6, sodium: 62 },
    { name: 'Rice (White)', serving: '1 cup cooked (158g)', calories: 206, protein: 4.3, carbs: 45, fat: 0.4, fiber: 0.6, sugar: 0, sodium: 2 },
    { name: 'Rice (Brown)', serving: '1 cup cooked (195g)', calories: 216, protein: 5, carbs: 45, fat: 1.8, fiber: 3.5, sugar: 0, sodium: 10 },
    { name: 'Bread (White)', serving: '1 slice (25g)', calories: 67, protein: 2, carbs: 13, fat: 0.8, fiber: 0.6, sugar: 1.3, sodium: 130 },
    { name: 'Bread (Whole Wheat)', serving: '1 slice (28g)', calories: 69, protein: 3.6, carbs: 12, fat: 1, fiber: 1.9, sugar: 1.4, sodium: 132 },
    { name: 'Milk (Whole)', serving: '1 cup (244ml)', calories: 149, protein: 8, carbs: 12, fat: 8, fiber: 0, sugar: 12, sodium: 105 },
    { name: 'Milk (Skim)', serving: '1 cup (245ml)', calories: 83, protein: 8, carbs: 12, fat: 0.2, fiber: 0, sugar: 12, sodium: 103 },
    { name: 'Greek Yogurt', serving: '1 cup (245g)', calories: 100, protein: 17, carbs: 6, fat: 0.7, fiber: 0, sugar: 4, sodium: 65 },
    { name: 'Cheese (Cheddar)', serving: '1 oz (28g)', calories: 113, protein: 7, carbs: 0.4, fat: 9, fiber: 0, sugar: 0.1, sodium: 174 },
    { name: 'Broccoli', serving: '1 cup chopped (91g)', calories: 31, protein: 2.5, carbs: 6, fat: 0.3, fiber: 2.4, sugar: 1.5, sodium: 30 },
    { name: 'Spinach', serving: '1 cup raw (30g)', calories: 7, protein: 0.9, carbs: 1.1, fat: 0.1, fiber: 0.7, sugar: 0.1, sodium: 24 },
    { name: 'Carrot', serving: '1 medium (61g)', calories: 25, protein: 0.6, carbs: 6, fat: 0.1, fiber: 1.7, sugar: 2.9, sodium: 42 },
    { name: 'Potato', serving: '1 medium (150g)', calories: 110, protein: 3, carbs: 26, fat: 0.1, fiber: 2.4, sugar: 1.7, sodium: 8 },
    { name: 'Sweet Potato', serving: '1 medium (130g)', calories: 103, protein: 2.3, carbs: 24, fat: 0.1, fiber: 3.8, sugar: 7, sodium: 41 },
    { name: 'Avocado', serving: '1/2 medium (68g)', calories: 114, protein: 1.4, carbs: 6, fat: 10, fiber: 4.6, sugar: 0.2, sodium: 5 },
    { name: 'Almonds', serving: '1 oz (28g)', calories: 164, protein: 6, carbs: 6, fat: 14, fiber: 3.5, sugar: 1.2, sodium: 0 },
    { name: 'Peanut Butter', serving: '2 tbsp (32g)', calories: 188, protein: 8, carbs: 6, fat: 16, fiber: 1.9, sugar: 3, sodium: 136 },
    { name: 'Oatmeal', serving: '1 cup cooked (234g)', calories: 154, protein: 6, carbs: 28, fat: 2.6, fiber: 4, sugar: 0.6, sodium: 2 },
    { name: 'Pasta', serving: '1 cup cooked (140g)', calories: 220, protein: 8, carbs: 43, fat: 1.3, fiber: 2.5, sugar: 0.8, sodium: 1 },
    { name: 'Tofu', serving: '1/2 cup (126g)', calories: 94, protein: 10, carbs: 2.3, fat: 5, fiber: 0.4, sugar: 0.5, sodium: 9 },
    { name: 'Beef (Ground 85%)', serving: '100g cooked', calories: 250, protein: 26, carbs: 0, fat: 15, fiber: 0, sugar: 0, sodium: 72 },
    { name: 'Tuna (Canned)', serving: '100g drained', calories: 116, protein: 26, carbs: 0, fat: 0.8, fiber: 0, sugar: 0, sodium: 338 },
    { name: 'Shrimp', serving: '100g cooked', calories: 99, protein: 24, carbs: 0.2, fat: 0.3, fiber: 0, sugar: 0, sodium: 111 },
    { name: 'Coffee (Black)', serving: '1 cup (240ml)', calories: 2, protein: 0.3, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 5 },
    { name: 'Orange Juice', serving: '1 cup (248ml)', calories: 112, protein: 1.7, carbs: 26, fat: 0.5, fiber: 0.5, sugar: 21, sodium: 2 },
  ]

  const filteredFoods = foodDatabase.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getScaledValue = (value: number) => Math.round(value * servings * 10) / 10

  const getDailyPercent = (value: number, daily: number) => Math.round((value * servings / daily) * 100)

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t('tools.nutritionFactsLookup.searchPlaceholder')}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg text-lg"
        />
      </div>

      {searchTerm && !selectedFood && (
        <div className="card p-2 max-h-64 overflow-y-auto">
          {filteredFoods.length === 0 ? (
            <div className="p-4 text-center text-slate-500">
              {t('tools.nutritionFactsLookup.noResults')}
            </div>
          ) : (
            filteredFoods.map(food => (
              <button
                key={food.name}
                onClick={() => { setSelectedFood(food); setSearchTerm('') }}
                className="w-full p-3 text-left hover:bg-slate-50 rounded"
              >
                <div className="font-medium">{food.name}</div>
                <div className="text-xs text-slate-500">{food.serving} • {food.calories} cal</div>
              </button>
            ))
          )}
        </div>
      )}

      {selectedFood && (
        <>
          <div className="card p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold">{selectedFood.name}</h2>
                <div className="text-sm text-slate-500">{selectedFood.serving}</div>
              </div>
              <button
                onClick={() => setSelectedFood(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('tools.nutritionFactsLookup.servings')}
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setServings(Math.max(0.5, servings - 0.5))}
                  className="w-10 h-10 bg-slate-100 rounded font-bold"
                >
                  -
                </button>
                <input
                  type="number"
                  value={servings}
                  onChange={(e) => setServings(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                  step={0.5}
                  className="w-20 text-center px-3 py-2 border border-slate-300 rounded"
                />
                <button
                  onClick={() => setServings(servings + 0.5)}
                  className="w-10 h-10 bg-slate-100 rounded font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="border-t-8 border-b-4 border-slate-800 py-2">
              <div className="text-2xl font-black">{t('tools.nutritionFactsLookup.nutritionFacts')}</div>
            </div>

            <div className="border-b border-slate-800 py-1">
              <div className="text-sm">{t('tools.nutritionFactsLookup.servingSize')} {selectedFood.serving}</div>
            </div>

            <div className="border-b-8 border-slate-800 py-2">
              <div className="flex justify-between items-end">
                <span className="font-bold">{t('tools.nutritionFactsLookup.calories')}</span>
                <span className="text-3xl font-black">{getScaledValue(selectedFood.calories)}</span>
              </div>
            </div>

            <div className="text-right text-xs border-b border-slate-300 py-1">
              {t('tools.nutritionFactsLookup.dailyValue')}
            </div>

            <div className="border-b border-slate-300 py-1 flex justify-between">
              <span><span className="font-bold">{t('tools.nutritionFactsLookup.totalFat')}</span> {getScaledValue(selectedFood.fat)}g</span>
              <span className="font-bold">{getDailyPercent(selectedFood.fat, 65)}%</span>
            </div>

            <div className="border-b border-slate-300 py-1 flex justify-between">
              <span><span className="font-bold">{t('tools.nutritionFactsLookup.totalCarbs')}</span> {getScaledValue(selectedFood.carbs)}g</span>
              <span className="font-bold">{getDailyPercent(selectedFood.carbs, 300)}%</span>
            </div>

            <div className="border-b border-slate-300 py-1 pl-4 flex justify-between">
              <span>{t('tools.nutritionFactsLookup.fiber')} {getScaledValue(selectedFood.fiber)}g</span>
              <span className="font-bold">{getDailyPercent(selectedFood.fiber, 25)}%</span>
            </div>

            <div className="border-b border-slate-300 py-1 pl-4">
              <span>{t('tools.nutritionFactsLookup.sugars')} {getScaledValue(selectedFood.sugar)}g</span>
            </div>

            <div className="border-b border-slate-300 py-1 flex justify-between">
              <span><span className="font-bold">{t('tools.nutritionFactsLookup.protein')}</span> {getScaledValue(selectedFood.protein)}g</span>
              <span className="font-bold">{getDailyPercent(selectedFood.protein, 50)}%</span>
            </div>

            <div className="border-b-4 border-slate-800 py-1 flex justify-between">
              <span><span className="font-bold">{t('tools.nutritionFactsLookup.sodium')}</span> {getScaledValue(selectedFood.sodium)}mg</span>
              <span className="font-bold">{getDailyPercent(selectedFood.sodium, 2300)}%</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="card p-3 text-center bg-yellow-50">
              <div className="text-xl font-bold text-yellow-600">{getScaledValue(selectedFood.fat)}g</div>
              <div className="text-xs text-slate-500">{t('tools.nutritionFactsLookup.fat')}</div>
            </div>
            <div className="card p-3 text-center bg-blue-50">
              <div className="text-xl font-bold text-blue-600">{getScaledValue(selectedFood.carbs)}g</div>
              <div className="text-xs text-slate-500">{t('tools.nutritionFactsLookup.carbs')}</div>
            </div>
            <div className="card p-3 text-center bg-red-50">
              <div className="text-xl font-bold text-red-600">{getScaledValue(selectedFood.protein)}g</div>
              <div className="text-xs text-slate-500">{t('tools.nutritionFactsLookup.protein')}</div>
            </div>
          </div>
        </>
      )}

      {!searchTerm && !selectedFood && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.nutritionFactsLookup.popularFoods')}</h3>
          <div className="flex flex-wrap gap-2">
            {foodDatabase.slice(0, 12).map(food => (
              <button
                key={food.name}
                onClick={() => setSelectedFood(food)}
                className="px-3 py-1.5 bg-slate-100 rounded text-sm hover:bg-slate-200"
              >
                {food.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
