import { useState, useRef, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

export default function Metronome() {
  const { t } = useTranslation()
  const [bpm, setBpm] = useState(120)
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentBeat, setCurrentBeat] = useState(0)
  const [accentFirst, setAccentFirst] = useState(true)
  const [volume, setVolume] = useState(0.7)

  const audioContextRef = useRef<AudioContext | null>(null)
  const nextNoteTimeRef = useRef(0)
  const timerIdRef = useRef<number | null>(null)
  const beatRef = useRef(0)

  const scheduleNote = useCallback((time: number, isAccent: boolean) => {
    const audioContext = audioContextRef.current
    if (!audioContext) return

    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.type = 'sine'
    oscillator.frequency.value = isAccent && accentFirst ? 880 : 440

    gainNode.gain.setValueAtTime(volume, time)
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.1)

    oscillator.start(time)
    oscillator.stop(time + 0.1)
  }, [volume, accentFirst])

  const scheduler = useCallback(() => {
    const audioContext = audioContextRef.current
    if (!audioContext) return

    const lookahead = 0.1
    const scheduleAheadTime = 0.1

    while (nextNoteTimeRef.current < audioContext.currentTime + scheduleAheadTime) {
      const isAccent = beatRef.current === 0
      scheduleNote(nextNoteTimeRef.current, isAccent)

      setCurrentBeat(beatRef.current)
      beatRef.current = (beatRef.current + 1) % beatsPerMeasure

      const secondsPerBeat = 60.0 / bpm
      nextNoteTimeRef.current += secondsPerBeat
    }

    timerIdRef.current = window.setTimeout(scheduler, lookahead * 1000)
  }, [bpm, beatsPerMeasure, scheduleNote])

  const startMetronome = useCallback(() => {
    if (isPlaying) return

    const audioContext = new AudioContext()
    audioContextRef.current = audioContext

    beatRef.current = 0
    nextNoteTimeRef.current = audioContext.currentTime

    scheduler()
    setIsPlaying(true)
  }, [isPlaying, scheduler])

  const stopMetronome = useCallback(() => {
    if (timerIdRef.current !== null) {
      clearTimeout(timerIdRef.current)
      timerIdRef.current = null
    }

    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }

    setIsPlaying(false)
    setCurrentBeat(0)
    beatRef.current = 0
  }, [])

  const toggleMetronome = () => {
    if (isPlaying) {
      stopMetronome()
    } else {
      startMetronome()
    }
  }

  const handleBpmChange = (newBpm: number) => {
    setBpm(Math.max(20, Math.min(300, newBpm)))
  }

  const tapTempo = (() => {
    const taps: number[] = []
    return () => {
      const now = Date.now()
      taps.push(now)

      // Keep only last 4 taps
      while (taps.length > 4) {
        taps.shift()
      }

      if (taps.length >= 2) {
        const intervals = []
        for (let i = 1; i < taps.length; i++) {
          intervals.push(taps[i] - taps[i - 1])
        }
        const avgInterval = intervals.reduce((a, b) => a + b) / intervals.length
        const newBpm = Math.round(60000 / avgInterval)
        handleBpmChange(newBpm)
      }
    }
  })()

  useEffect(() => {
    return () => {
      stopMetronome()
    }
  }, [stopMetronome])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex flex-col items-center space-y-6">
          <div className="text-6xl font-bold text-slate-700">
            {bpm}
          </div>
          <div className="text-lg text-slate-500">BPM</div>

          <div className="flex gap-2">
            {Array.from({ length: beatsPerMeasure }).map((_, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-full transition-all ${
                  isPlaying && currentBeat === i
                    ? i === 0 && accentFirst
                      ? 'bg-blue-500 scale-125'
                      : 'bg-green-500 scale-110'
                    : 'bg-slate-200'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <Button variant="primary" onClick={toggleMetronome}>
              {isPlaying ? t('tools.metronome.stop') : t('tools.metronome.start')}
            </Button>
            <Button variant="secondary" onClick={tapTempo}>
              {t('tools.metronome.tap')}
            </Button>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.metronome.tempoSettings')}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-600 mb-2">
              {t('tools.metronome.tempo')}: {bpm} BPM
            </label>
            <input
              type="range"
              min="20"
              max="300"
              value={bpm}
              onChange={(e) => handleBpmChange(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>20</span>
              <span>120</span>
              <span>300</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => handleBpmChange(bpm - 10)}
            >
              -10
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleBpmChange(bpm - 1)}
            >
              -1
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleBpmChange(bpm + 1)}
            >
              +1
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleBpmChange(bpm + 10)}
            >
              +10
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-slate-600">{t('tools.metronome.presets')}:</span>
            {[
              { label: 'Largo (50)', bpm: 50 },
              { label: 'Adagio (70)', bpm: 70 },
              { label: 'Andante (90)', bpm: 90 },
              { label: 'Moderato (110)', bpm: 110 },
              { label: 'Allegro (140)', bpm: 140 },
              { label: 'Presto (180)', bpm: 180 },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => handleBpmChange(preset.bpm)}
                className="px-3 py-1 text-sm bg-slate-100 text-slate-600 rounded hover:bg-slate-200"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.metronome.beatSettings')}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-600 mb-2">
              {t('tools.metronome.beatsPerMeasure')}
            </label>
            <div className="flex flex-wrap gap-2">
              {[2, 3, 4, 5, 6, 7, 8].map((beats) => (
                <button
                  key={beats}
                  onClick={() => setBeatsPerMeasure(beats)}
                  className={`w-10 h-10 text-sm rounded-lg ${
                    beatsPerMeasure === beats
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {beats}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={accentFirst}
              onChange={(e) => setAccentFirst(e.target.checked)}
            />
            <span className="text-sm text-slate-600">
              {t('tools.metronome.accentFirst')}
            </span>
          </label>

          <div>
            <label className="block text-sm text-slate-600 mb-2">
              {t('tools.metronome.volume')}: {Math.round(volume * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
