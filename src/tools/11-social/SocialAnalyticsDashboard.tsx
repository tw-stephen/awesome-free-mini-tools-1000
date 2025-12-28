import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

type Platform = 'instagram' | 'twitter' | 'tiktok' | 'youtube' | 'linkedin'
type Metric = 'followers' | 'engagement' | 'posts' | 'reach'

interface DataPoint {
  id: string
  platform: Platform
  metric: Metric
  value: number
  date: string
}

export default function SocialAnalyticsDashboard() {
  const { t } = useTranslation()
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([])
  const [platform, setPlatform] = useState<Platform>('instagram')
  const [metric, setMetric] = useState<Metric>('followers')
  const [value, setValue] = useState('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('social-analytics-data')
    if (saved) setDataPoints(JSON.parse(saved))
  }, [])

  const saveData = (updated: DataPoint[]) => {
    setDataPoints(updated)
    localStorage.setItem('social-analytics-data', JSON.stringify(updated))
  }

  const addDataPoint = () => {
    if (!value) return
    const newPoint: DataPoint = {
      id: Date.now().toString(),
      platform,
      metric,
      value: parseFloat(value),
      date: new Date().toISOString()
    }
    saveData([...dataPoints, newPoint])
    setValue('')
    setShowForm(false)
  }

  const deleteDataPoint = (id: string) => {
    saveData(dataPoints.filter(d => d.id !== id))
  }

  const platformColors: Record<Platform, string> = {
    instagram: '#E4405F',
    twitter: '#1DA1F2',
    tiktok: '#000000',
    youtube: '#FF0000',
    linkedin: '#0A66C2'
  }

  const metricIcons: Record<Metric, string> = {
    followers: '👥',
    engagement: '💬',
    posts: '📝',
    reach: '📈'
  }

  const getLatestValue = (p: Platform, m: Metric) => {
    const filtered = dataPoints
      .filter(d => d.platform === p && d.metric === m)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    return filtered[0]?.value || 0
  }

  const getGrowth = (p: Platform, m: Metric) => {
    const filtered = dataPoints
      .filter(d => d.platform === p && d.metric === m)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    if (filtered.length < 2) return null
    const oldest = filtered[0].value
    const newest = filtered[filtered.length - 1].value
    if (oldest === 0) return null
    return ((newest - oldest) / oldest) * 100
  }

  const platformStats = useMemo(() => {
    return (['instagram', 'twitter', 'tiktok', 'youtube', 'linkedin'] as Platform[]).map(p => ({
      platform: p,
      followers: getLatestValue(p, 'followers'),
      engagement: getLatestValue(p, 'engagement'),
      posts: getLatestValue(p, 'posts'),
      reach: getLatestValue(p, 'reach'),
      followersGrowth: getGrowth(p, 'followers')
    }))
  }, [dataPoints])

  const totalFollowers = platformStats.reduce((sum, p) => sum + p.followers, 0)
  const avgEngagement = platformStats.filter(p => p.engagement > 0).reduce((sum, p, _, arr) =>
    sum + p.engagement / arr.length, 0)

  const recentEntries = dataPoints
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {totalFollowers.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500">{t('tools.socialAnalyticsDashboard.totalFollowers')}</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {avgEngagement.toFixed(2)}%
          </div>
          <div className="text-xs text-slate-500">{t('tools.socialAnalyticsDashboard.avgEngagement')}</div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.socialAnalyticsDashboard.platformOverview')}
        </h3>
        <div className="space-y-3">
          {platformStats.map(stat => (
            <div key={stat.platform} className="p-3 bg-slate-50 rounded">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: platformColors[stat.platform] }}
                  />
                  <span className="font-medium capitalize">{stat.platform}</span>
                </div>
                {stat.followersGrowth !== null && (
                  <span className={`text-xs ${stat.followersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.followersGrowth >= 0 ? '+' : ''}{stat.followersGrowth.toFixed(1)}%
                  </span>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div>
                  <div className="font-bold">{stat.followers.toLocaleString()}</div>
                  <div className="text-slate-500">{t('tools.socialAnalyticsDashboard.followers')}</div>
                </div>
                <div>
                  <div className="font-bold">{stat.engagement}%</div>
                  <div className="text-slate-500">{t('tools.socialAnalyticsDashboard.engagement')}</div>
                </div>
                <div>
                  <div className="font-bold">{stat.posts}</div>
                  <div className="text-slate-500">{t('tools.socialAnalyticsDashboard.posts')}</div>
                </div>
                <div>
                  <div className="font-bold">{stat.reach.toLocaleString()}</div>
                  <div className="text-slate-500">{t('tools.socialAnalyticsDashboard.reach')}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full py-3 bg-blue-500 text-white rounded font-medium"
      >
        + {t('tools.socialAnalyticsDashboard.addData')}
      </button>

      {showForm && (
        <div className="card p-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('tools.socialAnalyticsDashboard.platform')}
            </label>
            <div className="flex flex-wrap gap-2">
              {(['instagram', 'twitter', 'tiktok', 'youtube', 'linkedin'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`px-3 py-1.5 rounded text-sm capitalize ${
                    platform === p ? 'text-white' : 'bg-slate-100'
                  }`}
                  style={platform === p ? { backgroundColor: platformColors[p] } : {}}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('tools.socialAnalyticsDashboard.metric')}
            </label>
            <div className="flex flex-wrap gap-2">
              {(['followers', 'engagement', 'posts', 'reach'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setMetric(m)}
                  className={`px-3 py-1.5 rounded text-sm capitalize ${
                    metric === m ? 'bg-blue-500 text-white' : 'bg-slate-100'
                  }`}
                >
                  {metricIcons[m]} {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('tools.socialAnalyticsDashboard.value')}
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={metric === 'engagement' ? '0.00' : '0'}
              step={metric === 'engagement' ? '0.01' : '1'}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>

          <button
            onClick={addDataPoint}
            disabled={!value}
            className="w-full py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {t('tools.socialAnalyticsDashboard.save')}
          </button>
        </div>
      )}

      {recentEntries.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.socialAnalyticsDashboard.recentData')}
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {recentEntries.map(entry => (
              <div key={entry.id} className="flex items-center justify-between p-2 bg-slate-50 rounded text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded"
                    style={{ backgroundColor: platformColors[entry.platform] }}
                  />
                  <span className="capitalize">{entry.platform}</span>
                  <span className="text-slate-500">•</span>
                  <span>{metricIcons[entry.metric]} {entry.metric}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {entry.metric === 'engagement' ? `${entry.value}%` : entry.value.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(entry.date).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => deleteDataPoint(entry.id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {dataPoints.length > 0 && (
        <button
          onClick={() => saveData([])}
          className="w-full py-2 bg-red-100 text-red-600 rounded"
        >
          {t('tools.socialAnalyticsDashboard.clearAll')}
        </button>
      )}
    </div>
  )
}
