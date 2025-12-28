import { useState, useRef, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

export default function PitchDetector() {
  const { t } = useTranslation()
  const [isListening, setIsListening] = useState(false)
  const [frequency, setFrequency] = useState<number | null>(null)
  const [note, setNote] = useState<string>('')
  const [octave, setOctave] = useState<number>(0)
  const [cents, setCents] = useState<number>(0)

  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationRef = useRef<number>(0)

  const frequencyToNote = (freq: number): { note: string; octave: number; cents: number } => {
    const a4 = 440
    const c0 = a4 * Math.pow(2, -4.75)
    const halfSteps = 12 * Math.log2(freq / c0)
    const noteIndex = Math.round(halfSteps) % 12
    const octave = Math.floor(Math.round(halfSteps) / 12)
    const exactHalfSteps = 12 * Math.log2(freq / c0)
    const cents = Math.round((exactHalfSteps - Math.round(halfSteps)) * 100)

    return {
      note: NOTES[noteIndex],
      octave,
      cents,
    }
  }

  const autoCorrelate = (buffer: Float32Array, sampleRate: number): number => {
    const SIZE = buffer.length
    const MAX_SAMPLES = Math.floor(SIZE / 2)
    let bestOffset = -1
    let bestCorrelation = 0
    let rms = 0

    for (let i = 0; i < SIZE; i++) {
      rms += buffer[i] * buffer[i]
    }
    rms = Math.sqrt(rms / SIZE)

    if (rms < 0.01) return -1 // Not enough signal

    let lastCorrelation = 1

    for (let offset = 0; offset < MAX_SAMPLES; offset++) {
      let correlation = 0

      for (let i = 0; i < MAX_SAMPLES; i++) {
        correlation += Math.abs(buffer[i] - buffer[i + offset])
      }

      correlation = 1 - correlation / MAX_SAMPLES

      if (correlation > 0.9 && correlation > lastCorrelation) {
        bestCorrelation = correlation
        bestOffset = offset
      }

      lastCorrelation = correlation
    }

    if (bestCorrelation > 0.01) {
      return sampleRate / bestOffset
    }

    return -1
  }

  const analyze = useCallback(() => {
    const analyser = analyserRef.current
    const audioContext = audioContextRef.current
    if (!analyser || !audioContext) return

    const buffer = new Float32Array(analyser.fftSize)
    analyser.getFloatTimeDomainData(buffer)

    const freq = autoCorrelate(buffer, audioContext.sampleRate)

    if (freq > 0 && freq < 5000) {
      setFrequency(Math.round(freq * 10) / 10)
      const { note: n, octave: o, cents: c } = frequencyToNote(freq)
      setNote(n)
      setOctave(o)
      setCents(c)
    } else {
      setFrequency(null)
      setNote('')
      setOctave(0)
      setCents(0)
    }

    animationRef.current = requestAnimationFrame(analyze)
  }, [])

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const audioContext = new AudioContext()
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 4096

      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)

      audioContextRef.current = audioContext
      analyserRef.current = analyser

      setIsListening(true)
      analyze()
    } catch (error) {
      console.error('Failed to access microphone:', error)
      alert(t('tools.pitchDetector.micPermissionError'))
    }
  }, [analyze, t])

  const stopListening = useCallback(() => {
    cancelAnimationFrame(animationRef.current)

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }

    if (audioContextRef.current) {
      audioContextRef.current.close()
    }

    streamRef.current = null
    audioContextRef.current = null
    analyserRef.current = null

    setIsListening(false)
    setFrequency(null)
    setNote('')
    setOctave(0)
    setCents(0)
  }, [])

  useEffect(() => {
    return () => {
      stopListening()
    }
  }, [stopListening])

  const getCentsColor = (c: number): string => {
    const absC = Math.abs(c)
    if (absC <= 5) return 'text-green-500'
    if (absC <= 15) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getTuningStatus = (c: number): string => {
    if (Math.abs(c) <= 5) return t('tools.pitchDetector.inTune')
    if (c < 0) return t('tools.pitchDetector.flat')
    return t('tools.pitchDetector.sharp')
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex flex-col items-center space-y-6">
          {note ? (
            <>
              <div className="text-8xl font-bold text-slate-700">
                {note}
                <span className="text-4xl text-slate-400">{octave}</span>
              </div>

              <div className="text-2xl text-slate-500">
                {frequency} Hz
              </div>

              <div className="w-full max-w-xs">
                <div className="relative h-4 bg-slate-200 rounded-full overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-0.5 h-full bg-slate-400" />
                  </div>
                  <div
                    className={`absolute top-0 h-full w-2 rounded-full ${
                      Math.abs(cents) <= 5 ? 'bg-green-500' : Math.abs(cents) <= 15 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{
                      left: `calc(50% + ${cents}%)`,
                      transform: 'translateX(-50%)',
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>-50</span>
                  <span>0</span>
                  <span>+50</span>
                </div>
              </div>

              <div className={`text-xl font-medium ${getCentsColor(cents)}`}>
                {cents > 0 ? '+' : ''}{cents} cents - {getTuningStatus(cents)}
              </div>
            </>
          ) : (
            <div className="text-4xl text-slate-300 py-8">
              {isListening ? t('tools.pitchDetector.listening') : t('tools.pitchDetector.noSignal')}
            </div>
          )}

          <Button
            variant="primary"
            onClick={isListening ? stopListening : startListening}
          >
            {isListening ? t('tools.pitchDetector.stop') : t('tools.pitchDetector.start')}
          </Button>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.pitchDetector.referenceNotes')}
        </h3>

        <div className="grid grid-cols-6 gap-2">
          {NOTES.map((n, i) => {
            const freq = 440 * Math.pow(2, (i - 9) / 12 + (4 - 4))
            return (
              <div
                key={n}
                className={`p-2 text-center rounded ${
                  note === n && octave === 4
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <div className="font-medium">{n}4</div>
                <div className="text-xs">{Math.round(freq)} Hz</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.pitchDetector.tips')}
        </h3>
        <ul className="text-sm text-slate-500 space-y-1">
          <li>• {t('tools.pitchDetector.tip1')}</li>
          <li>• {t('tools.pitchDetector.tip2')}</li>
          <li>• {t('tools.pitchDetector.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
