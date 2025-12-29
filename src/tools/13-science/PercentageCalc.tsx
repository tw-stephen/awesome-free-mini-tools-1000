import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function PercentageCalc() {
  const { t } = useTranslation()

  // What is X% of Y?
  const [percentOf, setPercentOf] = useState({ percent: 25, number: 200 })

  // X is what % of Y?
  const [whatPercent, setWhatPercent] = useState({ part: 50, whole: 200 })

  // Percentage change
  const [percentChange, setPercentChange] = useState({ from: 100, to: 125 })

  // Percentage increase/decrease
  const [percentAdjust, setPercentAdjust] = useState({ number: 100, percent: 15, isIncrease: true })

  const calculatePercentOf = () => {
    return (percentOf.percent / 100) * percentOf.number
  }

  const calculateWhatPercent = () => {
    return (whatPercent.part / whatPercent.whole) * 100
  }

  const calculatePercentChange = () => {
    return ((percentChange.to - percentChange.from) / percentChange.from) * 100
  }

  const calculateAdjusted = () => {
    const multiplier = percentAdjust.isIncrease
      ? 1 + percentAdjust.percent / 100
      : 1 - percentAdjust.percent / 100
    return percentAdjust.number * multiplier
  }

  return (
    <div className="space-y-4">
      {/* What is X% of Y? */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.percentageCalc.whatIsXPercentOfY')}</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <span>{t('tools.percentageCalc.whatIs')}</span>
          <input
            type="number"
            value={percentOf.percent}
            onChange={(e) => setPercentOf({ ...percentOf, percent: parseFloat(e.target.value) || 0 })}
            className="w-20 px-2 py-1 border border-slate-300 rounded text-center"
          />
          <span>%</span>
          <span>{t('tools.percentageCalc.of')}</span>
          <input
            type="number"
            value={percentOf.number}
            onChange={(e) => setPercentOf({ ...percentOf, number: parseFloat(e.target.value) || 0 })}
            className="w-24 px-2 py-1 border border-slate-300 rounded text-center"
          />
          <span>=</span>
          <span className="text-xl font-bold text-blue-600">{calculatePercentOf().toFixed(4)}</span>
        </div>
      </div>

      {/* X is what % of Y? */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.percentageCalc.xIsWhatPercentOfY')}</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="number"
            value={whatPercent.part}
            onChange={(e) => setWhatPercent({ ...whatPercent, part: parseFloat(e.target.value) || 0 })}
            className="w-24 px-2 py-1 border border-slate-300 rounded text-center"
          />
          <span>{t('tools.percentageCalc.isWhatPercentOf')}</span>
          <input
            type="number"
            value={whatPercent.whole}
            onChange={(e) => setWhatPercent({ ...whatPercent, whole: parseFloat(e.target.value) || 1 })}
            className="w-24 px-2 py-1 border border-slate-300 rounded text-center"
          />
          <span>=</span>
          <span className="text-xl font-bold text-green-600">{calculateWhatPercent().toFixed(4)}%</span>
        </div>
      </div>

      {/* Percentage Change */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.percentageCalc.percentageChange')}</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <span>{t('tools.percentageCalc.from')}</span>
          <input
            type="number"
            value={percentChange.from}
            onChange={(e) => setPercentChange({ ...percentChange, from: parseFloat(e.target.value) || 1 })}
            className="w-24 px-2 py-1 border border-slate-300 rounded text-center"
          />
          <span>{t('tools.percentageCalc.to')}</span>
          <input
            type="number"
            value={percentChange.to}
            onChange={(e) => setPercentChange({ ...percentChange, to: parseFloat(e.target.value) || 0 })}
            className="w-24 px-2 py-1 border border-slate-300 rounded text-center"
          />
          <span>=</span>
          <span className={`text-xl font-bold ${calculatePercentChange() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {calculatePercentChange() >= 0 ? '+' : ''}{calculatePercentChange().toFixed(4)}%
          </span>
        </div>
      </div>

      {/* Percentage Increase/Decrease */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.percentageCalc.percentageAdjust')}</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="number"
            value={percentAdjust.number}
            onChange={(e) => setPercentAdjust({ ...percentAdjust, number: parseFloat(e.target.value) || 0 })}
            className="w-24 px-2 py-1 border border-slate-300 rounded text-center"
          />
          <select
            value={percentAdjust.isIncrease ? 'increase' : 'decrease'}
            onChange={(e) => setPercentAdjust({ ...percentAdjust, isIncrease: e.target.value === 'increase' })}
            className="px-2 py-1 border border-slate-300 rounded"
          >
            <option value="increase">{t('tools.percentageCalc.increasedBy')}</option>
            <option value="decrease">{t('tools.percentageCalc.decreasedBy')}</option>
          </select>
          <input
            type="number"
            value={percentAdjust.percent}
            onChange={(e) => setPercentAdjust({ ...percentAdjust, percent: parseFloat(e.target.value) || 0 })}
            className="w-20 px-2 py-1 border border-slate-300 rounded text-center"
          />
          <span>%</span>
          <span>=</span>
          <span className="text-xl font-bold text-purple-600">{calculateAdjusted().toFixed(4)}</span>
        </div>
      </div>

      {/* Quick Reference */}
      <div className="card p-4 bg-blue-50">
        <h3 className="font-medium mb-2">{t('tools.percentageCalc.quickReference')}</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="p-2 bg-white rounded">
            <div className="text-xs text-slate-500">{t('tools.percentageCalc.formula1')}</div>
            <div className="font-mono">X% of Y = (X/100) x Y</div>
          </div>
          <div className="p-2 bg-white rounded">
            <div className="text-xs text-slate-500">{t('tools.percentageCalc.formula2')}</div>
            <div className="font-mono">% = (Part/Whole) x 100</div>
          </div>
          <div className="p-2 bg-white rounded">
            <div className="text-xs text-slate-500">{t('tools.percentageCalc.formula3')}</div>
            <div className="font-mono">% Change = ((New-Old)/Old) x 100</div>
          </div>
          <div className="p-2 bg-white rounded">
            <div className="text-xs text-slate-500">{t('tools.percentageCalc.formula4')}</div>
            <div className="font-mono">Y + X% = Y x (1 + X/100)</div>
          </div>
        </div>
      </div>

      {/* Common Percentages */}
      <div className="card p-4">
        <h3 className="font-medium mb-2">{t('tools.percentageCalc.commonPercentages')}</h3>
        <div className="grid grid-cols-4 gap-2 text-sm">
          <div className="text-center p-2 bg-slate-50 rounded">
            <div className="font-bold">10%</div>
            <div className="text-xs text-slate-500">= 1/10</div>
          </div>
          <div className="text-center p-2 bg-slate-50 rounded">
            <div className="font-bold">25%</div>
            <div className="text-xs text-slate-500">= 1/4</div>
          </div>
          <div className="text-center p-2 bg-slate-50 rounded">
            <div className="font-bold">33.3%</div>
            <div className="text-xs text-slate-500">= 1/3</div>
          </div>
          <div className="text-center p-2 bg-slate-50 rounded">
            <div className="font-bold">50%</div>
            <div className="text-xs text-slate-500">= 1/2</div>
          </div>
          <div className="text-center p-2 bg-slate-50 rounded">
            <div className="font-bold">66.7%</div>
            <div className="text-xs text-slate-500">= 2/3</div>
          </div>
          <div className="text-center p-2 bg-slate-50 rounded">
            <div className="font-bold">75%</div>
            <div className="text-xs text-slate-500">= 3/4</div>
          </div>
          <div className="text-center p-2 bg-slate-50 rounded">
            <div className="font-bold">80%</div>
            <div className="text-xs text-slate-500">= 4/5</div>
          </div>
          <div className="text-center p-2 bg-slate-50 rounded">
            <div className="font-bold">100%</div>
            <div className="text-xs text-slate-500">= 1</div>
          </div>
        </div>
      </div>
    </div>
  )
}
