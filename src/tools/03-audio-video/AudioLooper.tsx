import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

export default function AudioLooper() {
  const { t } = useTranslation()
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [loopStart, setLoopStart] = useState(0)
  const [loopEnd, setLoopEnd] = useState(100)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [loopCount, setLoopCount] = useState(0)

  const audioRef = useRef<HTMLAudioElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('audio/')) {
      if (audioUrl) URL.revokeObjectURL(audioUrl)

      setAudioFile(file)
      setAudioUrl(URL.createObjectURL(file))
      setIsPlaying(false)
      setLoopStart(0)
      setLoopEnd(100)
      setLoopCount(0)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current && duration > 0) {
      const time = audioRef.current.currentTime
      setCurrentTime(time)

      const endTime = (loopEnd / 100) * duration
      if (time >= endTime) {
        const startTime = (loopStart / 100) * duration
        audioRef.current.currentTime = startTime
        setLoopCount((prev) => prev + 1)
      }
    }
  }

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      const startTime = (loopStart / 100) * duration
      if (audioRef.current.currentTime < startTime) {
        audioRef.current.currentTime = startTime
      }
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const resetLoop = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = (loopStart / 100) * duration
      setLoopCount(0)
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl])

  const loopStartTime = (loopStart / 100) * duration
  const loopEndTime = (loopEnd / 100) * duration

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
            id="audio-looper-input"
          />
          <label
            htmlFor="audio-looper-input"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition"
          >
            {t('tools.audioLooper.selectAudio')}
          </label>
        </div>

        {audioFile && (
          <div className="text-sm text-slate-600 mb-4">
            {audioFile.name}
          </div>
        )}

        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
        )}
      </div>

      {audioUrl && duration > 0 && (
        <>
          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.audioLooper.loopRange')}
            </h3>

            <div className="relative h-12 bg-slate-200 rounded-lg overflow-hidden mb-4">
              <div
                className="absolute h-full bg-blue-200"
                style={{
                  left: `${loopStart}%`,
                  width: `${loopEnd - loopStart}%`,
                }}
              />
              <div
                className="absolute h-full w-1 bg-red-500"
                style={{
                  left: `${(currentTime / duration) * 100}%`,
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  {t('tools.audioLooper.start')}: {formatTime(loopStartTime)}
                </label>
                <input
                  type="range"
                  min="0"
                  max={loopEnd - 1}
                  value={loopStart}
                  onChange={(e) => setLoopStart(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  {t('tools.audioLooper.end')}: {formatTime(loopEndTime)}
                </label>
                <input
                  type="range"
                  min={loopStart + 1}
                  max="100"
                  value={loopEnd}
                  onChange={(e) => setLoopEnd(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <div className="text-center text-sm text-slate-500 mb-4">
              {t('tools.audioLooper.loopDuration')}: {formatTime(loopEndTime - loopStartTime)}
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-2xl font-mono text-slate-700">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
              <div className="text-lg text-blue-600">
                {t('tools.audioLooper.loops')}: {loopCount}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="primary" onClick={togglePlay}>
                {isPlaying ? t('tools.audioLooper.pause') : t('tools.audioLooper.play')}
              </Button>
              <Button variant="secondary" onClick={resetLoop}>
                {t('tools.audioLooper.reset')}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
