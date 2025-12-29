import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface VisaInfo {
  destination: string
  requirement: 'visa-free' | 'visa-on-arrival' | 'e-visa' | 'visa-required'
  duration: string
  notes: string
}

const passports = [
  { code: 'US', name: 'United States' },
  { code: 'UK', name: 'United Kingdom' },
  { code: 'TW', name: 'Taiwan' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'CN', name: 'China' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'AU', name: 'Australia' },
  { code: 'CA', name: 'Canada' },
  { code: 'SG', name: 'Singapore' },
  { code: 'IN', name: 'India' },
]

const destinations = [
  { code: 'JP', name: 'Japan', region: 'Asia' },
  { code: 'KR', name: 'South Korea', region: 'Asia' },
  { code: 'TW', name: 'Taiwan', region: 'Asia' },
  { code: 'TH', name: 'Thailand', region: 'Asia' },
  { code: 'SG', name: 'Singapore', region: 'Asia' },
  { code: 'MY', name: 'Malaysia', region: 'Asia' },
  { code: 'VN', name: 'Vietnam', region: 'Asia' },
  { code: 'ID', name: 'Indonesia', region: 'Asia' },
  { code: 'PH', name: 'Philippines', region: 'Asia' },
  { code: 'US', name: 'United States', region: 'Americas' },
  { code: 'CA', name: 'Canada', region: 'Americas' },
  { code: 'MX', name: 'Mexico', region: 'Americas' },
  { code: 'UK', name: 'United Kingdom', region: 'Europe' },
  { code: 'FR', name: 'France', region: 'Europe' },
  { code: 'DE', name: 'Germany', region: 'Europe' },
  { code: 'IT', name: 'Italy', region: 'Europe' },
  { code: 'ES', name: 'Spain', region: 'Europe' },
  { code: 'AU', name: 'Australia', region: 'Oceania' },
  { code: 'NZ', name: 'New Zealand', region: 'Oceania' },
  { code: 'AE', name: 'UAE', region: 'Middle East' },
]

// Simplified visa data - in production this would be from an API
const getVisaInfo = (passport: string, destination: string): VisaInfo => {
  // Same country
  if (passport === destination) {
    return { destination, requirement: 'visa-free', duration: 'Unlimited', notes: 'Home country' }
  }

  // Common visa-free combinations
  const visaFreeMap: Record<string, string[]> = {
    US: ['JP', 'KR', 'TW', 'TH', 'SG', 'MY', 'UK', 'FR', 'DE', 'IT', 'ES', 'MX', 'CA'],
    UK: ['JP', 'KR', 'TW', 'TH', 'SG', 'MY', 'US', 'FR', 'DE', 'IT', 'ES', 'CA', 'AU', 'NZ'],
    TW: ['JP', 'KR', 'TH', 'SG', 'MY', 'UK', 'FR', 'DE', 'IT', 'ES'],
    JP: ['US', 'UK', 'TW', 'KR', 'TH', 'SG', 'MY', 'FR', 'DE', 'IT', 'ES', 'CA', 'AU', 'NZ'],
    SG: ['JP', 'KR', 'TW', 'TH', 'MY', 'US', 'UK', 'FR', 'DE', 'IT', 'ES', 'CA', 'AU', 'NZ'],
  }

  const voaMap: Record<string, string[]> = {
    US: ['ID', 'VN'],
    UK: ['ID', 'VN'],
    TW: ['ID'],
  }

  const eVisaMap: Record<string, string[]> = {
    US: ['AU', 'NZ', 'AE'],
    UK: ['AU', 'AE'],
    TW: ['AU', 'AE'],
    CN: ['TH', 'SG', 'MY'],
  }

  if (visaFreeMap[passport]?.includes(destination)) {
    return { destination, requirement: 'visa-free', duration: '14-90 days', notes: 'Tourist visa waiver' }
  }

  if (voaMap[passport]?.includes(destination)) {
    return { destination, requirement: 'visa-on-arrival', duration: '30 days', notes: 'Available at airport' }
  }

  if (eVisaMap[passport]?.includes(destination)) {
    return { destination, requirement: 'e-visa', duration: '30-90 days', notes: 'Apply online before travel' }
  }

  return { destination, requirement: 'visa-required', duration: 'Varies', notes: 'Apply at embassy/consulate' }
}

