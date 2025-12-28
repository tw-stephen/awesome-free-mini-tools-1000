import { useState, useRef, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface ExtractedFrame {
  time: number
  dataUrl: string
}

export default function VideoFrameExtractor() {
  const { t } = useTranslation()
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [duration, setDuration] = useState(0)
  const [extractMode, setExtractMode] = useState<'interval' | 'count' | 'current'>('interval')
  const [interval, setInterval] = useState(1)
  const [frameCount, setFrameCount] = useState(10)
  const [currentTime, setCurrentTime] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [frames, setFrames] = useState<ExtractedFrame[]>([])
  const [format, setFormat] = useState<'png' | 'jpg'>('png')
  const [quality, setQuality] = useState(0.9)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('video/')) {
      if (videoUrl) URL.revokeObjectURL(videoUrl)

      setVideoFile(file)
      setVideoUrl(URL.createObjectURL(file))
      setFrames([])
      setProgress(0)
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

  const extractFrameAt = async (time: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!videoRef.current || !canvasRef.current) {
        reject(new Error('Video or canvas not ready'))
        return
      }

      const video = videoRef.current
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')!

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      video.currentTime = time

      const onSeeked = () => {
        video.removeEventListener('seeked', onSeeked)
        ctx.drawImage(video, 0, 0)
        const mimeType = format === 'png' ? 'image/png' : 'image/jpeg'
        resolve(canvas.toDataURL(mimeType, quality))
      }

      video.addEventListener('seeked', onSeeked)
    })
  }

  const extractFrames = useCallback(async () => {
    if (!videoRef.current || !duration) return

    setProcessing(true)
    setProgress(0)
    setFrames([])

    try {
      const timesToExtract: number[] = []

      if (extractMode === 'current') {
        timesToExtract.push(currentTime)
      } else if (extractMode === 'interval') {
        for (let t = 0; t < duration; t += interval) {
          timesToExtract.push(t)
        }
      } else if (extractMode === 'count') {
        const step = duration / (frameCount - 1)
        for (let i = 0; i < frameCount; i++) {
          timesToExtract.push(Math.min(i * step, duration - 0.01))
        }
      }

      const extractedFrames: ExtractedFrame[] = []

      for (let i = 0; i < timesToExtract.length; i++) {
        const time = timesToExtract[i]
        const dataUrl = await extractFrameAt(time)
        extractedFrames.push({ time, dataUrl })
        setProgress(Math.round(((i + 1) / timesToExtract.length) * 100))
      }

      setFrames(extractedFrames)
    } catch (error) {
      console.error('Failed to extract frames:', error)
    } finally {
      setProcessing(false)
    }
  }, [duration, extractMode, interval, frameCount, currentTime, format, quality])

  const downloadFrame = (frame: ExtractedFrame, index: number) => {
    const link = document.createElement('a')
    link.href = frame.dataUrl
    const baseName = videoFile?.name?.replace(/\.[^/.]+$/, '') || 'video'
    link.download = `${baseName}_frame_${index + 1}.${format}`
    link.click()
  }

  const downloadAllFrames = async () => {
    for (let i = 0; i < frames.length; i++) {
      downloadFrame(frames[i], i)
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    const ms = Math.floor((seconds % 1) * 100)
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl)
    }
  }, [])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <input
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="hidden"
            id="video-frame-input"
          />
          <label
            htmlFor="video-frame-input"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition"
          >
            {t('tools.videoFrameExtractor.selectVideo')}
          </label>
        </div>

        {videoFile && (
          <div className="text-sm text-slate-600 mb-4">{videoFile.name}</div>
        )}

        {videoUrl && (
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            className="w-full rounded-lg"
            style={{ maxHeight: 300 }}
          />
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {videoUrl && duration > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.videoFrameExtractor.extractMode')}
          </h3>

          <div className="space-y-3 mb-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="extractMode"
                checked={extractMode === 'current'}
                onChange={() => setExtractMode('current')}
              />
              <span>{t('tools.videoFrameExtractor.currentFrame')}</span>
              <span className="text-sm text-slate-500">({formatTime(currentTime)})</span>
            </label>

            <label className="flex items-start gap-2">
              <input
                type="radio"
                name="extractMode"
                checked={extractMode === 'interval'}
                onChange={() => setExtractMode('interval')}
                className="mt-1"
              />
              <div>
                <span>{t('tools.videoFrameExtractor.byInterval')}</span>
                {extractMode === 'interval' && (
                  <div className="mt-2">
                    <input
                      type="number"
                      min="0.1"
                      max="60"
                      step="0.1"
                      value={interval}
                      onChange={(e) => setInterval(parseFloat(e.target.value) || 1)}
                      className="w-24 px-2 py-1 border border-slate-300 rounded text-sm"
                    />
                    <span className="text-sm text-slate-500 ml-2">
                      {t('tools.videoFrameExtractor.seconds')}
                    </span>
                    <p className="text-xs text-slate-400 mt-1">
                      ~{Math.ceil(duration / interval)} {t('tools.videoFrameExtractor.frames')}
                    </p>
                  </div>
                )}
              </div>
            </label>

            <label className="flex items-start gap-2">
              <input
                type="radio"
                name="extractMode"
                checked={extractMode === 'count'}
                onChange={() => setExtractMode('count')}
                className="mt-1"
              />
              <div>
                <span>{t('tools.videoFrameExtractor.byCount')}</span>
                {extractMode === 'count' && (
                  <div className="mt-2">
                    <input
                      type="number"
                      min="2"
                      max="100"
                      value={frameCount}
                      onChange={(e) => setFrameCount(parseInt(e.target.value) || 10)}
                      className="w-24 px-2 py-1 border border-slate-300 rounded text-sm"
                    />
                    <span className="text-sm text-slate-500 ml-2">
                      {t('tools.videoFrameExtractor.frames')}
                    </span>
                  </div>
                )}
              </div>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                {t('tools.videoFrameExtractor.format')}
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as 'png' | 'jpg')}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              >
                <option value="png">PNG</option>
                <option value="jpg">JPEG</option>
              </select>
            </div>
            {format === 'jpg' && (
              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  {t('tools.videoFrameExtractor.quality')}: {Math.round(quality * 100)}%
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            )}
          </div>

          {processing && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-600">
                  {t('tools.videoFrameExtractor.extracting')}
                </span>
                <span className="text-sm text-blue-600">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <Button variant="primary" onClick={extractFrames} disabled={processing}>
            {processing
              ? t('tools.videoFrameExtractor.extracting')
              : t('tools.videoFrameExtractor.extract')}
          </Button>
        </div>
      )}

      {frames.length > 0 && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-700">
              {t('tools.videoFrameExtractor.extractedFrames')} ({frames.length})
            </h3>
            <Button variant="secondary" onClick={downloadAllFrames}>
              {t('tools.videoFrameExtractor.downloadAll')}
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {frames.map((frame, index) => (
              <div key={index} className="group relative">
                <img
                  src={frame.dataUrl}
                  alt={`Frame ${index + 1}`}
                  className="w-full rounded-lg"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-lg">
                  <button
                    onClick={() => downloadFrame(frame, index)}
                    className="px-3 py-1 bg-white text-slate-700 rounded text-sm hover:bg-slate-100"
                  >
                    {t('tools.videoFrameExtractor.download')}
                  </button>
                </div>
                <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1 rounded">
                  {formatTime(frame.time)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
