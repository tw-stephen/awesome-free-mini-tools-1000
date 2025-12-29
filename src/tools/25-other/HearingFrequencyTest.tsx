import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function HearingFrequencyTest() {
  const { t } = useTranslation()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentFrequency, setCurrentFrequency] = useState(1000)
  const [volume, setVolume] = useState(0.3)
  const [testResults, setTestResults] = useState<{ freq: number; heard: boolean }[]>([])
  const [testMode, setTestMode] = useState<'manual' | 'test'>('manual')
  const [testStep, setTestStep] = useState(0)
  const [testComplete, setTestComplete] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const oscillatorRef = useRef<OscillatorNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)

  const testFrequencies = [250, 500, 1000, 2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000, 18000]

  const frequencyRanges = [
    { range: '20-250 Hz', description: 'Bass, deep sounds', color: 'bg-red-100 text-red-700' },
    { range: '250-2000 Hz', description: 'Speech fundamentals', color: 'bg-orange-100 text-orange-700' },
    { range: '2000-6000 Hz', description: 'Consonants, clarity', color: 'bg-yellow-100 text-yellow-700' },
    { range: '6000-12000 Hz', description: 'Brilliance, detail', color: 'bg-green-100 text-green-700' },
    { range: '12000-20000 Hz', description: 'Ultra-high, air', color: 'bg-blue-100 text-blue-700' },
  ]

  useEffect(() => {
    return () => {
      stopSound()
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }
    return audioContextRef.current
  }

  const playSound = (frequency: number) => {
    stopSound()

    const audioContext = initAudio()
    if (audioContext.state === 'suspended') {
      audioContext.resume()
    }

    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime)

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.start()

    oscillatorRef.current = oscillator
    gainNodeRef.current = gainNode
    setIsPlaying(true)
  }

  const stopSound = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop()
      oscillatorRef.current.disconnect()
      oscillatorRef.current = null
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect()
      gainNodeRef.current = null
    }
    setIsPlaying(false)
  }

  const toggleSound = () => {
    if (isPlaying) {
      stopSound()
    } else {
      playSound(currentFrequency)
    }
  }

  const handleFrequencyChange = (freq: number) => {
    setCurrentFrequency(freq)
    if (isPlaying) {
      playSound(freq)
    }
  }

  const startTest = () => {
    setTestMode('test')
    setTestStep(0)
    setTestResults([])
    setTestComplete(false)
    playSound(testFrequencies[0])
  }

  const recordTestResult = (heard: boolean) => {
    stopSound()
    const newResults = [...testResults, { freq: testFrequencies[testStep], heard }]
    setTestResults(newResults)

    if (testStep < testFrequencies.length - 1) {
      setTestStep(testStep + 1)
      setTimeout(() => {
        playSound(testFrequencies[testStep + 1])
      }, 500)
    } else {
      setTestComplete(true)
      setTestMode('manual')
    }
  }

  const getHighestFrequency = () => {
    const heardFreqs = testResults.filter(r => r.heard).map(r => r.freq)
    return heardFreqs.length > 0 ? Math.max(...heardFreqs) : 0
  }

  const getHearingAge = () => {
    const highest = getHighestFrequency()
    if (highest >= 17000) return 'Under 20'
    if (highest >= 15000) return '20-30'
    if (highest >= 12000) return '30-40'
    if (highest >= 10000) return '40-50'
    if (highest >= 8000) return '50-60'
    return 'Over 60'
  }

  return (
    <div className="space-y-4">
      <div className="card p-4 bg-yellow-50">
        <p className="text-sm text-yellow-700">
          {t('tools.hearingFrequencyTest.warning')}
        </p>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.hearingFrequencyTest.volume')}</h3>
        <input
          type="range"
          min="0.1"
          max="0.5"
          step="0.05"
          value={volume}
          onChange={(e) => {
            setVolume(parseFloat(e.target.value))
            if (gainNodeRef.current) {
              gainNodeRef.current.gain.setValueAtTime(parseFloat(e.target.value), audioContextRef.current?.currentTime || 0)
            }
          }}
          className="w-full"
        />
        <div className="text-center text-sm text-slate-500 mt-1">
          {Math.round(volume * 100)}%
        </div>
      </div>

      {testMode === 'manual' && !testComplete && (
        <>
          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.hearingFrequencyTest.frequency')}</h3>
            <input
              type="range"
              min="20"
              max="20000"
              step="10"
              value={currentFrequency}
              onChange={(e) => handleFrequencyChange(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-center text-2xl font-bold text-blue-600 mt-2">
              {currentFrequency} Hz
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.hearingFrequencyTest.quickSelect')}</h3>
            <div className="flex flex-wrap gap-2">
              {[100, 500, 1000, 2000, 4000, 8000, 12000, 16000].map(freq => (
                <button
                  key={freq}
                  onClick={() => handleFrequencyChange(freq)}
                  className={`px-3 py-1 rounded text-sm ${
                    currentFrequency === freq
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  {freq >= 1000 ? `${freq / 1000}k` : freq} Hz
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={toggleSound}
            className={`w-full py-4 rounded-lg text-xl font-bold transition-colors ${
              isPlaying
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isPlaying ? t('tools.hearingFrequencyTest.stop') : t('tools.hearingFrequencyTest.play')}
          </button>

          <button
            onClick={startTest}
            className="w-full py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            {t('tools.hearingFrequencyTest.startTest')}
          </button>
        </>
      )}

      {testMode === 'test' && (
        <div className="card p-6">
          <div className="text-center mb-4">
            <div className="text-sm text-slate-500 mb-2">
              {t('tools.hearingFrequencyTest.testing')} {testStep + 1} / {testFrequencies.length}
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {testFrequencies[testStep]} Hz
            </div>
          </div>

          <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-purple-500 transition-all"
              style={{ width: `${((testStep + 1) / testFrequencies.length) * 100}%` }}
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => recordTestResult(true)}
              className="flex-1 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 text-lg font-bold"
            >
              {t('tools.hearingFrequencyTest.canHear')}
            </button>
            <button
              onClick={() => recordTestResult(false)}
              className="flex-1 py-4 bg-red-500 text-white rounded-lg hover:bg-red-600 text-lg font-bold"
            >
              {t('tools.hearingFrequencyTest.cantHear')}
            </button>
          </div>
        </div>
      )}

      {testComplete && testResults.length > 0 && (
        <div className="card p-6 bg-gradient-to-r from-purple-50 to-blue-50">
          <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">{t('tools.hearingFrequencyTest.results')}</h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-4 bg-white rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">{getHighestFrequency()} Hz</div>
              <div className="text-sm text-slate-500">{t('tools.hearingFrequencyTest.highestHeard')}</div>
            </div>
            <div className="p-4 bg-white rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{getHearingAge()}</div>
              <div className="text-sm text-slate-500">{t('tools.hearingFrequencyTest.hearingAge')}</div>
            </div>
          </div>

          <div className="space-y-1">
            {testResults.map((result, i) => (
              <div
                key={i}
                className={`flex justify-between items-center p-2 rounded ${
                  result.heard ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                <span className="font-medium">{result.freq} Hz</span>
                <span className={result.heard ? 'text-green-600' : 'text-red-600'}>
                  {result.heard ? 'Heard' : 'Not heard'}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              setTestComplete(false)
              setTestResults([])
            }}
            className="w-full mt-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            {t('tools.hearingFrequencyTest.testAgain')}
          </button>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.hearingFrequencyTest.frequencyRanges')}</h3>
        <div className="space-y-2">
          {frequencyRanges.map((range, i) => (
            <div key={i} className={`p-2 rounded ${range.color}`}>
              <div className="font-medium">{range.range}</div>
              <div className="text-xs opacity-75">{range.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.hearingFrequencyTest.info')}</h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.hearingFrequencyTest.info1')}</li>
          <li>{t('tools.hearingFrequencyTest.info2')}</li>
          <li>{t('tools.hearingFrequencyTest.info3')}</li>
        </ul>
      </div>
    </div>
  )
}
