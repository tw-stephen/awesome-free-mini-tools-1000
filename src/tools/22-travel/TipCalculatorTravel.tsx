import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Country {
  code: string
  name: string
  currency: string
  symbol: string
  tipInfo: {
    restaurant: { min: number; max: number; note: string }
    taxi: { min: number; max: number; note: string }
    hotel: { min: number; max: number; note: string }
    hairdresser: { min: number; max: number; note: string }
  }
}

const countries: Country[] = [
  {
    code: 'US',
    name: 'United States',
    currency: 'USD',
    symbol: '$',
    tipInfo: {
      restaurant: { min: 15, max: 20, note: 'Expected for table service' },
      taxi: { min: 15, max: 20, note: 'Round up or add percentage' },
      hotel: { min: 2, max: 5, note: '$2-5 per bag for bellhop' },
      hairdresser: { min: 15, max: 20, note: 'Standard practice' },
    },
  },
  {
    code: 'UK',
    name: 'United Kingdom',
    currency: 'GBP',
    symbol: '£',
    tipInfo: {
      restaurant: { min: 10, max: 15, note: 'Check if service included' },
      taxi: { min: 10, max: 10, note: 'Round up to nearest pound' },
      hotel: { min: 1, max: 2, note: '£1-2 per bag' },
      hairdresser: { min: 10, max: 15, note: 'Optional but appreciated' },
    },
  },
  {
    code: 'JP',
    name: 'Japan',
    currency: 'JPY',
    symbol: '¥',
    tipInfo: {
      restaurant: { min: 0, max: 0, note: 'Not expected, can be refused' },
      taxi: { min: 0, max: 0, note: 'Not customary' },
      hotel: { min: 0, max: 0, note: 'Not expected' },
      hairdresser: { min: 0, max: 0, note: 'Not customary' },
    },
  },
  {
    code: 'TW',
    name: 'Taiwan',
    currency: 'TWD',
    symbol: 'NT$',
    tipInfo: {
      restaurant: { min: 0, max: 10, note: 'Not expected, 10% at high-end' },
      taxi: { min: 0, max: 0, note: 'Round up small change' },
      hotel: { min: 0, max: 50, note: 'NT$50-100 per bag optional' },
      hairdresser: { min: 0, max: 0, note: 'Not customary' },
    },
  },
  {
    code: 'FR',
    name: 'France',
    currency: 'EUR',
    symbol: '€',
    tipInfo: {
      restaurant: { min: 5, max: 10, note: 'Service often included' },
      taxi: { min: 5, max: 10, note: 'Round up or 5-10%' },
      hotel: { min: 1, max: 2, note: '€1-2 per bag' },
      hairdresser: { min: 10, max: 10, note: 'Round up or small tip' },
    },
  },
  {
    code: 'DE',
    name: 'Germany',
    currency: 'EUR',
    symbol: '€',
    tipInfo: {
      restaurant: { min: 5, max: 10, note: 'Round up or add 5-10%' },
      taxi: { min: 5, max: 10, note: 'Round up' },
      hotel: { min: 1, max: 2, note: '€1-2 per bag' },
      hairdresser: { min: 5, max: 10, note: 'Round up' },
    },
  },
  {
    code: 'TH',
    name: 'Thailand',
    currency: 'THB',
    symbol: '฿',
    tipInfo: {
      restaurant: { min: 5, max: 10, note: 'Leave loose change' },
      taxi: { min: 0, max: 5, note: 'Round up' },
      hotel: { min: 20, max: 50, note: '฿20-50 per bag' },
      hairdresser: { min: 0, max: 10, note: 'Optional' },
    },
  },
  {
    code: 'AU',
    name: 'Australia',
    currency: 'AUD',
    symbol: 'A$',
    tipInfo: {
      restaurant: { min: 0, max: 10, note: 'Not expected but appreciated' },
      taxi: { min: 0, max: 5, note: 'Round up' },
      hotel: { min: 2, max: 5, note: '$2-5 per bag optional' },
      hairdresser: { min: 0, max: 10, note: 'Not expected' },
    },
  },
  {
    code: 'KR',
    name: 'South Korea',
    currency: 'KRW',
    symbol: '₩',
    tipInfo: {
      restaurant: { min: 0, max: 0, note: 'Not expected' },
      taxi: { min: 0, max: 0, note: 'Not customary' },
      hotel: { min: 0, max: 0, note: 'Not expected at most' },
      hairdresser: { min: 0, max: 0, note: 'Not customary' },
    },
  },
  {
    code: 'CN',
    name: 'China',
    currency: 'CNY',
    symbol: '¥',
    tipInfo: {
      restaurant: { min: 0, max: 0, note: 'Not expected' },
      taxi: { min: 0, max: 0, note: 'Not customary' },
      hotel: { min: 0, max: 0, note: 'Not expected' },
      hairdresser: { min: 0, max: 0, note: 'Not customary' },
    },
  },
]

