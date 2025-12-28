import { useState, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

export default function AudioRecorder() {
  const { t } = useTranslation()
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [duration, setDuration] = useState(0)
  const [format, setFormat] = useState<'webm' | 'mp4'>('webm')

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<number>(0)
  const streamRef = useRef<MediaStream | null>(null)

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mimeType = format === 'webm' ? 'audio/webm' : 'audio/mp4'
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported(mimeType) ? mimeType : 'audio/webm',
      })

      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType })
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start(100)
      setIsRecording(true)
      setIsPaused(false)
      setAudioUrl(null)
      setDuration(0)

      timerRef.current = window.setInterval(() => {
        setDuration((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error('Failed to start recording:', error)
      alert(t('tools.audioRecorder.micPermissionError'))
    }
  }, [format, t])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      streamRef.current?.getTracks().forEach((track) => track.stop())
      setIsRecording(false)
      setIsPaused(false)
      clearInterval(timerRef.current)
    }
  }, [isRecording])

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume()
        timerRef.current = window.setInterval(() => {
          setDuration((prev) => prev + 1)
        }, 1000)
      } else {
        mediaRecorderRef.current.pause()
        clearInterval(timerRef.current)
      }
      setIsPaused(!isPaused)
    }
  }, [isRecording, isPaused])

  const downloadAudio = () => {
    if (audioUrl) {
      const link = document.createElement('a')
      link.href = audioUrl
      link.download = `recording_${Date.now()}.${format}`
      link.click()
    }
  }

  const clearRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    setAudioUrl(null)
    setDuration(0)
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-5xl font-mono text-slate-700">
            {formatTime(duration)}
          </div>

          <div className={`w-4 h-4 rounded-full ${isRecording && !isPaused ? 'bg-red-500 animate-pulse' : 'bg-slate-300'}`} />

          <div className="flex gap-2">
            {!isRecording ? (
              <Button variant="primary" onClick={startRecording}>
                {t('tools.audioRecorder.startRecording')}
              </Button>
            ) : (
              <>
                <Button variant="secondary" onClick={pauseRecording}>
                  {isPaused ? t('tools.audioRecorder.resume') : t('tools.audioRecorder.pause')}
                </Button>
                <Button variant="primary" onClick={stopRecording}>
                  {t('tools.audioRecorder.stop')}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {audioUrl && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.audioRecorder.recordedAudio')}
          </h3>

          <audio src={audioUrl} controls className="w-full mb-4" />

          <div className="flex gap-2">
            <Button variant="primary" onClick={downloadAudio}>
              {t('tools.audioRecorder.download')}
            </Button>
            <Button variant="secondary" onClick={clearRecording}>
              {t('common.clear')}
            </Button>
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.audioRecorder.settings')}
        </h3>

        <div>
          <label className="block text-sm text-slate-600 mb-2">
            {t('tools.audioRecorder.format')}
          </label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as 'webm' | 'mp4')}
            disabled={isRecording}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm disabled:bg-slate-100"
          >
            <option value="webm">WebM</option>
            <option value="mp4">MP4</option>
          </select>
        </div>
      </div>
    </div>
  )
}