export default function VisaRequirements() {
  const { t } = useTranslation()
  const [passport, setPassport] = useState('US')
  const [selectedDestination, setSelectedDestination] = useState('')
  const [filterRegion, setFilterRegion] = useState('all')

  const regions = ['all', 'Asia', 'Americas', 'Europe', 'Oceania', 'Middle East']

  const filteredDestinations = filterRegion === 'all'
    ? destinations
    : destinations.filter(d => d.region === filterRegion)

  const getStatusColor = (requirement: VisaInfo['requirement']) => {
    switch (requirement) {
      case 'visa-free': return 'bg-green-100 text-green-700 border-green-300'
      case 'visa-on-arrival': return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'e-visa': return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'visa-required': return 'bg-red-100 text-red-700 border-red-300'
    }
  }

  const getStatusLabel = (requirement: VisaInfo['requirement']) => {
    switch (requirement) {
      case 'visa-free': return t('tools.visaRequirements.visaFree')
      case 'visa-on-arrival': return t('tools.visaRequirements.visaOnArrival')
      case 'e-visa': return t('tools.visaRequirements.eVisa')
      case 'visa-required': return t('tools.visaRequirements.visaRequired')
    }
  }

  const visaInfo = selectedDestination ? getVisaInfo(passport, selectedDestination) : null

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.visaRequirements.passport')}</h3>
        <select
          value={passport}
          onChange={e => setPassport(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        >
          {passports.map(p => (
            <option key={p.code} value={p.code}>{p.name}</option>
          ))}
        </select>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.visaRequirements.filterByRegion')}</h3>
        <div className="flex flex-wrap gap-2">
          {regions.map(region => (
            <button
              key={region}
              onClick={() => setFilterRegion(region)}
              className={`px-3 py-1 rounded-full text-sm ${
                filterRegion === region ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {region === 'all' ? 'All' : region}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.visaRequirements.destinations')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
          {filteredDestinations.map(dest => {
            const info = getVisaInfo(passport, dest.code)
            return (
              <button
                key={dest.code}
                onClick={() => setSelectedDestination(dest.code)}
                className={`p-2 rounded text-left border ${
                  selectedDestination === dest.code ? 'border-blue-500 bg-blue-50' : 'border-slate-200'
                }`}
              >
                <div className="font-medium text-sm">{dest.name}</div>
                <div className={`text-xs px-1 rounded inline-block mt-1 ${getStatusColor(info.requirement)}`}>
                  {getStatusLabel(info.requirement)}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {visaInfo && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">
            {t('tools.visaRequirements.requirementsFor')} {destinations.find(d => d.code === selectedDestination)?.name}
          </h3>
          <div className={`p-4 rounded border-2 ${getStatusColor(visaInfo.requirement)}`}>
            <div className="text-xl font-bold mb-2">{getStatusLabel(visaInfo.requirement)}</div>
            <div className="space-y-2">
              <div>
                <span className="text-sm opacity-70">{t('tools.visaRequirements.duration')}:</span>
                <span className="ml-2 font-medium">{visaInfo.duration}</span>
              </div>
              <div>
                <span className="text-sm opacity-70">{t('tools.visaRequirements.notes')}:</span>
                <span className="ml-2">{visaInfo.notes}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.visaRequirements.legend')}</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className={`p-2 rounded border ${getStatusColor('visa-free')}`}>
            <div className="font-medium text-sm">{t('tools.visaRequirements.visaFree')}</div>
            <div className="text-xs opacity-70">{t('tools.visaRequirements.visaFreeDesc')}</div>
          </div>
          <div className={`p-2 rounded border ${getStatusColor('visa-on-arrival')}`}>
            <div className="font-medium text-sm">{t('tools.visaRequirements.visaOnArrival')}</div>
            <div className="text-xs opacity-70">{t('tools.visaRequirements.voaDesc')}</div>
          </div>
          <div className={`p-2 rounded border ${getStatusColor('e-visa')}`}>
            <div className="font-medium text-sm">{t('tools.visaRequirements.eVisa')}</div>
            <div className="text-xs opacity-70">{t('tools.visaRequirements.eVisaDesc')}</div>
          </div>
          <div className={`p-2 rounded border ${getStatusColor('visa-required')}`}>
            <div className="font-medium text-sm">{t('tools.visaRequirements.visaRequired')}</div>
            <div className="text-xs opacity-70">{t('tools.visaRequirements.visaRequiredDesc')}</div>
          </div>
        </div>
      </div>

      <div className="text-xs text-slate-500 text-center">
        {t('tools.visaRequirements.disclaimer')}
      </div>
    </div>
  )
}
