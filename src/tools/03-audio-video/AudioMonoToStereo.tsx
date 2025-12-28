import { useState, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

type ConversionMode = 'duplicate' | 'phantom' | 'delay'

export default function AudioMonoToStereo() {
  const { t } = useTranslation()
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [processedUrl, setProcessedUrl] = useState<string | null>(null)
  const [mode, setMode] = useState<ConversionMode>('duplicate')
  const [isMono, setIsMono] = useState(false)
  const [delayMs, setDelayMs] = useState(20)

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

  const convertToStereo = useCallback(async () => {
    if (!audioFile) return

    setProcessing(true)

    try {
      const audioContext = new AudioContext()
      const arrayBuffer = await audioFile.arrayBuffer()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

      const monoData = audioBuffer.getChannelData(0)
      const sampleRate = audioBuffer.sampleRate

      // Create stereo buffer
      const stereoBuffer = audioContext.createBuffer(2, audioBuffer.length, sampleRate)
      const leftChannel = stereoBuffer.getChannelData(0)
      const rightChannel = stereoBuffer.getChannelData(1)

      switch (mode) {
        case 'duplicate':
          // Simply duplicate the mono signal to both channels
          for (let i = 0; i < monoData.length; i++) {
            leftChannel[i] = monoData[i]
            rightChannel[i] = monoData[i]
          }
          break

        case 'phantom':
          // Create a wider stereo image using phase/frequency differences
          for (let i = 0; i < monoData.length; i++) {
            // Apply slight variation to create pseudo-stereo
            const variation = Math.sin(i / sampleRate * 2 * Math.PI * 5) * 0.1
            leftChannel[i] = monoData[i] * (1 + variation * 0.5)
            rightChannel[i] = monoData[i] * (1 - variation * 0.5)
          }
          break

        case 'delay':
          // Create Haas effect stereo using delay
          const delaySamples = Math.floor((delayMs / 1000) * sampleRate)

          for (let i = 0; i < monoData.length; i++) {
            leftChannel[i] = monoData[i]
            // Right channel is delayed
            if (i >= delaySamples) {
              rightChannel[i] = monoData[i - delaySamples] * 0.9
            } else {
              rightChannel[i] = 0
            }
          }
          break
      }

      const wavBlob = audioBufferToWav(stereoBuffer)
      const url = URL.createObjectURL(wavBlob)

      if (processedUrl) URL.revokeObjectURL(processedUrl)
      setProcessedUrl(url)

      await audioContext.close()
    } catch (error) {
      console.error('Failed to convert to stereo:', error)
    } finally {
      setProcessing(false)
    }
  }, [audioFile, mode, delayMs, processedUrl])

  const downloadProcessed = () => {
    if (processedUrl) {
      const link = document.createElement('a')
      link.href = processedUrl
      link.download = `stereo_${audioFile?.name?.replace(/\.[^/.]+$/, '')}.wav`
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
            id="mono-to-stereo-input"
          />
          <label
            htmlFor="mono-to-stereo-input"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition"
          >
            {t('tools.audioMonoToStereo.selectAudio')}
          </label>
        </div>

        {audioFile && (
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
            <span>{audioFile.name}</span>
            <span
              className={`px-2 py-0.5 rounded text-xs ${
                isMono
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {isMono
                ? t('tools.audioMonoToStereo.mono')
                : t('tools.audioMonoToStereo.stereo')}
            </span>
          </div>
        )}

        {audioUrl && (
          <>
            <p className="text-sm text-slate-500 mb-2">{t('tools.audioMonoToStereo.original')}</p>
            <audio src={audioUrl} controls className="w-full" />
          </>
        )}
      </div>

      {audioUrl && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.audioMonoToStereo.conversionMode')}
          </h3>

          {!isMono && (
            <p className="text-sm text-green-600 mb-4">
              {t('tools.audioMonoToStereo.alreadyStereo')}
            </p>
          )}

          <div className="space-y-3 mb-4">
            <label className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100">
              <input
                type="radio"
                name="mode"
                checked={mode === 'duplicate'}
                onChange={() => setMode('duplicate')}
                className="mt-1"
              />
              <div>
                <div className="font-medium text-sm text-slate-700">
                  {t('tools.audioMonoToStereo.modeDuplicate')}
                </div>
                <p className="text-xs text-slate-500">
                  {t('tools.audioMonoToStereo.modeDuplicateDesc')}
                </p>
              </div>
            </label>

            <label className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100">
              <input
                type="radio"
                name="mode"
                checked={mode === 'phantom'}
                onChange={() => setMode('phantom')}
                className="mt-1"
              />
              <div>
                <div className="font-medium text-sm text-slate-700">
                  {t('tools.audioMonoToStereo.modePhantom')}
                </div>
                <p className="text-xs text-slate-500">
                  {t('tools.audioMonoToStereo.modePhantomDesc')}
                </p>
              </div>
            </label>

            <label className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100">
              <input
                type="radio"
                name="mode"
                checked={mode === 'delay'}
                onChange={() => setMode('delay')}
                className="mt-1"
              />
              <div>
                <div className="font-medium text-sm text-slate-700">
                  {t('tools.audioMonoToStereo.modeDelay')}
                </div>
                <p className="text-xs text-slate-500">
                  {t('tools.audioMonoToStereo.modeDelayDesc')}
                </p>
              </div>
            </label>
          </div>

          {mode === 'delay' && (
            <div className="mb-4">
              <label className="block text-sm text-slate-600 mb-1">
                {t('tools.audioMonoToStereo.delayTime')}: {delayMs}ms
              </label>
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={delayMs}
                onChange={(e) => setDelayMs(parseInt(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-slate-400 mt-1">
                {t('tools.audioMonoToStereo.delayHint')}
              </p>
            </div>
          )}

          <Button variant="primary" onClick={convertToStereo} disabled={processing}>
            {processing
              ? t('tools.audioMonoToStereo.processing')
              : t('tools.audioMonoToStereo.convert')}
          </Button>
        </div>
      )}

      {processedUrl && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.audioMonoToStereo.result')}
          </h3>

          <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
              {t('tools.audioMonoToStereo.stereo')}
            </span>
          </div>

          <audio src={processedUrl} controls className="w-full mb-4" />

          <Button variant="primary" onClick={downloadProcessed}>
            {t('tools.audioMonoToStereo.download')}
          </Button>
        </div>
      )}
    </div>
  )
}
