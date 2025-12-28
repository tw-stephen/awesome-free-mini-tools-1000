import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

export default function VideoSpeedChanger() {
  const { t } = useTranslation()
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [speed, setSpeed] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [preservePitch, setPreservePitch] = useState(true)

  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('video/')) {
      if (videoUrl) URL.revokeObjectURL(videoUrl)

      setVideoFile(file)
      setVideoUrl(URL.createObjectURL(file))
      setSpeed(1)
      setIsPlaying(false)
      setCurrentTime(0)
    }
  }

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed)
    if (videoRef.current) {
      videoRef.current.playbackRate = newSpeed
    }
  }

  const togglePlay = () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const speedPresets = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3, 4]

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.preservesPitch = preservePitch
    }
  }, [preservePitch])

  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl)
    }
  }, [videoUrl])

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
            id="video-speed-input"
          />
          <label
            htmlFor="video-speed-input"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition"
          >
            {t('tools.videoSpeedChanger.selectVideo')}
          </label>
        </div>

        {videoFile && (
          <div className="text-sm text-slate-600 mb-4">{videoFile.name}</div>
        )}

        {videoUrl && (
          <div className="relative">
            <video
              ref={videoRef}
              src={videoUrl}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
              className="w-full rounded-lg"
              style={{ maxHeight: 400 }}
            />
            <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-sm">
              {speed}x
            </div>
          </div>
        )}
      </div>

      {videoUrl && (
        <>
          <div className="card p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-mono text-slate-700">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
              <Button variant="primary" onClick={togglePlay}>
                {isPlaying ? t('tools.videoSpeedChanger.pause') : t('tools.videoSpeedChanger.play')}
              </Button>
            </div>

            <input
              type="range"
              min="0"
              max={duration}
              step="0.1"
              value={currentTime}
              onChange={(e) => {
                const time = parseFloat(e.target.value)
                setCurrentTime(time)
                if (videoRef.current) {
                  videoRef.current.currentTime = time
                }
              }}
              className="w-full"
            />
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.videoSpeedChanger.playbackSpeed')}
            </h3>

            <div className="mb-4">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-2xl font-mono text-blue-600">{speed}x</span>
                <span className="text-sm text-slate-500">
                  ({formatTime(duration / speed)} {t('tools.videoSpeedChanger.adjusted')})
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="4"
                step="0.05"
                value={speed}
                onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>0.1x</span>
                <span>1x</span>
                <span>2x</span>
                <span>4x</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {speedPresets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => handleSpeedChange(preset)}
                  className={`px-3 py-1 text-sm rounded-lg ${
                    Math.abs(speed - preset) < 0.01
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {preset}x
                </button>
              ))}
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={preservePitch}
                onChange={(e) => setPreservePitch(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-slate-600">
                {t('tools.videoSpeedChanger.preservePitch')}
              </span>
            </label>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.videoSpeedChanger.info')}
            </h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-slate-500">{t('tools.videoSpeedChanger.originalDuration')}</div>
                <div className="text-lg font-medium text-slate-700">{formatTime(duration)}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-slate-500">{t('tools.videoSpeedChanger.adjustedDuration')}</div>
                <div className="text-lg font-medium text-blue-600">{formatTime(duration / speed)}</div>
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-3">
              {t('tools.videoSpeedChanger.note')}
            </p>
          </div>
        </>
      )}
    </div>
  )
}
