import { useState, useRef, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

export default function BpmCounter() {
  const { t } = useTranslation()
  const [bpm, setBpm] = useState<number | null>(null)
  const [taps, setTaps] = useState<number[]>([])
  const [isListening, setIsListening] = useState(false)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [analyzedBpm, setAnalyzedBpm] = useState<number | null>(null)
  const [analyzing, setAnalyzing] = useState(false)

  const audioContextRef = useRef<AudioContext | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleTap = useCallback(() => {
    const now = Date.now()
    const newTaps = [...taps, now].filter((t) => now - t < 5000) // Keep taps from last 5 seconds

    setTaps(newTaps)

    if (newTaps.length >= 2) {
      const intervals: number[] = []
      for (let i = 1; i < newTaps.length; i++) {
        intervals.push(newTaps[i] - newTaps[i - 1])
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
      const calculatedBpm = Math.round(60000 / avgInterval)
      setBpm(calculatedBpm)
    }
  }, [taps])

  const resetTaps = () => {
    setTaps([])
    setBpm(null)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file)
      setAnalyzedBpm(null)
    }
  }

  const analyzeAudio = useCallback(async () => {
    if (!audioFile) return

    setAnalyzing(true)

    try {
      const audioContext = new AudioContext()
      audioContextRef.current = audioContext

      const arrayBuffer = await audioFile.arrayBuffer()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

      // Simple beat detection using energy peaks
      const channelData = audioBuffer.getChannelData(0)
      const sampleRate = audioBuffer.sampleRate

      // Calculate energy in windows
      const windowSize = Math.floor(sampleRate * 0.02) // 20ms windows
      const energies: number[] = []

      for (let i = 0; i < channelData.length - windowSize; i += windowSize) {
        let energy = 0
        for (let j = 0; j < windowSize; j++) {
          energy += channelData[i + j] * channelData[i + j]
        }
        energies.push(energy / windowSize)
      }

      // Find peaks (beats)
      const threshold = energies.reduce((a, b) => a + b, 0) / energies.length * 1.5
      const peaks: number[] = []

      for (let i = 1; i < energies.length - 1; i++) {
        if (energies[i] > threshold && energies[i] > energies[i - 1] && energies[i] > energies[i + 1]) {
          peaks.push(i)
        }
      }

      // Calculate BPM from peak intervals
      if (peaks.length >= 2) {
        const intervals: number[] = []
        for (let i = 1; i < peaks.length; i++) {
          intervals.push(peaks[i] - peaks[i - 1])
        }

        // Find most common interval
        const intervalCounts: Record<number, number> = {}
        intervals.forEach((interval) => {
          const rounded = Math.round(interval / 2) * 2 // Round to even numbers
          intervalCounts[rounded] = (intervalCounts[rounded] || 0) + 1
        })

        let mostCommonInterval = 0
        let maxCount = 0
        Object.entries(intervalCounts).forEach(([interval, count]) => {
          if (count > maxCount) {
            maxCount = count
            mostCommonInterval = parseInt(interval)
          }
        })

        if (mostCommonInterval > 0) {
          const windowsPerSecond = sampleRate / windowSize
          const beatsPerSecond = windowsPerSecond / mostCommonInterval
          const calculatedBpm = Math.round(beatsPerSecond * 60)

          // Normalize to common BPM range (60-180)
          let normalizedBpm = calculatedBpm
          while (normalizedBpm > 180) normalizedBpm /= 2
          while (normalizedBpm < 60) normalizedBpm *= 2

          setAnalyzedBpm(normalizedBpm)
        }
      }

      audioContext.close()
    } catch (error) {
      console.error('Failed to analyze audio:', error)
    } finally {
      setAnalyzing(false)
    }
  }, [audioFile])

  // Keyboard event for tapping
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && isListening) {
        e.preventDefault()
        handleTap()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isListening, handleTap])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex flex-col items-center space-y-6">
          <div className="text-6xl font-bold text-slate-700">
            {bpm !== null ? bpm : '--'}
          </div>
          <div className="text-lg text-slate-500">BPM</div>

          <div className="text-sm text-slate-400">
            {taps.length} {t('tools.bpmCounter.taps')}
          </div>

          <div className="flex gap-2">
            <Button
              variant="primary"
              onClick={() => {
                setIsListening(true)
                handleTap()
              }}
              className="w-32 h-32 text-xl"
            >
              {t('tools.bpmCounter.tap')}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setIsListening(!isListening)}
            >
              {isListening ? t('tools.bpmCounter.stopListening') : t('tools.bpmCounter.startListening')}
            </Button>
            <Button variant="secondary" onClick={resetTaps}>
              {t('tools.bpmCounter.reset')}
            </Button>
          </div>

          {isListening && (
            <div className="text-sm text-slate-500">
              {t('tools.bpmCounter.spaceHint')}
            </div>
          )}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.bpmCounter.audioAnalysis')}
        </h3>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileSelect}
              className="hidden"
              id="bpm-audio-input"
            />
            <label
              htmlFor="bpm-audio-input"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition"
            >
              {t('tools.bpmCounter.selectAudio')}
            </label>
            {audioFile && (
              <Button
                variant="primary"
                onClick={analyzeAudio}
                disabled={analyzing}
              >
                {analyzing ? t('tools.bpmCounter.analyzing') : t('tools.bpmCounter.analyze')}
              </Button>
            )}
          </div>

          {audioFile && (
            <div className="text-sm text-slate-600">
              {audioFile.name}
            </div>
          )}

          {analyzedBpm !== null && (
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <div className="text-3xl font-bold text-green-600">
                {analyzedBpm} BPM
              </div>
              <div className="text-sm text-green-500 mt-1">
                {t('tools.bpmCounter.detected')}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.bpmCounter.tempoGuide')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-slate-500">
          <div>Largo: 40-60</div>
          <div>Adagio: 60-80</div>
          <div>Andante: 80-100</div>
          <div>Moderato: 100-120</div>
          <div>Allegro: 120-140</div>
          <div>Vivace: 140-160</div>
          <div>Presto: 160-180</div>
          <div>Prestissimo: 180+</div>
        </div>
      </div>
    </div>
  )
}
