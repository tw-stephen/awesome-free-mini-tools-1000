import { useState, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface SilentRegion {
  start: number
  end: number
}

export default function SilenceRemover() {
  const { t } = useTranslation()
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [processedUrl, setProcessedUrl] = useState<string | null>(null)
  const [silentRegions, setSilentRegions] = useState<SilentRegion[]>([])
  const [threshold, setThreshold] = useState(-40)
  const [minSilence, setMinSilence] = useState(0.5)
  const [originalDuration, setOriginalDuration] = useState(0)
  const [newDuration, setNewDuration] = useState(0)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('audio/')) {
      if (audioUrl) URL.revokeObjectURL(audioUrl)
      if (processedUrl) URL.revokeObjectURL(processedUrl)

      setAudioFile(file)
      setAudioUrl(URL.createObjectURL(file))
      setProcessedUrl(null)
      setSilentRegions([])

      try {
        const audioContext = new AudioContext()
        const arrayBuffer = await file.arrayBuffer()
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
        setOriginalDuration(audioBuffer.duration)
        await audioContext.close()
      } catch (error) {
        console.error('Failed to analyze audio:', error)
      }
    }
  }

  const detectSilence = useCallback(async () => {
    if (!audioFile) return

    setProcessing(true)

    try {
      const audioContext = new AudioContext()
      const arrayBuffer = await audioFile.arrayBuffer()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

      const channelData = audioBuffer.getChannelData(0)
      const sampleRate = audioBuffer.sampleRate
      const thresholdLinear = Math.pow(10, threshold / 20)
      const minSilenceSamples = Math.floor(minSilence * sampleRate)

      const regions: SilentRegion[] = []
      let silenceStart: number | null = null
      let silentCount = 0

      for (let i = 0; i < channelData.length; i++) {
        const amplitude = Math.abs(channelData[i])

        if (amplitude < thresholdLinear) {
          if (silenceStart === null) {
            silenceStart = i / sampleRate
          }
          silentCount++
        } else {
          if (silenceStart !== null && silentCount >= minSilenceSamples) {
            regions.push({
              start: silenceStart,
              end: i / sampleRate,
            })
          }
          silenceStart = null
          silentCount = 0
        }
      }

      // Check for trailing silence
      if (silenceStart !== null && silentCount >= minSilenceSamples) {
        regions.push({
          start: silenceStart,
          end: audioBuffer.duration,
        })
      }

      setSilentRegions(regions)
      await audioContext.close()
    } catch (error) {
      console.error('Failed to detect silence:', error)
    } finally {
      setProcessing(false)
    }
  }, [audioFile, threshold, minSilence])

  const removeSilence = useCallback(async () => {
    if (!audioFile || silentRegions.length === 0) return

    setProcessing(true)

    try {
      const audioContext = new AudioContext()
      const arrayBuffer = await audioFile.arrayBuffer()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

      // Calculate non-silent regions
      const nonSilentRegions: SilentRegion[] = []
      let lastEnd = 0

      for (const region of silentRegions) {
        if (region.start > lastEnd) {
          nonSilentRegions.push({ start: lastEnd, end: region.start })
        }
        lastEnd = region.end
      }

      if (lastEnd < audioBuffer.duration) {
        nonSilentRegions.push({ start: lastEnd, end: audioBuffer.duration })
      }

      // Calculate new length
      const newLength = nonSilentRegions.reduce((sum, r) => {
        return sum + Math.floor((r.end - r.start) * audioBuffer.sampleRate)
      }, 0)

      // Create new buffer
      const newBuffer = audioContext.createBuffer(
        audioBuffer.numberOfChannels,
        newLength,
        audioBuffer.sampleRate
      )

      for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        const sourceData = audioBuffer.getChannelData(channel)
        const destData = newBuffer.getChannelData(channel)

        let destIndex = 0
        for (const region of nonSilentRegions) {
          const startSample = Math.floor(region.start * audioBuffer.sampleRate)
          const endSample = Math.floor(region.end * audioBuffer.sampleRate)

          for (let i = startSample; i < endSample && destIndex < destData.length; i++) {
            destData[destIndex++] = sourceData[i]
          }
        }
      }

      setNewDuration(newBuffer.duration)

      const wavBlob = audioBufferToWav(newBuffer)
      const url = URL.createObjectURL(wavBlob)

      if (processedUrl) URL.revokeObjectURL(processedUrl)
      setProcessedUrl(url)

      await audioContext.close()
    } catch (error) {
      console.error('Failed to remove silence:', error)
    } finally {
      setProcessing(false)
    }
  }, [audioFile, silentRegions, processedUrl])

  const downloadProcessed = () => {
    if (processedUrl) {
      const link = document.createElement('a')
      link.href = processedUrl
      link.download = `no_silence_${audioFile?.name?.replace(/\.[^/.]+$/, '')}.wav`
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

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    const ms = Math.floor((seconds % 1) * 100)
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
  }

  const totalSilence = silentRegions.reduce((sum, r) => sum + (r.end - r.start), 0)

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
            id="silence-remover-input"
          />
          <label
            htmlFor="silence-remover-input"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition"
          >
            {t('tools.silenceRemover.selectAudio')}
          </label>
        </div>

        {audioFile && (
          <div className="text-sm text-slate-600 mb-4">{audioFile.name}</div>
        )}

        {audioUrl && (
          <audio src={audioUrl} controls className="w-full" />
        )}
      </div>

      {audioUrl && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.silenceRemover.settings')}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                {t('tools.silenceRemover.threshold')}: {threshold} dB
              </label>
              <input
                type="range"
                min="-60"
                max="-20"
                step="1"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-slate-400 mt-1">
                {t('tools.silenceRemover.thresholdHint')}
              </p>
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">
                {t('tools.silenceRemover.minDuration')}: {minSilence}s
              </label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={minSilence}
                onChange={(e) => setMinSilence(parseFloat(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-slate-400 mt-1">
                {t('tools.silenceRemover.minDurationHint')}
              </p>
            </div>

            <Button variant="secondary" onClick={detectSilence} disabled={processing}>
              {processing
                ? t('tools.silenceRemover.detecting')
                : t('tools.silenceRemover.detectSilence')}
            </Button>
          </div>
        </div>
      )}

      {silentRegions.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.silenceRemover.detected')}
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 bg-slate-50 rounded-lg text-center">
              <div className="text-2xl font-medium text-blue-600">{silentRegions.length}</div>
              <div className="text-sm text-slate-500">
                {t('tools.silenceRemover.regionsFound')}
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg text-center">
              <div className="text-2xl font-medium text-slate-600">
                {formatTime(totalSilence)}
              </div>
              <div className="text-sm text-slate-500">
                {t('tools.silenceRemover.totalSilence')}
              </div>
            </div>
          </div>

          <div className="max-h-32 overflow-y-auto mb-4">
            <div className="space-y-1">
              {silentRegions.map((region, index) => (
                <div key={index} className="text-xs text-slate-500 flex justify-between">
                  <span>
                    {t('tools.silenceRemover.region')} {index + 1}
                  </span>
                  <span>
                    {formatTime(region.start)} - {formatTime(region.end)} (
                    {(region.end - region.start).toFixed(2)}s)
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Button variant="primary" onClick={removeSilence} disabled={processing}>
            {processing
              ? t('tools.silenceRemover.removing')
              : t('tools.silenceRemover.removeSilence')}
          </Button>
        </div>
      )}

      {processedUrl && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.silenceRemover.result')}
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 bg-slate-50 rounded-lg text-center">
              <div className="text-sm text-slate-500">{t('tools.silenceRemover.before')}</div>
              <div className="text-lg font-medium text-slate-600">
                {formatTime(originalDuration)}
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg text-center">
              <div className="text-sm text-slate-500">{t('tools.silenceRemover.after')}</div>
              <div className="text-lg font-medium text-green-600">
                {formatTime(newDuration)}
              </div>
            </div>
          </div>

          <audio src={processedUrl} controls className="w-full mb-4" />

          <Button variant="primary" onClick={downloadProcessed}>
            {t('tools.silenceRemover.download')}
          </Button>
        </div>
      )}
    </div>
  )
}
