import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface BatteryInfo {
  charging: boolean
  chargingTime: number
  dischargingTime: number
  level: number
}

export default function BatteryStatus() {
  const { t } = useTranslation()
  const [battery, setBattery] = useState<BatteryInfo | null>(null)
  const [supported, setSupported] = useState(true)
  const [history, setHistory] = useState<{ time: Date; level: number }[]>([])

  useEffect(() => {
    const getBattery = async () => {
      try {
        if ('getBattery' in navigator) {
          const batteryManager = await (navigator as any).getBattery()

          const updateBattery = () => {
            setBattery({
              charging: batteryManager.charging,
              chargingTime: batteryManager.chargingTime,
              dischargingTime: batteryManager.dischargingTime,
              level: batteryManager.level,
            })

            setHistory((prev) => [
              { time: new Date(), level: batteryManager.level * 100 },
              ...prev.slice(0, 19),
            ])
          }

          updateBattery()

          batteryManager.addEventListener('chargingchange', updateBattery)
          batteryManager.addEventListener('levelchange', updateBattery)
          batteryManager.addEventListener('chargingtimechange', updateBattery)
          batteryManager.addEventListener('dischargingtimechange', updateBattery)

          return () => {
            batteryManager.removeEventListener('chargingchange', updateBattery)
            batteryManager.removeEventListener('levelchange', updateBattery)
            batteryManager.removeEventListener('chargingtimechange', updateBattery)
            batteryManager.removeEventListener('dischargingtimechange', updateBattery)
          }
        } else {
          setSupported(false)
        }
      } catch {
        setSupported(false)
      }
    }

    getBattery()
  }, [])

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds) || seconds <= 0) return t('tools.batteryStatus.unknown')

    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const getBatteryColor = (level: number) => {
    if (level > 0.5) return 'bg-green-500'
    if (level > 0.2) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getBatteryIcon = (level: number, charging: boolean) => {
    if (charging) return '🔌'
    if (level > 0.75) return '🔋'
    if (level > 0.5) return '🔋'
    if (level > 0.25) return '🪫'
    return '🪫'
  }

  if (!supported) {
    return (
      <div className="space-y-4">
        <div className="card p-6 text-center">
          <div className="text-4xl mb-4">🔋</div>
          <h2 className="text-lg font-medium text-slate-700 mb-2">
            {t('tools.batteryStatus.notSupported')}
          </h2>
          <p className="text-slate-500">
            {t('tools.batteryStatus.notSupportedDesc')}
          </p>
        </div>
      </div>
    )
  }

  if (!battery) {
    return (
      <div className="space-y-4">
        <div className="card p-6 text-center">
          <div className="text-4xl mb-4 animate-pulse">🔋</div>
          <p className="text-slate-500">{t('tools.batteryStatus.loading')}</p>
        </div>
      </div>
    )
  }

  const levelPercent = Math.round(battery.level * 100)

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <div className="text-center mb-6">
          <div className="text-6xl mb-2">
            {getBatteryIcon(battery.level, battery.charging)}
          </div>
          <div className="text-5xl font-bold text-slate-800">
            {levelPercent}%
          </div>
          <div className={`text-lg font-medium ${battery.charging ? 'text-green-600' : 'text-slate-500'}`}>
            {battery.charging
              ? t('tools.batteryStatus.charging')
              : t('tools.batteryStatus.onBattery')
            }
          </div>
        </div>

        {/* Battery Bar */}
        <div className="relative mb-6">
          <div className="h-12 bg-slate-200 rounded-l-lg rounded-r-sm overflow-hidden border-2 border-slate-300 relative">
            <div
              className={`h-full transition-all duration-500 ${getBatteryColor(battery.level)}`}
              style={{ width: `${levelPercent}%` }}
            />
            {battery.charging && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl animate-pulse">⚡</span>
              </div>
            )}
          </div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-6 bg-slate-300 rounded-r-sm" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded text-center">
            <div className="text-sm text-slate-500 mb-1">
              {battery.charging
                ? t('tools.batteryStatus.timeToFull')
                : t('tools.batteryStatus.timeRemaining')
              }
            </div>
            <div className="text-xl font-bold text-slate-700">
              {battery.charging
                ? formatTime(battery.chargingTime)
                : formatTime(battery.dischargingTime)
              }
            </div>
          </div>
          <div className="p-4 bg-slate-50 rounded text-center">
            <div className="text-sm text-slate-500 mb-1">
              {t('tools.batteryStatus.status')}
            </div>
            <div className={`text-xl font-bold ${
              battery.charging ? 'text-green-600' : battery.level < 0.2 ? 'text-red-600' : 'text-slate-700'
            }`}>
              {battery.charging
                ? t('tools.batteryStatus.pluggedIn')
                : battery.level < 0.2
                ? t('tools.batteryStatus.low')
                : t('tools.batteryStatus.good')
              }
            </div>
          </div>
        </div>
      </div>

      {history.length > 1 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.batteryStatus.history')}
          </h3>
          <div className="h-32 flex items-end gap-1">
            {history.slice().reverse().map((entry, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t transition-all ${getBatteryColor(entry.level / 100)}`}
                style={{ height: `${entry.level}%` }}
                title={`${entry.level.toFixed(0)}% at ${entry.time.toLocaleTimeString()}`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>{t('tools.batteryStatus.oldest')}</span>
            <span>{t('tools.batteryStatus.newest')}</span>
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.batteryStatus.details')}
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between p-2 bg-slate-50 rounded">
            <span className="text-slate-600">{t('tools.batteryStatus.level')}</span>
            <span className="font-mono">{levelPercent}%</span>
          </div>
          <div className="flex justify-between p-2 bg-slate-50 rounded">
            <span className="text-slate-600">{t('tools.batteryStatus.chargingStatus')}</span>
            <span className="font-mono">{battery.charging ? 'Yes' : 'No'}</span>
          </div>
          <div className="flex justify-between p-2 bg-slate-50 rounded">
            <span className="text-slate-600">{t('tools.batteryStatus.chargingTime')}</span>
            <span className="font-mono">{formatTime(battery.chargingTime)}</span>
          </div>
          <div className="flex justify-between p-2 bg-slate-50 rounded">
            <span className="text-slate-600">{t('tools.batteryStatus.dischargingTime')}</span>
            <span className="font-mono">{formatTime(battery.dischargingTime)}</span>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.batteryStatus.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.batteryStatus.tip1')}</li>
          <li>{t('tools.batteryStatus.tip2')}</li>
          <li>{t('tools.batteryStatus.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
