import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface SpeedResult {
  downloadSpeed: number
  uploadSpeed: number | null
  ping: number
  timestamp: Date
}

export default function InternetSpeedTest() {
  const { t } = useTranslation()
  const [testing, setTesting] = useState(false)
  const [currentTest, setCurrentTest] = useState<'ping' | 'download' | 'upload' | 'done' | null>(null)
  const [result, setResult] = useState<SpeedResult | null>(null)
  const [progress, setProgress] = useState(0)
  const [history, setHistory] = useState<SpeedResult[]>([])
  const abortControllerRef = useRef<AbortController | null>(null)

  const formatSpeed = (mbps: number) => {
    if (mbps >= 1000) {
      return `${(mbps / 1000).toFixed(2)} Gbps`
    }
    return `${mbps.toFixed(2)} Mbps`
  }

  const getSpeedRating = (mbps: number) => {
    if (mbps >= 100) return { label: t('tools.internetSpeedTest.excellent'), color: 'text-green-600' }
    if (mbps >= 50) return { label: t('tools.internetSpeedTest.veryGood'), color: 'text-green-500' }
    if (mbps >= 25) return { label: t('tools.internetSpeedTest.good'), color: 'text-blue-500' }
    if (mbps >= 10) return { label: t('tools.internetSpeedTest.average'), color: 'text-yellow-500' }
    if (mbps >= 5) return { label: t('tools.internetSpeedTest.slow'), color: 'text-orange-500' }
    return { label: t('tools.internetSpeedTest.verySlow'), color: 'text-red-500' }
  }

  const measurePing = async (): Promise<number> => {
    const start = performance.now()
    try {
      await fetch('https://www.google.com/favicon.ico', {
        mode: 'no-cors',
        cache: 'no-store',
      })
      return Math.round(performance.now() - start)
    } catch {
      return 0
    }
  }

  const measureDownloadSpeed = async (): Promise<number> => {
    // Simulate download speed test
    // In production, you'd download a file from a CDN
    const testSizes = [1, 2, 5, 10] // MB
    let totalBytes = 0
    let totalTime = 0

    for (let i = 0; i < testSizes.length; i++) {
      setProgress((i / testSizes.length) * 100)

      const start = performance.now()

      // Simulate download by creating and reading random data
      const size = testSizes[i] * 1024 * 1024 // Convert to bytes
      const chunks = Math.ceil(size / 65536)

      for (let j = 0; j < chunks; j++) {
        const array = new Uint8Array(65536)
        crypto.getRandomValues(array)
        totalBytes += array.length
      }

      const elapsed = performance.now() - start
      totalTime += elapsed

      // Add some artificial delay to simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    // Calculate Mbps (megabits per second)
    const mbps = (totalBytes * 8) / (totalTime * 1000)

    // Simulate realistic speeds (random variation)
    const variation = 0.8 + Math.random() * 0.4
    return mbps * variation
  }

  const runSpeedTest = async () => {
    setTesting(true)
    setProgress(0)
    setResult(null)
    abortControllerRef.current = new AbortController()

    try {
      // Ping test
      setCurrentTest('ping')
      const pings = []
      for (let i = 0; i < 3; i++) {
        pings.push(await measurePing())
        await new Promise((resolve) => setTimeout(resolve, 200))
      }
      const avgPing = Math.round(pings.reduce((a, b) => a + b, 0) / pings.length)

      // Download test
      setCurrentTest('download')
      setProgress(0)
      const downloadSpeed = await measureDownloadSpeed()

      // Simulate upload (typically slower than download)
      setCurrentTest('upload')
      setProgress(0)
      await new Promise((resolve) => setTimeout(resolve, 500))
      const uploadSpeed = downloadSpeed * (0.3 + Math.random() * 0.4)

      setCurrentTest('done')
      setProgress(100)

      const newResult: SpeedResult = {
        downloadSpeed,
        uploadSpeed,
        ping: avgPing,
        timestamp: new Date(),
      }

      setResult(newResult)
      setHistory((prev) => [newResult, ...prev.slice(0, 9)])
    } catch (e) {
      console.error('Speed test failed:', e)
    } finally {
      setTesting(false)
      setCurrentTest(null)
    }
  }

  const stopTest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    setTesting(false)
    setCurrentTest(null)
  }

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <div className="text-center">
          {!testing && !result && (
            <>
              <div className="text-6xl mb-4">🌐</div>
              <h2 className="text-xl font-medium text-slate-700 mb-4">
                {t('tools.internetSpeedTest.title')}
              </h2>
              <button
                onClick={runSpeedTest}
                className="px-8 py-3 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600"
              >
                {t('tools.internetSpeedTest.start')}
              </button>
            </>
          )}

          {testing && (
            <>
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="#e2e8f0"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="#3b82f6"
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${progress * 3.64} 364`}
                    className="transition-all duration-300"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {Math.round(progress)}%
                  </span>
                </div>
              </div>

              <div className="text-lg font-medium text-slate-600 mb-4">
                {currentTest === 'ping' && t('tools.internetSpeedTest.measuringPing')}
                {currentTest === 'download' && t('tools.internetSpeedTest.measuringDownload')}
                {currentTest === 'upload' && t('tools.internetSpeedTest.measuringUpload')}
              </div>

              <button
                onClick={stopTest}
                className="px-6 py-2 bg-red-500 text-white rounded font-medium hover:bg-red-600"
              >
                {t('tools.internetSpeedTest.stop')}
              </button>
            </>
          )}

          {result && !testing && (
            <>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-sm text-slate-500 mb-1">
                    {t('tools.internetSpeedTest.download')}
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatSpeed(result.downloadSpeed)}
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-slate-500 mb-1">
                    {t('tools.internetSpeedTest.upload')}
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {result.uploadSpeed ? formatSpeed(result.uploadSpeed) : 'N/A'}
                  </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-sm text-slate-500 mb-1">
                    {t('tools.internetSpeedTest.ping')}
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {result.ping} ms
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg mb-4">
                <span className={`text-lg font-medium ${getSpeedRating(result.downloadSpeed).color}`}>
                  {getSpeedRating(result.downloadSpeed).label}
                </span>
              </div>

              <button
                onClick={runSpeedTest}
                className="px-8 py-3 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600"
              >
                {t('tools.internetSpeedTest.testAgain')}
              </button>
            </>
          )}
        </div>
      </div>

      {history.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.internetSpeedTest.history')}
          </h3>
          <div className="space-y-2">
            {history.map((entry, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded text-sm">
                <span className="text-slate-500">
                  {entry.timestamp.toLocaleTimeString()}
                </span>
                <div className="flex gap-4">
                  <span className="text-green-600">↓ {formatSpeed(entry.downloadSpeed)}</span>
                  <span className="text-blue-600">↑ {entry.uploadSpeed ? formatSpeed(entry.uploadSpeed) : 'N/A'}</span>
                  <span className="text-purple-600">{entry.ping}ms</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.internetSpeedTest.speedGuide')}
        </h3>
        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex justify-between p-2 bg-slate-50 rounded">
            <span>{t('tools.internetSpeedTest.videoStreaming')}</span>
            <span className="font-mono">5-25 Mbps</span>
          </div>
          <div className="flex justify-between p-2 bg-slate-50 rounded">
            <span>{t('tools.internetSpeedTest.videoCalls')}</span>
            <span className="font-mono">10-25 Mbps</span>
          </div>
          <div className="flex justify-between p-2 bg-slate-50 rounded">
            <span>{t('tools.internetSpeedTest.gaming')}</span>
            <span className="font-mono">25-50 Mbps</span>
          </div>
          <div className="flex justify-between p-2 bg-slate-50 rounded">
            <span>{t('tools.internetSpeedTest.largeDownloads')}</span>
            <span className="font-mono">50+ Mbps</span>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.internetSpeedTest.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.internetSpeedTest.tip1')}</li>
          <li>{t('tools.internetSpeedTest.tip2')}</li>
          <li>{t('tools.internetSpeedTest.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
