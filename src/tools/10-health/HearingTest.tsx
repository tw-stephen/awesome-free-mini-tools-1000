import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface TestResult {
  frequency: number
  leftEar: number
  rightEar: number
}

export default function HearingTest() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<'intro' | 'test' | 'results'>('intro')
  const [currentFrequency, setCurrentFrequency] = useState(0)
  const [currentEar, setCurrentEar] = useState<'left' | 'right'>('left')
  const [volume, setVolume] = useState(0.5)
  const [isPlaying, setIsPlaying] = useState(false)
  const [results, setResults] = useState<TestResult[]>([])
  const [tempResults, setTempResults] = useState<Map<string, number>>(new Map())
  const audioContextRef = useRef<AudioContext | null>(null)
  const oscillatorRef = useRef<OscillatorNode | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const pannerRef = useRef<StereoPannerNode | null>(null)

  const frequencies = [250, 500, 1000, 2000, 4000, 8000]

  const startTest = () => {
    setMode('test')
    setCurrentFrequency(0)
    setCurrentEar('left')
    setVolume(0.5)
    setResults([])
    setTempResults(new Map())
  }

  const playTone = () => {
    if (isPlaying) {
      stopTone()
      return
    }

    audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    oscillatorRef.current = audioContextRef.current.createOscillator()
    gainRef.current = audioContextRef.current.createGain()
    pannerRef.current = audioContextRef.current.createStereoPanner()

    oscillatorRef.current.frequency.value = frequencies[currentFrequency]
    oscillatorRef.current.type = 'sine'
    gainRef.current.gain.value = volume
    pannerRef.current.pan.value = currentEar === 'left' ? -1 : 1

    oscillatorRef.current.connect(gainRef.current)
    gainRef.current.connect(pannerRef.current)
    pannerRef.current.connect(audioContextRef.current.destination)

    oscillatorRef.current.start()
    setIsPlaying(true)
  }

  const stopTone = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop()
      oscillatorRef.current.disconnect()
    }
    if (gainRef.current) gainRef.current.disconnect()
    if (pannerRef.current) pannerRef.current.disconnect()
    if (audioContextRef.current) audioContextRef.current.close()
    setIsPlaying(false)
  }

  const recordResult = (heard: boolean) => {
    stopTone()
    const key = `${frequencies[currentFrequency]}-${currentEar}`
    const resultVolume = heard ? volume : 1

    setTempResults(new Map(tempResults.set(key, resultVolume)))

    if (currentEar === 'left') {
      setCurrentEar('right')
      setVolume(0.5)
    } else {
      if (currentFrequency < frequencies.length - 1) {
        setCurrentFrequency(currentFrequency + 1)
        setCurrentEar('left')
        setVolume(0.5)
      } else {
        finishTest()
      }
    }
  }

  const finishTest = () => {
    const finalResults: TestResult[] = frequencies.map(freq => ({
      frequency: freq,
      leftEar: tempResults.get(`${freq}-left`) || 1,
      rightEar: tempResults.get(`${freq}-right`) || 1,
    }))
    setResults(finalResults)
    setMode('results')
  }

  const getHearingLevel = (volume: number): string => {
    if (volume <= 0.2) return t('tools.hearingTest.excellent')
    if (volume <= 0.4) return t('tools.hearingTest.good')
    if (volume <= 0.6) return t('tools.hearingTest.fair')
    if (volume <= 0.8) return t('tools.hearingTest.mild')
    return t('tools.hearingTest.moderate')
  }

  const getHearingColor = (volume: number): string => {
    if (volume <= 0.2) return 'text-green-600 bg-green-50'
    if (volume <= 0.4) return 'text-blue-600 bg-blue-50'
    if (volume <= 0.6) return 'text-yellow-600 bg-yellow-50'
    if (volume <= 0.8) return 'text-orange-600 bg-orange-50'
    return 'text-red-600 bg-red-50'
  }

  const getOverallScore = () => {
    if (results.length === 0) return 0
    const avgLeft = results.reduce((sum, r) => sum + r.leftEar, 0) / results.length
    const avgRight = results.reduce((sum, r) => sum + r.rightEar, 0) / results.length
    return Math.round((1 - (avgLeft + avgRight) / 2) * 100)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4 bg-yellow-50 border border-yellow-200">
        <p className="text-sm text-yellow-800">
          {t('tools.hearingTest.disclaimer')}
        </p>
      </div>

      {mode === 'intro' && (
        <>
          <div className="card p-6 text-center">
            <div className="text-6xl mb-4">👂</div>
            <h2 className="text-xl font-bold">{t('tools.hearingTest.title')}</h2>
            <p className="text-sm text-slate-500 mt-2">{t('tools.hearingTest.subtitle')}</p>
          </div>

          <div className="card p-4 bg-blue-50">
            <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.hearingTest.instructions')}</h3>
            <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
              <li>{t('tools.hearingTest.instruction1')}</li>
              <li>{t('tools.hearingTest.instruction2')}</li>
              <li>{t('tools.hearingTest.instruction3')}</li>
              <li>{t('tools.hearingTest.instruction4')}</li>
            </ul>
          </div>

          <button
            onClick={startTest}
            className="w-full py-3 bg-blue-500 text-white rounded font-medium"
          >
            {t('tools.hearingTest.startTest')}
          </button>
        </>
      )}

      {mode === 'test' && (
        <div className="card p-6 text-center">
          <div className="text-sm text-slate-500 mb-2">
            {t('tools.hearingTest.frequency')} {currentFrequency + 1}/{frequencies.length}
          </div>

          <div className="text-4xl font-bold text-blue-600 mb-2">
            {frequencies[currentFrequency]} Hz
          </div>

          <div className={`inline-block px-4 py-2 rounded-full mb-4 ${
            currentEar === 'left' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
          }`}>
            {currentEar === 'left' ? t('tools.hearingTest.leftEar') : t('tools.hearingTest.rightEar')}
          </div>

          <div className="mb-4">
            <label className="block text-sm text-slate-500 mb-2">
              {t('tools.hearingTest.volume')}: {Math.round(volume * 100)}%
            </label>
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.1}
              value={volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value))
                if (isPlaying && gainRef.current) {
                  gainRef.current.gain.value = parseFloat(e.target.value)
                }
              }}
              className="w-full"
            />
          </div>

          <button
            onClick={playTone}
            className={`w-full py-3 rounded font-medium mb-4 ${
              isPlaying ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
            }`}
          >
            {isPlaying ? t('tools.hearingTest.stopTone') : t('tools.hearingTest.playTone')}
          </button>

          <p className="text-sm text-slate-600 mb-4">{t('tools.hearingTest.canYouHear')}</p>

          <div className="flex gap-2">
            <button
              onClick={() => recordResult(true)}
              className="flex-1 py-3 bg-green-500 text-white rounded font-medium"
            >
              {t('tools.hearingTest.yes')}
            </button>
            <button
              onClick={() => recordResult(false)}
              className="flex-1 py-3 bg-red-500 text-white rounded font-medium"
            >
              {t('tools.hearingTest.no')}
            </button>
          </div>
        </div>
      )}

      {mode === 'results' && (
        <>
          <div className="card p-6 text-center bg-blue-50">
            <div className="text-6xl mb-4">👂</div>
            <h2 className="text-xl font-bold mb-4">{t('tools.hearingTest.results')}</h2>
            <div className="text-4xl font-bold text-blue-600">{getOverallScore()}%</div>
            <div className="text-sm text-slate-600">{t('tools.hearingTest.overallScore')}</div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.hearingTest.detailedResults')}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">{t('tools.hearingTest.frequency')}</th>
                    <th className="text-center py-2">{t('tools.hearingTest.leftEar')}</th>
                    <th className="text-center py-2">{t('tools.hearingTest.rightEar')}</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map(result => (
                    <tr key={result.frequency} className="border-b">
                      <td className="py-2">{result.frequency} Hz</td>
                      <td className={`text-center py-2 ${getHearingColor(result.leftEar)}`}>
                        {getHearingLevel(result.leftEar)}
                      </td>
                      <td className={`text-center py-2 ${getHearingColor(result.rightEar)}`}>
                        {getHearingLevel(result.rightEar)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card p-4 bg-slate-50">
            <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.hearingTest.legend')}</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-green-500"></span>
                <span>{t('tools.hearingTest.excellent')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-blue-500"></span>
                <span>{t('tools.hearingTest.good')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-yellow-500"></span>
                <span>{t('tools.hearingTest.fair')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-orange-500"></span>
                <span>{t('tools.hearingTest.mild')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-red-500"></span>
                <span>{t('tools.hearingTest.moderate')}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setMode('intro')}
            className="w-full py-3 bg-blue-500 text-white rounded font-medium"
          >
            {t('tools.hearingTest.testAgain')}
          </button>
        </>
      )}
    </div>
  )
}
