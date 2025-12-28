import { useState, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface Thumbnail {
  id: string
  time: number
  url: string
}

export default function VideoThumbnail() {
  const { t } = useTranslation()
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([])
  const [thumbnailWidth, setThumbnailWidth] = useState(320)
  const [generating, setGenerating] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('video/')) {
      if (videoUrl) URL.revokeObjectURL(videoUrl)
      thumbnails.forEach((t) => URL.revokeObjectURL(t.url))

      setVideoFile(file)
      setVideoUrl(URL.createObjectURL(file))
      setThumbnails([])
      setCurrentTime(0)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const captureThumbnail = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const scale = thumbnailWidth / video.videoWidth
    const height = Math.round(video.videoHeight * scale)

    canvas.width = thumbnailWidth
    canvas.height = height

    ctx.drawImage(video, 0, 0, thumbnailWidth, height)

    const url = canvas.toDataURL('image/jpeg', 0.9)

    const thumbnail: Thumbnail = {
      id: Math.random().toString(36).slice(2),
      time: video.currentTime,
      url,
    }

    setThumbnails((prev) => [...prev, thumbnail])
  }, [thumbnailWidth])

  const generateThumbnails = useCallback(async (count: number) => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || duration === 0) return

    setGenerating(true)

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      setGenerating(false)
      return
    }

    const scale = thumbnailWidth / video.videoWidth
    const height = Math.round(video.videoHeight * scale)
    canvas.width = thumbnailWidth
    canvas.height = height

    const interval = duration / (count + 1)
    const newThumbnails: Thumbnail[] = []

    for (let i = 1; i <= count; i++) {
      const time = interval * i
      video.currentTime = time

      await new Promise<void>((resolve) => {
        const onSeeked = () => {
          ctx.drawImage(video, 0, 0, thumbnailWidth, height)
          const url = canvas.toDataURL('image/jpeg', 0.9)

          newThumbnails.push({
            id: Math.random().toString(36).slice(2),
            time,
            url,
          })

          video.removeEventListener('seeked', onSeeked)
          resolve()
        }
        video.addEventListener('seeked', onSeeked)
      })
    }

    setThumbnails((prev) => [...prev, ...newThumbnails])
    setGenerating(false)
  }, [duration, thumbnailWidth])

  const removeThumbnail = (id: string) => {
    setThumbnails((prev) => {
      const thumbnail = prev.find((t) => t.id === id)
      if (thumbnail) URL.revokeObjectURL(thumbnail.url)
      return prev.filter((t) => t.id !== id)
    })
  }

  const downloadThumbnail = (thumbnail: Thumbnail) => {
    const link = document.createElement('a')
    link.href = thumbnail.url
    link.download = `thumbnail_${formatTime(thumbnail.time).replace(':', '-')}.jpg`
    link.click()
  }

  const downloadAll = () => {
    thumbnails.forEach((thumbnail, index) => {
      setTimeout(() => {
        downloadThumbnail(thumbnail)
      }, index * 200)
    })
  }

  const clearAll = () => {
    thumbnails.forEach((t) => URL.revokeObjectURL(t.url))
    setThumbnails([])
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
            id="video-thumbnail-input"
          />
          <label
            htmlFor="video-thumbnail-input"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition"
          >
            {t('tools.videoThumbnail.selectVideo')}
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
            onTimeUpdate={handleTimeUpdate}
            controls
            className="w-full max-w-2xl rounded-lg"
          />
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {videoUrl && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.videoThumbnail.capture')}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                {t('tools.videoThumbnail.width')}: {thumbnailWidth}px
              </label>
              <input
                type="range"
                min="160"
                max="1920"
                step="10"
                value={thumbnailWidth}
                onChange={(e) => setThumbnailWidth(parseInt(e.target.value))}
                className="w-full max-w-xs"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="primary" onClick={captureThumbnail}>
                {t('tools.videoThumbnail.captureAt')} {formatTime(currentTime)}
              </Button>
              <Button
                variant="secondary"
                onClick={() => generateThumbnails(5)}
                disabled={generating}
              >
                {generating ? t('tools.videoThumbnail.generating') : t('tools.videoThumbnail.generate5')}
              </Button>
              <Button
                variant="secondary"
                onClick={() => generateThumbnails(10)}
                disabled={generating}
              >
                {t('tools.videoThumbnail.generate10')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {thumbnails.length > 0 && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-slate-700">
              {t('tools.videoThumbnail.thumbnails')} ({thumbnails.length})
            </h3>
            <div className="flex gap-2">
              <Button onClick={downloadAll}>
                {t('tools.videoThumbnail.downloadAll')}
              </Button>
              <Button variant="secondary" onClick={clearAll}>
                {t('common.clear')}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {thumbnails.map((thumbnail) => (
              <div
                key={thumbnail.id}
                className="relative group"
              >
                <img
                  src={thumbnail.url}
                  alt={`Thumbnail at ${formatTime(thumbnail.time)}`}
                  className="w-full rounded-lg shadow"
                />
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent rounded-b-lg">
                  <span className="text-white text-sm">{formatTime(thumbnail.time)}</span>
                </div>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => downloadThumbnail(thumbnail)}
                    className="p-1 bg-white rounded shadow text-slate-600 hover:text-blue-500"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => removeThumbnail(thumbnail.id)}
                    className="p-1 bg-white rounded shadow text-slate-600 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
