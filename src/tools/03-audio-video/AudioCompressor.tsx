import { useState, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

export default function AudioCompressor() {
  const { t } = useTranslation()
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null)

  // Compressor settings
  const [threshold, setThreshold] = useState(-24)
  const [ratio, setRatio] = useState(4)
  const [attack, setAttack] = useState(0.003)
  const [release, setRelease] = useState(0.25)
  const [knee, setKnee] = useState(30)
  const [makeupGain, setMakeupGain] = useState(0)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('audio/')) {
      if (audioUrl) URL.revokeObjectURL(audioUrl)
      if (compressedUrl) URL.revokeObjectURL(compressedUrl)

      setAudioFile(file)
      setAudioUrl(URL.createObjectURL(file))
      setCompressedUrl(null)
    }
  }

  const applyCompression = useCallback(async () => {
    if (!audioFile) return

    setProcessing(true)

    try {
      const audioContext = new OfflineAudioContext(2, 44100 * 600, 44100)
      const arrayBuffer = await audioFile.arrayBuffer()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

      // Create offline context with correct length
      const offlineContext = new OfflineAudioContext(
        audioBuffer.numberOfChannels,
        audioBuffer.length,
        audioBuffer.sampleRate
      )

      // Create buffer source
      const source = offlineContext.createBufferSource()
      source.buffer = audioBuffer

      // Create compressor
      const compressor = offlineContext.createDynamicsCompressor()
      compressor.threshold.value = threshold
      compressor.ratio.value = ratio
      compressor.attack.value = attack
      compressor.release.value = release
      compressor.knee.value = knee

      // Create gain for makeup gain
      const gainNode = offlineContext.createGain()
      gainNode.gain.value = Math.pow(10, makeupGain / 20)

      // Connect nodes
      source.connect(compressor)
      compressor.connect(gainNode)
      gainNode.connect(offlineContext.destination)

      source.start()

      const renderedBuffer = await offlineContext.startRendering()

      const wavBlob = audioBufferToWav(renderedBuffer)
      const url = URL.createObjectURL(wavBlob)

      if (compressedUrl) URL.revokeObjectURL(compressedUrl)
      setCompressedUrl(url)
    } catch (error) {
      console.error('Failed to apply compression:', error)
    } finally {
      setProcessing(false)
    }
  }, [audioFile, threshold, ratio, attack, release, knee, makeupGain, compressedUrl])

  const downloadCompressed = () => {
    if (compressedUrl) {
      const link = document.createElement('a')
      link.href = compressedUrl
      link.download = `compressed_${audioFile?.name?.replace(/\.[^/.]+$/, '')}.wav`
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
            id="audio-compressor-input"
          />
          <label
            htmlFor="audio-compressor-input"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition"
          >
            {t('tools.audioCompressor.selectAudio')}
          </label>
        </div>

        {audioFile && (
          <div className="text-sm text-slate-600 mb-4">{audioFile.name}</div>
        )}

        {audioUrl && (
          <>
            <p className="text-sm text-slate-500 mb-2">{t('tools.audioCompressor.original')}</p>
            <audio src={audioUrl} controls className="w-full" />
          </>
        )}
      </div>

      {audioUrl && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.audioCompressor.settings')}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                {t('tools.audioCompressor.threshold')}: {threshold} dB
              </label>
              <input
                type="range"
                min="-60"
                max="0"
                step="1"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">
                {t('tools.audioCompressor.ratio')}: {ratio}:1
              </label>
              <input
                type="range"
                min="1"
                max="20"
                step="0.5"
                value={ratio}
                onChange={(e) => setRatio(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  {t('tools.audioCompressor.attack')}: {(attack * 1000).toFixed(0)} ms
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.001"
                  value={attack}
                  onChange={(e) => setAttack(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  {t('tools.audioCompressor.release')}: {(release * 1000).toFixed(0)} ms
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={release}
                  onChange={(e) => setRelease(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">
                {t('tools.audioCompressor.knee')}: {knee} dB
              </label>
              <input
                type="range"
                min="0"
                max="40"
                step="1"
                value={knee}
                onChange={(e) => setKnee(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">
                {t('tools.audioCompressor.makeupGain')}: {makeupGain} dB
              </label>
              <input
                type="range"
                min="0"
                max="24"
                step="1"
                value={makeupGain}
                onChange={(e) => setMakeupGain(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <Button variant="primary" onClick={applyCompression} disabled={processing}>
              {processing
                ? t('tools.audioCompressor.processing')
                : t('tools.audioCompressor.apply')}
            </Button>
          </div>
        </div>
      )}

      {compressedUrl && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.audioCompressor.result')}
          </h3>

          <audio src={compressedUrl} controls className="w-full mb-4" />

          <Button variant="primary" onClick={downloadCompressed}>
            {t('tools.audioCompressor.download')}
          </Button>
        </div>
      )}
    </div>
  )
}
