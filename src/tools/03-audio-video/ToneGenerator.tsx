import { useState, useRef, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

type WaveType = 'sine' | 'square' | 'sawtooth' | 'triangle'

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

export default function ToneGenerator() {
  const { t } = useTranslation()
  const [frequency, setFrequency] = useState(440)
  const [waveType, setWaveType] = useState<WaveType>('sine')
  const [volume, setVolume] = useState(0.5)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(1)
  const [note, setNote] = useState('A')
  const [octave, setOctave] = useState(4)

  const audioContextRef = useRef<AudioContext | null>(null)
  const oscillatorRef = useRef<OscillatorNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)

  const noteToFrequency = (note: string, octave: number): number => {
    const noteIndex = NOTES.indexOf(note)
    const a4 = 440
    const a4Index = NOTES.indexOf('A')
    const a4Octave = 4
    const halfSteps = noteIndex - a4Index + (octave - a4Octave) * 12
    return a4 * Math.pow(2, halfSteps / 12)
  }

  const frequencyToNote = (freq: number): { note: string; octave: number } => {
    const a4 = 440
    const a4Index = NOTES.indexOf('A')
    const halfSteps = Math.round(12 * Math.log2(freq / a4))
    const totalIndex = a4Index + halfSteps + 4 * 12
    const noteIndex = ((totalIndex % 12) + 12) % 12
    const octave = Math.floor(totalIndex / 12)
    return { note: NOTES[noteIndex], octave }
  }

  const startTone = useCallback(() => {
    if (isPlaying) return

    const audioContext = new AudioContext()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.type = waveType
    oscillator.frequency.value = frequency
    gainNode.gain.value = volume

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.start()

    audioContextRef.current = audioContext
    oscillatorRef.current = oscillator
    gainNodeRef.current = gainNode

    setIsPlaying(true)
  }, [frequency, waveType, volume, isPlaying])

  const stopTone = useCallback(() => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop()
      oscillatorRef.current.disconnect()
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
    }

    oscillatorRef.current = null
    audioContextRef.current = null
    gainNodeRef.current = null
    setIsPlaying(false)
  }, [])

  const playToneForDuration = useCallback(() => {
    startTone()
    setTimeout(() => {
      stopTone()
    }, duration * 1000)
  }, [startTone, stopTone, duration])

  const handleFrequencyChange = (freq: number) => {
    setFrequency(freq)
    const { note: n, octave: o } = frequencyToNote(freq)
    setNote(n)
    setOctave(o)

    if (oscillatorRef.current) {
      oscillatorRef.current.frequency.value = freq
    }
  }

  const handleNoteChange = (n: string) => {
    setNote(n)
    const freq = noteToFrequency(n, octave)
    setFrequency(Math.round(freq * 100) / 100)

    if (oscillatorRef.current) {
      oscillatorRef.current.frequency.value = freq
    }
  }

  const handleOctaveChange = (o: number) => {
    setOctave(o)
    const freq = noteToFrequency(note, o)
    setFrequency(Math.round(freq * 100) / 100)

    if (oscillatorRef.current) {
      oscillatorRef.current.frequency.value = freq
    }
  }

  const handleVolumeChange = (vol: number) => {
    setVolume(vol)
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = vol
    }
  }

  const handleWaveTypeChange = (type: WaveType) => {
    setWaveType(type)
    if (oscillatorRef.current) {
      oscillatorRef.current.type = type
    }
  }

  useEffect(() => {
    return () => {
      stopTone()
    }
  }, [stopTone])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-5xl font-mono text-slate-700">
            {frequency.toFixed(1)} Hz
          </div>

          <div className="text-2xl text-slate-500">
            {note}{octave}
          </div>

          <div className="flex gap-2">
            {isPlaying ? (
              <Button variant="secondary" onClick={stopTone}>
                {t('tools.toneGenerator.stop')}
              </Button>
            ) : (
              <>
                <Button variant="primary" onClick={startTone}>
                  {t('tools.toneGenerator.play')}
                </Button>
                <Button variant="secondary" onClick={playToneForDuration}>
                  {t('tools.toneGenerator.playFor')} {duration}s
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.toneGenerator.frequencySettings')}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-600 mb-2">
              {t('tools.toneGenerator.frequency')}: {frequency.toFixed(1)} Hz
            </label>
            <input
              type="range"
              min="20"
              max="20000"
              step="1"
              value={frequency}
              onChange={(e) => handleFrequencyChange(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>20 Hz</span>
              <span>1000 Hz</span>
              <span>20000 Hz</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-600 mb-2">
                {t('tools.toneGenerator.note')}
              </label>
              <select
                value={note}
                onChange={(e) => handleNoteChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                {NOTES.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-2">
                {t('tools.toneGenerator.octave')}
              </label>
              <select
                value={octave}
                onChange={(e) => handleOctaveChange(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-slate-600">{t('tools.toneGenerator.presets')}:</span>
            {[
              { label: 'A4 (440Hz)', freq: 440 },
              { label: 'C4 (261Hz)', freq: 261.63 },
              { label: '1kHz', freq: 1000 },
              { label: '100Hz', freq: 100 },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => handleFrequencyChange(preset.freq)}
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
          {t('tools.toneGenerator.waveSettings')}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-600 mb-2">
              {t('tools.toneGenerator.waveType')}
            </label>
            <div className="flex flex-wrap gap-2">
              {(['sine', 'square', 'sawtooth', 'triangle'] as WaveType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => handleWaveTypeChange(type)}
                  className={`px-4 py-2 text-sm rounded-lg ${
                    waveType === type
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t(`tools.toneGenerator.${type}`)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-2">
              {t('tools.toneGenerator.volume')}: {Math.round(volume * 100)}%
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
              {t('tools.toneGenerator.duration')}: {duration}s
            </label>
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={duration}
              onChange={(e) => setDuration(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
