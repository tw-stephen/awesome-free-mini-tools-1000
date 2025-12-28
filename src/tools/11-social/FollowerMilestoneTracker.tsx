import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

type Platform = 'instagram' | 'youtube' | 'tiktok' | 'twitter'

interface MilestoneEntry {
  id: string
  platform: Platform
  count: number
  date: string
  notes: string
}

interface Milestone {
  count: number
  label: string
}

export default function FollowerMilestoneTracker() {
  const { t } = useTranslation()
  const [entries, setEntries] = useState<MilestoneEntry[]>([])
  const [platform, setPlatform] = useState<Platform>('instagram')
  const [count, setCount] = useState('')
  const [notes, setNotes] = useState('')

  const milestones: Milestone[] = [
    { count: 100, label: '100' },
    { count: 500, label: '500' },
    { count: 1000, label: '1K' },
    { count: 5000, label: '5K' },
    { count: 10000, label: '10K' },
    { count: 50000, label: '50K' },
    { count: 100000, label: '100K' },
    { count: 500000, label: '500K' },
    { count: 1000000, label: '1M' }
  ]

  useEffect(() => {
    const saved = localStorage.getItem('follower-milestones')
    if (saved) setEntries(JSON.parse(saved))
  }, [])

  const saveEntries = (updated: MilestoneEntry[]) => {
    setEntries(updated)
    localStorage.setItem('follower-milestones', JSON.stringify(updated))
  }

  const addEntry = () => {
    if (!count) return
    const newEntry: MilestoneEntry = {
      id: Date.now().toString(),
      platform,
      count: parseInt(count),
      date: new Date().toISOString(),
      notes
    }
    saveEntries([...entries, newEntry])
    setCount('')
    setNotes('')
  }

  const deleteEntry = (id: string) => {
    saveEntries(entries.filter(e => e.id !== id))
  }

  const getPlatformEntries = (p: Platform) => {
    return entries.filter(e => e.platform === p).sort((a, b) => a.count - b.count)
  }

  const getCurrentCount = (p: Platform) => {
    const platformEntries = getPlatformEntries(p)
    if (platformEntries.length === 0) return 0
    return platformEntries[platformEntries.length - 1].count
  }

  const getNextMilestone = (p: Platform) => {
    const current = getCurrentCount(p)
    return milestones.find(m => m.count > current)
  }

  const getProgress = (p: Platform) => {
    const current = getCurrentCount(p)
    const next = getNextMilestone(p)
    if (!next) return 100

    const prev = milestones.filter(m => m.count < next.count).pop()
    const start = prev?.count || 0
    const range = next.count - start
    const progress = current - start

    return Math.min((progress / range) * 100, 100)
  }

  const getGrowthRate = (p: Platform) => {
    const platformEntries = getPlatformEntries(p)
    if (platformEntries.length < 2) return null

    const recent = platformEntries.slice(-7)
    if (recent.length < 2) return null

    const oldest = recent[0]
    const newest = recent[recent.length - 1]
    const daysDiff = Math.ceil((new Date(newest.date).getTime() - new Date(oldest.date).getTime()) / (1000 * 60 * 60 * 24)) || 1

    return Math.round((newest.count - oldest.count) / daysDiff)
  }

  const platformColors: Record<Platform, string> = {
    instagram: 'bg-gradient-to-r from-purple-500 to-pink-500',
    youtube: 'bg-red-600',
    tiktok: 'bg-slate-800',
    twitter: 'bg-blue-400'
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2">
        {(['instagram', 'youtube', 'tiktok', 'twitter'] as const).map(p => {
          const current = getCurrentCount(p)
          return (
            <div key={p} className="card p-3 text-center">
              <div className={`w-8 h-8 rounded mx-auto mb-2 ${platformColors[p]}`} />
              <div className="text-lg font-bold">{current.toLocaleString()}</div>
              <div className="text-xs text-slate-500 capitalize">{p}</div>
            </div>
          )
        })}
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.followerMilestoneTracker.logUpdate')}
        </h3>
        <div className="space-y-3">
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

          <div className="flex gap-2">
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              placeholder={t('tools.followerMilestoneTracker.followerCount')}
              className="flex-1 px-3 py-2 border border-slate-300 rounded"
            />
            <button
              onClick={addEntry}
              disabled={!count}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {t('tools.followerMilestoneTracker.log')}
            </button>
          </div>

          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t('tools.followerMilestoneTracker.notes')}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>
      </div>

      {(['instagram', 'youtube', 'tiktok', 'twitter'] as const).map(p => {
        const platformEntries = getPlatformEntries(p)
        const next = getNextMilestone(p)
        const progress = getProgress(p)
        const growthRate = getGrowthRate(p)

        if (platformEntries.length === 0) return null

        return (
          <div key={p} className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium capitalize">{p}</h3>
              {growthRate !== null && (
                <span className={`text-sm ${growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {growthRate >= 0 ? '+' : ''}{growthRate}/day
                </span>
              )}
            </div>

            {next && (
              <div className="mb-3">
                <div className="flex justify-between text-sm text-slate-600 mb-1">
                  <span>{t('tools.followerMilestoneTracker.nextMilestone')}: {next.label}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${platformColors[p]}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {(next.count - getCurrentCount(p)).toLocaleString()} {t('tools.followerMilestoneTracker.toGo')}
                </div>
              </div>
            )}

            <div className="space-y-1 max-h-32 overflow-y-auto">
              {platformEntries.slice().reverse().slice(0, 5).map(entry => (
                <div key={entry.id} className="flex items-center justify-between text-sm bg-slate-50 p-2 rounded">
                  <div>
                    <span className="font-medium">{entry.count.toLocaleString()}</span>
                    <span className="text-slate-500 ml-2">{new Date(entry.date).toLocaleDateString()}</span>
                  </div>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      <div className="card p-4 bg-blue-50">
        <h3 className="font-medium text-slate-700 mb-2">{t('tools.followerMilestoneTracker.milestones')}</h3>
        <div className="flex flex-wrap gap-2">
          {milestones.map(m => (
            <span key={m.count} className="px-2 py-1 bg-white rounded text-sm">
              {m.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
