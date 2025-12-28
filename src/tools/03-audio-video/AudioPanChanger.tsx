import { useState, useRef, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

export default function AudioPanChanger() {
  const { t } = useTranslation()
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [pan, setPan] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [processedUrl, setProcessedUrl] = useState<string | null>(null)

  const audioRef = useRef<HTMLAudioElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const pannerRef = useRef<StereoPannerNode | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('audio/')) {
      cleanup()

      if (audioUrl) URL.revokeObjectURL(audioUrl)
      if (processedUrl) URL.revokeObjectURL(processedUrl)

      setAudioFile(file)
      setAudioUrl(URL.createObjectURL(file))
      setProcessedUrl(null)
      setIsPlaying(false)
      setPan(0)
    }
  }

  const setupAudioContext = useCallback(() => {
    if (!audioRef.current || audioContextRef.current) return

    const audioContext = new AudioContext()
    audioContextRef.current = audioContext

    const panner = audioContext.createStereoPanner()
    panner.pan.value = pan
    pannerRef.current = panner

    const source = audioContext.createMediaElementSource(audioRef.current)
    sourceRef.current = source

    source.connect(panner)
    panner.connect(audioContext.destination)
  }, [pan])

  const updatePan = (value: number) => {
    setPan(value)
    if (pannerRef.current) {
      pannerRef.current.pan.value = value
    }
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

  const exportWithPan = useCallback(async () => {
    if (!audioFile) return

    setProcessing(true)

    try {
      const arrayBuffer = await audioFile.arrayBuffer()
      const audioContext = new AudioContext()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

      // Create stereo output buffer
      const outputBuffer = audioContext.createBuffer(
        2,
        audioBuffer.length,
        audioBuffer.sampleRate
      )

      // Get source channels
      let leftSource: Float32Array
      let rightSource: Float32Array

      if (audioBuffer.numberOfChannels === 1) {
        leftSource = audioBuffer.getChannelData(0)
        rightSource = audioBuffer.getChannelData(0)
      } else {
        leftSource = audioBuffer.getChannelData(0)
        rightSource = audioBuffer.getChannelData(1)
      }

      const outputLeft = outputBuffer.getChannelData(0)
      const outputRight = outputBuffer.getChannelData(1)

      // Apply equal-power panning
      const panAngle = (pan * Math.PI) / 4
      const leftGain = Math.cos(panAngle + Math.PI / 4)
      const rightGain = Math.sin(panAngle + Math.PI / 4)

      for (let i = 0; i < audioBuffer.length; i++) {
        // Mix to mono first for pan
        const mono = (leftSource[i] + rightSource[i]) / 2
        outputLeft[i] = Math.max(-1, Math.min(1, mono * leftGain))
        outputRight[i] = Math.max(-1, Math.min(1, mono * rightGain))
      }

      const wavBlob = audioBufferToWav(outputBuffer)
      const url = URL.createObjectURL(wavBlob)

      if (processedUrl) URL.revokeObjectURL(processedUrl)
      setProcessedUrl(url)

      await audioContext.close()
    } catch (error) {
      console.error('Failed to export with pan:', error)
    } finally {
      setProcessing(false)
    }
  }, [audioFile, pan, processedUrl])

  const cleanup = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    pannerRef.current = null
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

  const getPanLabel = (value: number): string => {
    if (value === 0) return t('tools.audioPanChanger.center')
    if (value < 0) return `${Math.abs(Math.round(value * 100))}% ${t('tools.audioPanChanger.left')}`
    return `${Math.round(value * 100)}% ${t('tools.audioPanChanger.right')}`
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
            id="audio-pan-input"
          />
          <label
            htmlFor="audio-pan-input"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition"
          >
            {t('tools.audioPanChanger.selectAudio')}
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
              {isPlaying ? t('tools.audioPanChanger.pause') : t('tools.audioPanChanger.play')}
            </Button>
          </>
        )}
      </div>

      {audioUrl && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.audioPanChanger.panPosition')}
          </h3>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500">
                {t('tools.audioPanChanger.left')}
              </span>
              <span className="text-lg font-medium text-blue-600">
                {getPanLabel(pan)}
              </span>
              <span className="text-sm text-slate-500">
                {t('tools.audioPanChanger.right')}
              </span>
            </div>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.01"
              value={pan}
              onChange={(e) => updatePan(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Visual representation */}
          <div className="p-4 bg-slate-50 rounded-lg mb-4">
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="text-xs text-slate-500 mb-1">L</div>
                <div
                  className="w-6 bg-blue-500 rounded transition-all"
                  style={{
                    height: 30 + Math.max(0, -pan * 30),
                    opacity: 0.5 + Math.max(0, -pan * 0.5),
                  }}
                />
              </div>
              <div className="relative w-40 h-8 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="absolute top-1 bottom-1 w-3 bg-blue-500 rounded-full transition-all"
                  style={{
                    left: `calc(50% + ${pan * 50}% - 6px)`,
                  }}
                />
              </div>
              <div className="text-center">
                <div className="text-xs text-slate-500 mb-1">R</div>
                <div
                  className="w-6 bg-blue-500 rounded transition-all"
                  style={{
                    height: 30 + Math.max(0, pan * 30),
                    opacity: 0.5 + Math.max(0, pan * 0.5),
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => updatePan(-1)}
              className={`px-3 py-1 text-sm rounded ${
                pan === -1 ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {t('tools.audioPanChanger.fullLeft')}
            </button>
            <button
              onClick={() => updatePan(-0.5)}
              className={`px-3 py-1 text-sm rounded ${
                pan === -0.5 ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              50% {t('tools.audioPanChanger.left')}
            </button>
            <button
              onClick={() => updatePan(0)}
              className={`px-3 py-1 text-sm rounded ${
                pan === 0 ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {t('tools.audioPanChanger.center')}
            </button>
            <button
              onClick={() => updatePan(0.5)}
              className={`px-3 py-1 text-sm rounded ${
                pan === 0.5 ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              50% {t('tools.audioPanChanger.right')}
            </button>
            <button
              onClick={() => updatePan(1)}
              className={`px-3 py-1 text-sm rounded ${
                pan === 1 ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {t('tools.audioPanChanger.fullRight')}
            </button>
          </div>

          <Button variant="primary" onClick={exportWithPan} disabled={processing}>
            {processing
              ? t('tools.audioPanChanger.processing')
              : t('tools.audioPanChanger.export')}
          </Button>
        </div>
      )}

      {processedUrl && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.audioPanChanger.result')}
          </h3>

          <audio src={processedUrl} controls className="w-full mb-4" />

          <Button
            variant="primary"
            onClick={() => {
              const link = document.createElement('a')
              link.href = processedUrl
              link.download = `panned_${audioFile?.name?.replace(/\.[^/.]+$/, '')}.wav`
              link.click()
            }}
          >
            {t('tools.audioPanChanger.download')}
          </Button>
        </div>
      )}
    </div>
  )
}
