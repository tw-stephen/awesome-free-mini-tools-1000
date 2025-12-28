import { useState, useRef, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

type NoiseType = 'white' | 'pink' | 'brown' | 'blue'

export default function WhiteNoiseGenerator() {
  const { t } = useTranslation()
  const [isPlaying, setIsPlaying] = useState(false)
  const [noiseType, setNoiseType] = useState<NoiseType>('white')
  const [volume, setVolume] = useState(0.3)
  const [timer, setTimer] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)

  const audioContextRef = useRef<AudioContext | null>(null)
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const timerRef = useRef<number | null>(null)

  const createNoiseBuffer = useCallback((audioContext: AudioContext, type: NoiseType): AudioBuffer => {
    const bufferSize = audioContext.sampleRate * 2 // 2 seconds buffer
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
    const data = buffer.getChannelData(0)

    switch (type) {
      case 'white':
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1
        }
        break
      case 'pink':
        {
          let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1
            b0 = 0.99886 * b0 + white * 0.0555179
            b1 = 0.99332 * b1 + white * 0.0750759
            b2 = 0.96900 * b2 + white * 0.1538520
            b3 = 0.86650 * b3 + white * 0.3104856
            b4 = 0.55000 * b4 + white * 0.5329522
            b5 = -0.7616 * b5 - white * 0.0168980
            data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11
            b6 = white * 0.115926
          }
        }
        break
      case 'brown':
        {
          let lastOut = 0
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1
            data[i] = (lastOut + 0.02 * white) / 1.02
            lastOut = data[i]
            data[i] *= 3.5
          }
        }
        break
      case 'blue':
        {
          let b0 = 0, b1 = 0, b2 = 0
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1
            data[i] = white - b0 + b1 * 0.5 - b2 * 0.25
            b2 = b1
            b1 = b0
            b0 = white
          }
        }
        break
    }

    return buffer
  }, [])

  const startNoise = useCallback(() => {
    if (isPlaying) return

    const audioContext = new AudioContext()
    const noiseBuffer = createNoiseBuffer(audioContext, noiseType)

    const source = audioContext.createBufferSource()
    source.buffer = noiseBuffer
    source.loop = true

    const gainNode = audioContext.createGain()
    gainNode.gain.value = volume

    source.connect(gainNode)
    gainNode.connect(audioContext.destination)

    source.start()

    audioContextRef.current = audioContext
    noiseSourceRef.current = source
    gainNodeRef.current = gainNode

    setIsPlaying(true)

    if (timer > 0) {
      setTimeRemaining(timer * 60)
      timerRef.current = window.setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            stopNoise()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
  }, [isPlaying, noiseType, volume, timer, createNoiseBuffer])

  const stopNoise = useCallback(() => {
    if (noiseSourceRef.current) {
      noiseSourceRef.current.stop()
      noiseSourceRef.current.disconnect()
    }

    if (audioContextRef.current) {
      audioContextRef.current.close()
    }

    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    noiseSourceRef.current = null
    audioContextRef.current = null
    gainNodeRef.current = null

    setIsPlaying(false)
    setTimeRemaining(0)
  }, [])

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = newVolume
    }
  }

  const handleNoiseTypeChange = (type: NoiseType) => {
    setNoiseType(type)
    if (isPlaying) {
      stopNoise()
      setTimeout(() => {
        const audioContext = new AudioContext()
        const noiseBuffer = createNoiseBuffer(audioContext, type)

        const source = audioContext.createBufferSource()
        source.buffer = noiseBuffer
        source.loop = true

        const gainNode = audioContext.createGain()
        gainNode.gain.value = volume

        source.connect(gainNode)
        gainNode.connect(audioContext.destination)

        source.start()

        audioContextRef.current = audioContext
        noiseSourceRef.current = source
        gainNodeRef.current = gainNode

        setIsPlaying(true)
      }, 100)
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    return () => {
      stopNoise()
    }
  }, [stopNoise])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex flex-col items-center space-y-6">
          <div className={`w-32 h-32 rounded-full flex items-center justify-center ${
            isPlaying ? 'bg-blue-500 animate-pulse' : 'bg-slate-200'
          }`}>
            <div className="text-4xl">
              {isPlaying ? '🔊' : '🔇'}
            </div>
          </div>

          {timeRemaining > 0 && (
            <div className="text-2xl font-mono text-slate-600">
              {formatTime(timeRemaining)}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="primary"
              onClick={isPlaying ? stopNoise : startNoise}
            >
              {isPlaying ? t('tools.whiteNoiseGenerator.stop') : t('tools.whiteNoiseGenerator.start')}
            </Button>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.whiteNoiseGenerator.noiseType')}
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { type: 'white' as NoiseType, label: t('tools.whiteNoiseGenerator.white'), desc: t('tools.whiteNoiseGenerator.whiteDesc') },
            { type: 'pink' as NoiseType, label: t('tools.whiteNoiseGenerator.pink'), desc: t('tools.whiteNoiseGenerator.pinkDesc') },
            { type: 'brown' as NoiseType, label: t('tools.whiteNoiseGenerator.brown'), desc: t('tools.whiteNoiseGenerator.brownDesc') },
            { type: 'blue' as NoiseType, label: t('tools.whiteNoiseGenerator.blue'), desc: t('tools.whiteNoiseGenerator.blueDesc') },
          ].map(({ type, label, desc }) => (
            <button
              key={type}
              onClick={() => handleNoiseTypeChange(type)}
              className={`p-3 rounded-lg text-left transition ${
                noiseType === type
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <div className="font-medium">{label}</div>
              <div className={`text-xs ${noiseType === type ? 'text-blue-100' : 'text-slate-400'}`}>
                {desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.whiteNoiseGenerator.settings')}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-600 mb-2">
              {t('tools.whiteNoiseGenerator.volume')}: {Math.round(volume * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-2">
              {t('tools.whiteNoiseGenerator.timer')}: {timer > 0 ? `${timer} ${t('tools.whiteNoiseGenerator.minutes')}` : t('tools.whiteNoiseGenerator.noTimer')}
            </label>
            <div className="flex flex-wrap gap-2">
              {[0, 5, 15, 30, 60, 120].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setTimer(mins)}
                  disabled={isPlaying}
                  className={`px-3 py-1 text-sm rounded ${
                    timer === mins
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50'
                  }`}
                >
                  {mins === 0 ? t('tools.whiteNoiseGenerator.off') : `${mins}m`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.whiteNoiseGenerator.about')}
        </h3>
        <p className="text-sm text-slate-500">
          {t('tools.whiteNoiseGenerator.aboutDesc')}
        </p>
      </div>
    </div>
  )
}
