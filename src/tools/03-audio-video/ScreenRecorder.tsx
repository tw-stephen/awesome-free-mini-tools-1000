import { useState, useRef, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

export default function ScreenRecorder() {
  const { t } = useTranslation()
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null)
  const [includeAudio, setIncludeAudio] = useState(true)
  const [includeMicrophone, setIncludeMicrophone] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)
  const pausedTimeRef = useRef<number>(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const previewRef = useRef<HTMLVideoElement>(null)

  const startRecording = useCallback(async () => {
    try {
      // Get screen stream
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: includeAudio,
      })

      let combinedStream = screenStream

      // Add microphone if requested
      if (includeMicrophone) {
        try {
          const micStream = await navigator.mediaDevices.getUserMedia({ audio: true })
          const audioContext = new AudioContext()
          const dest = audioContext.createMediaStreamDestination()

          // Mix screen audio (if any)
          if (screenStream.getAudioTracks().length > 0) {
            const screenSource = audioContext.createMediaStreamSource(
              new MediaStream(screenStream.getAudioTracks())
            )
            screenSource.connect(dest)
          }

          // Add microphone
          const micSource = audioContext.createMediaStreamSource(micStream)
          micSource.connect(dest)

          combinedStream = new MediaStream([
            ...screenStream.getVideoTracks(),
            ...dest.stream.getAudioTracks(),
          ])
        } catch (micError) {
          console.warn('Could not access microphone:', micError)
        }
      }

      // Show preview
      if (previewRef.current) {
        previewRef.current.srcObject = combinedStream
        previewRef.current.play()
      }

      const mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: 'video/webm;codecs=vp9',
      })
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)

        if (recordedUrl) URL.revokeObjectURL(recordedUrl)
        setRecordedUrl(url)

        combinedStream.getTracks().forEach((track) => track.stop())
        if (previewRef.current) {
          previewRef.current.srcObject = null
        }
      }

      // Handle stream stop (when user clicks browser's stop sharing button)
      combinedStream.getVideoTracks()[0].onended = () => {
        if (isRecording) {
          stopRecording()
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
    } catch (error) {
      console.error('Failed to start recording:', error)
    }
  }, [includeAudio, includeMicrophone, recordedUrl, isRecording])

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume()
        pausedTimeRef.current += Date.now() - (timerRef.current || Date.now())
        timerRef.current = window.setInterval(() => {
          setRecordingTime((Date.now() - startTimeRef.current - pausedTimeRef.current) / 1000)
        }, 100)
      } else {
        mediaRecorderRef.current.pause()
        if (timerRef.current) clearInterval(timerRef.current)
      }
      setIsPaused(!isPaused)
    }
  }, [isRecording, isPaused])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      if (timerRef.current) clearInterval(timerRef.current)
      setIsRecording(false)
      setIsPaused(false)
      setRecordingTime(0)
    }
  }, [isRecording])

  const downloadRecording = () => {
    if (recordedUrl) {
      const link = document.createElement('a')
      link.href = recordedUrl
      link.download = `screen_recording_${new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')}.webm`
      link.click()
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    return () => {
      if (recordedUrl) URL.revokeObjectURL(recordedUrl)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        {!isRecording && !recordedUrl && (
          <div className="mb-4 space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeAudio}
                onChange={(e) => setIncludeAudio(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-slate-600">
                {t('tools.screenRecorder.includeSystemAudio')}
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeMicrophone}
                onChange={(e) => setIncludeMicrophone(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-slate-600">
                {t('tools.screenRecorder.includeMicrophone')}
              </span>
            </label>
          </div>
        )}

        {isRecording && (
          <div className="mb-4">
            <video
              ref={previewRef}
              muted
              className="w-full rounded-lg bg-black"
              style={{ maxHeight: 400 }}
            />
          </div>
        )}

        <div className="flex flex-col items-center">
          {isRecording && (
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span className="text-2xl font-mono text-slate-700">
                {formatTime(recordingTime)}
              </span>
            </div>
          )}

          <div className="flex gap-2">
            {!isRecording ? (
              <Button variant="primary" onClick={startRecording}>
                {t('tools.screenRecorder.startRecording')}
              </Button>
            ) : (
              <>
                <Button variant="secondary" onClick={pauseRecording}>
                  {isPaused ? t('tools.screenRecorder.resume') : t('tools.screenRecorder.pause')}
                </Button>
                <Button variant="secondary" className="bg-red-500 hover:bg-red-600 text-white" onClick={stopRecording}>
                  {t('tools.screenRecorder.stop')}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {recordedUrl && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.screenRecorder.result')}
          </h3>

          <video
            ref={videoRef}
            src={recordedUrl}
            controls
            className="w-full rounded-lg mb-4"
            style={{ maxHeight: 400 }}
          />

          <div className="flex gap-2">
            <Button variant="primary" onClick={downloadRecording}>
              {t('tools.screenRecorder.download')}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                if (recordedUrl) URL.revokeObjectURL(recordedUrl)
                setRecordedUrl(null)
              }}
            >
              {t('tools.screenRecorder.newRecording')}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
