import { useState, useRef, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

export default function FrequencyAnalyzer() {
  const { t } = useTranslation()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [peakFrequency, setPeakFrequency] = useState<number | null>(null)
  const [avgVolume, setAvgVolume] = useState(0)
  const [fftSize, setFftSize] = useState(2048)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationRef = useRef<number | null>(null)

  const startAnalyzing = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const audioContext = new AudioContext()
      audioContextRef.current = audioContext

      const analyser = audioContext.createAnalyser()
      analyser.fftSize = fftSize
      analyser.smoothingTimeConstant = 0.8
      analyserRef.current = analyser

      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)

      setIsAnalyzing(true)
      draw()
    } catch (error) {
      console.error('Failed to access microphone:', error)
    }
  }, [fftSize])

  const stopAnalyzing = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    setIsAnalyzing(false)
    setPeakFrequency(null)
    setAvgVolume(0)
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const analyser = analyserRef.current
    const audioContext = audioContextRef.current

    if (!canvas || !analyser || !audioContext) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    analyser.getByteFrequencyData(dataArray)

    const width = canvas.width
    const height = canvas.height

    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, width, height)

    // Draw frequency bars
    const barWidth = width / bufferLength
    let maxValue = 0
    let maxIndex = 0
    let sum = 0

    for (let i = 0; i < bufferLength; i++) {
      const value = dataArray[i]
      sum += value

      if (value > maxValue) {
        maxValue = value
        maxIndex = i
      }

      const percent = value / 255
      const barHeight = percent * height

      // Color gradient based on frequency
      const hue = (i / bufferLength) * 240
      ctx.fillStyle = `hsl(${hue}, 80%, ${50 + percent * 30}%)`

      ctx.fillRect(
        i * barWidth,
        height - barHeight,
        barWidth - 1,
        barHeight
      )
    }

    // Calculate peak frequency
    const nyquist = audioContext.sampleRate / 2
    const freqPerBin = nyquist / bufferLength
    const peak = maxIndex * freqPerBin
    setPeakFrequency(peak)

    // Calculate average volume
    const avg = sum / bufferLength
    setAvgVolume((avg / 255) * 100)

    // Draw frequency labels
    ctx.fillStyle = '#94a3b8'
    ctx.font = '10px sans-serif'
    const frequencies = [100, 500, 1000, 2000, 5000, 10000, 20000]
    frequencies.forEach((freq) => {
      if (freq <= nyquist) {
        const x = (freq / nyquist) * width
        ctx.fillText(`${freq >= 1000 ? freq / 1000 + 'k' : freq}`, x, height - 5)
      }
    })

    animationRef.current = requestAnimationFrame(draw)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      }
    }

    return () => stopAnalyzing()
  }, [stopAnalyzing])

  useEffect(() => {
    if (isAnalyzing && analyserRef.current) {
      analyserRef.current.fftSize = fftSize
    }
  }, [fftSize, isAnalyzing])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div
          className="relative bg-slate-900 rounded-lg overflow-hidden mb-4"
          style={{ height: 300 }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {!isAnalyzing ? (
            <Button variant="primary" onClick={startAnalyzing}>
              {t('tools.frequencyAnalyzer.start')}
            </Button>
          ) : (
            <Button variant="secondary" className="bg-red-500 hover:bg-red-600 text-white" onClick={stopAnalyzing}>
              {t('tools.frequencyAnalyzer.stop')}
            </Button>
          )}
        </div>
      </div>

      {isAnalyzing && (
        <div className="card p-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="text-sm text-slate-500 mb-1">
                {t('tools.frequencyAnalyzer.peakFrequency')}
              </div>
              <div className="text-2xl font-mono text-blue-600">
                {peakFrequency !== null ? `${Math.round(peakFrequency)} Hz` : '-'}
              </div>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="text-sm text-slate-500 mb-1">
                {t('tools.frequencyAnalyzer.avgVolume')}
              </div>
              <div className="text-2xl font-mono text-green-600">
                {avgVolume.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.frequencyAnalyzer.settings')}
        </h3>

        <div>
          <label className="block text-sm text-slate-600 mb-1">
            {t('tools.frequencyAnalyzer.fftSize')}: {fftSize}
          </label>
          <select
            value={fftSize}
            onChange={(e) => setFftSize(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
          >
            <option value="512">512</option>
            <option value="1024">1024</option>
            <option value="2048">2048</option>
            <option value="4096">4096</option>
            <option value="8192">8192</option>
          </select>
          <p className="text-xs text-slate-400 mt-1">
            {t('tools.frequencyAnalyzer.fftSizeHint')}
          </p>
        </div>
      </div>
    </div>
  )
}
