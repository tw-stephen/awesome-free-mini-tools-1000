import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Item {
  id: number
  name: string
  value: number
}

export default function NetWorthCalculator() {
  const { t } = useTranslation()
  const [assets, setAssets] = useState<Item[]>([
    { id: 1, name: 'Cash & Savings', value: 0 },
    { id: 2, name: 'Investments', value: 0 },
    { id: 3, name: 'Real Estate', value: 0 },
    { id: 4, name: 'Vehicles', value: 0 },
    { id: 5, name: 'Other Assets', value: 0 },
  ])
  const [liabilities, setLiabilities] = useState<Item[]>([
    { id: 1, name: 'Mortgage', value: 0 },
    { id: 2, name: 'Car Loans', value: 0 },
    { id: 3, name: 'Student Loans', value: 0 },
    { id: 4, name: 'Credit Cards', value: 0 },
    { id: 5, name: 'Other Debts', value: 0 },
  ])
  const [newAsset, setNewAsset] = useState('')
  const [newLiability, setNewLiability] = useState('')

  const updateAsset = (id: number, value: number) => {
    setAssets(assets.map(a => a.id === id ? { ...a, value } : a))
  }

  const updateLiability = (id: number, value: number) => {
    setLiabilities(liabilities.map(l => l.id === id ? { ...l, value } : l))
  }

  const addAsset = () => {
    if (!newAsset) return
    setAssets([...assets, { id: Date.now(), name: newAsset, value: 0 }])
    setNewAsset('')
  }

  const addLiability = () => {
    if (!newLiability) return
    setLiabilities([...liabilities, { id: Date.now(), name: newLiability, value: 0 }])
    setNewLiability('')
  }

  const deleteAsset = (id: number) => {
    setAssets(assets.filter(a => a.id !== id))
  }

  const deleteLiability = (id: number) => {
    setLiabilities(liabilities.filter(l => l.id !== id))
  }

  const stats = useMemo(() => {
    const totalAssets = assets.reduce((sum, a) => sum + a.value, 0)
    const totalLiabilities = liabilities.reduce((sum, l) => sum + l.value, 0)
    const netWorth = totalAssets - totalLiabilities
    return { totalAssets, totalLiabilities, netWorth }
  }, [assets, liabilities])

  return (
    <div className="space-y-4">
      <div className={`card p-4 text-center ${stats.netWorth >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
        <div className="text-sm text-slate-600">{t('tools.netWorthCalculator.netWorth')}</div>
        <div className={`text-3xl font-bold ${stats.netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          ${stats.netWorth.toLocaleString()}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="card p-3 bg-green-50 text-center">
          <div className="text-sm text-slate-600">{t('tools.netWorthCalculator.totalAssets')}</div>
          <div className="text-xl font-bold text-green-600">${stats.totalAssets.toLocaleString()}</div>
        </div>
        <div className="card p-3 bg-red-50 text-center">
          <div className="text-sm text-slate-600">{t('tools.netWorthCalculator.totalLiabilities')}</div>
          <div className="text-xl font-bold text-red-600">${stats.totalLiabilities.toLocaleString()}</div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-green-700 mb-3">
          {t('tools.netWorthCalculator.assets')}
        </h3>
        <div className="space-y-2">
          {assets.map(asset => (
            <div key={asset.id} className="flex gap-2 items-center">
              <span className="flex-1 text-sm">{asset.name}</span>
              <input
                type="number"
                value={asset.value || ''}
                onChange={(e) => updateAsset(asset.id, parseFloat(e.target.value) || 0)}
                className="w-28 px-2 py-1 border border-slate-300 rounded text-sm text-right"
              />
              <button
                onClick={() => deleteAsset(asset.id)}
                className="text-slate-400 hover:text-red-500"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          <input
            type="text"
            value={newAsset}
            onChange={(e) => setNewAsset(e.target.value)}
            placeholder={t('tools.netWorthCalculator.addAsset')}
            className="flex-1 px-3 py-1 border border-slate-300 rounded text-sm"
          />
          <button
            onClick={addAsset}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            +
          </button>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-red-700 mb-3">
          {t('tools.netWorthCalculator.liabilities')}
        </h3>
        <div className="space-y-2">
          {liabilities.map(liability => (
            <div key={liability.id} className="flex gap-2 items-center">
              <span className="flex-1 text-sm">{liability.name}</span>
              <input
                type="number"
                value={liability.value || ''}
                onChange={(e) => updateLiability(liability.id, parseFloat(e.target.value) || 0)}
                className="w-28 px-2 py-1 border border-slate-300 rounded text-sm text-right"
              />
              <button
                onClick={() => deleteLiability(liability.id)}
                className="text-slate-400 hover:text-red-500"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          <input
            type="text"
            value={newLiability}
            onChange={(e) => setNewLiability(e.target.value)}
            placeholder={t('tools.netWorthCalculator.addLiability')}
            className="flex-1 px-3 py-1 border border-slate-300 rounded text-sm"
          />
          <button
            onClick={addLiability}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}
