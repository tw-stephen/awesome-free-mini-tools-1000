import { useState, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

export default function AudioReverser() {
  const { t } = useTranslation()
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [reversedUrl, setReversedUrl] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('audio/')) {
      if (audioUrl) URL.revokeObjectURL(audioUrl)
      if (reversedUrl) URL.revokeObjectURL(reversedUrl)

      setAudioFile(file)
      setAudioUrl(URL.createObjectURL(file))
      setReversedUrl(null)
    }
  }

  const reverseAudio = useCallback(async () => {
    if (!audioFile) return

    setProcessing(true)

    try {
      const audioContext = new AudioContext()
      const arrayBuffer = await audioFile.arrayBuffer()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

      const reversedBuffer = audioContext.createBuffer(
        audioBuffer.numberOfChannels,
        audioBuffer.length,
        audioBuffer.sampleRate
      )

      for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        const originalData = audioBuffer.getChannelData(channel)
        const reversedData = reversedBuffer.getChannelData(channel)

        for (let i = 0; i < audioBuffer.length; i++) {
          reversedData[i] = originalData[audioBuffer.length - 1 - i]
        }
      }

      const wavBlob = audioBufferToWav(reversedBuffer)
      const url = URL.createObjectURL(wavBlob)

      if (reversedUrl) URL.revokeObjectURL(reversedUrl)
      setReversedUrl(url)

      audioContext.close()
    } catch (error) {
      console.error('Failed to reverse audio:', error)
    } finally {
      setProcessing(false)
    }
  }, [audioFile, reversedUrl])

  const downloadReversed = () => {
    if (reversedUrl) {
      const link = document.createElement('a')
      link.href = reversedUrl
      link.download = `reversed_${audioFile?.name?.replace(/\.[^/.]+$/, '')}.wav`
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
            id="audio-reverse-input"
          />
          <label
            htmlFor="audio-reverse-input"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition"
          >
            {t('tools.audioReverser.selectAudio')}
          </label>
        </div>

        {audioFile && (
          <div className="text-sm text-slate-600 mb-4">
            {audioFile.name}
          </div>
        )}

        {audioUrl && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t('tools.audioReverser.original')}
              </label>
              <audio src={audioUrl} controls className="w-full" />
            </div>

            <Button
              variant="primary"
              onClick={reverseAudio}
              disabled={processing}
            >
              {processing ? t('tools.audioReverser.processing') : t('tools.audioReverser.reverse')}
            </Button>
          </div>
        )}
      </div>

      {reversedUrl && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.audioReverser.reversed')}
          </h3>

          <audio src={reversedUrl} controls className="w-full mb-4" />

          <Button variant="primary" onClick={downloadReversed}>
            {t('tools.audioReverser.download')}
          </Button>
        </div>
      )}
    </div>
  )
}
