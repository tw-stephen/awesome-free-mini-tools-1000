import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

type Platform = 'instagram' | 'tiktok' | 'twitter' | 'youtube'

interface Metrics {
  views: string
  likes: string
  comments: string
  shares: string
  saves: string
  followers: string
  postAge: string
}

export default function ViralScoreCalculator() {
  const { t } = useTranslation()
  const [platform, setPlatform] = useState<Platform>('instagram')
  const [metrics, setMetrics] = useState<Metrics>({
    views: '',
    likes: '',
    comments: '',
    shares: '',
    saves: '',
    followers: '',
    postAge: ''
  })

  const parseNumber = (str: string) => {
    const num = parseFloat(str.replace(/,/g, ''))
    return isNaN(num) ? 0 : num
  }

  const viralityAnalysis = useMemo(() => {
    const views = parseNumber(metrics.views)
    const likes = parseNumber(metrics.likes)
    const comments = parseNumber(metrics.comments)
    const shares = parseNumber(metrics.shares)
    const saves = parseNumber(metrics.saves)
    const followers = parseNumber(metrics.followers)
    const postAge = parseNumber(metrics.postAge)

    if (views === 0 && likes === 0) {
      return null
    }

    // Platform-specific weights
    const weights: Record<Platform, Record<string, number>> = {
      instagram: { likes: 1, comments: 3, shares: 5, saves: 4 },
      tiktok: { likes: 1, comments: 3, shares: 6, saves: 2 },
      twitter: { likes: 1, comments: 4, shares: 8, saves: 2 },
      youtube: { likes: 2, comments: 5, shares: 4, saves: 3 }
    }

    const w = weights[platform]

    // Calculate engagement score
    const totalEngagement = likes * w.likes + comments * w.comments + shares * w.shares + saves * w.saves
    const baseScore = views > 0 ? (totalEngagement / views) * 100 : 0

    // Engagement rate
    const engagementRate = followers > 0
      ? ((likes + comments + shares) / followers) * 100
      : 0

    // Velocity multiplier (engagement per hour)
    const velocityMultiplier = postAge > 0
      ? Math.min(2, 1 + (totalEngagement / postAge) / 100)
      : 1

    // Share ratio boost
    const shareRatio = views > 0 ? shares / views : 0
    const shareBoost = shareRatio > 0.01 ? 1.5 : shareRatio > 0.005 ? 1.2 : 1

    // Comment depth indicator
    const commentRatio = likes > 0 ? comments / likes : 0
    const commentQuality = commentRatio > 0.1 ? 1.3 : commentRatio > 0.05 ? 1.1 : 1

    // Final viral score (0-100)
    let viralScore = Math.min(100, baseScore * velocityMultiplier * shareBoost * commentQuality)

    // View to follower ratio (for reach assessment)
    const reachMultiplier = followers > 0 ? views / followers : 1

    // Determine viral status
    let status: 'not_viral' | 'trending' | 'viral' | 'mega_viral'
    let statusLabel: string
    let statusColor: string

    if (viralScore >= 80 || reachMultiplier >= 10) {
      status = 'mega_viral'
      statusLabel = 'Mega Viral'
      statusColor = 'text-purple-600'
    } else if (viralScore >= 50 || reachMultiplier >= 5) {
      status = 'viral'
      statusLabel = 'Going Viral'
      statusColor = 'text-green-600'
    } else if (viralScore >= 25 || reachMultiplier >= 2) {
      status = 'trending'
      statusLabel = 'Trending'
      statusColor = 'text-yellow-600'
    } else {
      status = 'not_viral'
      statusLabel = 'Not Viral Yet'
      statusColor = 'text-slate-600'
    }

    return {
      viralScore: Math.round(viralScore),
      engagementRate: engagementRate.toFixed(2),
      reachMultiplier: reachMultiplier.toFixed(1),
      shareRatio: (shareRatio * 100).toFixed(3),
      commentRatio: (commentRatio * 100).toFixed(2),
      velocity: postAge > 0 ? Math.round(totalEngagement / postAge) : 0,
      status,
      statusLabel,
      statusColor,
      recommendations: getRecommendations(status, engagementRate, shareRatio, commentRatio)
    }
  }, [metrics, platform])

  const getRecommendations = (
    status: string,
    engagementRate: number,
    shareRatio: number,
    commentRatio: number
  ): string[] => {
    const recs: string[] = []

    if (status === 'mega_viral' || status === 'viral') {
      recs.push('Engage with comments to boost visibility')
      recs.push('Post follow-up content to ride the wave')
      recs.push('Pin this post to your profile')
    } else if (status === 'trending') {
      recs.push('Respond to comments quickly to boost engagement')
      recs.push('Share to your stories for more reach')
      if (shareRatio < 0.005) {
        recs.push('Add a clear call-to-action for sharing')
      }
    } else {
      if (engagementRate < 1) {
        recs.push('Post during peak hours for your audience')
      }
      if (shareRatio < 0.001) {
        recs.push('Create more shareable content')
      }
      if (commentRatio < 0.05) {
        recs.push('Ask questions to encourage comments')
      }
      recs.push('Use relevant hashtags for discovery')
    }

    return recs.slice(0, 4)
  }

  const updateMetric = (key: keyof Metrics, value: string) => {
    setMetrics(prev => ({ ...prev, [key]: value }))
  }

  const platformBenchmarks: Record<Platform, { good: number; excellent: number }> = {
    instagram: { good: 3, excellent: 6 },
    tiktok: { good: 5, excellent: 15 },
    twitter: { good: 2, excellent: 5 },
    youtube: { good: 4, excellent: 8 }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.viralScoreCalculator.platform')}
        </label>
        <div className="flex flex-wrap gap-2">
          {(['instagram', 'tiktok', 'twitter', 'youtube'] as const).map(p => (
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
        <h3 className="text-sm font-medium text-slate-700">
          {t('tools.viralScoreCalculator.metrics')}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.viralScoreCalculator.views')}
            </label>
            <input
              type="text"
              value={metrics.views}
              onChange={(e) => updateMetric('views', e.target.value)}
              placeholder="10,000"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.viralScoreCalculator.likes')}
            </label>
            <input
              type="text"
              value={metrics.likes}
              onChange={(e) => updateMetric('likes', e.target.value)}
              placeholder="500"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.viralScoreCalculator.comments')}
            </label>
            <input
              type="text"
              value={metrics.comments}
              onChange={(e) => updateMetric('comments', e.target.value)}
              placeholder="50"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.viralScoreCalculator.shares')}
            </label>
            <input
              type="text"
              value={metrics.shares}
              onChange={(e) => updateMetric('shares', e.target.value)}
              placeholder="25"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.viralScoreCalculator.saves')}
            </label>
            <input
              type="text"
              value={metrics.saves}
              onChange={(e) => updateMetric('saves', e.target.value)}
              placeholder="30"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.viralScoreCalculator.followers')}
            </label>
            <input
              type="text"
              value={metrics.followers}
              onChange={(e) => updateMetric('followers', e.target.value)}
              placeholder="5,000"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">
            {t('tools.viralScoreCalculator.postAge')}
          </label>
          <input
            type="text"
            value={metrics.postAge}
            onChange={(e) => updateMetric('postAge', e.target.value)}
            placeholder="24"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>
      </div>

      {viralityAnalysis && (
        <>
          <div className="card p-4 text-center">
            <div className={`text-4xl font-bold ${viralityAnalysis.statusColor}`}>
              {viralityAnalysis.viralScore}
            </div>
            <div className="text-sm text-slate-600 mt-1">
              {t('tools.viralScoreCalculator.viralScore')}
            </div>
            <div className={`text-lg font-medium mt-2 ${viralityAnalysis.statusColor}`}>
              {viralityAnalysis.statusLabel}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="card p-3 text-center">
              <div className="text-xl font-bold text-blue-600">
                {viralityAnalysis.engagementRate}%
              </div>
              <div className="text-xs text-slate-500">
                {t('tools.viralScoreCalculator.engagementRate')}
              </div>
            </div>
            <div className="card p-3 text-center">
              <div className="text-xl font-bold text-green-600">
                {viralityAnalysis.reachMultiplier}x
              </div>
              <div className="text-xs text-slate-500">
                {t('tools.viralScoreCalculator.reachMultiplier')}
              </div>
            </div>
            <div className="card p-3 text-center">
              <div className="text-xl font-bold text-purple-600">
                {viralityAnalysis.shareRatio}%
              </div>
              <div className="text-xs text-slate-500">
                {t('tools.viralScoreCalculator.shareRate')}
              </div>
            </div>
            <div className="card p-3 text-center">
              <div className="text-xl font-bold text-orange-600">
                {viralityAnalysis.velocity}/hr
              </div>
              <div className="text-xs text-slate-500">
                {t('tools.viralScoreCalculator.velocity')}
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.viralScoreCalculator.recommendations')}
            </h3>
            <ul className="space-y-2">
              {viralityAnalysis.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-blue-500">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      <div className="card p-4 bg-blue-50">
        <h3 className="font-medium text-slate-700 mb-2">
          {t('tools.viralScoreCalculator.benchmarks')} - {platform}
        </h3>
        <div className="text-sm text-slate-600 space-y-1">
          <p>• {t('tools.viralScoreCalculator.goodEngagement')}: {platformBenchmarks[platform].good}%+</p>
          <p>• {t('tools.viralScoreCalculator.excellentEngagement')}: {platformBenchmarks[platform].excellent}%+</p>
        </div>
      </div>
    </div>
  )
}
