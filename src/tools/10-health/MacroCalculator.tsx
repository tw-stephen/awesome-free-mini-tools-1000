import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function MacroCalculator() {
  const { t } = useTranslation()
  const [calories, setCalories] = useState('')
  const [goal, setGoal] = useState<'maintain' | 'lose' | 'gain' | 'keto'>('maintain')
  const [result, setResult] = useState<{
    protein: { grams: number; calories: number; percent: number }
    carbs: { grams: number; calories: number; percent: number }
    fat: { grams: number; calories: number; percent: number }
  } | null>(null)

  const goals = [
    { id: 'maintain', ratios: { protein: 0.30, carbs: 0.40, fat: 0.30 } },
    { id: 'lose', ratios: { protein: 0.40, carbs: 0.30, fat: 0.30 } },
    { id: 'gain', ratios: { protein: 0.30, carbs: 0.50, fat: 0.20 } },
    { id: 'keto', ratios: { protein: 0.25, carbs: 0.05, fat: 0.70 } },
  ]

  const calculate = () => {
    const cal = parseInt(calories)
    if (isNaN(cal) || cal <= 0) return

    const selectedGoal = goals.find(g => g.id === goal)
    if (!selectedGoal) return

    const { protein: proteinRatio, carbs: carbsRatio, fat: fatRatio } = selectedGoal.ratios

    const proteinCal = cal * proteinRatio
    const carbsCal = cal * carbsRatio
    const fatCal = cal * fatRatio

    setResult({
      protein: {
        grams: Math.round(proteinCal / 4),
        calories: Math.round(proteinCal),
        percent: Math.round(proteinRatio * 100),
      },
      carbs: {
        grams: Math.round(carbsCal / 4),
        calories: Math.round(carbsCal),
        percent: Math.round(carbsRatio * 100),
      },
      fat: {
        grams: Math.round(fatCal / 9),
        calories: Math.round(fatCal),
        percent: Math.round(fatRatio * 100),
      },
    })
  }

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.macroCalculator.dailyCalories')}
          </label>
          <input
            type="number"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            placeholder="2000"
            className="w-full px-3 py-2 border border-slate-300 rounded text-lg"
          />
          <p className="text-xs text-slate-500 mt-1">
            {t('tools.macroCalculator.useTdee')}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {t('tools.macroCalculator.goal')}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {goals.map(g => (
              <button
                key={g.id}
                onClick={() => setGoal(g.id as typeof goal)}
                className={`p-3 rounded text-center ${
                  goal === g.id ? 'bg-blue-500 text-white' : 'bg-slate-100'
                }`}
              >
                <div className="font-medium">{t(`tools.macroCalculator.${g.id}`)}</div>
                <div className="text-xs opacity-80">
                  P:{Math.round(g.ratios.protein * 100)} C:{Math.round(g.ratios.carbs * 100)} F:{Math.round(g.ratios.fat * 100)}
                </div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={calculate}
          disabled={!calories}
          className="w-full py-2 bg-blue-500 text-white rounded font-medium disabled:opacity-50"
        >
          {t('tools.macroCalculator.calculate')}
        </button>
      </div>

      {result && (
        <>
          <div className="card p-4">
            <div className="flex h-8 rounded-full overflow-hidden mb-4">
              <div className="bg-red-500" style={{ width: `${result.protein.percent}%` }} />
              <div className="bg-yellow-500" style={{ width: `${result.carbs.percent}%` }} />
              <div className="bg-blue-500" style={{ width: `${result.fat.percent}%` }} />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded">
                <div className="w-4 h-4 bg-red-500 rounded-full" />
                <div className="flex-1">
                  <div className="font-medium">{t('tools.macroCalculator.protein')}</div>
                  <div className="text-sm text-slate-500">{result.protein.calories} cal</div>
                </div>
                <div className="text-2xl font-bold text-red-600">{result.protein.grams}g</div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded">
                <div className="w-4 h-4 bg-yellow-500 rounded-full" />
                <div className="flex-1">
                  <div className="font-medium">{t('tools.macroCalculator.carbs')}</div>
                  <div className="text-sm text-slate-500">{result.carbs.calories} cal</div>
                </div>
                <div className="text-2xl font-bold text-yellow-600">{result.carbs.grams}g</div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded">
                <div className="w-4 h-4 bg-blue-500 rounded-full" />
                <div className="flex-1">
                  <div className="font-medium">{t('tools.macroCalculator.fat')}</div>
                  <div className="text-sm text-slate-500">{result.fat.calories} cal</div>
                </div>
                <div className="text-2xl font-bold text-blue-600">{result.fat.grams}g</div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.macroCalculator.summary')}</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500">
                  <th className="text-left py-1">{t('tools.macroCalculator.macro')}</th>
                  <th className="text-right">{t('tools.macroCalculator.grams')}</th>
                  <th className="text-right">{t('tools.macroCalculator.calories')}</th>
                  <th className="text-right">%</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-1">{t('tools.macroCalculator.protein')}</td>
                  <td className="text-right">{result.protein.grams}g</td>
                  <td className="text-right">{result.protein.calories}</td>
                  <td className="text-right">{result.protein.percent}%</td>
                </tr>
                <tr>
                  <td className="py-1">{t('tools.macroCalculator.carbs')}</td>
                  <td className="text-right">{result.carbs.grams}g</td>
                  <td className="text-right">{result.carbs.calories}</td>
                  <td className="text-right">{result.carbs.percent}%</td>
                </tr>
                <tr>
                  <td className="py-1">{t('tools.macroCalculator.fat')}</td>
                  <td className="text-right">{result.fat.grams}g</td>
                  <td className="text-right">{result.fat.calories}</td>
                  <td className="text-right">{result.fat.percent}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="card p-4 bg-blue-50">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.macroCalculator.tips')}</h3>
        <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.macroCalculator.tip1')}</li>
          <li>{t('tools.macroCalculator.tip2')}</li>
          <li>{t('tools.macroCalculator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
