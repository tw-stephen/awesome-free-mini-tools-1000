import { useState, useRef, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

type PresetType = 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma' | 'custom'

const PRESETS: Record<PresetType, { frequency: number; label: string; description: string }> = {
  delta: { frequency: 2, label: 'Delta (0.5-4 Hz)', description: 'Deep sleep' },
  theta: { frequency: 6, label: 'Theta (4-8 Hz)', description: 'Meditation' },
  alpha: { frequency: 10, label: 'Alpha (8-14 Hz)', description: 'Relaxation' },
  beta: { frequency: 20, label: 'Beta (14-30 Hz)', description: 'Focus' },
  gamma: { frequency: 40, label: 'Gamma (30-50 Hz)', description: 'Peak concentration' },
  custom: { frequency: 10, label: 'Custom', description: 'Set your own' },
}

export default function BinauralBeats() {
  const { t } = useTranslation()
  const [isPlaying, setIsPlaying] = useState(false)
  const [baseFrequency, setBaseFrequency] = useState(200)
  const [beatFrequency, setBeatFrequency] = useState(10)
  const [volume, setVolume] = useState(0.3)
  const [preset, setPreset] = useState<PresetType>('alpha')

  const audioContextRef = useRef<AudioContext | null>(null)
  const leftOscillatorRef = useRef<OscillatorNode | null>(null)
  const rightOscillatorRef = useRef<OscillatorNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)

  const startBeats = useCallback(() => {
    if (isPlaying) return

    const audioContext = new AudioContext()
    audioContextRef.current = audioContext

    // Create stereo panner
    const merger = audioContext.createChannelMerger(2)
    const gainNode = audioContext.createGain()
    gainNode.gain.value = volume

    // Left ear oscillator
    const leftOscillator = audioContext.createOscillator()
    leftOscillator.type = 'sine'
    leftOscillator.frequency.value = baseFrequency

    const leftGain = audioContext.createGain()
    leftOscillator.connect(leftGain)
    leftGain.connect(merger, 0, 0)

    // Right ear oscillator (base + beat frequency)
    const rightOscillator = audioContext.createOscillator()
    rightOscillator.type = 'sine'
    rightOscillator.frequency.value = baseFrequency + beatFrequency

    const rightGain = audioContext.createGain()
    rightOscillator.connect(rightGain)
    rightGain.connect(merger, 0, 1)

    merger.connect(gainNode)
    gainNode.connect(audioContext.destination)

    leftOscillator.start()
    rightOscillator.start()

    leftOscillatorRef.current = leftOscillator
    rightOscillatorRef.current = rightOscillator
    gainNodeRef.current = gainNode

    setIsPlaying(true)
  }, [isPlaying, baseFrequency, beatFrequency, volume])

  const stopBeats = useCallback(() => {
    if (leftOscillatorRef.current) {
      leftOscillatorRef.current.stop()
      leftOscillatorRef.current.disconnect()
    }
    if (rightOscillatorRef.current) {
      rightOscillatorRef.current.stop()
      rightOscillatorRef.current.disconnect()
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
    }

    leftOscillatorRef.current = null
    rightOscillatorRef.current = null
    audioContextRef.current = null
    gainNodeRef.current = null

    setIsPlaying(false)
  }, [])

  const handlePresetChange = (p: PresetType) => {
    setPreset(p)
    if (p !== 'custom') {
      setBeatFrequency(PRESETS[p].frequency)
    }
  }

  const handleBeatFrequencyChange = (freq: number) => {
    setBeatFrequency(freq)
    setPreset('custom')

    if (rightOscillatorRef.current) {
      rightOscillatorRef.current.frequency.value = baseFrequency + freq
    }
  }

  const handleBaseFrequencyChange = (freq: number) => {
    setBaseFrequency(freq)

    if (leftOscillatorRef.current) {
      leftOscillatorRef.current.frequency.value = freq
    }
    if (rightOscillatorRef.current) {
      rightOscillatorRef.current.frequency.value = freq + beatFrequency
    }
  }

  const handleVolumeChange = (vol: number) => {
    setVolume(vol)
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = vol
    }
  }

  useEffect(() => {
    return () => {
      stopBeats()
    }
  }, [stopBeats])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex flex-col items-center space-y-6">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
            isPlaying ? 'bg-blue-500 animate-pulse' : 'bg-slate-200'
          }`}>
            <div className="text-3xl">
              {isPlaying ? '🎧' : '🔇'}
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-slate-700">
              {beatFrequency} Hz
            </div>
            <div className="text-sm text-slate-500">
              {t('tools.binauralBeats.beatFrequency')}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="primary"
              onClick={isPlaying ? stopBeats : startBeats}
            >
              {isPlaying ? t('tools.binauralBeats.stop') : t('tools.binauralBeats.start')}
            </Button>
          </div>

          <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
            ⚠️ {t('tools.binauralBeats.headphoneWarning')}
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.binauralBeats.presets')}
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {(Object.keys(PRESETS) as PresetType[]).map((p) => (
            <button
              key={p}
              onClick={() => handlePresetChange(p)}
              className={`p-3 rounded-lg text-left transition ${
                preset === p
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <div className="font-medium">{PRESETS[p].label}</div>
              <div className={`text-xs ${preset === p ? 'text-blue-100' : 'text-slate-400'}`}>
                {PRESETS[p].description}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.binauralBeats.settings')}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-600 mb-2">
              {t('tools.binauralBeats.beatFreq')}: {beatFrequency} Hz
            </label>
            <input
              type="range"
              min="0.5"
              max="50"
              step="0.5"
              value={beatFrequency}
              onChange={(e) => handleBeatFrequencyChange(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-2">
              {t('tools.binauralBeats.baseFreq')}: {baseFrequency} Hz
            </label>
            <input
              type="range"
              min="100"
              max="500"
              step="10"
              value={baseFrequency}
              onChange={(e) => handleBaseFrequencyChange(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-2">
              {t('tools.binauralBeats.volume')}: {Math.round(volume * 100)}%
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

          <div className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg">
            <strong>{t('tools.binauralBeats.leftEar')}:</strong> {baseFrequency} Hz<br />
            <strong>{t('tools.binauralBeats.rightEar')}:</strong> {baseFrequency + beatFrequency} Hz<br />
            <strong>{t('tools.binauralBeats.difference')}:</strong> {beatFrequency} Hz
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.binauralBeats.about')}
        </h3>
        <p className="text-sm text-slate-500">
          {t('tools.binauralBeats.aboutDesc')}
        </p>
      </div>
    </div>
  )
}
