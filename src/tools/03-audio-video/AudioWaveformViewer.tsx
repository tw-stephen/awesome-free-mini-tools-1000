import { useState, useRef, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

export default function AudioWaveformViewer() {
  const { t } = useTranslation()
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [waveformColor, setWaveformColor] = useState('#3b82f6')

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const audioDataRef = useRef<Float32Array | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('audio/')) {
      if (audioUrl) URL.revokeObjectURL(audioUrl)

      setAudioFile(file)
      setAudioUrl(URL.createObjectURL(file))
      setCurrentTime(0)
      setIsPlaying(false)

      // Decode and store audio data
      try {
        const audioContext = new AudioContext()
        const arrayBuffer = await file.arrayBuffer()
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

        // Get mono data
        const channelData = audioBuffer.getChannelData(0)
        audioDataRef.current = channelData

        setDuration(audioBuffer.duration)
        drawWaveform()

        audioContext.close()
      } catch (error) {
        console.error('Failed to decode audio:', error)
      }
    }
  }

  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current
    const audioData = audioDataRef.current
    if (!canvas || !audioData) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const middle = height / 2

    ctx.fillStyle = '#f1f5f9'
    ctx.fillRect(0, 0, width, height)

    // Calculate samples per pixel
    const samplesPerPixel = Math.floor(audioData.length / (width * zoom))

    ctx.strokeStyle = waveformColor
    ctx.lineWidth = 1
    ctx.beginPath()

    for (let x = 0; x < width; x++) {
      const startSample = Math.floor(x * samplesPerPixel)
      let min = 1
      let max = -1

      for (let i = 0; i < samplesPerPixel && startSample + i < audioData.length; i++) {
        const sample = audioData[startSample + i]
        if (sample < min) min = sample
        if (sample > max) max = sample
      }

      const yMin = (1 + min) * middle
      const yMax = (1 + max) * middle

      ctx.moveTo(x, yMin)
      ctx.lineTo(x, yMax)
    }

    ctx.stroke()

    // Draw playback position
    if (duration > 0) {
      const posX = (currentTime / duration) * width
      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(posX, 0)
      ctx.lineTo(posX, height)
      ctx.stroke()
    }
  }, [zoom, waveformColor, currentTime, duration])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    const audio = audioRef.current
    if (!canvas || !audio || duration === 0) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const ratio = x / canvas.width
    const newTime = ratio * duration

    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    const ms = Math.floor((seconds % 1) * 100)
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    drawWaveform()
  }, [drawWaveform])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeObserver = new ResizeObserver(() => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      drawWaveform()
    })

    resizeObserver.observe(canvas)
    return () => resizeObserver.disconnect()
  }, [drawWaveform])

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
            id="waveform-audio-input"
          />
          <label
            htmlFor="waveform-audio-input"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition"
          >
            {t('tools.audioWaveformViewer.selectAudio')}
          </label>
        </div>

        {audioFile && (
          <div className="text-sm text-slate-600 mb-4">
            {audioFile.name}
          </div>
        )}

        <div className="relative bg-slate-100 rounded-lg overflow-hidden" style={{ height: 200 }}>
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="w-full h-full cursor-crosshair"
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
        )}
      </div>

      {audioUrl && (
        <>
          <div className="card p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-2xl font-mono text-slate-700">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
              <Button variant="primary" onClick={togglePlay}>
                {isPlaying ? t('tools.audioWaveformViewer.pause') : t('tools.audioWaveformViewer.play')}
              </Button>
            </div>

            <input
              type="range"
              min="0"
              max={duration}
              step="0.01"
              value={currentTime}
              onChange={(e) => {
                const time = parseFloat(e.target.value)
                setCurrentTime(time)
                if (audioRef.current) {
                  audioRef.current.currentTime = time
                }
              }}
              className="w-full"
            />
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.audioWaveformViewer.displaySettings')}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  {t('tools.audioWaveformViewer.zoom')}: {zoom}x
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-2">
                  {t('tools.audioWaveformViewer.color')}
                </label>
                <div className="flex gap-2">
                  {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setWaveformColor(color)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        waveformColor === color ? 'border-slate-400' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <input
                    type="color"
                    value={waveformColor}
                    onChange={(e) => setWaveformColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
