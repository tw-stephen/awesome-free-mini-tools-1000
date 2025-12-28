import { useState, useRef, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

export default function AudioSpeedChanger() {
  const { t } = useTranslation()
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [preservePitch, setPreservePitch] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [processedUrl, setProcessedUrl] = useState<string | null>(null)

  const audioRef = useRef<HTMLAudioElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('audio/')) {
      if (audioUrl) URL.revokeObjectURL(audioUrl)
      if (processedUrl) URL.revokeObjectURL(processedUrl)

      setAudioFile(file)
      setAudioUrl(URL.createObjectURL(file))
      setProcessedUrl(null)
      setCurrentTime(0)
      setIsPlaying(false)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate)
    if (audioRef.current) {
      audioRef.current.playbackRate = rate
    }
  }

  const processAudio = useCallback(async () => {
    if (!audioFile) return

    setProcessing(true)

    try {
      const audioContext = new AudioContext()
      const arrayBuffer = await audioFile.arrayBuffer()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

      // Change speed by resampling
      const rate = playbackRate
      const newLength = Math.round(audioBuffer.length / rate)
      const sampleRate = audioBuffer.sampleRate

      const processedBuffer = audioContext.createBuffer(
        audioBuffer.numberOfChannels,
        newLength,
        sampleRate
      )

      for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        const originalData = audioBuffer.getChannelData(channel)
        const processedData = processedBuffer.getChannelData(channel)

        for (let i = 0; i < newLength; i++) {
          const originalIndex = i * rate
          const index0 = Math.floor(originalIndex)
          const index1 = Math.min(index0 + 1, originalData.length - 1)
          const fraction = originalIndex - index0

          // Linear interpolation
          processedData[i] = originalData[index0] * (1 - fraction) + originalData[index1] * fraction
        }
      }

      // Convert to WAV
      const wavBlob = audioBufferToWav(processedBuffer)
      const url = URL.createObjectURL(wavBlob)

      if (processedUrl) URL.revokeObjectURL(processedUrl)
      setProcessedUrl(url)

      audioContext.close()
    } catch (error) {
      console.error('Failed to process audio:', error)
    } finally {
      setProcessing(false)
    }
  }, [audioFile, playbackRate, processedUrl])

  const downloadProcessed = () => {
    if (processedUrl) {
      const link = document.createElement('a')
      link.href = processedUrl
      link.download = `speed_${playbackRate}x_${audioFile?.name?.replace(/\.[^/.]+$/, '')}.wav`
      link.click()
    }
  }

  // Convert AudioBuffer to WAV Blob
  function audioBufferToWav(buffer: AudioBuffer): Blob {
    const numChannels = buffer.numberOfChannels
    const sampleRate = buffer.sampleRate
    const format = 1
    const bitDepth = 16

    const bytesPerSample = bitDepth / 8
    const blockAlign = numChannels * bytesPerSample
    const dataLength = buffer.length * blockAlign
    const bufferLength = 44 + dataLength

    const arrayBuffer = new ArrayBuffer(bufferLength)
    const view = new DataView(arrayBuffer)

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

  const formatTime = (seconds: number): string => {
    if (!isFinite(seconds)) return '00:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.preservesPitch = preservePitch
    }
  }, [preservePitch])

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
            id="audio-speed-input"
          />
          <label
            htmlFor="audio-speed-input"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition"
          >
            {t('tools.audioSpeedChanger.selectAudio')}
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

      {audioUrl && (
        <>
          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.audioSpeedChanger.preview')}
            </h3>

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

              <div className="flex gap-2">
                <Button variant="primary" onClick={togglePlay}>
                  {isPlaying ? t('tools.audioSpeedChanger.pause') : t('tools.audioSpeedChanger.play')}
                </Button>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.audioSpeedChanger.speedSettings')}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-600 mb-2">
                  {t('tools.audioSpeedChanger.speed')}: {playbackRate.toFixed(2)}x
                </label>
                <input
                  type="range"
                  min="0.25"
                  max="4"
                  step="0.05"
                  value={playbackRate}
                  onChange={(e) => handleRateChange(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>0.25x</span>
                  <span>1x</span>
                  <span>2x</span>
                  <span>4x</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => handleRateChange(rate)}
                    className={`px-3 py-1 text-sm rounded ${
                      Math.abs(playbackRate - rate) < 0.01
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={preservePitch}
                  onChange={(e) => setPreservePitch(e.target.checked)}
                />
                <span className="text-sm text-slate-600">
                  {t('tools.audioSpeedChanger.preservePitch')}
                </span>
              </label>

              <div className="text-sm text-slate-500">
                {t('tools.audioSpeedChanger.newDuration')}: {formatTime(duration / playbackRate)}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="primary"
                  onClick={processAudio}
                  disabled={processing}
                >
                  {processing ? t('tools.audioSpeedChanger.processing') : t('tools.audioSpeedChanger.process')}
                </Button>
              </div>
            </div>
          </div>

          {processedUrl && (
            <div className="card p-4">
              <h3 className="text-sm font-medium text-slate-700 mb-3">
                {t('tools.audioSpeedChanger.result')}
              </h3>

              <audio src={processedUrl} controls className="w-full mb-4" />

              <Button variant="primary" onClick={downloadProcessed}>
                {t('tools.audioSpeedChanger.download')}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
