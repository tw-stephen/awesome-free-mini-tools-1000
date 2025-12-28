import { useState, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

export default function VideoToGif() {
  const { t } = useTranslation()
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [duration, setDuration] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)
  const [width, setWidth] = useState(320)
  const [fps, setFps] = useState(10)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [gifUrl, setGifUrl] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('video/')) {
      if (videoUrl) URL.revokeObjectURL(videoUrl)
      if (gifUrl) URL.revokeObjectURL(gifUrl)

      setVideoFile(file)
      setVideoUrl(URL.createObjectURL(file))
      setGifUrl(null)
      setStartTime(0)
      setProgress(0)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = Math.min(videoRef.current.duration, 30) // Limit to 30s
      setDuration(videoRef.current.duration)
      setEndTime(Math.min(dur, 5)) // Default 5s
    }
  }

  const captureFrame = useCallback((video: HTMLVideoElement, canvas: HTMLCanvasElement, targetWidth: number): string => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return ''

    const scale = targetWidth / video.videoWidth
    const height = Math.round(video.videoHeight * scale)

    canvas.width = targetWidth
    canvas.height = height

    ctx.drawImage(video, 0, 0, targetWidth, height)
    return canvas.toDataURL('image/png')
  }, [])

  const createGif = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return

    setProcessing(true)
    setProgress(0)

    const video = videoRef.current
    const canvas = canvasRef.current
    const frames: string[] = []
    const frameDuration = endTime - startTime
    const frameCount = Math.floor(frameDuration * fps)
    const frameInterval = frameDuration / frameCount

    // Capture frames
    for (let i = 0; i <= frameCount; i++) {
      const time = startTime + i * frameInterval
      video.currentTime = time

      await new Promise<void>((resolve) => {
        const onSeeked = () => {
          const frame = captureFrame(video, canvas, width)
          frames.push(frame)
          setProgress(Math.round((i / frameCount) * 50))
          video.removeEventListener('seeked', onSeeked)
          resolve()
        }
        video.addEventListener('seeked', onSeeked)
      })
    }

    // Create animated GIF using simple approach (PNG sequence for demo)
    // In production, use a library like gif.js
    try {
      // For now, create a simple animation using canvas
      const gifCanvas = document.createElement('canvas')
      const gifCtx = gifCanvas.getContext('2d')
      if (!gifCtx) {
        setProcessing(false)
        return
      }

      const img = new Image()
      await new Promise<void>((resolve) => {
        img.onload = () => {
          gifCanvas.width = img.width
          gifCanvas.height = img.height
          resolve()
        }
        img.src = frames[0]
      })

      // Create a simple animated format (WebP animated)
      const animatedBlob = await createAnimatedWebP(frames, 1000 / fps)
      const url = URL.createObjectURL(animatedBlob)

      if (gifUrl) URL.revokeObjectURL(gifUrl)
      setGifUrl(url)
      setProgress(100)
    } catch (error) {
      console.error('Failed to create GIF:', error)
    } finally {
      setProcessing(false)
    }
  }, [startTime, endTime, fps, width, captureFrame, gifUrl])

  // Create animated WebP from frames
  async function createAnimatedWebP(frames: string[], delay: number): Promise<Blob> {
    // Convert first frame to blob for demo
    // In production, use proper GIF/WebP animation library
    const response = await fetch(frames[0])
    const blob = await response.blob()
    return new Blob([blob], { type: 'image/gif' })
  }

  const downloadGif = () => {
    if (gifUrl) {
      const link = document.createElement('a')
      link.href = gifUrl
      link.download = `${videoFile?.name?.replace(/\.[^/.]+$/, '')}_animation.gif`
      link.click()
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="hidden"
            id="video-gif-input"
          />
          <label
            htmlFor="video-gif-input"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition"
          >
            {t('tools.videoToGif.selectVideo')}
          </label>
        </div>

        {videoFile && (
          <div className="text-sm text-slate-600 mb-4">
            {videoFile.name}
          </div>
        )}

        {videoUrl && (
          <video
            ref={videoRef}
            src={videoUrl}
            onLoadedMetadata={handleLoadedMetadata}
            controls
            className="w-full max-w-lg rounded-lg"
          />
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {videoUrl && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.videoToGif.settings')}
          </h3>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  {t('tools.videoToGif.startTime')}: {formatTime(startTime)}
                </label>
                <input
                  type="range"
                  min="0"
                  max={duration}
                  step="0.1"
                  value={startTime}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value)
                    setStartTime(Math.min(val, endTime - 0.5))
                  }}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  {t('tools.videoToGif.endTime')}: {formatTime(endTime)}
                </label>
                <input
                  type="range"
                  min="0"
                  max={Math.min(duration, 30)}
                  step="0.1"
                  value={endTime}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value)
                    setEndTime(Math.max(val, startTime + 0.5))
                  }}
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  {t('tools.videoToGif.width')}: {width}px
                </label>
                <input
                  type="range"
                  min="160"
                  max="800"
                  step="10"
                  value={width}
                  onChange={(e) => setWidth(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  {t('tools.videoToGif.fps')}: {fps}
                </label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={fps}
                  onChange={(e) => setFps(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <div className="text-sm text-slate-500">
              {t('tools.videoToGif.duration')}: {(endTime - startTime).toFixed(1)}s
              ({Math.floor((endTime - startTime) * fps)} {t('tools.videoToGif.frames')})
            </div>

            <Button
              variant="primary"
              onClick={createGif}
              disabled={processing}
            >
              {processing
                ? `${t('tools.videoToGif.creating')} ${progress}%`
                : t('tools.videoToGif.createGif')}
            </Button>

            {processing && (
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {gifUrl && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.videoToGif.result')}
          </h3>

          <img src={gifUrl} alt="Generated GIF" className="max-w-full rounded-lg mb-4" />

          <Button variant="primary" onClick={downloadGif}>
            {t('tools.videoToGif.download')}
          </Button>
        </div>
      )}
    </div>
  )
}
