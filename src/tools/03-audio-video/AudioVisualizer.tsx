import { useState, useRef, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

type VisualizerType = 'bars' | 'waveform' | 'circular' | 'particles'

export default function AudioVisualizer() {
  const { t } = useTranslation()
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [visualizerType, setVisualizerType] = useState<VisualizerType>('bars')
  const [colorScheme, setColorScheme] = useState<'rainbow' | 'gradient' | 'solid'>('rainbow')
  const [sensitivity, setSensitivity] = useState(1)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const animationRef = useRef<number>(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const initAudio = useCallback(() => {
    if (!audioRef.current || audioContextRef.current) return

    const audioContext = new AudioContext()
    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 256

    const source = audioContext.createMediaElementSource(audioRef.current)
    source.connect(analyser)
    analyser.connect(audioContext.destination)

    audioContextRef.current = audioContext
    analyserRef.current = analyser
    sourceRef.current = source
  }, [])

  const getColor = useCallback((index: number, total: number, value: number) => {
    switch (colorScheme) {
      case 'rainbow':
        return `hsl(${(index / total) * 360}, 80%, ${50 + value * 20}%)`
      case 'gradient':
        return `rgb(${value * 255}, ${100 + value * 100}, ${255 - value * 100})`
      case 'solid':
        return `rgb(59, 130, 246)`
      default:
        return '#3b82f6'
    }
  }, [colorScheme])

  const drawBars = useCallback((ctx: CanvasRenderingContext2D, dataArray: Uint8Array, width: number, height: number) => {
    const bufferLength = dataArray.length
    const barWidth = width / bufferLength * 2.5
    let x = 0

    for (let i = 0; i < bufferLength; i++) {
      const value = (dataArray[i] / 255) * sensitivity
      const barHeight = value * height * 0.9

      ctx.fillStyle = getColor(i, bufferLength, value)
      ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight)

      x += barWidth
    }
  }, [sensitivity, getColor])

  const drawWaveform = useCallback((ctx: CanvasRenderingContext2D, dataArray: Uint8Array, width: number, height: number) => {
    const bufferLength = dataArray.length
    const sliceWidth = width / bufferLength

    ctx.lineWidth = 2
    ctx.strokeStyle = getColor(0, 1, 0.5)
    ctx.beginPath()

    let x = 0
    for (let i = 0; i < bufferLength; i++) {
      const value = (dataArray[i] / 255) * sensitivity
      const y = height / 2 + (value - 0.5) * height * 0.8

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
      x += sliceWidth
    }

    ctx.lineTo(width, height / 2)
    ctx.stroke()
  }, [sensitivity, getColor])

  const drawCircular = useCallback((ctx: CanvasRenderingContext2D, dataArray: Uint8Array, width: number, height: number) => {
    const bufferLength = dataArray.length
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) * 0.3

    for (let i = 0; i < bufferLength; i++) {
      const value = (dataArray[i] / 255) * sensitivity
      const angle = (i / bufferLength) * Math.PI * 2 - Math.PI / 2
      const barLength = value * radius

      const x1 = centerX + Math.cos(angle) * radius
      const y1 = centerY + Math.sin(angle) * radius
      const x2 = centerX + Math.cos(angle) * (radius + barLength)
      const y2 = centerY + Math.sin(angle) * (radius + barLength)

      ctx.strokeStyle = getColor(i, bufferLength, value)
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }
  }, [sensitivity, getColor])

  const drawParticles = useCallback((ctx: CanvasRenderingContext2D, dataArray: Uint8Array, width: number, height: number) => {
    const bufferLength = dataArray.length
    const centerX = width / 2
    const centerY = height / 2

    for (let i = 0; i < bufferLength; i += 2) {
      const value = (dataArray[i] / 255) * sensitivity
      const angle = (i / bufferLength) * Math.PI * 2
      const distance = value * Math.min(width, height) * 0.4

      const x = centerX + Math.cos(angle) * distance
      const y = centerY + Math.sin(angle) * distance
      const size = value * 8 + 2

      ctx.fillStyle = getColor(i, bufferLength, value)
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
    }
  }, [sensitivity, getColor])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const analyser = analyserRef.current
    if (!canvas || !analyser) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    analyser.getByteFrequencyData(dataArray)

    ctx.fillStyle = 'rgba(15, 23, 42, 0.2)'
    ctx.fillRect(0, 0, width, height)

    switch (visualizerType) {
      case 'bars':
        drawBars(ctx, dataArray, width, height)
        break
      case 'waveform':
        drawWaveform(ctx, dataArray, width, height)
        break
      case 'circular':
        drawCircular(ctx, dataArray, width, height)
        break
      case 'particles':
        drawParticles(ctx, dataArray, width, height)
        break
    }

    animationRef.current = requestAnimationFrame(draw)
  }, [visualizerType, drawBars, drawWaveform, drawCircular, drawParticles])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file)
      setIsPlaying(false)

      // Reset audio context for new file
      if (sourceRef.current) {
        sourceRef.current.disconnect()
        sourceRef.current = null
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
        audioContextRef.current = null
      }
      analyserRef.current = null
    }
  }

  const togglePlayPause = () => {
    if (!audioRef.current) return

    if (!audioContextRef.current) {
      initAudio()
    }

    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume()
    }

    if (isPlaying) {
      audioRef.current.pause()
      cancelAnimationFrame(animationRef.current)
    } else {
      audioRef.current.play()
      draw()
    }
    setIsPlaying(!isPlaying)
  }

  const handleEnded = () => {
    setIsPlaying(false)
    cancelAnimationFrame(animationRef.current)
  }

  useEffect(() => {
    return () => {
      cancelAnimationFrame(animationRef.current)
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.fillStyle = '#0f172a'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
    }
  }, [])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileSelect}
            className="hidden"
            id="audio-input"
          />
          <label
            htmlFor="audio-input"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition"
          >
            {t('tools.audioVisualizer.selectAudio')}
          </label>
          {audioFile && (
            <Button
              variant="primary"
              onClick={togglePlayPause}
            >
              {isPlaying ? t('tools.audioVisualizer.pause') : t('tools.audioVisualizer.play')}
            </Button>
          )}
        </div>

        {audioFile && (
          <div className="text-sm text-slate-600 mb-4">
            {audioFile.name}
          </div>
        )}

        <canvas
          ref={canvasRef}
          width={800}
          height={300}
          className="w-full rounded-lg bg-slate-900"
        />

        {audioFile && (
          <audio
            ref={audioRef}
            src={URL.createObjectURL(audioFile)}
            onEnded={handleEnded}
            className="hidden"
          />
        )}
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.audioVisualizer.settings')}
        </h3>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-slate-600 mb-2">
              {t('tools.audioVisualizer.visualizerType')}
            </label>
            <select
              value={visualizerType}
              onChange={(e) => setVisualizerType(e.target.value as VisualizerType)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value="bars">{t('tools.audioVisualizer.bars')}</option>
              <option value="waveform">{t('tools.audioVisualizer.waveform')}</option>
              <option value="circular">{t('tools.audioVisualizer.circular')}</option>
              <option value="particles">{t('tools.audioVisualizer.particles')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-2">
              {t('tools.audioVisualizer.colorScheme')}
            </label>
            <select
              value={colorScheme}
              onChange={(e) => setColorScheme(e.target.value as 'rainbow' | 'gradient' | 'solid')}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value="rainbow">{t('tools.audioVisualizer.rainbow')}</option>
              <option value="gradient">{t('tools.audioVisualizer.gradient')}</option>
              <option value="solid">{t('tools.audioVisualizer.solid')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-2">
              {t('tools.audioVisualizer.sensitivity')}: {sensitivity.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={sensitivity}
              onChange={(e) => setSensitivity(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
