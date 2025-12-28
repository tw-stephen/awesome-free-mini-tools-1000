import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

type Platform = 'instagram' | 'youtube' | 'tiktok' | 'twitter'

export default function InfluencerRateCalculator() {
  const { t } = useTranslation()
  const [platform, setPlatform] = useState<Platform>('instagram')
  const [followers, setFollowers] = useState('')
  const [engagementRate, setEngagementRate] = useState('')
  const [niche, setNiche] = useState<'general' | 'luxury' | 'tech' | 'lifestyle' | 'fitness'>('general')
  const [contentType, setContentType] = useState<'post' | 'story' | 'reel' | 'video'>('post')

  const baseRates: Record<Platform, Record<string, { min: number; max: number }>> = {
    instagram: {
      nano: { min: 10, max: 100 },       // 1K-10K
      micro: { min: 100, max: 500 },     // 10K-50K
      midTier: { min: 500, max: 5000 },  // 50K-500K
      macro: { min: 5000, max: 10000 },  // 500K-1M
      mega: { min: 10000, max: 100000 }  // 1M+
    },
    youtube: {
      nano: { min: 20, max: 200 },
      micro: { min: 200, max: 1000 },
      midTier: { min: 1000, max: 10000 },
      macro: { min: 10000, max: 20000 },
      mega: { min: 20000, max: 200000 }
    },
    tiktok: {
      nano: { min: 5, max: 50 },
      micro: { min: 50, max: 500 },
      midTier: { min: 500, max: 5000 },
      macro: { min: 5000, max: 10000 },
      mega: { min: 10000, max: 50000 }
    },
    twitter: {
      nano: { min: 5, max: 50 },
      micro: { min: 50, max: 200 },
      midTier: { min: 200, max: 2000 },
      macro: { min: 2000, max: 5000 },
      mega: { min: 5000, max: 30000 }
    }
  }

  const nicheMultipliers: Record<string, number> = {
    general: 1.0,
    luxury: 1.5,
    tech: 1.3,
    lifestyle: 1.1,
    fitness: 1.2
  }

  const contentMultipliers: Record<string, number> = {
    post: 1.0,
    story: 0.5,
    reel: 1.3,
    video: 1.5
  }

  const calculations = useMemo(() => {
    const followersNum = parseInt(followers) || 0
    const engagementNum = parseFloat(engagementRate) || 0

    if (followersNum === 0) return null

    // Determine tier
    let tier: string
    if (followersNum < 10000) tier = 'nano'
    else if (followersNum < 50000) tier = 'micro'
    else if (followersNum < 500000) tier = 'midTier'
    else if (followersNum < 1000000) tier = 'macro'
    else tier = 'mega'

    const rates = baseRates[platform][tier]
    const nicheMultiplier = nicheMultipliers[niche]
    const contentMultiplier = contentMultipliers[contentType]

    // Engagement bonus (good engagement = higher rates)
    let engagementBonus = 1.0
    if (engagementNum > 5) engagementBonus = 1.3
    else if (engagementNum > 3) engagementBonus = 1.15
    else if (engagementNum < 1) engagementBonus = 0.7

    const minRate = Math.round(rates.min * nicheMultiplier * contentMultiplier * engagementBonus)
    const maxRate = Math.round(rates.max * nicheMultiplier * contentMultiplier * engagementBonus)
    const avgRate = Math.round((minRate + maxRate) / 2)

    // CPM (Cost Per Mille)
    const cpm = Math.round((avgRate / followersNum) * 1000 * 100) / 100

    return {
      tier,
      minRate,
      maxRate,
      avgRate,
      cpm,
      monthlyPotential: avgRate * 4 // Assuming 4 posts/month
    }
  }, [followers, engagementRate, platform, niche, contentType])

  const getTierLabel = (tier: string) => {
    const labels: Record<string, string> = {
      nano: t('tools.influencerRateCalculator.tierNano'),
      micro: t('tools.influencerRateCalculator.tierMicro'),
      midTier: t('tools.influencerRateCalculator.tierMid'),
      macro: t('tools.influencerRateCalculator.tierMacro'),
      mega: t('tools.influencerRateCalculator.tierMega')
    }
    return labels[tier]
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.influencerRateCalculator.platform')}
        </label>
        <div className="flex flex-wrap gap-2">
          {(['instagram', 'youtube', 'tiktok', 'twitter'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`px-3 py-1.5 rounded text-sm capitalize ${
                platform === p ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.influencerRateCalculator.followers')}
            </label>
            <input
              type="number"
              value={followers}
              onChange={(e) => setFollowers(e.target.value)}
              placeholder="50000"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.influencerRateCalculator.engagementRate')}
            </label>
            <input
              type="number"
              value={engagementRate}
              onChange={(e) => setEngagementRate(e.target.value)}
              placeholder="3.5"
              step="0.1"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-1">
            {t('tools.influencerRateCalculator.niche')}
          </label>
          <select
            value={niche}
            onChange={(e) => setNiche(e.target.value as typeof niche)}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          >
            <option value="general">{t('tools.influencerRateCalculator.nicheGeneral')}</option>
            <option value="luxury">{t('tools.influencerRateCalculator.nicheLuxury')}</option>
            <option value="tech">{t('tools.influencerRateCalculator.nicheTech')}</option>
            <option value="lifestyle">{t('tools.influencerRateCalculator.nicheLifestyle')}</option>
            <option value="fitness">{t('tools.influencerRateCalculator.nicheFitness')}</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-1">
            {t('tools.influencerRateCalculator.contentType')}
          </label>
          <div className="flex flex-wrap gap-2">
            {(['post', 'story', 'reel', 'video'] as const).map(c => (
              <button
                key={c}
                onClick={() => setContentType(c)}
                className={`px-3 py-1.5 rounded text-sm capitalize ${
                  contentType === c ? 'bg-blue-500 text-white' : 'bg-slate-100'
                }`}
              >
                {t(`tools.influencerRateCalculator.content${c.charAt(0).toUpperCase() + c.slice(1)}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {calculations && (
        <>
          <div className="card p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <div className="text-center">
              <div className="text-sm opacity-80">{t('tools.influencerRateCalculator.estimatedRate')}</div>
              <div className="text-3xl font-bold my-2">
                ${calculations.minRate} - ${calculations.maxRate}
              </div>
              <div className="text-sm opacity-80">
                {t('tools.influencerRateCalculator.perContent')}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="card p-3 text-center">
              <div className="text-xs text-slate-500">{t('tools.influencerRateCalculator.tier')}</div>
              <div className="font-bold text-blue-600">{getTierLabel(calculations.tier)}</div>
            </div>
            <div className="card p-3 text-center">
              <div className="text-xs text-slate-500">{t('tools.influencerRateCalculator.averageRate')}</div>
              <div className="font-bold text-green-600">${calculations.avgRate}</div>
            </div>
            <div className="card p-3 text-center">
              <div className="text-xs text-slate-500">{t('tools.influencerRateCalculator.cpm')}</div>
              <div className="font-bold text-purple-600">${calculations.cpm}</div>
            </div>
            <div className="card p-3 text-center">
              <div className="text-xs text-slate-500">{t('tools.influencerRateCalculator.monthlyPotential')}</div>
              <div className="font-bold text-orange-600">${calculations.monthlyPotential.toLocaleString()}</div>
            </div>
          </div>
        </>
      )}

      <div className="card p-4 bg-yellow-50">
        <h3 className="font-medium text-slate-700 mb-2">{t('tools.influencerRateCalculator.note')}</h3>
        <p className="text-sm text-slate-600">
          {t('tools.influencerRateCalculator.disclaimer')}
        </p>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.influencerRateCalculator.factors')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• {t('tools.influencerRateCalculator.factor1')}</li>
          <li>• {t('tools.influencerRateCalculator.factor2')}</li>
          <li>• {t('tools.influencerRateCalculator.factor3')}</li>
          <li>• {t('tools.influencerRateCalculator.factor4')}</li>
        </ul>
      </div>
    </div>
  )
}
