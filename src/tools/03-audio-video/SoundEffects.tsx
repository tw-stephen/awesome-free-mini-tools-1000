import { useState, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

type EffectType = 'reverb' | 'delay' | 'distortion' | 'chorus' | 'tremolo' | 'flanger'

export default function SoundEffects() {
  const { t } = useTranslation()
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [processedUrl, setProcessedUrl] = useState<string | null>(null)
  const [selectedEffect, setSelectedEffect] = useState<EffectType>('reverb')

  // Effect parameters
  const [reverbDecay, setReverbDecay] = useState(2)
  const [delayTime, setDelayTime] = useState(0.3)
  const [delayFeedback, setDelayFeedback] = useState(0.5)
  const [distortionAmount, setDistortionAmount] = useState(50)
  const [tremoloRate, setTremoloRate] = useState(5)
  const [tremoloDepth, setTremoloDepth] = useState(0.5)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('audio/')) {
      if (audioUrl) URL.revokeObjectURL(audioUrl)
      if (processedUrl) URL.revokeObjectURL(processedUrl)

      setAudioFile(file)
      setAudioUrl(URL.createObjectURL(file))
      setProcessedUrl(null)
    }
  }

  const createImpulseResponse = (
    context: OfflineAudioContext,
    duration: number,
    decay: number
  ): AudioBuffer => {
    const sampleRate = context.sampleRate
    const length = sampleRate * duration
    const impulse = context.createBuffer(2, length, sampleRate)

    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel)
      for (let i = 0; i < length; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay)
      }
    }

    return impulse
  }

  const makeDistortionCurve = (amount: number): Float32Array => {
    const samples = 44100
    const curve = new Float32Array(samples)
    const deg = Math.PI / 180

    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1
      curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x))
    }

    return curve
  }

  const applyEffect = useCallback(async () => {
    if (!audioFile) return

    setProcessing(true)

    try {
      const arrayBuffer = await audioFile.arrayBuffer()
      const tempContext = new AudioContext()
      const audioBuffer = await tempContext.decodeAudioData(arrayBuffer)
      await tempContext.close()

      const offlineContext = new OfflineAudioContext(
        audioBuffer.numberOfChannels,
        audioBuffer.length,
        audioBuffer.sampleRate
      )

      const source = offlineContext.createBufferSource()
      source.buffer = audioBuffer

      let lastNode: AudioNode = source

      switch (selectedEffect) {
        case 'reverb': {
          const convolver = offlineContext.createConvolver()
          convolver.buffer = createImpulseResponse(offlineContext, 3, reverbDecay)
          const dryGain = offlineContext.createGain()
          const wetGain = offlineContext.createGain()
          dryGain.gain.value = 0.7
          wetGain.gain.value = 0.3

          source.connect(dryGain)
          source.connect(convolver)
          convolver.connect(wetGain)
          dryGain.connect(offlineContext.destination)
          wetGain.connect(offlineContext.destination)

          source.start()
          break
        }

        case 'delay': {
          const delay = offlineContext.createDelay(1)
          delay.delayTime.value = delayTime
          const feedbackGain = offlineContext.createGain()
          feedbackGain.gain.value = delayFeedback
          const dryGain = offlineContext.createGain()
          const wetGain = offlineContext.createGain()
          dryGain.gain.value = 0.7
          wetGain.gain.value = 0.5

          source.connect(dryGain)
          source.connect(delay)
          delay.connect(feedbackGain)
          feedbackGain.connect(delay)
          delay.connect(wetGain)
          dryGain.connect(offlineContext.destination)
          wetGain.connect(offlineContext.destination)

          source.start()
          break
        }

        case 'distortion': {
          const waveshaper = offlineContext.createWaveShaper()
          waveshaper.curve = makeDistortionCurve(distortionAmount)
          waveshaper.oversample = '4x'

          source.connect(waveshaper)
          waveshaper.connect(offlineContext.destination)

          source.start()
          break
        }

        case 'tremolo': {
          const gainNode = offlineContext.createGain()
          const lfo = offlineContext.createOscillator()
          const lfoGain = offlineContext.createGain()

          lfo.frequency.value = tremoloRate
          lfo.type = 'sine'
          lfoGain.gain.value = tremoloDepth

          lfo.connect(lfoGain)
          lfoGain.connect(gainNode.gain)

          source.connect(gainNode)
          gainNode.connect(offlineContext.destination)

          lfo.start()
          source.start()
          break
        }

        case 'chorus': {
          const delay1 = offlineContext.createDelay(0.1)
          const delay2 = offlineContext.createDelay(0.1)
          const lfo1 = offlineContext.createOscillator()
          const lfo2 = offlineContext.createOscillator()
          const lfoGain1 = offlineContext.createGain()
          const lfoGain2 = offlineContext.createGain()
          const dryGain = offlineContext.createGain()
          const wetGain = offlineContext.createGain()

          delay1.delayTime.value = 0.02
          delay2.delayTime.value = 0.025
          lfo1.frequency.value = 0.5
          lfo2.frequency.value = 0.7
          lfoGain1.gain.value = 0.005
          lfoGain2.gain.value = 0.005
          dryGain.gain.value = 0.7
          wetGain.gain.value = 0.5

          lfo1.connect(lfoGain1)
          lfo2.connect(lfoGain2)
          lfoGain1.connect(delay1.delayTime)
          lfoGain2.connect(delay2.delayTime)

          source.connect(dryGain)
          source.connect(delay1)
          source.connect(delay2)
          delay1.connect(wetGain)
          delay2.connect(wetGain)
          dryGain.connect(offlineContext.destination)
          wetGain.connect(offlineContext.destination)

          lfo1.start()
          lfo2.start()
          source.start()
          break
        }

        case 'flanger': {
          const delay = offlineContext.createDelay(0.02)
          const lfo = offlineContext.createOscillator()
          const lfoGain = offlineContext.createGain()
          const feedback = offlineContext.createGain()
          const dryGain = offlineContext.createGain()
          const wetGain = offlineContext.createGain()

          delay.delayTime.value = 0.005
          lfo.frequency.value = 0.25
          lfoGain.gain.value = 0.003
          feedback.gain.value = 0.5
          dryGain.gain.value = 0.7
          wetGain.gain.value = 0.5

          lfo.connect(lfoGain)
          lfoGain.connect(delay.delayTime)

          source.connect(dryGain)
          source.connect(delay)
          delay.connect(feedback)
          feedback.connect(delay)
          delay.connect(wetGain)
          dryGain.connect(offlineContext.destination)
          wetGain.connect(offlineContext.destination)

          lfo.start()
          source.start()
          break
        }

        default:
          source.connect(offlineContext.destination)
          source.start()
      }

      const renderedBuffer = await offlineContext.startRendering()
      const wavBlob = audioBufferToWav(renderedBuffer)
      const url = URL.createObjectURL(wavBlob)

      if (processedUrl) URL.revokeObjectURL(processedUrl)
      setProcessedUrl(url)
    } catch (error) {
      console.error('Failed to apply effect:', error)
    } finally {
      setProcessing(false)
    }
  }, [
    audioFile,
    selectedEffect,
    reverbDecay,
    delayTime,
    delayFeedback,
    distortionAmount,
    tremoloRate,
    tremoloDepth,
    processedUrl,
  ])

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
            id="sound-effects-input"
          />
          <label
            htmlFor="sound-effects-input"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition"
          >
            {t('tools.soundEffects.selectAudio')}
          </label>
        </div>

        {audioFile && (
          <div className="text-sm text-slate-600 mb-4">{audioFile.name}</div>
        )}

        {audioUrl && (
          <>
            <p className="text-sm text-slate-500 mb-2">{t('tools.soundEffects.original')}</p>
            <audio src={audioUrl} controls className="w-full" />
          </>
        )}
      </div>

      {audioUrl && (
        <>
          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.soundEffects.selectEffect')}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
              {(['reverb', 'delay', 'distortion', 'chorus', 'tremolo', 'flanger'] as EffectType[]).map(
                (effect) => (
                  <button
                    key={effect}
                    onClick={() => setSelectedEffect(effect)}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      selectedEffect === effect
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {t(`tools.soundEffects.effects.${effect}`)}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.soundEffects.parameters')}
            </h3>

            {selectedEffect === 'reverb' && (
              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  {t('tools.soundEffects.reverbDecay')}: {reverbDecay}s
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.1"
                  value={reverbDecay}
                  onChange={(e) => setReverbDecay(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            )}

            {selectedEffect === 'delay' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">
                    {t('tools.soundEffects.delayTime')}: {(delayTime * 1000).toFixed(0)}ms
                  </label>
                  <input
                    type="range"
                    min="0.05"
                    max="1"
                    step="0.01"
                    value={delayTime}
                    onChange={(e) => setDelayTime(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">
                    {t('tools.soundEffects.feedback')}: {Math.round(delayFeedback * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="0.9"
                    step="0.1"
                    value={delayFeedback}
                    onChange={(e) => setDelayFeedback(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {selectedEffect === 'distortion' && (
              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  {t('tools.soundEffects.amount')}: {distortionAmount}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={distortionAmount}
                  onChange={(e) => setDistortionAmount(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            )}

            {selectedEffect === 'tremolo' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">
                    {t('tools.soundEffects.rate')}: {tremoloRate} Hz
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="0.5"
                    value={tremoloRate}
                    onChange={(e) => setTremoloRate(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">
                    {t('tools.soundEffects.depth')}: {Math.round(tremoloDepth * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={tremoloDepth}
                    onChange={(e) => setTremoloDepth(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {(selectedEffect === 'chorus' || selectedEffect === 'flanger') && (
              <p className="text-sm text-slate-500">
                {t('tools.soundEffects.noParams')}
              </p>
            )}

            <div className="mt-4">
              <Button variant="primary" onClick={applyEffect} disabled={processing}>
                {processing
                  ? t('tools.soundEffects.processing')
                  : t('tools.soundEffects.apply')}
              </Button>
            </div>
          </div>
        </>
      )}

      {processedUrl && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.soundEffects.result')}
          </h3>

          <audio src={processedUrl} controls className="w-full mb-4" />

          <Button
            variant="primary"
            onClick={() => {
              const link = document.createElement('a')
              link.href = processedUrl
              link.download = `${selectedEffect}_${audioFile?.name?.replace(/\.[^/.]+$/, '')}.wav`
              link.click()
            }}
          >
            {t('tools.soundEffects.download')}
          </Button>
        </div>
      )}
    </div>
  )
}
