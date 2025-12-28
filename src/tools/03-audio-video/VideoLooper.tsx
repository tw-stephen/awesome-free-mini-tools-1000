import { useState, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

export default function VideoLooper() {
  const { t } = useTranslation()
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [duration, setDuration] = useState(0)
  const [loopStart, setLoopStart] = useState(0)
  const [loopEnd, setLoopEnd] = useState(0)
  const [isLooping, setIsLooping] = useState(true)
  const [loopCount, setLoopCount] = useState(0)
  const [playbackRate, setPlaybackRate] = useState(1)

  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('video/')) {
      if (videoUrl) URL.revokeObjectURL(videoUrl)

      setVideoFile(file)
      setVideoUrl(URL.createObjectURL(file))
      setLoopStart(0)
      setLoopCount(0)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration
      setDuration(dur)
      setLoopEnd(dur)
    }
  }

  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current || !isLooping) return

    if (videoRef.current.currentTime >= loopEnd) {
      videoRef.current.currentTime = loopStart
      setLoopCount((prev) => prev + 1)
    }
  }, [isLooping, loopStart, loopEnd])

  const setLoopPoint = (type: 'start' | 'end') => {
    if (!videoRef.current) return

    if (type === 'start') {
      setLoopStart(Math.min(videoRef.current.currentTime, loopEnd - 0.1))
    } else {
      setLoopEnd(Math.max(videoRef.current.currentTime, loopStart + 0.1))
    }
  }

  const jumpToLoopStart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = loopStart
    }
  }

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate)
    if (videoRef.current) {
      videoRef.current.playbackRate = rate
    }
  }

  const resetLoop = () => {
    setLoopStart(0)
    setLoopEnd(duration)
    setLoopCount(0)
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    const ms = Math.floor((seconds % 1) * 100)
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
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
            id="video-loop-input"
          />
          <label
            htmlFor="video-loop-input"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition"
          >
            {t('tools.videoLooper.selectVideo')}
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
      </div>

      {videoUrl && (
        <>
          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.videoLooper.loopSettings')}
            </h3>

            <div className="space-y-4">
              <div className="relative h-8 bg-slate-100 rounded-lg overflow-hidden">
                <div
                  className="absolute h-full bg-blue-200"
                  style={{
                    left: `${(loopStart / duration) * 100}%`,
                    width: `${((loopEnd - loopStart) / duration) * 100}%`,
                  }}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">
                    {t('tools.videoLooper.loopStart')}: {formatTime(loopStart)}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="range"
                      min="0"
                      max={duration}
                      step="0.01"
                      value={loopStart}
                      onChange={(e) => setLoopStart(Math.min(parseFloat(e.target.value), loopEnd - 0.1))}
                      className="flex-1"
                    />
                    <Button variant="secondary" onClick={() => setLoopPoint('start')}>
                      {t('tools.videoLooper.setHere')}
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">
                    {t('tools.videoLooper.loopEnd')}: {formatTime(loopEnd)}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="range"
                      min="0"
                      max={duration}
                      step="0.01"
                      value={loopEnd}
                      onChange={(e) => setLoopEnd(Math.max(parseFloat(e.target.value), loopStart + 0.1))}
                      className="flex-1"
                    />
                    <Button variant="secondary" onClick={() => setLoopPoint('end')}>
                      {t('tools.videoLooper.setHere')}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-500">
                  {t('tools.videoLooper.loopDuration')}: {formatTime(loopEnd - loopStart)}
                </div>
                <div className="text-sm text-slate-500">
                  {t('tools.videoLooper.loopCount')}: {loopCount}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isLooping}
                    onChange={(e) => setIsLooping(e.target.checked)}
                  />
                  <span className="text-sm text-slate-600">
                    {t('tools.videoLooper.enableLoop')}
                  </span>
                </label>
                <Button variant="secondary" onClick={jumpToLoopStart}>
                  {t('tools.videoLooper.jumpToStart')}
                </Button>
                <Button variant="secondary" onClick={resetLoop}>
                  {t('tools.videoLooper.reset')}
                </Button>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.videoLooper.playbackSpeed')}
            </h3>

            <div className="flex flex-wrap gap-2">
              {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                <button
                  key={rate}
                  onClick={() => handlePlaybackRateChange(rate)}
                  className={`px-3 py-1 text-sm rounded ${
                    playbackRate === rate
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
