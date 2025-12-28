import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Asset {
  id: number
  name: string
  value: number
  category: string
}

interface Liability {
  id: number
  name: string
  value: number
  category: string
}

interface Snapshot {
  date: string
  netWorth: number
  assets: number
  liabilities: number
}

export default function NetWorthCalculator() {
  const { t } = useTranslation()
  const [assets, setAssets] = useState<Asset[]>([])
  const [liabilities, setLiabilities] = useState<Liability[]>([])
  const [snapshots, setSnapshots] = useState<Snapshot[]>([])
  const [newAsset, setNewAsset] = useState({ name: '', value: '', category: 'Cash' })
  const [newLiability, setNewLiability] = useState({ name: '', value: '', category: 'Loans' })
  const [showAddAsset, setShowAddAsset] = useState(false)
  const [showAddLiability, setShowAddLiability] = useState(false)

  const assetCategories = ['Cash', 'Investments', 'Real Estate', 'Vehicles', 'Retirement', 'Other']
  const liabilityCategories = ['Loans', 'Mortgage', 'Credit Card', 'Student Loans', 'Other']

  useEffect(() => {
    const saved = localStorage.getItem('net-worth-calculator')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setAssets(data.assets || [])
        setLiabilities(data.liabilities || [])
        setSnapshots(data.snapshots || [])
      } catch (e) {
        console.error('Failed to load data')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('net-worth-calculator', JSON.stringify({
      assets,
      liabilities,
      snapshots,
    }))
  }, [assets, liabilities, snapshots])

  const addAsset = () => {
    if (!newAsset.name || !newAsset.value) return
    setAssets([...assets, {
      id: Date.now(),
      name: newAsset.name,
      value: parseFloat(newAsset.value) || 0,
      category: newAsset.category,
    }])
    setNewAsset({ name: '', value: '', category: 'Cash' })
    setShowAddAsset(false)
  }

  const addLiability = () => {
    if (!newLiability.name || !newLiability.value) return
    setLiabilities([...liabilities, {
      id: Date.now(),
      name: newLiability.name,
      value: parseFloat(newLiability.value) || 0,
      category: newLiability.category,
    }])
    setNewLiability({ name: '', value: '', category: 'Loans' })
    setShowAddLiability(false)
  }

  const deleteAsset = (id: number) => setAssets(assets.filter(a => a.id !== id))
  const deleteLiability = (id: number) => setLiabilities(liabilities.filter(l => l.id !== id))

  const totals = useMemo(() => {
    const totalAssets = assets.reduce((sum, a) => sum + a.value, 0)
    const totalLiabilities = liabilities.reduce((sum, l) => sum + l.value, 0)
    const netWorth = totalAssets - totalLiabilities

    const assetsByCategory: Record<string, number> = {}
    assets.forEach(a => {
      assetsByCategory[a.category] = (assetsByCategory[a.category] || 0) + a.value
    })

    const liabilitiesByCategory: Record<string, number> = {}
    liabilities.forEach(l => {
      liabilitiesByCategory[l.category] = (liabilitiesByCategory[l.category] || 0) + l.value
    })

    return { totalAssets, totalLiabilities, netWorth, assetsByCategory, liabilitiesByCategory }
  }, [assets, liabilities])

  const saveSnapshot = () => {
    const today = new Date().toISOString().split('T')[0]
    const existingIndex = snapshots.findIndex(s => s.date === today)
    const snapshot: Snapshot = {
      date: today,
      netWorth: totals.netWorth,
      assets: totals.totalAssets,
      liabilities: totals.totalLiabilities,
    }
    if (existingIndex >= 0) {
      const updated = [...snapshots]
      updated[existingIndex] = snapshot
      setSnapshots(updated)
    } else {
      setSnapshots([...snapshots, snapshot])
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getChange = () => {
    if (snapshots.length < 2) return null
    const sorted = [...snapshots].sort((a, b) => a.date.localeCompare(b.date))
    const lastTwo = sorted.slice(-2)
    return lastTwo[1].netWorth - lastTwo[0].netWorth
  }

  const change = getChange()

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="text-center mb-4">
          <div className="text-sm text-slate-500">{t('tools.netWorth.netWorth')}</div>
          <div className={`text-4xl font-bold ${totals.netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(totals.netWorth)}
          </div>
          {change !== null && (
            <div className={`text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {change >= 0 ? '↑' : '↓'} {formatCurrency(Math.abs(change))} since last snapshot
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-green-50 rounded text-center">
            <div className="text-xl font-bold text-green-600">{formatCurrency(totals.totalAssets)}</div>
            <div className="text-xs text-slate-500">{t('tools.netWorth.totalAssets')}</div>
          </div>
          <div className="p-3 bg-red-50 rounded text-center">
            <div className="text-xl font-bold text-red-600">{formatCurrency(totals.totalLiabilities)}</div>
            <div className="text-xs text-slate-500">{t('tools.netWorth.totalLiabilities')}</div>
          </div>
        </div>

        <button
          onClick={saveSnapshot}
          className="w-full mt-4 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
        >
          {t('tools.netWorth.saveSnapshot')}
        </button>
      </div>

      <div className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-slate-700">{t('tools.netWorth.assets')}</h3>
          <button
            onClick={() => setShowAddAsset(!showAddAsset)}
            className="text-blue-500 text-sm"
          >
            + {t('tools.netWorth.add')}
          </button>
        </div>

        {showAddAsset && (
          <div className="space-y-2 mb-4 p-3 bg-slate-50 rounded">
            <input
              type="text"
              value={newAsset.name}
              onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
              placeholder={t('tools.netWorth.assetName')}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={newAsset.value}
                onChange={(e) => setNewAsset({ ...newAsset, value: e.target.value })}
                placeholder={t('tools.netWorth.value')}
                className="px-3 py-2 border border-slate-300 rounded text-sm"
              />
              <select
                value={newAsset.category}
                onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded text-sm"
              >
                {assetCategories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <button
              onClick={addAsset}
              className="w-full py-2 bg-green-500 text-white rounded text-sm"
            >
              {t('tools.netWorth.addAsset')}
            </button>
          </div>
        )}

        {assets.length === 0 ? (
          <p className="text-sm text-slate-500">{t('tools.netWorth.noAssets')}</p>
        ) : (
          <div className="space-y-2">
            {assets.map(asset => (
              <div key={asset.id} className="flex items-center justify-between p-2 bg-green-50 rounded">
                <div>
                  <div className="font-medium text-sm">{asset.name}</div>
                  <div className="text-xs text-slate-500">{asset.category}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-medium">{formatCurrency(asset.value)}</span>
                  <button onClick={() => deleteAsset(asset.id)} className="text-slate-400 hover:text-red-500">×</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-slate-700">{t('tools.netWorth.liabilities')}</h3>
          <button
            onClick={() => setShowAddLiability(!showAddLiability)}
            className="text-blue-500 text-sm"
          >
            + {t('tools.netWorth.add')}
          </button>
        </div>

        {showAddLiability && (
          <div className="space-y-2 mb-4 p-3 bg-slate-50 rounded">
            <input
              type="text"
              value={newLiability.name}
              onChange={(e) => setNewLiability({ ...newLiability, name: e.target.value })}
              placeholder={t('tools.netWorth.liabilityName')}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={newLiability.value}
                onChange={(e) => setNewLiability({ ...newLiability, value: e.target.value })}
                placeholder={t('tools.netWorth.value')}
                className="px-3 py-2 border border-slate-300 rounded text-sm"
              />
              <select
                value={newLiability.category}
                onChange={(e) => setNewLiability({ ...newLiability, category: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded text-sm"
              >
                {liabilityCategories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <button
              onClick={addLiability}
              className="w-full py-2 bg-red-500 text-white rounded text-sm"
            >
              {t('tools.netWorth.addLiability')}
            </button>
          </div>
        )}

        {liabilities.length === 0 ? (
          <p className="text-sm text-slate-500">{t('tools.netWorth.noLiabilities')}</p>
        ) : (
          <div className="space-y-2">
            {liabilities.map(liability => (
              <div key={liability.id} className="flex items-center justify-between p-2 bg-red-50 rounded">
                <div>
                  <div className="font-medium text-sm">{liability.name}</div>
                  <div className="text-xs text-slate-500">{liability.category}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600 font-medium">-{formatCurrency(liability.value)}</span>
                  <button onClick={() => deleteLiability(liability.id)} className="text-slate-400 hover:text-red-500">×</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {snapshots.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.netWorth.history')}</h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {[...snapshots].reverse().slice(0, 5).map((s, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-slate-500">{s.date}</span>
                <span className={s.netWorth >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatCurrency(s.netWorth)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.netWorth.tips')}</h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.netWorth.tip1')}</li>
          <li>{t('tools.netWorth.tip2')}</li>
          <li>{t('tools.netWorth.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
