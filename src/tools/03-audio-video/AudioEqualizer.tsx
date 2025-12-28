import { useState, useRef, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface Band {
  frequency: number
  gain: number
  label: string
}

const DEFAULT_BANDS: Band[] = [
  { frequency: 60, gain: 0, label: '60 Hz' },
  { frequency: 170, gain: 0, label: '170 Hz' },
  { frequency: 310, gain: 0, label: '310 Hz' },
  { frequency: 600, gain: 0, label: '600 Hz' },
  { frequency: 1000, gain: 0, label: '1 kHz' },
  { frequency: 3000, gain: 0, label: '3 kHz' },
  { frequency: 6000, gain: 0, label: '6 kHz' },
  { frequency: 12000, gain: 0, label: '12 kHz' },
  { frequency: 14000, gain: 0, label: '14 kHz' },
  { frequency: 16000, gain: 0, label: '16 kHz' },
]

const PRESETS = {
  flat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  bass: [6, 5, 4, 2, 0, 0, 0, 0, 0, 0],
  treble: [0, 0, 0, 0, 0, 2, 4, 5, 6, 6],
  vocal: [-2, -1, 0, 2, 4, 4, 3, 2, 0, -1],
  rock: [5, 4, 3, 1, -1, -1, 1, 3, 4, 5],
  pop: [-1, 1, 3, 4, 3, 0, -1, -1, 1, 2],
  classical: [0, 0, 0, 0, 0, 0, -2, -2, -2, -4],
  jazz: [3, 2, 1, 2, -1, -1, 0, 1, 2, 3],
}

export default function AudioEqualizer() {
  const { t } = useTranslation()
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [bands, setBands] = useState<Band[]>(DEFAULT_BANDS)
  const [preset, setPreset] = useState('flat')
  const [processing, setProcessing] = useState(false)
  const [exportedUrl, setExportedUrl] = useState<string | null>(null)

  const audioRef = useRef<HTMLAudioElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const filtersRef = useRef<BiquadFilterNode[]>([])
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('audio/')) {
      cleanup()

      if (audioUrl) URL.revokeObjectURL(audioUrl)
      if (exportedUrl) URL.revokeObjectURL(exportedUrl)

      setAudioFile(file)
      setAudioUrl(URL.createObjectURL(file))
      setExportedUrl(null)
      setIsPlaying(false)
    }
  }

  const setupAudioContext = useCallback(() => {
    if (!audioRef.current || audioContextRef.current) return

    const audioContext = new AudioContext()
    audioContextRef.current = audioContext

    const source = audioContext.createMediaElementSource(audioRef.current)
    sourceRef.current = source

    // Create filters for each band
    const filters: BiquadFilterNode[] = bands.map((band, index) => {
      const filter = audioContext.createBiquadFilter()

      if (index === 0) {
        filter.type = 'lowshelf'
      } else if (index === bands.length - 1) {
        filter.type = 'highshelf'
      } else {
        filter.type = 'peaking'
      }

      filter.frequency.value = band.frequency
      filter.gain.value = band.gain
      filter.Q.value = 1

      return filter
    })

    filtersRef.current = filters

    // Connect the chain
    source.connect(filters[0])
    for (let i = 0; i < filters.length - 1; i++) {
      filters[i].connect(filters[i + 1])
    }
    filters[filters.length - 1].connect(audioContext.destination)
  }, [bands])

  const updateBandGain = (index: number, gain: number) => {
    const newBands = [...bands]
    newBands[index] = { ...newBands[index], gain }
    setBands(newBands)

    if (filtersRef.current[index]) {
      filtersRef.current[index].gain.value = gain
    }
  }

  const applyPreset = (presetName: string) => {
    const presetGains = PRESETS[presetName as keyof typeof PRESETS] || PRESETS.flat
    const newBands = bands.map((band, index) => ({
      ...band,
      gain: presetGains[index],
    }))
    setBands(newBands)
    setPreset(presetName)

    filtersRef.current.forEach((filter, index) => {
      filter.gain.value = presetGains[index]
    })
  }

  const togglePlay = () => {
    if (!audioRef.current) return

    if (!audioContextRef.current) {
      setupAudioContext()
    }

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const exportWithEQ = useCallback(async () => {
    if (!audioFile) return

    setProcessing(true)

    try {
      const arrayBuffer = await audioFile.arrayBuffer()
      const audioContext = new OfflineAudioContext(2, 44100 * 600, 44100)
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

      const offlineContext = new OfflineAudioContext(
        audioBuffer.numberOfChannels,
        audioBuffer.length,
        audioBuffer.sampleRate
      )

      const source = offlineContext.createBufferSource()
      source.buffer = audioBuffer

      // Create filters
      const filters: BiquadFilterNode[] = bands.map((band, index) => {
        const filter = offlineContext.createBiquadFilter()

        if (index === 0) {
          filter.type = 'lowshelf'
        } else if (index === bands.length - 1) {
          filter.type = 'highshelf'
        } else {
          filter.type = 'peaking'
        }

        filter.frequency.value = band.frequency
        filter.gain.value = band.gain
        filter.Q.value = 1

        return filter
      })

      source.connect(filters[0])
      for (let i = 0; i < filters.length - 1; i++) {
        filters[i].connect(filters[i + 1])
      }
      filters[filters.length - 1].connect(offlineContext.destination)

      source.start()

      const renderedBuffer = await offlineContext.startRendering()
      const wavBlob = audioBufferToWav(renderedBuffer)
      const url = URL.createObjectURL(wavBlob)

      if (exportedUrl) URL.revokeObjectURL(exportedUrl)
      setExportedUrl(url)
    } catch (error) {
      console.error('Failed to export with EQ:', error)
    } finally {
      setProcessing(false)
    }
  }, [audioFile, bands, exportedUrl])

  const cleanup = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    filtersRef.current = []
    sourceRef.current = null
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

  useEffect(() => {
    return cleanup
  }, [])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileSelect}
            className="hidden"
            id="audio-eq-input"
          />
          <label
            htmlFor="audio-eq-input"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition"
          >
            {t('tools.audioEqualizer.selectAudio')}
          </label>
        </div>

        {audioFile && (
          <div className="text-sm text-slate-600 mb-4">{audioFile.name}</div>
        )}

        {audioUrl && (
          <>
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
            <Button variant="primary" onClick={togglePlay}>
              {isPlaying ? t('tools.audioEqualizer.pause') : t('tools.audioEqualizer.play')}
            </Button>
          </>
        )}
      </div>

      {audioUrl && (
        <>
          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.audioEqualizer.presets')}
            </h3>

            <div className="flex flex-wrap gap-2">
              {Object.keys(PRESETS).map((name) => (
                <button
                  key={name}
                  onClick={() => applyPreset(name)}
                  className={`px-3 py-1 text-sm rounded-lg ${
                    preset === name
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t(`tools.audioEqualizer.preset.${name}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.audioEqualizer.equalizer')}
            </h3>

            <div className="flex justify-between items-end gap-2" style={{ height: 200 }}>
              {bands.map((band, index) => (
                <div key={band.frequency} className="flex flex-col items-center flex-1">
                  <div className="text-xs text-slate-500 mb-1">
                    {band.gain > 0 ? '+' : ''}
                    {band.gain}
                  </div>
                  <input
                    type="range"
                    min="-12"
                    max="12"
                    step="1"
                    value={band.gain}
                    onChange={(e) => updateBandGain(index, parseFloat(e.target.value))}
                    className="h-32"
                    style={{
                      writingMode: 'vertical-lr',
                      direction: 'rtl',
                    }}
                  />
                  <div className="text-xs text-slate-500 mt-2">{band.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <Button variant="primary" onClick={exportWithEQ} disabled={processing}>
              {processing
                ? t('tools.audioEqualizer.processing')
                : t('tools.audioEqualizer.export')}
            </Button>
          </div>

          {exportedUrl && (
            <div className="card p-4">
              <h3 className="text-sm font-medium text-slate-700 mb-3">
                {t('tools.audioEqualizer.result')}
              </h3>

              <audio src={exportedUrl} controls className="w-full mb-4" />

              <Button
                variant="primary"
                onClick={() => {
                  const link = document.createElement('a')
                  link.href = exportedUrl
                  link.download = `eq_${audioFile?.name?.replace(/\.[^/.]+$/, '')}.wav`
                  link.click()
                }}
              >
                {t('tools.audioEqualizer.download')}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
