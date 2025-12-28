import { useState, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

export default function AudioChannelSplitter() {
  const { t } = useTranslation()
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [channels, setChannels] = useState<{ url: string; name: string }[]>([])
  const [channelCount, setChannelCount] = useState(0)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('audio/')) {
      // Cleanup previous URLs
      if (audioUrl) URL.revokeObjectURL(audioUrl)
      channels.forEach((ch) => URL.revokeObjectURL(ch.url))

      setAudioFile(file)
      setAudioUrl(URL.createObjectURL(file))
      setChannels([])

      // Get channel count
      try {
        const audioContext = new AudioContext()
        const arrayBuffer = await file.arrayBuffer()
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
        setChannelCount(audioBuffer.numberOfChannels)
        await audioContext.close()
      } catch (error) {
        console.error('Failed to analyze audio:', error)
      }
    }
  }

  const splitChannels = useCallback(async () => {
    if (!audioFile) return

    setProcessing(true)

    try {
      const audioContext = new AudioContext()
      const arrayBuffer = await audioFile.arrayBuffer()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

      const newChannels: { url: string; name: string }[] = []

      for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
        // Create a mono buffer for this channel
        const monoBuffer = audioContext.createBuffer(
          1,
          audioBuffer.length,
          audioBuffer.sampleRate
        )

        const sourceData = audioBuffer.getChannelData(i)
        const destData = monoBuffer.getChannelData(0)

        for (let j = 0; j < audioBuffer.length; j++) {
          destData[j] = sourceData[j]
        }

        const wavBlob = audioBufferToWav(monoBuffer)
        const url = URL.createObjectURL(wavBlob)

        const channelName =
          audioBuffer.numberOfChannels === 2
            ? i === 0
              ? 'Left'
              : 'Right'
            : `Channel ${i + 1}`

        newChannels.push({ url, name: channelName })
      }

      setChannels(newChannels)
      await audioContext.close()
    } catch (error) {
      console.error('Failed to split channels:', error)
    } finally {
      setProcessing(false)
    }
  }, [audioFile])

  const downloadChannel = (channel: { url: string; name: string }) => {
    const link = document.createElement('a')
    link.href = channel.url
    const baseName = audioFile?.name?.replace(/\.[^/.]+$/, '') || 'audio'
    link.download = `${baseName}_${channel.name}.wav`
    link.click()
  }

  const downloadAll = () => {
    channels.forEach((channel, index) => {
      setTimeout(() => downloadChannel(channel), index * 100)
    })
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
    const channelData: Float32Array[] = []
    for (let i = 0; i < numChannels; i++) {
      channelData.push(buffer.getChannelData(i))
    }

    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < numChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, channelData[channel][i]))
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
            id="audio-channel-input"
          />
          <label
            htmlFor="audio-channel-input"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition"
          >
            {t('tools.audioChannelSplitter.selectAudio')}
          </label>
        </div>

        {audioFile && (
          <div className="text-sm text-slate-600 mb-4">{audioFile.name}</div>
        )}

        {audioUrl && (
          <audio src={audioUrl} controls className="w-full" />
        )}
      </div>

      {audioUrl && channelCount > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.audioChannelSplitter.info')}
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 bg-slate-50 rounded-lg text-center">
              <div className="text-2xl font-medium text-blue-600">{channelCount}</div>
              <div className="text-sm text-slate-500">
                {t('tools.audioChannelSplitter.channels')}
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg text-center">
              <div className="text-2xl font-medium text-slate-600">
                {channelCount === 1
                  ? t('tools.audioChannelSplitter.mono')
                  : channelCount === 2
                  ? t('tools.audioChannelSplitter.stereo')
                  : t('tools.audioChannelSplitter.multichannel')}
              </div>
              <div className="text-sm text-slate-500">
                {t('tools.audioChannelSplitter.type')}
              </div>
            </div>
          </div>

          {channelCount === 1 ? (
            <p className="text-sm text-slate-500">
              {t('tools.audioChannelSplitter.monoNote')}
            </p>
          ) : (
            <Button variant="primary" onClick={splitChannels} disabled={processing}>
              {processing
                ? t('tools.audioChannelSplitter.processing')
                : t('tools.audioChannelSplitter.split')}
            </Button>
          )}
        </div>
      )}

      {channels.length > 0 && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-700">
              {t('tools.audioChannelSplitter.result')}
            </h3>
            <Button variant="secondary" onClick={downloadAll}>
              {t('tools.audioChannelSplitter.downloadAll')}
            </Button>
          </div>

          <div className="space-y-4">
            {channels.map((channel, index) => (
              <div key={index} className="p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">{channel.name}</span>
                  <button
                    onClick={() => downloadChannel(channel)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    {t('tools.audioChannelSplitter.download')}
                  </button>
                </div>
                <audio src={channel.url} controls className="w-full" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
