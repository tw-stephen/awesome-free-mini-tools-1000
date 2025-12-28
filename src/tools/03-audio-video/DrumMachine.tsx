import { useState, useRef, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

type DrumSound = 'kick' | 'snare' | 'hihat' | 'clap'

const STEPS = 16
const SOUNDS: DrumSound[] = ['kick', 'snare', 'hihat', 'clap']

export default function DrumMachine() {
  const { t } = useTranslation()
  const [isPlaying, setIsPlaying] = useState(false)
  const [bpm, setBpm] = useState(120)
  const [currentStep, setCurrentStep] = useState(0)
  const [pattern, setPattern] = useState<Record<DrumSound, boolean[]>>({
    kick: Array(STEPS).fill(false),
    snare: Array(STEPS).fill(false),
    hihat: Array(STEPS).fill(false),
    clap: Array(STEPS).fill(false),
  })
  const [volume, setVolume] = useState(0.7)

  const audioContextRef = useRef<AudioContext | null>(null)
  const intervalRef = useRef<number | null>(null)

  const createDrumSound = useCallback((type: DrumSound) => {
    const audioContext = audioContextRef.current
    if (!audioContext) return

    const gainNode = audioContext.createGain()
    gainNode.connect(audioContext.destination)
    gainNode.gain.value = volume

    const now = audioContext.currentTime

    switch (type) {
      case 'kick': {
        const osc = audioContext.createOscillator()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(150, now)
        osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.5)
        gainNode.gain.setValueAtTime(1, now)
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5)
        osc.connect(gainNode)
        osc.start(now)
        osc.stop(now + 0.5)
        break
      }
      case 'snare': {
        const noise = audioContext.createBufferSource()
        const bufferSize = audioContext.sampleRate * 0.2
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
        const output = buffer.getChannelData(0)
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1
        }
        noise.buffer = buffer

        const filter = audioContext.createBiquadFilter()
        filter.type = 'highpass'
        filter.frequency.value = 1000

        gainNode.gain.setValueAtTime(0.8, now)
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2)

        noise.connect(filter)
        filter.connect(gainNode)
        noise.start(now)
        noise.stop(now + 0.2)
        break
      }
      case 'hihat': {
        const noise = audioContext.createBufferSource()
        const bufferSize = audioContext.sampleRate * 0.05
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
        const output = buffer.getChannelData(0)
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1
        }
        noise.buffer = buffer

        const filter = audioContext.createBiquadFilter()
        filter.type = 'highpass'
        filter.frequency.value = 5000

        gainNode.gain.setValueAtTime(0.3, now)
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05)

        noise.connect(filter)
        filter.connect(gainNode)
        noise.start(now)
        noise.stop(now + 0.05)
        break
      }
      case 'clap': {
        const noise = audioContext.createBufferSource()
        const bufferSize = audioContext.sampleRate * 0.15
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
        const output = buffer.getChannelData(0)
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1
        }
        noise.buffer = buffer

        const filter = audioContext.createBiquadFilter()
        filter.type = 'bandpass'
        filter.frequency.value = 2000

        gainNode.gain.setValueAtTime(0.5, now)
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15)

        noise.connect(filter)
        filter.connect(gainNode)
        noise.start(now)
        noise.stop(now + 0.15)
        break
      }
    }
  }, [volume])

  const playStep = useCallback((step: number) => {
    SOUNDS.forEach((sound) => {
      if (pattern[sound][step]) {
        createDrumSound(sound)
      }
    })
    setCurrentStep(step)
  }, [pattern, createDrumSound])

  const startPlaying = useCallback(() => {
    if (isPlaying) return

    const audioContext = new AudioContext()
    audioContextRef.current = audioContext

    setIsPlaying(true)

    let step = 0
    const stepDuration = (60 / bpm) * 1000 / 4 // 16th notes

    playStep(step)

    intervalRef.current = window.setInterval(() => {
      step = (step + 1) % STEPS
      playStep(step)
    }, stepDuration)
  }, [isPlaying, bpm, playStep])

  const stopPlaying = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }

    setIsPlaying(false)
    setCurrentStep(0)
  }, [])

  const toggleStep = (sound: DrumSound, step: number) => {
    setPattern((prev) => ({
      ...prev,
      [sound]: prev[sound].map((v, i) => (i === step ? !v : v)),
    }))
  }

  const clearPattern = () => {
    setPattern({
      kick: Array(STEPS).fill(false),
      snare: Array(STEPS).fill(false),
      hihat: Array(STEPS).fill(false),
      clap: Array(STEPS).fill(false),
    })
  }

  const presetRock = () => {
    setPattern({
      kick: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
      snare: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
      hihat: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
      clap: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    })
  }

  const presetDisco = () => {
    setPattern({
      kick: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
      snare: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
      hihat: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
      clap: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
    })
  }

  useEffect(() => {
    return () => {
      stopPlaying()
    }
  }, [stopPlaying])

  const getSoundLabel = (sound: DrumSound): string => {
    const labels: Record<DrumSound, string> = {
      kick: t('tools.drumMachine.kick'),
      snare: t('tools.drumMachine.snare'),
      hihat: t('tools.drumMachine.hihat'),
      clap: t('tools.drumMachine.clap'),
    }
    return labels[sound]
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <Button
            variant="primary"
            onClick={isPlaying ? stopPlaying : startPlaying}
          >
            {isPlaying ? t('tools.drumMachine.stop') : t('tools.drumMachine.play')}
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">{bpm} BPM</span>
            <input
              type="range"
              min="60"
              max="200"
              value={bpm}
              onChange={(e) => setBpm(parseInt(e.target.value))}
              className="w-24"
              disabled={isPlaying}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">{t('tools.drumMachine.volume')}</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-24"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-sm text-slate-500 w-20" />
                {Array.from({ length: STEPS }).map((_, i) => (
                  <th
                    key={i}
                    className={`text-center text-xs w-8 ${
                      i === currentStep && isPlaying ? 'text-blue-500 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SOUNDS.map((sound) => (
                <tr key={sound}>
                  <td className="text-sm font-medium text-slate-600 py-1">
                    <button
                      onClick={() => createDrumSound(sound)}
                      className="hover:text-blue-500"
                    >
                      {getSoundLabel(sound)}
                    </button>
                  </td>
                  {pattern[sound].map((active, i) => (
                    <td key={i} className="p-0.5">
                      <button
                        onClick={() => toggleStep(sound, i)}
                        className={`w-6 h-6 rounded ${
                          active
                            ? 'bg-blue-500'
                            : i === currentStep && isPlaying
                            ? 'bg-blue-200'
                            : i % 4 === 0
                            ? 'bg-slate-200'
                            : 'bg-slate-100'
                        }`}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.drumMachine.presets')}
        </h3>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={presetRock}>
            {t('tools.drumMachine.rock')}
          </Button>
          <Button variant="secondary" onClick={presetDisco}>
            {t('tools.drumMachine.disco')}
          </Button>
          <Button variant="secondary" onClick={clearPattern}>
            {t('tools.drumMachine.clear')}
          </Button>
        </div>
      </div>
    </div>
  )
}
