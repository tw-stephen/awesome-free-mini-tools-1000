import { useState, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface AudioItem {
  id: string
  file: File
  url: string
  duration: number
}

export default function AudioMerger() {
  const { t } = useTranslation()
  const [audioFiles, setAudioFiles] = useState<AudioItem[]>([])
  const [processing, setProcessing] = useState(false)
  const [mergedUrl, setMergedUrl] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const audioFiles = files.filter((f) => f.type.startsWith('audio/'))

    const newItems: AudioItem[] = await Promise.all(
      audioFiles.map(async (file) => {
        const url = URL.createObjectURL(file)
        const duration = await getAudioDuration(url)
        return {
          id: Math.random().toString(36).slice(2),
          file,
          url,
          duration,
        }
      })
    )

    setAudioFiles((prev) => [...prev, ...newItems])

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getAudioDuration = (url: string): Promise<number> => {
    return new Promise((resolve) => {
      const audio = new Audio(url)
      audio.onloadedmetadata = () => {
        resolve(audio.duration)
      }
      audio.onerror = () => resolve(0)
    })
  }

  const removeAudio = (id: string) => {
    setAudioFiles((prev) => {
      const item = prev.find((a) => a.id === id)
      if (item) URL.revokeObjectURL(item.url)
      return prev.filter((a) => a.id !== id)
    })
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    setAudioFiles((prev) => {
      const newList = [...prev]
      ;[newList[index - 1], newList[index]] = [newList[index], newList[index - 1]]
      return newList
    })
  }

  const moveDown = (index: number) => {
    if (index === audioFiles.length - 1) return
    setAudioFiles((prev) => {
      const newList = [...prev]
      ;[newList[index], newList[index + 1]] = [newList[index + 1], newList[index]]
      return newList
    })
  }

  const mergeAudio = useCallback(async () => {
    if (audioFiles.length < 2) return

    setProcessing(true)

    try {
      const audioContext = new AudioContext()
      const audioBuffers: AudioBuffer[] = []

      // Decode all audio files
      for (const item of audioFiles) {
        const response = await fetch(item.url)
        const arrayBuffer = await response.arrayBuffer()
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
        audioBuffers.push(audioBuffer)
      }

      // Calculate total length
      const sampleRate = audioBuffers[0].sampleRate
      const numChannels = Math.max(...audioBuffers.map((b) => b.numberOfChannels))
      const totalLength = audioBuffers.reduce((sum, b) => sum + b.length, 0)

      // Create merged buffer
      const mergedBuffer = audioContext.createBuffer(numChannels, totalLength, sampleRate)

      let offset = 0
      for (const buffer of audioBuffers) {
        for (let channel = 0; channel < numChannels; channel++) {
          const mergedData = mergedBuffer.getChannelData(channel)
          const sourceChannel = Math.min(channel, buffer.numberOfChannels - 1)
          const sourceData = buffer.getChannelData(sourceChannel)

          for (let i = 0; i < buffer.length; i++) {
            mergedData[offset + i] = sourceData[i]
          }
        }
        offset += buffer.length
      }

      // Convert to WAV
      const wavBlob = audioBufferToWav(mergedBuffer)
      const url = URL.createObjectURL(wavBlob)

      if (mergedUrl) URL.revokeObjectURL(mergedUrl)
      setMergedUrl(url)

      audioContext.close()
    } catch (error) {
      console.error('Failed to merge audio:', error)
    } finally {
      setProcessing(false)
    }
  }, [audioFiles, mergedUrl])

  const downloadMerged = () => {
    if (mergedUrl) {
      const link = document.createElement('a')
      link.href = mergedUrl
      link.download = 'merged_audio.wav'
      link.click()
    }
  }

  const clearAll = () => {
    audioFiles.forEach((item) => URL.revokeObjectURL(item.url))
    if (mergedUrl) URL.revokeObjectURL(mergedUrl)
    setAudioFiles([])
    setMergedUrl(null)
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
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const totalDuration = audioFiles.reduce((sum, a) => sum + a.duration, 0)

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="audio-merge-input"
          />
          <label
            htmlFor="audio-merge-input"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition"
          >
            {t('tools.audioMerger.addFiles')}
          </label>
          {audioFiles.length >= 2 && (
            <Button
              variant="primary"
              onClick={mergeAudio}
              disabled={processing}
            >
              {processing ? t('tools.audioMerger.merging') : t('tools.audioMerger.merge')}
            </Button>
          )}
          {audioFiles.length > 0 && (
            <Button variant="secondary" onClick={clearAll}>
              {t('common.clear')}
            </Button>
          )}
        </div>

        <div className="text-sm text-slate-600">
          {audioFiles.length} {t('tools.audioMerger.files')} • {t('tools.audioMerger.total')}: {formatTime(totalDuration)}
        </div>
      </div>

      {audioFiles.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.audioMerger.audioList')}
          </h3>

          <div className="space-y-2">
            {audioFiles.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
              >
                <span className="text-sm font-mono text-slate-400 w-6">{index + 1}</span>

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{item.file.name}</div>
                  <div className="text-xs text-slate-500">
                    {formatTime(item.duration)} • {(item.file.size / 1024).toFixed(1)} KB
                  </div>
                </div>

                <audio src={item.url} controls className="h-8 w-32" />

                <div className="flex gap-1">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === audioFiles.length - 1}
                    className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => removeAudio(item.id)}
                    className="p-1 text-slate-400 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {mergedUrl && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.audioMerger.mergedAudio')}
          </h3>

          <audio src={mergedUrl} controls className="w-full mb-4" />

          <Button variant="primary" onClick={downloadMerged}>
            {t('tools.audioMerger.download')}
          </Button>
        </div>
      )}
    </div>
  )
}
