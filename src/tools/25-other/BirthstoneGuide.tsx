import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function BirthstoneGuide() {
  const { t } = useTranslation()
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString())

  const birthstones = [
    {
      month: 1,
      name: 'January',
      stone: 'Garnet',
      color: '#722F37',
      meaning: 'Protection, friendship, trust',
      properties: ['Promotes self-confidence', 'Encourages creativity', 'Provides protection during travel'],
      alternatives: ['Rose Quartz'],
    },
    {
      month: 2,
      name: 'February',
      stone: 'Amethyst',
      color: '#9966CC',
      meaning: 'Peace, courage, stability',
      properties: ['Calms the mind', 'Enhances intuition', 'Promotes emotional balance'],
      alternatives: ['Onyx', 'Moonstone'],
    },
    {
      month: 3,
      name: 'March',
      stone: 'Aquamarine',
      color: '#7FFFD4',
      meaning: 'Youth, health, hope',
      properties: ['Calms nerves', 'Promotes clear communication', 'Soothes fears'],
      alternatives: ['Bloodstone'],
    },
    {
      month: 4,
      name: 'April',
      stone: 'Diamond',
      color: '#B9F2FF',
      meaning: 'Eternal love, strength, clarity',
      properties: ['Amplifies energy', 'Represents purity', 'Enhances relationships'],
      alternatives: ['White Sapphire', 'Quartz'],
    },
    {
      month: 5,
      name: 'May',
      stone: 'Emerald',
      color: '#50C878',
      meaning: 'Rebirth, love, fertility',
      properties: ['Promotes wisdom', 'Enhances memory', 'Brings loyalty'],
      alternatives: ['Chrysoprase'],
    },
    {
      month: 6,
      name: 'June',
      stone: 'Pearl',
      color: '#FDEEF4',
      meaning: 'Purity, innocence, integrity',
      properties: ['Calms emotions', 'Promotes sincerity', 'Enhances personal integrity'],
      alternatives: ['Alexandrite', 'Moonstone'],
    },
    {
      month: 7,
      name: 'July',
      stone: 'Ruby',
      color: '#E0115F',
      meaning: 'Passion, protection, prosperity',
      properties: ['Increases energy', 'Promotes courage', 'Brings love and passion'],
      alternatives: ['Carnelian'],
    },
    {
      month: 8,
      name: 'August',
      stone: 'Peridot',
      color: '#E6E200',
      meaning: 'Strength, healing, protection',
      properties: ['Reduces stress', 'Attracts abundance', 'Promotes restful sleep'],
      alternatives: ['Sardonyx', 'Spinel'],
    },
    {
      month: 9,
      name: 'September',
      stone: 'Sapphire',
      color: '#0F52BA',
      meaning: 'Wisdom, loyalty, nobility',
      properties: ['Enhances mental clarity', 'Promotes truth', 'Brings spiritual insight'],
      alternatives: ['Lapis Lazuli'],
    },
    {
      month: 10,
      name: 'October',
      stone: 'Opal',
      color: '#A8C3BC',
      meaning: 'Creativity, inspiration, hope',
      properties: ['Amplifies emotions', 'Enhances imagination', 'Promotes spontaneity'],
      alternatives: ['Tourmaline'],
    },
    {
      month: 11,
      name: 'November',
      stone: 'Topaz',
      color: '#FFC87C',
      meaning: 'Abundance, good fortune, healing',
      properties: ['Promotes creativity', 'Attracts success', 'Enhances relaxation'],
      alternatives: ['Citrine'],
    },
    {
      month: 12,
      name: 'December',
      stone: 'Turquoise',
      color: '#40E0D0',
      meaning: 'Good luck, protection, friendship',
      properties: ['Promotes self-realization', 'Aids in creative expression', 'Balances emotions'],
      alternatives: ['Tanzanite', 'Zircon'],
    },
  ]

  const month = parseInt(selectedMonth)
  const selected = birthstones.find(b => b.month === month)

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.birthstoneGuide.selectMonth')}</h3>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        >
          {birthstones.map(b => (
            <option key={b.month} value={b.month}>{b.name}</option>
          ))}
        </select>
      </div>

      {selected && (
        <>
          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div
                className="w-20 h-20 rounded-full shadow-lg"
                style={{ backgroundColor: selected.color }}
              />
              <div>
                <div className="text-2xl font-bold text-slate-800">{selected.stone}</div>
                <div className="text-slate-500">{selected.name} {t('tools.birthstoneGuide.birthstone')}</div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.birthstoneGuide.meaning')}</h3>
            <p className="text-slate-600 italic">"{selected.meaning}"</p>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.birthstoneGuide.properties')}</h3>
            <ul className="space-y-2">
              {selected.properties.map((prop, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span
                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                    style={{ backgroundColor: selected.color }}
                  />
                  <span className="text-slate-600">{prop}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.birthstoneGuide.alternatives')}</h3>
            <div className="flex flex-wrap gap-2">
              {selected.alternatives.map(alt => (
                <span key={alt} className="px-3 py-1 bg-slate-100 text-slate-600 rounded">
                  {alt}
                </span>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.birthstoneGuide.allBirthstones')}</h3>
        <div className="grid grid-cols-3 gap-2">
          {birthstones.map(b => (
            <button
              key={b.month}
              onClick={() => setSelectedMonth(b.month.toString())}
              className={`p-2 rounded text-center transition-all ${
                b.month === month ? 'ring-2 ring-purple-400' : ''
              }`}
              style={{ backgroundColor: `${b.color}33` }}
            >
              <div
                className="w-6 h-6 rounded-full mx-auto mb-1"
                style={{ backgroundColor: b.color }}
              />
              <div className="text-xs font-medium">{b.name.slice(0, 3)}</div>
              <div className="text-xs text-slate-500">{b.stone}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.birthstoneGuide.info')}</h3>
        <p className="text-sm text-slate-600">
          {t('tools.birthstoneGuide.infoText')}
        </p>
      </div>
    </div>
  )
}
