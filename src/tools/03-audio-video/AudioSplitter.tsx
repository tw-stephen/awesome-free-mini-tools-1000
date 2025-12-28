import { useState, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface SplitPoint {
  id: string
  time: number
}

export default function AudioSplitter() {
  const { t } = useTranslation()
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [splitPoints, setSplitPoints] = useState<SplitPoint[]>([])
  const [splitMode, setSplitMode] = useState<'manual' | 'equal'>('manual')
  const [numParts, setNumParts] = useState(2)
  const [processing, setProcessing] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file)
      setSplitPoints([])

      try {
        const audioContext = new AudioContext()
        audioContextRef.current = audioContext
        const arrayBuffer = await file.arrayBuffer()
        const buffer = await audioContext.decodeAudioData(arrayBuffer)
        setAudioBuffer(buffer)
        setDuration(buffer.duration)
      } catch (error) {
        console.error('Failed to decode audio:', error)
      }
    }
  }

  const addSplitPoint = () => {
    if (currentTime > 0 && currentTime < duration) {
      const exists = splitPoints.some((p) => Math.abs(p.time - currentTime) < 0.1)
      if (!exists) {
        setSplitPoints((prev) =>
          [...prev, { id: Date.now().toString(), time: currentTime }].sort(
            (a, b) => a.time - b.time
          )
        )
      }
    }
  }

  const removeSplitPoint = (id: string) => {
    setSplitPoints((prev) => prev.filter((p) => p.id !== id))
  }

  const generateEqualSplits = () => {
    if (duration <= 0 || numParts < 2) return

    const partDuration = duration / numParts
    const newPoints: SplitPoint[] = []

    for (let i = 1; i < numParts; i++) {
      newPoints.push({
        id: Date.now().toString() + i,
        time: partDuration * i,
      })
    }

    setSplitPoints(newPoints)
  }

  const splitAudio = useCallback(async () => {
    if (!audioBuffer || splitPoints.length === 0) return

    setProcessing(true)

    try {
      const allPoints = [0, ...splitPoints.map((p) => p.time), duration]

      for (let i = 0; i < allPoints.length - 1; i++) {
        const startTime = allPoints[i]
        const endTime = allPoints[i + 1]
        const startSample = Math.floor(startTime * audioBuffer.sampleRate)
        const endSample = Math.floor(endTime * audioBuffer.sampleRate)
        const length = endSample - startSample

        const partBuffer = new AudioContext().createBuffer(
          audioBuffer.numberOfChannels,
          length,
          audioBuffer.sampleRate
        )

        for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
          const sourceData = audioBuffer.getChannelData(channel)
          const destData = partBuffer.getChannelData(channel)
          for (let j = 0; j < length; j++) {
            destData[j] = sourceData[startSample + j]
          }
        }

        const wavBlob = audioBufferToWav(partBuffer)
        const url = URL.createObjectURL(wavBlob)
        const link = document.createElement('a')
        link.href = url
        const baseName = audioFile?.name?.replace(/\.[^/.]+$/, '') || 'audio'
        link.download = `${baseName}_part${i + 1}.wav`
        link.click()
        URL.revokeObjectURL(url)

        // Small delay between downloads
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    } catch (error) {
      console.error('Failed to split audio:', error)
    } finally {
      setProcessing(false)
    }
  }, [audioBuffer, audioFile, splitPoints, duration])

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

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileSelect}
            className="hidden"
            id="audio-splitter-input"
          />
          <label
            htmlFor="audio-splitter-input"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition"
          >
            {t('tools.audioSplitter.selectAudio')}
          </label>
        </div>

        {audioFile && (
          <>
            <div className="text-sm text-slate-600 mb-4">{audioFile.name}</div>

            <audio
              ref={audioRef}
              src={URL.createObjectURL(audioFile)}
              controls
              onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
              className="w-full mb-4"
            />

            <div className="relative h-8 bg-slate-200 rounded-lg overflow-hidden mb-4">
              {splitPoints.map((point) => (
                <div
                  key={point.id}
                  className="absolute top-0 w-0.5 h-full bg-red-500 cursor-pointer"
                  style={{ left: `${(point.time / duration) * 100}%` }}
                  onClick={() => removeSplitPoint(point.id)}
                  title={formatTime(point.time)}
                />
              ))}
              <div
                className="absolute top-0 w-1 h-full bg-blue-500"
                style={{ left: `${(currentTime / duration) * 100}%` }}
              />
            </div>
          </>
        )}
      </div>

      {audioFile && duration > 0 && (
        <>
          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.audioSplitter.splitMode')}
            </h3>

            <div className="flex gap-4 mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="splitMode"
                  checked={splitMode === 'manual'}
                  onChange={() => setSplitMode('manual')}
                />
                <span>{t('tools.audioSplitter.manual')}</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="splitMode"
                  checked={splitMode === 'equal'}
                  onChange={() => setSplitMode('equal')}
                />
                <span>{t('tools.audioSplitter.equalParts')}</span>
              </label>
            </div>

            {splitMode === 'manual' ? (
              <div className="flex gap-2">
                <Button variant="primary" onClick={addSplitPoint}>
                  {t('tools.audioSplitter.addSplitAtCurrent')} ({formatTime(currentTime)})
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <label className="text-sm text-slate-600">
                  {t('tools.audioSplitter.numberOfParts')}:
                </label>
                <input
                  type="number"
                  min="2"
                  max="20"
                  value={numParts}
                  onChange={(e) => setNumParts(parseInt(e.target.value) || 2)}
                  className="w-20 px-2 py-1 border border-slate-300 rounded"
                />
                <Button variant="primary" onClick={generateEqualSplits}>
                  {t('tools.audioSplitter.generate')}
                </Button>
              </div>
            )}
          </div>

          {splitPoints.length > 0 && (
            <div className="card p-4">
              <h3 className="text-sm font-medium text-slate-700 mb-3">
                {t('tools.audioSplitter.splitPoints')} ({splitPoints.length})
              </h3>

              <div className="space-y-2 mb-4">
                {splitPoints.map((point, index) => (
                  <div
                    key={point.id}
                    className="flex items-center justify-between p-2 bg-slate-50 rounded"
                  >
                    <span className="text-sm text-slate-600">
                      {t('tools.audioSplitter.point')} {index + 1}: {formatTime(point.time)}
                    </span>
                    <button
                      onClick={() => removeSplitPoint(point.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      {t('tools.audioSplitter.remove')}
                    </button>
                  </div>
                ))}
              </div>

              <div className="text-sm text-slate-500 mb-4">
                {t('tools.audioSplitter.willCreate')} {splitPoints.length + 1} {t('tools.audioSplitter.files')}
              </div>

              <Button variant="primary" onClick={splitAudio} disabled={processing}>
                {processing ? t('tools.audioSplitter.processing') : t('tools.audioSplitter.splitAndDownload')}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
