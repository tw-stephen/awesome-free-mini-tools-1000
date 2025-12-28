import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Asset {
  id: string
  name: string
  category: 'cash' | 'investments' | 'property' | 'vehicles' | 'retirement' | 'other'
  value: number
  notes: string
}

interface Liability {
  id: string
  name: string
  category: 'mortgage' | 'auto' | 'student' | 'credit' | 'personal' | 'other'
  balance: number
  interestRate: number
  monthlyPayment: number
  notes: string
}

interface Snapshot {
  date: string
  assets: number
  liabilities: number
  netWorth: number
}

export default function NetWorthTracker() {
  const { t } = useTranslation()
  const [assets, setAssets] = useState<Asset[]>([])
  const [liabilities, setLiabilities] = useState<Liability[]>([])
  const [snapshots, setSnapshots] = useState<Snapshot[]>([])
  const [activeTab, setActiveTab] = useState<'assets' | 'liabilities' | 'history'>('assets')
  const [showAssetForm, setShowAssetForm] = useState(false)
  const [showLiabilityForm, setShowLiabilityForm] = useState(false)
  const [editingAssetId, setEditingAssetId] = useState<string | null>(null)
  const [editingLiabilityId, setEditingLiabilityId] = useState<string | null>(null)

  const [assetForm, setAssetForm] = useState({
    name: '',
    category: 'cash' as Asset['category'],
    value: 0,
    notes: ''
  })

  const [liabilityForm, setLiabilityForm] = useState({
    name: '',
    category: 'credit' as Liability['category'],
    balance: 0,
    interestRate: 0,
    monthlyPayment: 0,
    notes: ''
  })

  const assetCategories: Asset['category'][] = ['cash', 'investments', 'property', 'vehicles', 'retirement', 'other']
  const liabilityCategories: Liability['category'][] = ['mortgage', 'auto', 'student', 'credit', 'personal', 'other']

  useEffect(() => {
    const savedAssets = localStorage.getItem('networth-assets')
    const savedLiabilities = localStorage.getItem('networth-liabilities')
    const savedSnapshots = localStorage.getItem('networth-snapshots')
    if (savedAssets) setAssets(JSON.parse(savedAssets))
    if (savedLiabilities) setLiabilities(JSON.parse(savedLiabilities))
    if (savedSnapshots) setSnapshots(JSON.parse(savedSnapshots))
  }, [])

  const saveAssets = (updated: Asset[]) => {
    setAssets(updated)
    localStorage.setItem('networth-assets', JSON.stringify(updated))
  }

  const saveLiabilities = (updated: Liability[]) => {
    setLiabilities(updated)
    localStorage.setItem('networth-liabilities', JSON.stringify(updated))
  }

  const saveSnapshots = (updated: Snapshot[]) => {
    setSnapshots(updated)
    localStorage.setItem('networth-snapshots', JSON.stringify(updated))
  }

  const addAsset = () => {
    if (!assetForm.name) return
    const asset: Asset = {
      id: editingAssetId || Date.now().toString(),
      ...assetForm
    }
    if (editingAssetId) {
      saveAssets(assets.map(a => a.id === editingAssetId ? asset : a))
    } else {
      saveAssets([...assets, asset])
    }
    setAssetForm({ name: '', category: 'cash', value: 0, notes: '' })
    setShowAssetForm(false)
    setEditingAssetId(null)
  }

  const addLiability = () => {
    if (!liabilityForm.name) return
    const liability: Liability = {
      id: editingLiabilityId || Date.now().toString(),
      ...liabilityForm
    }
    if (editingLiabilityId) {
      saveLiabilities(liabilities.map(l => l.id === editingLiabilityId ? liability : l))
    } else {
      saveLiabilities([...liabilities, liability])
    }
    setLiabilityForm({ name: '', category: 'credit', balance: 0, interestRate: 0, monthlyPayment: 0, notes: '' })
    setShowLiabilityForm(false)
    setEditingLiabilityId(null)
  }

  const editAsset = (asset: Asset) => {
    setAssetForm({ name: asset.name, category: asset.category, value: asset.value, notes: asset.notes })
    setEditingAssetId(asset.id)
    setShowAssetForm(true)
  }

  const editLiability = (liability: Liability) => {
    setLiabilityForm({
      name: liability.name,
      category: liability.category,
      balance: liability.balance,
      interestRate: liability.interestRate,
      monthlyPayment: liability.monthlyPayment,
      notes: liability.notes
    })
    setEditingLiabilityId(liability.id)
    setShowLiabilityForm(true)
  }

  const deleteAsset = (id: string) => saveAssets(assets.filter(a => a.id !== id))
  const deleteLiability = (id: string) => saveLiabilities(liabilities.filter(l => l.id !== id))

  const takeSnapshot = () => {
    const snapshot: Snapshot = {
      date: new Date().toISOString().split('T')[0],
      assets: totalAssets,
      liabilities: totalLiabilities,
      netWorth
    }
    saveSnapshots([snapshot, ...snapshots.filter(s => s.date !== snapshot.date)])
  }

  const totalAssets = useMemo(() => assets.reduce((sum, a) => sum + a.value, 0), [assets])
  const totalLiabilities = useMemo(() => liabilities.reduce((sum, l) => sum + l.balance, 0), [liabilities])
  const netWorth = totalAssets - totalLiabilities

  const assetsByCategory = useMemo(() => {
    const grouped: Record<string, number> = {}
    assets.forEach(a => {
      grouped[a.category] = (grouped[a.category] || 0) + a.value
    })
    return grouped
  }, [assets])

  const liabilitiesByCategory = useMemo(() => {
    const grouped: Record<string, number> = {}
    liabilities.forEach(l => {
      grouped[l.category] = (grouped[l.category] || 0) + l.balance
    })
    return grouped
  }, [liabilities])

  const monthlyDebtPayments = useMemo(() =>
    liabilities.reduce((sum, l) => sum + l.monthlyPayment, 0), [liabilities])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)
  }

  const assetCategoryColors: Record<string, string> = {
    cash: 'bg-green-100 text-green-700',
    investments: 'bg-blue-100 text-blue-700',
    property: 'bg-purple-100 text-purple-700',
    vehicles: 'bg-yellow-100 text-yellow-700',
    retirement: 'bg-indigo-100 text-indigo-700',
    other: 'bg-slate-100 text-slate-700'
  }

  const liabilityCategoryColors: Record<string, string> = {
    mortgage: 'bg-red-100 text-red-700',
    auto: 'bg-orange-100 text-orange-700',
    student: 'bg-yellow-100 text-yellow-700',
    credit: 'bg-pink-100 text-pink-700',
    personal: 'bg-purple-100 text-purple-700',
    other: 'bg-slate-100 text-slate-700'
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <div className="card p-3 text-center bg-green-50">
          <div className="text-xl font-bold text-green-600">{formatCurrency(totalAssets)}</div>
          <div className="text-xs text-slate-500">{t('tools.netWorthTracker.totalAssets')}</div>
        </div>
        <div className="card p-3 text-center bg-red-50">
          <div className="text-xl font-bold text-red-600">{formatCurrency(totalLiabilities)}</div>
          <div className="text-xs text-slate-500">{t('tools.netWorthTracker.totalLiabilities')}</div>
        </div>
        <div className={`card p-3 text-center ${netWorth >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
          <div className={`text-xl font-bold ${netWorth >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
            {formatCurrency(netWorth)}
          </div>
          <div className="text-xs text-slate-500">{t('tools.netWorthTracker.netWorth')}</div>
        </div>
      </div>

      <div className="flex gap-2">
        {(['assets', 'liabilities', 'history'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded text-sm ${
              activeTab === tab ? 'bg-blue-500 text-white' : 'bg-slate-100'
            }`}
          >
            {t(`tools.netWorthTracker.${tab}`)}
          </button>
        ))}
      </div>

      {activeTab === 'assets' && (
        <>
          <div className="card p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-slate-700">{t('tools.netWorthTracker.assetBreakdown')}</h3>
              <button
                onClick={() => setShowAssetForm(!showAssetForm)}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
              >
                +
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {assetCategories.map(cat => (
                <div key={cat} className={`p-2 rounded text-center ${assetCategoryColors[cat]}`}>
                  <div className="font-bold">{formatCurrency(assetsByCategory[cat] || 0)}</div>
                  <div className="text-xs">{t(`tools.netWorthTracker.${cat}`)}</div>
                </div>
              ))}
            </div>

            {showAssetForm && (
              <div className="p-3 bg-slate-50 rounded mb-4 space-y-2">
                <input
                  type="text"
                  value={assetForm.name}
                  onChange={(e) => setAssetForm({ ...assetForm, name: e.target.value })}
                  placeholder={t('tools.netWorthTracker.assetName')}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                />
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={assetForm.category}
                    onChange={(e) => setAssetForm({ ...assetForm, category: e.target.value as Asset['category'] })}
                    className="px-3 py-2 border border-slate-300 rounded"
                  >
                    {assetCategories.map(c => (
                      <option key={c} value={c}>{t(`tools.netWorthTracker.${c}`)}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={assetForm.value || ''}
                    onChange={(e) => setAssetForm({ ...assetForm, value: parseFloat(e.target.value) || 0 })}
                    placeholder={t('tools.netWorthTracker.value')}
                    className="px-3 py-2 border border-slate-300 rounded"
                  />
                </div>
                <button
                  onClick={addAsset}
                  disabled={!assetForm.name}
                  className="w-full py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                  {editingAssetId ? t('tools.netWorthTracker.update') : t('tools.netWorthTracker.addAsset')}
                </button>
              </div>
            )}

            {assets.length === 0 ? (
              <p className="text-center text-slate-500 py-4">{t('tools.netWorthTracker.noAssets')}</p>
            ) : (
              <div className="space-y-2">
                {assets.map(asset => (
                  <div key={asset.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                    <div>
                      <div className="font-medium">{asset.name}</div>
                      <span className={`text-xs px-2 py-0.5 rounded ${assetCategoryColors[asset.category]}`}>
                        {asset.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-green-600">{formatCurrency(asset.value)}</span>
                      <button onClick={() => editAsset(asset)} className="text-blue-500 text-xs">
                        {t('tools.netWorthTracker.edit')}
                      </button>
                      <button onClick={() => deleteAsset(asset.id)} className="text-red-500 text-xs">×</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'liabilities' && (
        <>
          <div className="card p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-slate-700">{t('tools.netWorthTracker.liabilityBreakdown')}</h3>
              <button
                onClick={() => setShowLiabilityForm(!showLiabilityForm)}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
              >
                +
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {liabilityCategories.map(cat => (
                <div key={cat} className={`p-2 rounded text-center ${liabilityCategoryColors[cat]}`}>
                  <div className="font-bold">{formatCurrency(liabilitiesByCategory[cat] || 0)}</div>
                  <div className="text-xs">{t(`tools.netWorthTracker.${cat}`)}</div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-orange-50 rounded mb-4 text-center">
              <div className="text-lg font-bold text-orange-600">{formatCurrency(monthlyDebtPayments)}</div>
              <div className="text-xs text-slate-600">{t('tools.netWorthTracker.monthlyPayments')}</div>
            </div>

            {showLiabilityForm && (
              <div className="p-3 bg-slate-50 rounded mb-4 space-y-2">
                <input
                  type="text"
                  value={liabilityForm.name}
                  onChange={(e) => setLiabilityForm({ ...liabilityForm, name: e.target.value })}
                  placeholder={t('tools.netWorthTracker.liabilityName')}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                />
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={liabilityForm.category}
                    onChange={(e) => setLiabilityForm({ ...liabilityForm, category: e.target.value as Liability['category'] })}
                    className="px-3 py-2 border border-slate-300 rounded"
                  >
                    {liabilityCategories.map(c => (
                      <option key={c} value={c}>{t(`tools.netWorthTracker.${c}`)}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={liabilityForm.balance || ''}
                    onChange={(e) => setLiabilityForm({ ...liabilityForm, balance: parseFloat(e.target.value) || 0 })}
                    placeholder={t('tools.netWorthTracker.balance')}
                    className="px-3 py-2 border border-slate-300 rounded"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={liabilityForm.interestRate || ''}
                    onChange={(e) => setLiabilityForm({ ...liabilityForm, interestRate: parseFloat(e.target.value) || 0 })}
                    placeholder={t('tools.netWorthTracker.interestRate')}
                    step="0.1"
                    className="px-3 py-2 border border-slate-300 rounded"
                  />
                  <input
                    type="number"
                    value={liabilityForm.monthlyPayment || ''}
                    onChange={(e) => setLiabilityForm({ ...liabilityForm, monthlyPayment: parseFloat(e.target.value) || 0 })}
                    placeholder={t('tools.netWorthTracker.monthlyPayment')}
                    className="px-3 py-2 border border-slate-300 rounded"
                  />
                </div>
                <button
                  onClick={addLiability}
                  disabled={!liabilityForm.name}
                  className="w-full py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                  {editingLiabilityId ? t('tools.netWorthTracker.update') : t('tools.netWorthTracker.addLiability')}
                </button>
              </div>
            )}

            {liabilities.length === 0 ? (
              <p className="text-center text-slate-500 py-4">{t('tools.netWorthTracker.noLiabilities')}</p>
            ) : (
              <div className="space-y-2">
                {liabilities.map(liability => (
                  <div key={liability.id} className="p-2 bg-slate-50 rounded">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <div className="font-medium">{liability.name}</div>
                        <span className={`text-xs px-2 py-0.5 rounded ${liabilityCategoryColors[liability.category]}`}>
                          {liability.category}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-red-600">{formatCurrency(liability.balance)}</div>
                        <div className="text-xs text-slate-500">{liability.interestRate}% APR</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600">
                        {t('tools.netWorthTracker.monthlyPayment')}: {formatCurrency(liability.monthlyPayment)}
                      </span>
                      <div className="flex gap-2">
                        <button onClick={() => editLiability(liability)} className="text-blue-500">
                          {t('tools.netWorthTracker.edit')}
                        </button>
                        <button onClick={() => deleteLiability(liability.id)} className="text-red-500">×</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'history' && (
        <div className="card p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-slate-700">{t('tools.netWorthTracker.snapshotHistory')}</h3>
            <button
              onClick={takeSnapshot}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
            >
              {t('tools.netWorthTracker.takeSnapshot')}
            </button>
          </div>
          {snapshots.length === 0 ? (
            <p className="text-center text-slate-500 py-8">{t('tools.netWorthTracker.noSnapshots')}</p>
          ) : (
            <div className="space-y-2">
              {snapshots.slice(0, 12).map((snapshot, i) => {
                const prevSnapshot = snapshots[i + 1]
                const change = prevSnapshot ? snapshot.netWorth - prevSnapshot.netWorth : 0
                return (
                  <div key={snapshot.date} className="p-3 bg-slate-50 rounded">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">{snapshot.date}</span>
                      <div className="text-right">
                        <div className={`font-bold ${snapshot.netWorth >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                          {formatCurrency(snapshot.netWorth)}
                        </div>
                        {change !== 0 && (
                          <div className={`text-xs ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {change > 0 ? '+' : ''}{formatCurrency(change)}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-slate-500">
                      <div>{t('tools.netWorthTracker.assets')}: {formatCurrency(snapshot.assets)}</div>
                      <div>{t('tools.netWorthTracker.liabilities')}: {formatCurrency(snapshot.liabilities)}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
