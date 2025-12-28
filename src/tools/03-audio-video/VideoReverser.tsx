import { useState, useRef, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

export default function VideoReverser() {
  const { t } = useTranslation()
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [reversedUrl, setReversedUrl] = useState<string | null>(null)
  const [includeAudio, setIncludeAudio] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('video/')) {
      if (videoUrl) URL.revokeObjectURL(videoUrl)
      if (reversedUrl) URL.revokeObjectURL(reversedUrl)

      setVideoFile(file)
      setVideoUrl(URL.createObjectURL(file))
      setReversedUrl(null)
      setProgress(0)
    }
  }

  const reverseVideo = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return

    setProcessing(true)
    setProgress(0)

    try {
      const video = videoRef.current
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')!

      // Set canvas size
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const fps = 30
      const duration = video.duration
      const totalFrames = Math.floor(duration * fps)

      // Extract frames
      const frames: ImageData[] = []

      for (let i = 0; i < totalFrames; i++) {
        const time = (i / totalFrames) * duration
        video.currentTime = time

        await new Promise<void>((resolve) => {
          const onSeeked = () => {
            video.removeEventListener('seeked', onSeeked)
            resolve()
          }
          video.addEventListener('seeked', onSeeked)
        })

        ctx.drawImage(video, 0, 0)
        frames.push(ctx.getImageData(0, 0, canvas.width, canvas.height))

        setProgress(Math.floor((i / totalFrames) * 50))
      }

      // Reverse frames and create video
      frames.reverse()

      // Create MediaRecorder to record canvas
      const stream = canvas.captureStream(fps)
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 5000000,
      })

      const chunks: Blob[] = []
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data)
      }

      const recordingComplete = new Promise<Blob>((resolve) => {
        mediaRecorder.onstop = () => {
          resolve(new Blob(chunks, { type: 'video/webm' }))
        }
      })

      mediaRecorder.start()

      // Play back frames in reverse order
      for (let i = 0; i < frames.length; i++) {
        ctx.putImageData(frames[i], 0, 0)
        await new Promise((resolve) => setTimeout(resolve, 1000 / fps))
        setProgress(50 + Math.floor((i / frames.length) * 50))
      }

      mediaRecorder.stop()

      const blob = await recordingComplete
      const url = URL.createObjectURL(blob)

      if (reversedUrl) URL.revokeObjectURL(reversedUrl)
      setReversedUrl(url)
      setProgress(100)
    } catch (error) {
      console.error('Failed to reverse video:', error)
    } finally {
      setProcessing(false)
    }
  }, [reversedUrl])

  const downloadReversed = () => {
    if (reversedUrl) {
      const link = document.createElement('a')
      link.href = reversedUrl
      link.download = `reversed_${videoFile?.name?.replace(/\.[^/.]+$/, '')}.webm`
      link.click()
    }
  }

  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl)
      if (reversedUrl) URL.revokeObjectURL(reversedUrl)
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
            id="video-reverser-input"
          />
          <label
            htmlFor="video-reverser-input"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition"
          >
            {t('tools.videoReverser.selectVideo')}
          </label>
        </div>

        {videoFile && (
          <div className="text-sm text-slate-600 mb-4">{videoFile.name}</div>
        )}

        {videoUrl && (
          <>
            <p className="text-sm text-slate-500 mb-2">{t('tools.videoReverser.original')}</p>
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              className="w-full rounded-lg mb-4"
              style={{ maxHeight: 300 }}
            />
          </>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {videoUrl && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.videoReverser.settings')}
          </h3>

          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeAudio}
                onChange={(e) => setIncludeAudio(e.target.checked)}
                className="rounded"
                disabled={true}
              />
              <span className="text-sm text-slate-400">
                {t('tools.videoReverser.includeAudio')} ({t('tools.videoReverser.notSupported')})
              </span>
            </label>
          </div>

          {processing && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-600">{t('tools.videoReverser.processing')}</span>
                <span className="text-sm text-blue-600">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {progress < 50
                  ? t('tools.videoReverser.extractingFrames')
                  : t('tools.videoReverser.creatingVideo')}
              </p>
            </div>
          )}

          <Button variant="primary" onClick={reverseVideo} disabled={processing}>
            {processing
              ? t('tools.videoReverser.processing')
              : t('tools.videoReverser.reverse')}
          </Button>

          <p className="text-xs text-slate-400 mt-3">
            {t('tools.videoReverser.note')}
          </p>
        </div>
      )}

      {reversedUrl && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.videoReverser.result')}
          </h3>

          <video
            src={reversedUrl}
            controls
            className="w-full rounded-lg mb-4"
            style={{ maxHeight: 300 }}
          />

          <Button variant="primary" onClick={downloadReversed}>
            {t('tools.videoReverser.download')}
          </Button>
        </div>
      )}
    </div>
  )
}
