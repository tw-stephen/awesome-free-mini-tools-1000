import { useState, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

export default function AudioStereoWidener() {
  const { t } = useTranslation()
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [processedUrl, setProcessedUrl] = useState<string | null>(null)
  const [width, setWidth] = useState(1.5)
  const [isMono, setIsMono] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('audio/')) {
      if (audioUrl) URL.revokeObjectURL(audioUrl)
      if (processedUrl) URL.revokeObjectURL(processedUrl)

      setAudioFile(file)
      setAudioUrl(URL.createObjectURL(file))
      setProcessedUrl(null)

      // Check if mono
      try {
        const audioContext = new AudioContext()
        const arrayBuffer = await file.arrayBuffer()
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
        setIsMono(audioBuffer.numberOfChannels === 1)
        await audioContext.close()
      } catch (error) {
        console.error('Failed to analyze audio:', error)
      }
    }
  }

  const applyWidening = useCallback(async () => {
    if (!audioFile) return

    setProcessing(true)

    try {
      const audioContext = new AudioContext()
      const arrayBuffer = await audioFile.arrayBuffer()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

      let leftChannel: Float32Array
      let rightChannel: Float32Array

      if (audioBuffer.numberOfChannels === 1) {
        // Convert mono to stereo
        leftChannel = new Float32Array(audioBuffer.getChannelData(0))
        rightChannel = new Float32Array(audioBuffer.getChannelData(0))
      } else {
        leftChannel = new Float32Array(audioBuffer.getChannelData(0))
        rightChannel = new Float32Array(audioBuffer.getChannelData(1))
      }

      // Create output buffer
      const outputBuffer = audioContext.createBuffer(
        2,
        audioBuffer.length,
        audioBuffer.sampleRate
      )

      const outputLeft = outputBuffer.getChannelData(0)
      const outputRight = outputBuffer.getChannelData(1)

      // Apply stereo widening using Mid/Side processing
      for (let i = 0; i < audioBuffer.length; i++) {
        // Calculate mid (mono) and side (stereo) signals
        const mid = (leftChannel[i] + rightChannel[i]) / 2
        const side = (leftChannel[i] - rightChannel[i]) / 2

        // Apply width to side signal
        const newSide = side * width

        // Reconstruct left and right with adjusted side
        outputLeft[i] = Math.max(-1, Math.min(1, mid + newSide))
        outputRight[i] = Math.max(-1, Math.min(1, mid - newSide))
      }

      const wavBlob = audioBufferToWav(outputBuffer)
      const url = URL.createObjectURL(wavBlob)

      if (processedUrl) URL.revokeObjectURL(processedUrl)
      setProcessedUrl(url)

      await audioContext.close()
    } catch (error) {
      console.error('Failed to apply stereo widening:', error)
    } finally {
      setProcessing(false)
    }
  }, [audioFile, width, processedUrl])

  const downloadProcessed = () => {
    if (processedUrl) {
      const link = document.createElement('a')
      link.href = processedUrl
      link.download = `stereo_wide_${audioFile?.name?.replace(/\.[^/.]+$/, '')}.wav`
      link.click()
    }
  }

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

  const getWidthLabel = (value: number): string => {
    if (value === 0) return t('tools.audioStereoWidener.mono')
    if (value < 1) return t('tools.audioStereoWidener.narrow')
    if (value === 1) return t('tools.audioStereoWidener.normal')
    if (value < 2) return t('tools.audioStereoWidener.wide')
    return t('tools.audioStereoWidener.extraWide')
  }

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
            id="stereo-widener-input"
          />
          <label
            htmlFor="stereo-widener-input"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition"
          >
            {t('tools.audioStereoWidener.selectAudio')}
          </label>
        </div>

        {audioFile && (
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
            <span>{audioFile.name}</span>
            {isMono && (
              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">
                {t('tools.audioStereoWidener.monoSource')}
              </span>
            )}
          </div>
        )}

        {audioUrl && (
          <>
            <p className="text-sm text-slate-500 mb-2">{t('tools.audioStereoWidener.original')}</p>
            <audio src={audioUrl} controls className="w-full" />
          </>
        )}
      </div>

      {audioUrl && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.audioStereoWidener.settings')}
          </h3>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-slate-600">
                {t('tools.audioStereoWidener.stereoWidth')}
              </label>
              <span className="text-lg font-medium text-blue-600">
                {width.toFixed(1)}x - {getWidthLabel(width)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="3"
              step="0.1"
              value={width}
              onChange={(e) => setWidth(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>{t('tools.audioStereoWidener.mono')}</span>
              <span>{t('tools.audioStereoWidener.normal')}</span>
              <span>{t('tools.audioStereoWidener.extraWide')}</span>
            </div>
          </div>

          {/* Visual representation */}
          <div className="mb-4 p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="text-xs text-slate-500 mb-1">L</div>
                <div
                  className="w-4 bg-blue-500 rounded transition-all"
                  style={{ height: 40 + width * 15, opacity: 0.7 + width * 0.1 }}
                />
              </div>
              <div
                className="flex items-center"
                style={{ width: 50 + width * 30 }}
              >
                <div className="flex-1 h-0.5 bg-slate-300" />
                <div className="w-2 h-2 rounded-full bg-slate-400" />
                <div className="flex-1 h-0.5 bg-slate-300" />
              </div>
              <div className="text-center">
                <div className="text-xs text-slate-500 mb-1">R</div>
                <div
                  className="w-4 bg-blue-500 rounded transition-all"
                  style={{ height: 40 + width * 15, opacity: 0.7 + width * 0.1 }}
                />
              </div>
            </div>
            <div className="text-center text-xs text-slate-400 mt-2">
              {t('tools.audioStereoWidener.visualization')}
            </div>
          </div>

          {isMono && (
            <p className="text-sm text-yellow-600 mb-4">
              {t('tools.audioStereoWidener.monoNote')}
            </p>
          )}

          <Button variant="primary" onClick={applyWidening} disabled={processing}>
            {processing
              ? t('tools.audioStereoWidener.processing')
              : t('tools.audioStereoWidener.apply')}
          </Button>
        </div>
      )}

      {processedUrl && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.audioStereoWidener.result')}
          </h3>

          <audio src={processedUrl} controls className="w-full mb-4" />

          <Button variant="primary" onClick={downloadProcessed}>
            {t('tools.audioStereoWidener.download')}
          </Button>
        </div>
      )}
    </div>
  )
}
