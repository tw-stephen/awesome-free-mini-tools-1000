import { useState, useRef, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface Recording {
  id: string
  blob: Blob
  url: string
  duration: number
  timestamp: Date
}

export default function VoiceRecorder() {
  const { t } = useTranslation()
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)
  const [audioLevel, setAudioLevel] = useState(0)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)
  const pausedTimeRef = useRef<number>(0)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationRef = useRef<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const updateAudioLevel = useCallback(() => {
    if (!analyserRef.current) return

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    analyserRef.current.getByteFrequencyData(dataArray)

    const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length
    setAudioLevel((avg / 255) * 100)

    if (isRecording && !isPaused) {
      animationRef.current = requestAnimationFrame(updateAudioLevel)
    }
  }, [isRecording, isPaused])

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Setup audio level monitoring
      const audioContext = new AudioContext()
      audioContextRef.current = audioContext
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      analyserRef.current = analyser
      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        const duration = (Date.now() - startTimeRef.current - pausedTimeRef.current) / 1000

        setRecordings((prev) => [
          {
            id: Date.now().toString(),
            blob,
            url,
            duration,
            timestamp: new Date(),
          },
          ...prev,
        ])

        stream.getTracks().forEach((track) => track.stop())
        if (audioContextRef.current) {
          audioContextRef.current.close()
        }
      }

      mediaRecorder.start(100)
      startTimeRef.current = Date.now()
      pausedTimeRef.current = 0
      setIsRecording(true)
      setIsPaused(false)
      setRecordingTime(0)

      timerRef.current = window.setInterval(() => {
        setRecordingTime((Date.now() - startTimeRef.current - pausedTimeRef.current) / 1000)
      }, 100)

      updateAudioLevel()
    } catch (error) {
      console.error('Failed to start recording:', error)
    }
  }, [updateAudioLevel])

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume()
        pausedTimeRef.current += Date.now() - (timerRef.current || Date.now())
        timerRef.current = window.setInterval(() => {
          setRecordingTime((Date.now() - startTimeRef.current - pausedTimeRef.current) / 1000)
        }, 100)
        updateAudioLevel()
      } else {
        mediaRecorderRef.current.pause()
        if (timerRef.current) clearInterval(timerRef.current)
        if (animationRef.current) cancelAnimationFrame(animationRef.current)
      }
      setIsPaused(!isPaused)
    }
  }, [isRecording, isPaused, updateAudioLevel])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      if (timerRef.current) clearInterval(timerRef.current)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      setIsRecording(false)
      setIsPaused(false)
      setRecordingTime(0)
      setAudioLevel(0)
    }
  }, [isRecording])

  const playRecording = (recording: Recording) => {
    if (currentlyPlaying === recording.id) {
      audioRef.current?.pause()
      setCurrentlyPlaying(null)
    } else {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      audioRef.current = new Audio(recording.url)
      audioRef.current.onended = () => setCurrentlyPlaying(null)
      audioRef.current.play()
      setCurrentlyPlaying(recording.id)
    }
  }

  const downloadRecording = (recording: Recording) => {
    const link = document.createElement('a')
    link.href = recording.url
    link.download = `recording_${recording.timestamp.toISOString().slice(0, 19).replace(/[:-]/g, '')}.webm`
    link.click()
  }

  const deleteRecording = (id: string) => {
    const recording = recordings.find((r) => r.id === id)
    if (recording) {
      URL.revokeObjectURL(recording.url)
    }
    setRecordings((prev) => prev.filter((r) => r.id !== id))
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    const ms = Math.floor((seconds % 1) * 10)
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms}`
  }

  useEffect(() => {
    return () => {
      recordings.forEach((r) => URL.revokeObjectURL(r.url))
      if (timerRef.current) clearInterval(timerRef.current)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex flex-col items-center mb-6">
          <div className="text-5xl font-mono text-slate-700 mb-4">
            {formatTime(recordingTime)}
          </div>

          {isRecording && (
            <div className="w-full max-w-md mb-4">
              <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 transition-all duration-75"
                  style={{ width: `${audioLevel}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex gap-2">
            {!isRecording ? (
              <Button variant="primary" onClick={startRecording}>
                {t('tools.voiceRecorder.startRecording')}
              </Button>
            ) : (
              <>
                <Button variant="secondary" onClick={pauseRecording}>
                  {isPaused ? t('tools.voiceRecorder.resume') : t('tools.voiceRecorder.pause')}
                </Button>
                <Button variant="secondary" className="bg-red-500 hover:bg-red-600 text-white" onClick={stopRecording}>
                  {t('tools.voiceRecorder.stop')}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {recordings.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.voiceRecorder.recordings')} ({recordings.length})
          </h3>

          <div className="space-y-2">
            {recordings.map((recording) => (
              <div
                key={recording.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => playRecording(recording)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentlyPlaying === recording.id
                        ? 'bg-red-500 text-white'
                        : 'bg-blue-500 text-white'
                    }`}
                  >
                    {currentlyPlaying === recording.id ? '⏸' : '▶'}
                  </button>
                  <div>
                    <div className="text-sm font-medium text-slate-700">
                      {recording.timestamp.toLocaleTimeString()}
                    </div>
                    <div className="text-xs text-slate-500">
                      {formatTime(recording.duration)}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadRecording(recording)}
                    className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    {t('tools.voiceRecorder.download')}
                  </button>
                  <button
                    onClick={() => deleteRecording(recording.id)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    {t('tools.voiceRecorder.delete')}
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