export default function TipCalculatorTravel() {
  const { t } = useTranslation()
  const [selectedCountry, setSelectedCountry] = useState('US')
  const [billAmount, setBillAmount] = useState(100)
  const [serviceType, setServiceType] = useState<'restaurant' | 'taxi' | 'hotel' | 'hairdresser'>('restaurant')
  const [customTipPercent, setCustomTipPercent] = useState<number | null>(null)
  const [partySize, setPartySize] = useState(1)

  const country = countries.find(c => c.code === selectedCountry)
  const tipInfo = country?.tipInfo[serviceType]

  const calculateTip = (percent: number) => {
    return (billAmount * percent) / 100
  }

  const suggestedTipMin = tipInfo ? calculateTip(tipInfo.min) : 0
  const suggestedTipMax = tipInfo ? calculateTip(tipInfo.max) : 0
  const customTip = customTipPercent !== null ? calculateTip(customTipPercent) : null

  const serviceTypes = [
    { id: 'restaurant', name: 'Restaurant', icon: '🍽️' },
    { id: 'taxi', name: 'Taxi', icon: '🚕' },
    { id: 'hotel', name: 'Hotel', icon: '🏨' },
    { id: 'hairdresser', name: 'Hairdresser', icon: '💇' },
  ]

  const quickTips = [10, 15, 18, 20, 25]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.tipCalculatorTravel.selectCountry')}</h3>
        <select
          value={selectedCountry}
          onChange={e => setSelectedCountry(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        >
          {countries.map(c => (
            <option key={c.code} value={c.code}>{c.name} ({c.currency})</option>
          ))}
        </select>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.tipCalculatorTravel.serviceType')}</h3>
        <div className="grid grid-cols-4 gap-2">
          {serviceTypes.map(st => (
            <button
              key={st.id}
              onClick={() => setServiceType(st.id as typeof serviceType)}
              className={`p-2 rounded text-center ${
                serviceType === st.id ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <div className="text-xl">{st.icon}</div>
              <div className="text-xs mt-1">{st.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.tipCalculatorTravel.billAmount')}</h3>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">{country?.symbol}</span>
          <input
            type="number"
            value={billAmount}
            onChange={e => setBillAmount(parseFloat(e.target.value) || 0)}
            className="flex-1 px-3 py-2 border border-slate-300 rounded text-xl text-right"
          />
        </div>
        {serviceType === 'restaurant' && (
          <div className="mt-3">
            <label className="text-sm text-slate-500">{t('tools.tipCalculatorTravel.partySize')}</label>
            <input
              type="number"
              value={partySize}
              onChange={e => setPartySize(parseInt(e.target.value) || 1)}
              min={1}
              className="w-full px-3 py-2 border border-slate-300 rounded mt-1"
            />
          </div>
        )}
      </div>

      {tipInfo && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.tipCalculatorTravel.localCustom')}</h3>
          <div className={`p-4 rounded ${
            tipInfo.min === 0 && tipInfo.max === 0 ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'
          }`}>
            {tipInfo.min === 0 && tipInfo.max === 0 ? (
              <div className="text-green-700">
                <div className="font-bold text-lg">{t('tools.tipCalculatorTravel.noTipExpected')}</div>
                <div className="text-sm mt-1">{tipInfo.note}</div>
              </div>
            ) : (
              <div>
                <div className="text-sm text-slate-600">{t('tools.tipCalculatorTravel.suggested')}</div>
                <div className="font-bold text-2xl text-blue-600">
                  {tipInfo.min}% - {tipInfo.max}%
                </div>
                <div className="text-sm text-slate-500 mt-1">{tipInfo.note}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {tipInfo && (tipInfo.min > 0 || tipInfo.max > 0) && (
        <>
          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.tipCalculatorTravel.quickTips')}</h3>
            <div className="flex flex-wrap gap-2">
              {quickTips.map(percent => (
                <button
                  key={percent}
                  onClick={() => setCustomTipPercent(percent)}
                  className={`px-4 py-2 rounded ${
                    customTipPercent === percent ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  {percent}%
                </button>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm text-slate-500">{t('tools.tipCalculatorTravel.minTip')} ({tipInfo.min}%)</div>
                <div className="font-bold text-xl">{country?.symbol}{suggestedTipMin.toFixed(2)}</div>
              </div>
              <div className="border-x border-slate-200">
                <div className="text-sm text-slate-500">{t('tools.tipCalculatorTravel.maxTip')} ({tipInfo.max}%)</div>
                <div className="font-bold text-xl">{country?.symbol}{suggestedTipMax.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">{t('tools.tipCalculatorTravel.total')}</div>
                <div className="font-bold text-xl text-green-600">
                  {country?.symbol}{(billAmount + (customTip ?? suggestedTipMax)).toFixed(2)}
                </div>
              </div>
            </div>
            {serviceType === 'restaurant' && partySize > 1 && (
              <div className="mt-4 pt-4 border-t border-slate-200 text-center">
                <div className="text-sm text-slate-500">{t('tools.tipCalculatorTravel.perPerson')}</div>
                <div className="font-bold text-lg">
                  {country?.symbol}{((billAmount + (customTip ?? suggestedTipMax)) / partySize).toFixed(2)}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.tipCalculatorTravel.tippingGuide')}</h3>
        <div className="space-y-2 text-sm">
          {serviceTypes.map(st => {
            const info = country?.tipInfo[st.id as keyof typeof country.tipInfo]
            return (
              <div key={st.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <span>{st.icon} {st.name}</span>
                <span className={info?.min === 0 && info?.max === 0 ? 'text-green-600' : ''}>
                  {info?.min === 0 && info?.max === 0 ? 'Not expected' : `${info?.min}% - ${info?.max}%`}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
