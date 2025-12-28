import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface DebateFormat {
  id: string
  name: string
  rounds: { name: string; duration: number; side: 'affirmative' | 'negative' | 'both' }[]
}

export default function DebateTimer() {
  const { t } = useTranslation()
  const [formatId, setFormatId] = useState('lincoln')
  const [currentRound, setCurrentRound] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState<'setup' | 'debate' | 'finished'>('setup')
  const intervalRef = useRef<number | null>(null)

  const formats: DebateFormat[] = [
    {
      id: 'lincoln',
      name: t('tools.debateTimer.lincolnDouglas'),
      rounds: [
        { name: 'Affirmative Constructive', duration: 360, side: 'affirmative' },
        { name: 'Cross-Examination (by Neg)', duration: 180, side: 'negative' },
        { name: 'Negative Constructive', duration: 420, side: 'negative' },
        { name: 'Cross-Examination (by Aff)', duration: 180, side: 'affirmative' },
        { name: 'Affirmative Rebuttal', duration: 240, side: 'affirmative' },
        { name: 'Negative Rebuttal', duration: 360, side: 'negative' },
        { name: 'Affirmative Rebuttal', duration: 180, side: 'affirmative' },
      ],
    },
    {
      id: 'policy',
      name: t('tools.debateTimer.policy'),
      rounds: [
        { name: '1st Affirmative Constructive', duration: 480, side: 'affirmative' },
        { name: 'Cross-Ex', duration: 180, side: 'both' },
        { name: '1st Negative Constructive', duration: 480, side: 'negative' },
        { name: 'Cross-Ex', duration: 180, side: 'both' },
        { name: '2nd Affirmative Constructive', duration: 480, side: 'affirmative' },
        { name: 'Cross-Ex', duration: 180, side: 'both' },
        { name: '2nd Negative Constructive', duration: 480, side: 'negative' },
        { name: 'Cross-Ex', duration: 180, side: 'both' },
        { name: '1st Negative Rebuttal', duration: 300, side: 'negative' },
        { name: '1st Affirmative Rebuttal', duration: 300, side: 'affirmative' },
        { name: '2nd Negative Rebuttal', duration: 300, side: 'negative' },
        { name: '2nd Affirmative Rebuttal', duration: 300, side: 'affirmative' },
      ],
    },
    {
      id: 'simple',
      name: t('tools.debateTimer.simple'),
      rounds: [
        { name: 'Opening - Team A', duration: 180, side: 'affirmative' },
        { name: 'Opening - Team B', duration: 180, side: 'negative' },
        { name: 'Rebuttal - Team A', duration: 120, side: 'affirmative' },
        { name: 'Rebuttal - Team B', duration: 120, side: 'negative' },
        { name: 'Closing - Team A', duration: 120, side: 'affirmative' },
        { name: 'Closing - Team B', duration: 120, side: 'negative' },
      ],
    },
  ]

  const currentFormat = formats.find(f => f.id === formatId)!

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const startDebate = () => {
    setCurrentRound(0)
    setTimeLeft(currentFormat.rounds[0].duration)
    setMode('debate')
  }

  const toggleTimer = () => {
    if (isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      setIsRunning(false)
    } else {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current)
            setIsRunning(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      setIsRunning(true)
    }
  }

  const nextRound = () => {
    if (currentRound < currentFormat.rounds.length - 1) {
      setCurrentRound(currentRound + 1)
      setTimeLeft(currentFormat.rounds[currentRound + 1].duration)
      setIsRunning(false)
      if (intervalRef.current) clearInterval(intervalRef.current)
    } else {
      setMode('finished')
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getSideColor = (side: string) => {
    if (side === 'affirmative') return 'bg-blue-100 text-blue-700'
    if (side === 'negative') return 'bg-red-100 text-red-700'
    return 'bg-purple-100 text-purple-700'
  }

  return (
    <div className="space-y-4">
      {mode === 'setup' && (
        <>
          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.debateTimer.selectFormat')}
            </h3>
            <div className="space-y-2">
              {formats.map(format => (
                <button
                  key={format.id}
                  onClick={() => setFormatId(format.id)}
                  className={`w-full p-3 rounded text-left ${formatId === format.id ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
                >
                  <div className="font-medium">{format.name}</div>
                  <div className="text-xs opacity-75">
                    {format.rounds.length} {t('tools.debateTimer.rounds')}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.debateTimer.schedule')}
            </h3>
            <div className="space-y-2">
              {currentFormat.rounds.map((round, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span>{round.name}</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${getSideColor(round.side)}`}>
                    {formatTime(round.duration)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={startDebate}
            className="w-full py-3 bg-blue-500 text-white rounded font-medium"
          >
            {t('tools.debateTimer.startDebate')}
          </button>
        </>
      )}

      {mode === 'debate' && (
        <>
          <div className="card p-6 text-center">
            <div className="text-sm text-slate-500 mb-2">
              {t('tools.debateTimer.round')} {currentRound + 1} / {currentFormat.rounds.length}
            </div>
            <div className={`inline-block px-4 py-1 rounded mb-4 ${getSideColor(currentFormat.rounds[currentRound].side)}`}>
              {currentFormat.rounds[currentRound].name}
            </div>
            <div className={`text-6xl font-mono font-bold mb-6 ${timeLeft <= 30 ? 'text-red-600' : ''}`}>
              {formatTime(timeLeft)}
            </div>
            <div className="flex gap-2">
              <button
                onClick={toggleTimer}
                className={`flex-1 py-3 rounded font-medium ${isRunning ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white'}`}
              >
                {isRunning ? t('tools.debateTimer.pause') : t('tools.debateTimer.start')}
              </button>
              <button
                onClick={nextRound}
                className="flex-1 py-3 bg-blue-500 text-white rounded font-medium"
              >
                {currentRound < currentFormat.rounds.length - 1 ? t('tools.debateTimer.nextRound') : t('tools.debateTimer.finish')}
              </button>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-2">
              {t('tools.debateTimer.upcoming')}
            </h3>
            <div className="space-y-1">
              {currentFormat.rounds.slice(currentRound + 1, currentRound + 4).map((round, i) => (
                <div key={i} className="text-sm text-slate-500 flex justify-between">
                  <span>{round.name}</span>
                  <span>{formatTime(round.duration)}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {mode === 'finished' && (
        <div className="card p-6 text-center">
          <div className="text-4xl mb-4">🎉</div>
          <div className="text-xl font-bold mb-2">{t('tools.debateTimer.debateComplete')}</div>
          <p className="text-slate-500 mb-4">{t('tools.debateTimer.wellDone')}</p>
          <button
            onClick={() => setMode('setup')}
            className="py-2 px-6 bg-blue-500 text-white rounded font-medium"
          >
            {t('tools.debateTimer.newDebate')}
          </button>
        </div>
      )}
    </div>
  )
}
