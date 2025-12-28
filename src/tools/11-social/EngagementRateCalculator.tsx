import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function EngagementRateCalculator() {
  const { t } = useTranslation()
  const [platform, setPlatform] = useState<'instagram' | 'twitter' | 'tiktok' | 'youtube'>('instagram')
  const [followers, setFollowers] = useState('')
  const [likes, setLikes] = useState('')
  const [comments, setComments] = useState('')
  const [shares, setShares] = useState('')
  const [views, setViews] = useState('')
  const [saves, setSaves] = useState('')
  const [posts, setPosts] = useState('1')

  const calculateEngagement = () => {
    const followersNum = parseFloat(followers) || 0
    const likesNum = parseFloat(likes) || 0
    const commentsNum = parseFloat(comments) || 0
    const sharesNum = parseFloat(shares) || 0
    const viewsNum = parseFloat(views) || 0
    const savesNum = parseFloat(saves) || 0
    const postsNum = parseInt(posts) || 1

    if (followersNum === 0) return null

    let engagementRate = 0
    let totalEngagement = 0

    switch (platform) {
      case 'instagram':
        totalEngagement = likesNum + commentsNum + savesNum + sharesNum
        engagementRate = (totalEngagement / followersNum / postsNum) * 100
        break
      case 'twitter':
        totalEngagement = likesNum + commentsNum + sharesNum
        engagementRate = (totalEngagement / followersNum / postsNum) * 100
        break
      case 'tiktok':
        if (viewsNum > 0) {
          totalEngagement = likesNum + commentsNum + sharesNum
          engagementRate = (totalEngagement / viewsNum) * 100
        } else {
          totalEngagement = likesNum + commentsNum + sharesNum
          engagementRate = (totalEngagement / followersNum / postsNum) * 100
        }
        break
      case 'youtube':
        if (viewsNum > 0) {
          totalEngagement = likesNum + commentsNum
          engagementRate = (totalEngagement / viewsNum) * 100
        }
        break
    }

    return {
      rate: engagementRate,
      total: totalEngagement,
      perPost: totalEngagement / postsNum
    }
  }

  const result = calculateEngagement()

  const getRating = (rate: number) => {
    if (rate >= 6) return { label: t('tools.engagementRateCalculator.excellent'), color: 'text-green-600' }
    if (rate >= 3) return { label: t('tools.engagementRateCalculator.good'), color: 'text-blue-600' }
    if (rate >= 1) return { label: t('tools.engagementRateCalculator.average'), color: 'text-yellow-600' }
    return { label: t('tools.engagementRateCalculator.low'), color: 'text-red-600' }
  }

  const benchmarks = {
    instagram: { low: 1, average: 3, good: 6 },
    twitter: { low: 0.5, average: 1, good: 3 },
    tiktok: { low: 3, average: 6, good: 10 },
    youtube: { low: 2, average: 4, good: 8 }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.engagementRateCalculator.platform')}
        </label>
        <div className="flex flex-wrap gap-2">
          {(['instagram', 'twitter', 'tiktok', 'youtube'] as const).map(p => (
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
              {t('tools.engagementRateCalculator.followers')}
            </label>
            <input
              type="number"
              value={followers}
              onChange={(e) => setFollowers(e.target.value)}
              placeholder="10000"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.engagementRateCalculator.posts')}
            </label>
            <input
              type="number"
              value={posts}
              onChange={(e) => setPosts(e.target.value)}
              placeholder="1"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.engagementRateCalculator.likes')}
            </label>
            <input
              type="number"
              value={likes}
              onChange={(e) => setLikes(e.target.value)}
              placeholder="500"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.engagementRateCalculator.comments')}
            </label>
            <input
              type="number"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="50"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.engagementRateCalculator.shares')}
            </label>
            <input
              type="number"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              placeholder="20"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          {(platform === 'instagram') && (
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.engagementRateCalculator.saves')}
              </label>
              <input
                type="number"
                value={saves}
                onChange={(e) => setSaves(e.target.value)}
                placeholder="30"
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
          )}
          {(platform === 'tiktok' || platform === 'youtube') && (
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.engagementRateCalculator.views')}
              </label>
              <input
                type="number"
                value={views}
                onChange={(e) => setViews(e.target.value)}
                placeholder="10000"
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
          )}
        </div>
      </div>

      {result && result.rate > 0 && (
        <>
          <div className="card p-6 text-center">
            <div className="text-4xl font-bold text-blue-600">
              {result.rate.toFixed(2)}%
            </div>
            <div className="text-slate-500">{t('tools.engagementRateCalculator.engagementRate')}</div>
            <div className={`text-lg font-medium mt-2 ${getRating(result.rate).color}`}>
              {getRating(result.rate).label}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="card p-3 text-center">
              <div className="text-xl font-bold">{result.total.toLocaleString()}</div>
              <div className="text-xs text-slate-500">{t('tools.engagementRateCalculator.totalEngagement')}</div>
            </div>
            <div className="card p-3 text-center">
              <div className="text-xl font-bold">{result.perPost.toLocaleString()}</div>
              <div className="text-xs text-slate-500">{t('tools.engagementRateCalculator.perPost')}</div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-2">
              {t('tools.engagementRateCalculator.benchmarks')} ({platform})
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-red-600">{t('tools.engagementRateCalculator.low')}</span>
                <span>&lt; {benchmarks[platform].low}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-600">{t('tools.engagementRateCalculator.average')}</span>
                <span>{benchmarks[platform].low}% - {benchmarks[platform].average}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-600">{t('tools.engagementRateCalculator.good')}</span>
                <span>{benchmarks[platform].average}% - {benchmarks[platform].good}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-600">{t('tools.engagementRateCalculator.excellent')}</span>
                <span>&gt; {benchmarks[platform].good}%</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
