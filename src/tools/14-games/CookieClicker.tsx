import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Upgrade {
  id: string
  name: string
  cost: number
  cps: number // cookies per second
  count: number
}

export default function CookieClicker() {
  const { t } = useTranslation()
  const [cookies, setCookies] = useState(0)
  const [clickPower, setClickPower] = useState(1)
  const [cps, setCps] = useState(0) // cookies per second
  const [totalCookies, setTotalCookies] = useState(0)
  const [isClicking, setIsClicking] = useState(false)
  const [upgrades, setUpgrades] = useState<Upgrade[]>([
    { id: 'cursor', name: 'Cursor', cost: 15, cps: 0.1, count: 0 },
    { id: 'grandma', name: 'Grandma', cost: 100, cps: 1, count: 0 },
    { id: 'farm', name: 'Farm', cost: 1100, cps: 8, count: 0 },
    { id: 'mine', name: 'Mine', cost: 12000, cps: 47, count: 0 },
    { id: 'factory', name: 'Factory', cost: 130000, cps: 260, count: 0 },
  ])

  const clickCookie = () => {
    setCookies(prev => prev + clickPower)
    setTotalCookies(prev => prev + clickPower)
    setIsClicking(true)
    setTimeout(() => setIsClicking(false), 100)
  }

  const buyUpgrade = (upgradeId: string) => {
    const upgrade = upgrades.find(u => u.id === upgradeId)
    if (!upgrade || cookies < upgrade.cost) return

    setCookies(prev => prev - upgrade.cost)
    setUpgrades(prev => prev.map(u =>
      u.id === upgradeId
        ? { ...u, count: u.count + 1, cost: Math.floor(u.cost * 1.15) }
        : u
    ))
  }

  // Calculate CPS
  useEffect(() => {
    const totalCps = upgrades.reduce((sum, u) => sum + u.cps * u.count, 0)
    setCps(totalCps)
  }, [upgrades])

  // Passive cookie generation
  useEffect(() => {
    const interval = setInterval(() => {
      if (cps > 0) {
        setCookies(prev => prev + cps / 10)
        setTotalCookies(prev => prev + cps / 10)
      }
    }, 100)
    return () => clearInterval(interval)
  }, [cps])

  const formatNumber = (num: number): string => {
    if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T'
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
    return Math.floor(num).toString()
  }

  const getUpgradeEmoji = (id: string) => {
    const emojis: Record<string, string> = {
      cursor: '👆',
      grandma: '👵',
      farm: '🌾',
      mine: '⛏️',
      factory: '🏭',
    }
    return emojis[id] || '🍪'
  }

  const resetGame = () => {
    setCookies(0)
    setTotalCookies(0)
    setClickPower(1)
    setUpgrades(prev => prev.map(u => ({ ...u, count: 0, cost: u.id === 'cursor' ? 15 : u.id === 'grandma' ? 100 : u.id === 'farm' ? 1100 : u.id === 'mine' ? 12000 : 130000 })))
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-amber-50 rounded">
            <div className="text-2xl font-bold text-amber-600">{formatNumber(cookies)}</div>
            <div className="text-sm text-slate-500">{t('tools.cookieClicker.cookies')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{formatNumber(cps)}/s</div>
            <div className="text-sm text-slate-500">CPS</div>
          </div>
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{formatNumber(totalCookies)}</div>
            <div className="text-sm text-slate-500">{t('tools.cookieClicker.total')}</div>
          </div>
        </div>
      </div>

      <div className="card p-6 flex flex-col items-center">
        <button
          onClick={clickCookie}
          className={`w-40 h-40 text-8xl rounded-full bg-amber-100 hover:bg-amber-200 active:scale-95 transition-all shadow-lg ${
            isClicking ? 'scale-90' : ''
          }`}
        >
          🍪
        </button>
        <p className="mt-4 text-slate-500">
          {t('tools.cookieClicker.clickPower')}: +{clickPower} {t('tools.cookieClicker.perClick')}
        </p>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.cookieClicker.upgrades')}</h3>
        <div className="space-y-2">
          {upgrades.map(upgrade => (
            <button
              key={upgrade.id}
              onClick={() => buyUpgrade(upgrade.id)}
              disabled={cookies < upgrade.cost}
              className={`w-full p-3 rounded-lg flex items-center justify-between ${
                cookies >= upgrade.cost
                  ? 'bg-green-50 hover:bg-green-100 border-2 border-green-200'
                  : 'bg-slate-50 opacity-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getUpgradeEmoji(upgrade.id)}</span>
                <div className="text-left">
                  <div className="font-medium">{upgrade.name}</div>
                  <div className="text-xs text-slate-500">+{upgrade.cps} CPS</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-amber-600">🍪 {formatNumber(upgrade.cost)}</div>
                <div className="text-xs text-slate-500">{t('tools.cookieClicker.owned')}: {upgrade.count}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={resetGame}
        className="w-full py-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
      >
        {t('tools.cookieClicker.resetGame')}
      </button>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.cookieClicker.howToPlay')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• {t('tools.cookieClicker.instruction1')}</li>
          <li>• {t('tools.cookieClicker.instruction2')}</li>
          <li>• {t('tools.cookieClicker.instruction3')}</li>
        </ul>
      </div>
    </div>
  )
}
