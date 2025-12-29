import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Appliance {
  id: number
  name: string
  watts: number
  hoursPerDay: number
  daysPerMonth: number
}

export default function EnergyUsageCalculator() {
  const { t } = useTranslation()
  const [appliances, setAppliances] = useState<Appliance[]>([])
  const [electricityRate, setElectricityRate] = useState('0.12')
  const [currency, setCurrency] = useState('$')
  const [newAppliance, setNewAppliance] = useState({
    name: '',
    watts: '',
    hoursPerDay: '1',
    daysPerMonth: '30',
  })

  const commonAppliances = [
    { name: 'LED Bulb', watts: 10 },
    { name: 'Refrigerator', watts: 150 },
    { name: 'Air Conditioner', watts: 1500 },
    { name: 'Washing Machine', watts: 500 },
    { name: 'Dryer', watts: 3000 },
    { name: 'Dishwasher', watts: 1800 },
    { name: 'Microwave', watts: 1000 },
    { name: 'TV (LED)', watts: 100 },
    { name: 'Computer', watts: 200 },
    { name: 'Laptop', watts: 50 },
    { name: 'Gaming Console', watts: 150 },
    { name: 'Electric Heater', watts: 1500 },
    { name: 'Hair Dryer', watts: 1800 },
    { name: 'Vacuum Cleaner', watts: 1200 },
    { name: 'Coffee Maker', watts: 1000 },
    { name: 'Toaster', watts: 850 },
  ]

  useEffect(() => {
    const saved = localStorage.getItem('energy-calculator-appliances')
    if (saved) {
      try {
        setAppliances(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load appliances')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('energy-calculator-appliances', JSON.stringify(appliances))
  }, [appliances])

  const addAppliance = () => {
    if (!newAppliance.name || !newAppliance.watts) return
    setAppliances([
      ...appliances,
      {
        id: Date.now(),
        name: newAppliance.name,
        watts: parseFloat(newAppliance.watts),
        hoursPerDay: parseFloat(newAppliance.hoursPerDay) || 1,
        daysPerMonth: parseFloat(newAppliance.daysPerMonth) || 30,
      },
    ])
    setNewAppliance({ name: '', watts: '', hoursPerDay: '1', daysPerMonth: '30' })
  }

  const addCommonAppliance = (item: typeof commonAppliances[0]) => {
    setNewAppliance({
      ...newAppliance,
      name: item.name,
      watts: item.watts.toString(),
    })
  }

  const removeAppliance = (id: number) => {
    setAppliances(appliances.filter(a => a.id !== id))
  }

  const updateAppliance = (id: number, field: string, value: string) => {
    setAppliances(appliances.map(a =>
      a.id === id ? { ...a, [field]: parseFloat(value) || 0 } : a
    ))
  }

  const calculateUsage = (appliance: Appliance) => {
    const kwhPerMonth = (appliance.watts * appliance.hoursPerDay * appliance.daysPerMonth) / 1000
    const costPerMonth = kwhPerMonth * parseFloat(electricityRate)
    return { kwhPerMonth, costPerMonth }
  }

  const totalMonthlyKwh = appliances.reduce((sum, a) => sum + calculateUsage(a).kwhPerMonth, 0)
  const totalMonthlyCost = appliances.reduce((sum, a) => sum + calculateUsage(a).costPerMonth, 0)
  const totalYearlyCost = totalMonthlyCost * 12
  const totalYearlyKwh = totalMonthlyKwh * 12

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.energyUsageCalculator.settings')}</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.energyUsageCalculator.electricityRate')}</label>
            <div className="flex">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="px-2 py-2 border border-slate-300 rounded-l text-sm"
              >
                <option value="$">$</option>
                <option value="NT$">NT$</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
              <input
                type="number"
                value={electricityRate}
                onChange={(e) => setElectricityRate(e.target.value)}
                className="flex-1 px-3 py-2 border-y border-r border-slate-300 rounded-r"
                placeholder="0.12"
                step="0.01"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">{t('tools.energyUsageCalculator.perKwh')}</p>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.energyUsageCalculator.quickAdd')}</h3>
        <div className="flex flex-wrap gap-1">
          {commonAppliances.map(item => (
            <button
              key={item.name}
              onClick={() => addCommonAppliance(item)}
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-xs"
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.energyUsageCalculator.addAppliance')}</h3>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={newAppliance.name}
            onChange={(e) => setNewAppliance({ ...newAppliance, name: e.target.value })}
            className="px-3 py-2 border border-slate-300 rounded text-sm"
            placeholder={t('tools.energyUsageCalculator.applianceName')}
          />
          <input
            type="number"
            value={newAppliance.watts}
            onChange={(e) => setNewAppliance({ ...newAppliance, watts: e.target.value })}
            className="px-3 py-2 border border-slate-300 rounded text-sm"
            placeholder={t('tools.energyUsageCalculator.watts')}
          />
          <input
            type="number"
            value={newAppliance.hoursPerDay}
            onChange={(e) => setNewAppliance({ ...newAppliance, hoursPerDay: e.target.value })}
            className="px-3 py-2 border border-slate-300 rounded text-sm"
            placeholder={t('tools.energyUsageCalculator.hoursPerDay')}
          />
          <input
            type="number"
            value={newAppliance.daysPerMonth}
            onChange={(e) => setNewAppliance({ ...newAppliance, daysPerMonth: e.target.value })}
            className="px-3 py-2 border border-slate-300 rounded text-sm"
            placeholder={t('tools.energyUsageCalculator.daysPerMonth')}
          />
        </div>
        <button
          onClick={addAppliance}
          className="w-full mt-3 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
        >
          {t('tools.energyUsageCalculator.add')}
        </button>
      </div>

      {appliances.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.energyUsageCalculator.yourAppliances')}</h3>
          <div className="space-y-2">
            {appliances.map(appliance => {
              const usage = calculateUsage(appliance)
              return (
                <div key={appliance.id} className="p-3 bg-slate-50 rounded">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium text-sm">{appliance.name}</div>
                      <div className="text-xs text-slate-500">{appliance.watts}W</div>
                    </div>
                    <button
                      onClick={() => removeAppliance(appliance.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      x
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <label className="text-xs text-slate-500">{t('tools.energyUsageCalculator.hours')}</label>
                      <input
                        type="number"
                        value={appliance.hoursPerDay}
                        onChange={(e) => updateAppliance(appliance.id, 'hoursPerDay', e.target.value)}
                        className="w-full px-2 py-1 border border-slate-200 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500">{t('tools.energyUsageCalculator.days')}</label>
                      <input
                        type="number"
                        value={appliance.daysPerMonth}
                        onChange={(e) => updateAppliance(appliance.id, 'daysPerMonth', e.target.value)}
                        className="w-full px-2 py-1 border border-slate-200 rounded text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">{usage.kwhPerMonth.toFixed(2)} kWh/mo</span>
                    <span className="font-medium text-green-600">{currency}{usage.costPerMonth.toFixed(2)}/mo</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="card p-4 bg-green-50">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.energyUsageCalculator.totalUsage')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-slate-600">{t('tools.energyUsageCalculator.monthly')}</div>
            <div className="text-xl font-bold text-green-600">{totalMonthlyKwh.toFixed(1)} kWh</div>
            <div className="text-lg font-medium">{currency}{totalMonthlyCost.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-sm text-slate-600">{t('tools.energyUsageCalculator.yearly')}</div>
            <div className="text-xl font-bold text-green-600">{totalYearlyKwh.toFixed(0)} kWh</div>
            <div className="text-lg font-medium">{currency}{totalYearlyCost.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.energyUsageCalculator.tips')}</h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.energyUsageCalculator.tip1')}</li>
          <li>{t('tools.energyUsageCalculator.tip2')}</li>
          <li>{t('tools.energyUsageCalculator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
