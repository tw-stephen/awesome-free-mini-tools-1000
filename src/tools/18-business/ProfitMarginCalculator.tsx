import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Product {
  id: number
  name: string
  revenue: number
  cost: number
}

export default function ProfitMarginCalculator() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<'single' | 'multi'>('single')
  const [single, setSingle] = useState({ revenue: 0, cost: 0, sellingPrice: 0, unitCost: 0, units: 1 })
  const [products, setProducts] = useState<Product[]>([])

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
  }

  const formatPercent = (value: number): string => {
    return `${value.toFixed(2)}%`
  }

  // Single product calculations
  const grossProfit = single.revenue - single.cost
  const grossMargin = single.revenue > 0 ? (grossProfit / single.revenue) * 100 : 0
  const markup = single.cost > 0 ? (grossProfit / single.cost) * 100 : 0

  // Per unit calculations
  const unitProfit = single.sellingPrice - single.unitCost
  const unitMargin = single.sellingPrice > 0 ? (unitProfit / single.sellingPrice) * 100 : 0
  const totalRevenue = single.sellingPrice * single.units
  const totalCost = single.unitCost * single.units
  const totalProfit = unitProfit * single.units

  const addProduct = () => {
    setProducts([...products, { id: Date.now(), name: '', revenue: 0, cost: 0 }])
  }

  const updateProduct = (id: number, field: keyof Product, value: string | number) => {
    setProducts(products.map(p => p.id === id ? { ...p, [field]: value } : p))
  }

  const removeProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id))
  }

  const getProductMargin = (product: Product): { profit: number; margin: number; markup: number } => {
    const profit = product.revenue - product.cost
    const margin = product.revenue > 0 ? (profit / product.revenue) * 100 : 0
    const markupPct = product.cost > 0 ? (profit / product.cost) * 100 : 0
    return { profit, margin, markup: markupPct }
  }

  const totalPortfolioRevenue = products.reduce((sum, p) => sum + p.revenue, 0)
  const totalPortfolioCost = products.reduce((sum, p) => sum + p.cost, 0)
  const totalPortfolioProfit = totalPortfolioRevenue - totalPortfolioCost
  const avgMargin = totalPortfolioRevenue > 0 ? (totalPortfolioProfit / totalPortfolioRevenue) * 100 : 0

  const generateReport = (): string => {
    let doc = `PROFIT MARGIN ANALYSIS\n${'═'.repeat(50)}\n\n`

    if (mode === 'single') {
      doc += `REVENUE-BASED ANALYSIS\n${'─'.repeat(40)}\n`
      doc += `Revenue: ${formatCurrency(single.revenue)}\n`
      doc += `Cost: ${formatCurrency(single.cost)}\n`
      doc += `Gross Profit: ${formatCurrency(grossProfit)}\n`
      doc += `Gross Margin: ${formatPercent(grossMargin)}\n`
      doc += `Markup: ${formatPercent(markup)}\n\n`

      doc += `PER-UNIT ANALYSIS\n${'─'.repeat(40)}\n`
      doc += `Selling Price: ${formatCurrency(single.sellingPrice)}\n`
      doc += `Unit Cost: ${formatCurrency(single.unitCost)}\n`
      doc += `Unit Profit: ${formatCurrency(unitProfit)}\n`
      doc += `Units: ${single.units}\n`
      doc += `Total Profit: ${formatCurrency(totalProfit)}\n`
    } else {
      doc += `PRODUCT PORTFOLIO ANALYSIS\n${'─'.repeat(40)}\n\n`
      products.forEach((p, i) => {
        const m = getProductMargin(p)
        doc += `${i + 1}. ${p.name || 'Product'}\n`
        doc += `   Revenue: ${formatCurrency(p.revenue)} | Cost: ${formatCurrency(p.cost)}\n`
        doc += `   Profit: ${formatCurrency(m.profit)} | Margin: ${formatPercent(m.margin)}\n\n`
      })
      doc += `PORTFOLIO SUMMARY\n${'─'.repeat(40)}\n`
      doc += `Total Revenue: ${formatCurrency(totalPortfolioRevenue)}\n`
      doc += `Total Cost: ${formatCurrency(totalPortfolioCost)}\n`
      doc += `Total Profit: ${formatCurrency(totalPortfolioProfit)}\n`
      doc += `Average Margin: ${formatPercent(avgMargin)}\n`
    }

    return doc
  }

  const copyReport = () => {
    navigator.clipboard.writeText(generateReport())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2">
          <button onClick={() => setMode('single')} className={`flex-1 py-2 rounded ${mode === 'single' ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>Single Product</button>
          <button onClick={() => setMode('multi')} className={`flex-1 py-2 rounded ${mode === 'multi' ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>Product Portfolio</button>
        </div>
      </div>

      {mode === 'single' && (
        <>
          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.profitMarginCalculator.revenue')}</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-slate-500 block mb-1">Total Revenue ($)</label>
                <input type="number" value={single.revenue} onChange={(e) => setSingle({ ...single, revenue: Number(e.target.value) })} className="w-full px-3 py-2 border border-slate-300 rounded" min="0" />
              </div>
              <div>
                <label className="text-sm text-slate-500 block mb-1">Total Cost ($)</label>
                <input type="number" value={single.cost} onChange={(e) => setSingle({ ...single, cost: Number(e.target.value) })} className="w-full px-3 py-2 border border-slate-300 rounded" min="0" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className={`card p-4 text-center ${grossProfit >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="text-sm text-slate-500">Gross Profit</div>
              <div className={`text-2xl font-bold ${grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(grossProfit)}</div>
            </div>
            <div className={`card p-4 text-center ${grossMargin >= 0 ? 'bg-blue-50' : 'bg-red-50'}`}>
              <div className="text-sm text-slate-500">Gross Margin</div>
              <div className={`text-2xl font-bold ${grossMargin >= 0 ? 'text-blue-600' : 'text-red-600'}`}>{formatPercent(grossMargin)}</div>
            </div>
            <div className="card p-4 text-center bg-purple-50">
              <div className="text-sm text-slate-500">Markup</div>
              <div className="text-2xl font-bold text-purple-600">{formatPercent(markup)}</div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.profitMarginCalculator.perUnit')}</h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-sm text-slate-500 block mb-1">Selling Price ($)</label>
                <input type="number" value={single.sellingPrice} onChange={(e) => setSingle({ ...single, sellingPrice: Number(e.target.value) })} className="w-full px-3 py-2 border border-slate-300 rounded" min="0" />
              </div>
              <div>
                <label className="text-sm text-slate-500 block mb-1">Unit Cost ($)</label>
                <input type="number" value={single.unitCost} onChange={(e) => setSingle({ ...single, unitCost: Number(e.target.value) })} className="w-full px-3 py-2 border border-slate-300 rounded" min="0" />
              </div>
              <div>
                <label className="text-sm text-slate-500 block mb-1">Units</label>
                <input type="number" value={single.units} onChange={(e) => setSingle({ ...single, units: Number(e.target.value) })} className="w-full px-3 py-2 border border-slate-300 rounded" min="1" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="card p-4 text-center">
              <div className="text-sm text-slate-500">Unit Profit</div>
              <div className={`text-xl font-bold ${unitProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(unitProfit)}</div>
              <div className="text-sm text-slate-500 mt-1">Margin: {formatPercent(unitMargin)}</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-sm text-slate-500">Total ({single.units} units)</div>
              <div className={`text-xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(totalProfit)}</div>
              <div className="text-sm text-slate-500 mt-1">Revenue: {formatCurrency(totalRevenue)}</div>
            </div>
          </div>
        </>
      )}

      {mode === 'multi' && (
        <>
          <button onClick={addProduct} className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium">
            + {t('tools.profitMarginCalculator.addProduct')}
          </button>

          {products.map((product, index) => {
            const m = getProductMargin(product)
            return (
              <div key={product.id} className="card p-4">
                <div className="flex items-center justify-between mb-3">
                  <input type="text" value={product.name} onChange={(e) => updateProduct(product.id, 'name', e.target.value)} placeholder={`Product ${index + 1}`} className="font-medium bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-300 rounded px-2 py-1" />
                  <button onClick={() => removeProduct(product.id)} className="text-red-500 hover:text-red-600">×</button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs text-slate-500">Revenue</label>
                    <input type="number" value={product.revenue} onChange={(e) => updateProduct(product.id, 'revenue', Number(e.target.value))} className="w-full px-2 py-1 border border-slate-300 rounded text-sm" min="0" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Cost</label>
                    <input type="number" value={product.cost} onChange={(e) => updateProduct(product.id, 'cost', Number(e.target.value))} className="w-full px-2 py-1 border border-slate-300 rounded text-sm" min="0" />
                  </div>
                  <div className="text-center">
                    <label className="text-xs text-slate-500">Profit</label>
                    <div className={`text-lg font-bold ${m.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(m.profit)}</div>
                  </div>
                  <div className="text-center">
                    <label className="text-xs text-slate-500">Margin</label>
                    <div className={`text-lg font-bold ${m.margin >= 0 ? 'text-blue-600' : 'text-red-600'}`}>{formatPercent(m.margin)}</div>
                  </div>
                </div>
              </div>
            )
          })}

          {products.length > 0 && (
            <div className="card p-4 bg-slate-50">
              <h3 className="font-medium mb-3">{t('tools.profitMarginCalculator.portfolio')}</h3>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-sm text-slate-500">Total Revenue</div>
                  <div className="text-lg font-bold">{formatCurrency(totalPortfolioRevenue)}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500">Total Cost</div>
                  <div className="text-lg font-bold">{formatCurrency(totalPortfolioCost)}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500">Total Profit</div>
                  <div className={`text-lg font-bold ${totalPortfolioProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(totalPortfolioProfit)}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500">Avg Margin</div>
                  <div className={`text-lg font-bold ${avgMargin >= 0 ? 'text-blue-600' : 'text-red-600'}`}>{formatPercent(avgMargin)}</div>
                </div>
              </div>
            </div>
          )}

          {products.length === 0 && (
            <div className="card p-8 text-center text-slate-500">
              Add products to analyze your portfolio margins
            </div>
          )}
        </>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.profitMarginCalculator.formulas')}</h4>
        <div className="text-sm text-slate-600 font-mono space-y-1">
          <p>Gross Margin = (Revenue - Cost) / Revenue × 100</p>
          <p>Markup = (Revenue - Cost) / Cost × 100</p>
        </div>
      </div>

      <button onClick={copyReport} className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600 font-medium">
        {t('tools.profitMarginCalculator.export')}
      </button>
    </div>
  )
}
