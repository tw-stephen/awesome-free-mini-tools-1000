import { useState, useRef, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

export default function AudioTrimmer() {
  const { t } = useTranslation()
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [duration, setDuration] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [trimmedUrl, setTrimmedUrl] = useState<string | null>(null)

  const audioRef = useRef<HTMLAudioElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('audio/')) {
      if (audioUrl) URL.revokeObjectURL(audioUrl)
      if (trimmedUrl) URL.revokeObjectURL(trimmedUrl)

      setAudioFile(file)
      setAudioUrl(URL.createObjectURL(file))
      setTrimmedUrl(null)
      setStartTime(0)
      setCurrentTime(0)
      setIsPlaying(false)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const dur = audioRef.current.duration
      setDuration(dur)
      setEndTime(dur)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const time = audioRef.current.currentTime
      setCurrentTime(time)

      // Stop at end time during preview
      if (time >= endTime) {
        audioRef.current.pause()
        audioRef.current.currentTime = startTime
        setIsPlaying(false)
      }
    }
  }

  const playPreview = useCallback(() => {
    if (!audioRef.current) return

    audioRef.current.currentTime = startTime
    audioRef.current.play()
    setIsPlaying(true)
  }, [startTime])

  const stopPreview = useCallback(() => {
    if (!audioRef.current) return

    audioRef.current.pause()
    setIsPlaying(false)
  }, [])

  const trimAudio = useCallback(async () => {
    if (!audioFile) return

    setProcessing(true)

    try {
      const audioContext = new AudioContext()
      audioContextRef.current = audioContext

      const arrayBuffer = await audioFile.arrayBuffer()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

      const sampleRate = audioBuffer.sampleRate
      const startSample = Math.floor(startTime * sampleRate)
      const endSample = Math.floor(endTime * sampleRate)
      const trimmedLength = endSample - startSample

      const trimmedBuffer = audioContext.createBuffer(
        audioBuffer.numberOfChannels,
        trimmedLength,
        sampleRate
      )

      for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        const originalData = audioBuffer.getChannelData(channel)
        const trimmedData = trimmedBuffer.getChannelData(channel)

        for (let i = 0; i < trimmedLength; i++) {
          trimmedData[i] = originalData[startSample + i]
        }
      }

      // Convert to WAV
      const wavBlob = audioBufferToWav(trimmedBuffer)
      const url = URL.createObjectURL(wavBlob)

      if (trimmedUrl) URL.revokeObjectURL(trimmedUrl)
      setTrimmedUrl(url)
    } catch (error) {
      console.error('Failed to trim audio:', error)
    } finally {
      setProcessing(false)
    }
  }, [audioFile, startTime, endTime, trimmedUrl])

  const downloadTrimmed = () => {
    if (trimmedUrl) {
      const link = document.createElement('a')
      link.href = trimmedUrl
      link.download = `trimmed_${audioFile?.name?.replace(/\.[^/.]+$/, '')}.wav`
      link.click()
    }
  }

  const formatTime = (seconds: number): string => {
    if (!isFinite(seconds)) return '00:00.0'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    const ms = Math.floor((seconds % 1) * 10)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms}`
  }

  // Convert AudioBuffer to WAV Blob
  function audioBufferToWav(buffer: AudioBuffer): Blob {
    const numChannels = buffer.numberOfChannels
    const sampleRate = buffer.sampleRate
    const format = 1 // PCM
    const bitDepth = 16

    const bytesPerSample = bitDepth / 8
    const blockAlign = numChannels * bytesPerSample

    const dataLength = buffer.length * blockAlign
    const bufferLength = 44 + dataLength

    const arrayBuffer = new ArrayBuffer(bufferLength)
    const view = new DataView(arrayBuffer)

    // WAV header
    writeString(view, 0, 'RIFF')
    view.setUint32(4, 36 + dataLength, true)
    writeString(view, 8, 'WAVE')
    writeString(view, 12, 'fmt ')
    view.setUint32(16, 16, true)
    view.setUint16(20, format, true)
    view.setUint16(22, numChannels, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, sampleRate * blockAlign, true)
    view.setUint16(32, blockAlign, true)
    view.setUint16(34, bitDepth, true)
    writeString(view, 36, 'data')
    view.setUint32(40, dataLength, true)

    // Interleave samples
    const offset = 44
    const channels: Float32Array[] = []
    for (let i = 0; i < numChannels; i++) {
      channels.push(buffer.getChannelData(i))
    }

    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < numChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, channels[channel][i]))
        const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff
        view.setInt16(offset + (i * numChannels + channel) * 2, intSample, true)
      }
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' })
  }

  function writeString(view: DataView, offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i))
    }
  }

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl)
      if (trimmedUrl) URL.revokeObjectURL(trimmedUrl)
      if (audioContextRef.current) audioContextRef.current.close()
    }
  }, [])

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
            id="audio-trim-input"
          />
          <label
            htmlFor="audio-trim-input"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition"
          >
            {t('tools.audioTrimmer.selectAudio')}
          </label>
        </div>

        {audioFile && (
          <div className="text-sm text-slate-600 mb-4">
            {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)
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

      {audioUrl && (
        <>
          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.audioTrimmer.trimRange')}
            </h3>

            <div className="space-y-4">
              <div className="relative h-12 bg-slate-100 rounded-lg overflow-hidden">
                <div
                  className="absolute h-full bg-blue-100"
                  style={{
                    left: `${(startTime / duration) * 100}%`,
                    width: `${((endTime - startTime) / duration) * 100}%`,
                  }}
                />
                <div
                  className="absolute h-full w-1 bg-red-500"
                  style={{ left: `${(currentTime / duration) * 100}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">
                    {t('tools.audioTrimmer.startTime')}: {formatTime(startTime)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    step="0.1"
                    value={startTime}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value)
                      setStartTime(Math.min(val, endTime - 0.1))
                    }}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">
                    {t('tools.audioTrimmer.endTime')}: {formatTime(endTime)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    step="0.1"
                    value={endTime}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value)
                      setEndTime(Math.max(val, startTime + 0.1))
                    }}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>{t('tools.audioTrimmer.selectedDuration')}: {formatTime(endTime - startTime)}</span>
                <span>{t('tools.audioTrimmer.totalDuration')}: {formatTime(duration)}</span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={isPlaying ? stopPreview : playPreview}
                >
                  {isPlaying ? t('tools.audioTrimmer.stopPreview') : t('tools.audioTrimmer.preview')}
                </Button>
                <Button
                  variant="primary"
                  onClick={trimAudio}
                  disabled={processing}
                >
                  {processing ? t('tools.audioTrimmer.processing') : t('tools.audioTrimmer.trim')}
                </Button>
              </div>
            </div>
          </div>

          {trimmedUrl && (
            <div className="card p-4">
              <h3 className="text-sm font-medium text-slate-700 mb-3">
                {t('tools.audioTrimmer.trimmedAudio')}
              </h3>

              <audio src={trimmedUrl} controls className="w-full mb-4" />

              <Button variant="primary" onClick={downloadTrimmed}>
                {t('tools.audioTrimmer.download')}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
