import { useState, useRef, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

export default function VideoPlayer() {
  const { t } = useTranslation()
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('video/')) {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl)
      }
      setVideoFile(file)
      setVideoUrl(URL.createObjectURL(file))
      setIsPlaying(false)
      setCurrentTime(0)
    }
  }

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying])

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

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value)
    setVolume(vol)
    if (videoRef.current) {
      videoRef.current.volume = vol
    }
    setIsMuted(vol === 0)
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate)
    if (videoRef.current) {
      videoRef.current.playbackRate = rate
    }
  }

  const toggleFullscreen = async () => {
    if (!containerRef.current) return

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        await containerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen()
      }
    }
  }

  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, currentTime + seconds))
    }
  }

  const formatTime = (seconds: number): string => {
    if (!isFinite(seconds)) return '00:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!videoRef.current) return

      switch (e.key) {
        case ' ':
          e.preventDefault()
          togglePlay()
          break
        case 'ArrowLeft':
          skipTime(-5)
          break
        case 'ArrowRight':
          skipTime(5)
          break
        case 'm':
          toggleMute()
          break
        case 'f':
          toggleFullscreen()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [togglePlay])

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
            id="video-input"
          />
          <label
            htmlFor="video-input"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition"
          >
            {t('tools.videoPlayer.selectVideo')}
          </label>
        </div>

        {videoFile && (
          <div className="text-sm text-slate-600 mb-4">
            {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
          </div>
        )}

        <div ref={containerRef} className="relative bg-black rounded-lg overflow-hidden">
          {videoUrl ? (
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full"
              onClick={togglePlay}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
            />
          ) : (
            <div className="w-full aspect-video flex items-center justify-center text-slate-400">
              {t('tools.videoPlayer.noVideo')}
            </div>
          )}
        </div>
      </div>

      {videoUrl && (
        <div className="card p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 w-12">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration || 0}
                step="0.1"
                value={currentTime}
                onChange={handleSeek}
                className="flex-1"
              />
              <span className="text-sm text-slate-600 w-12">{formatTime(duration)}</span>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => skipTime(-10)}>
                  -10s
                </Button>
                <Button variant="primary" onClick={togglePlay}>
                  {isPlaying ? t('tools.videoPlayer.pause') : t('tools.videoPlayer.play')}
                </Button>
                <Button variant="secondary" onClick={() => skipTime(10)}>
                  +10s
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="text-slate-600 hover:text-slate-800"
                >
                  {isMuted ? '🔇' : '🔊'}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-24"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">{t('tools.videoPlayer.speed')}:</span>
                {[0.5, 1, 1.5, 2].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => handlePlaybackRateChange(rate)}
                    className={`px-2 py-1 text-sm rounded ${
                      playbackRate === rate
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>

              <Button variant="secondary" onClick={toggleFullscreen}>
                {isFullscreen ? t('tools.videoPlayer.exitFullscreen') : t('tools.videoPlayer.fullscreen')}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.videoPlayer.shortcuts')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-slate-500">
          <div><kbd className="px-1 bg-slate-100 rounded">Space</kbd> {t('tools.videoPlayer.playPause')}</div>
          <div><kbd className="px-1 bg-slate-100 rounded">←/→</kbd> {t('tools.videoPlayer.skipSeconds')}</div>
          <div><kbd className="px-1 bg-slate-100 rounded">M</kbd> {t('tools.videoPlayer.muteToggle')}</div>
          <div><kbd className="px-1 bg-slate-100 rounded">F</kbd> {t('tools.videoPlayer.fullscreenToggle')}</div>
        </div>
      </div>
    </div>
  )
}
