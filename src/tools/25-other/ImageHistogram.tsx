import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface HistogramData {
  red: number[]
  green: number[]
  blue: number[]
  luminance: number[]
}

interface ImageStats {
  avgRed: number
  avgGreen: number
  avgBlue: number
  avgLuminance: number
  totalPixels: number
}

export default function ImageHistogram() {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [histogram, setHistogram] = useState<HistogramData | null>(null)
  const [stats, setStats] = useState<ImageStats | null>(null)
  const [showChannel, setShowChannel] = useState<'all' | 'red' | 'green' | 'blue' | 'luminance'>('all')

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const img = new Image()
    img.onload = () => {
      setImage(img)
      analyzeImage(img)
    }
    img.src = URL.createObjectURL(file)
  }

  const analyzeImage = (img: HTMLImageElement) => {
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(img, 0, 0)
    const imageData = ctx.getImageData(0, 0, img.width, img.height)
    const data = imageData.data

    const red: number[] = new Array(256).fill(0)
    const green: number[] = new Array(256).fill(0)
    const blue: number[] = new Array(256).fill(0)
    const luminance: number[] = new Array(256).fill(0)

    let sumRed = 0, sumGreen = 0, sumBlue = 0, sumLuminance = 0
    const totalPixels = img.width * img.height

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const lum = Math.round(0.299 * r + 0.587 * g + 0.114 * b)

      red[r]++
      green[g]++
      blue[b]++
      luminance[lum]++

      sumRed += r
      sumGreen += g
      sumBlue += b
      sumLuminance += lum
    }

    setHistogram({ red, green, blue, luminance })
    setStats({
      avgRed: Math.round(sumRed / totalPixels),
      avgGreen: Math.round(sumGreen / totalPixels),
      avgBlue: Math.round(sumBlue / totalPixels),
      avgLuminance: Math.round(sumLuminance / totalPixels),
      totalPixels
    })
  }

  useEffect(() => {
    if (!histogram || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    ctx.fillStyle = '#1e293b'
    ctx.fillRect(0, 0, width, height)

    const drawHistogram = (data: number[], color: string, alpha: number = 1) => {
      const max = Math.max(...data)
      if (max === 0) return

      ctx.globalAlpha = alpha
      ctx.fillStyle = color

      const barWidth = width / 256
      for (let i = 0; i < 256; i++) {
        const barHeight = (data[i] / max) * (height - 20)
        ctx.fillRect(i * barWidth, height - barHeight - 10, barWidth, barHeight)
      }
      ctx.globalAlpha = 1
    }

    if (showChannel === 'all') {
      drawHistogram(histogram.red, '#ef4444', 0.5)
      drawHistogram(histogram.green, '#22c55e', 0.5)
      drawHistogram(histogram.blue, '#3b82f6', 0.5)
    } else if (showChannel === 'red') {
      drawHistogram(histogram.red, '#ef4444')
    } else if (showChannel === 'green') {
      drawHistogram(histogram.green, '#22c55e')
    } else if (showChannel === 'blue') {
      drawHistogram(histogram.blue, '#3b82f6')
    } else if (showChannel === 'luminance') {
      drawHistogram(histogram.luminance, '#94a3b8')
    }

    // Draw scale
    ctx.fillStyle = '#64748b'
    ctx.font = '10px sans-serif'
    ctx.textAlign = 'center'
    for (let i = 0; i <= 255; i += 64) {
      ctx.fillText(i.toString(), (i / 255) * width, height - 2)
    }
  }, [histogram, showChannel])

  const channels = [
    { id: 'all', label: t('tools.imageHistogram.all'), color: 'bg-gradient-to-r from-red-500 via-green-500 to-blue-500' },
    { id: 'red', label: t('tools.imageHistogram.red'), color: 'bg-red-500' },
    { id: 'green', label: t('tools.imageHistogram.green'), color: 'bg-green-500' },
    { id: 'blue', label: t('tools.imageHistogram.blue'), color: 'bg-blue-500' },
    { id: 'luminance', label: t('tools.imageHistogram.luminance'), color: 'bg-slate-400' }
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <Button onClick={() => fileInputRef.current?.click()}>
          {image ? t('tools.imageHistogram.changeImage') : t('tools.imageHistogram.selectImage')}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-4">
          {image && (
            <div className="flex justify-center p-4 bg-slate-100 rounded-lg">
              <img
                src={image.src}
                alt="Preview"
                className="max-w-full max-h-[200px] shadow-lg rounded object-contain"
              />
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            {channels.map(channel => (
              <button
                key={channel.id}
                onClick={() => setShowChannel(channel.id as typeof showChannel)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  showChannel === channel.id
                    ? 'ring-2 ring-offset-2 ring-blue-500'
                    : ''
                }`}
              >
                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${channel.color}`} />
                {channel.label}
              </button>
            ))}
          </div>

          <div className="bg-slate-800 rounded-lg p-4">
            {histogram ? (
              <canvas
                ref={canvasRef}
                width={512}
                height={200}
                className="w-full"
              />
            ) : (
              <div className="flex items-center justify-center h-[200px] text-slate-400">
                {t('tools.imageHistogram.placeholder')}
              </div>
            )}
          </div>
        </div>

        <div className="w-64 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-700">{t('tools.imageHistogram.statistics')}</h3>

          {stats ? (
            <div className="space-y-3">
              <div className="p-3 bg-red-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-red-600">{t('tools.imageHistogram.avgRed')}</span>
                  <span className="font-mono font-bold text-red-600">{stats.avgRed}</span>
                </div>
                <div className="mt-1 h-2 bg-red-200 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500" style={{ width: `${(stats.avgRed / 255) * 100}%` }} />
                </div>
              </div>

              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-600">{t('tools.imageHistogram.avgGreen')}</span>
                  <span className="font-mono font-bold text-green-600">{stats.avgGreen}</span>
                </div>
                <div className="mt-1 h-2 bg-green-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: `${(stats.avgGreen / 255) * 100}%` }} />
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-600">{t('tools.imageHistogram.avgBlue')}</span>
                  <span className="font-mono font-bold text-blue-600">{stats.avgBlue}</span>
                </div>
                <div className="mt-1 h-2 bg-blue-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${(stats.avgBlue / 255) * 100}%` }} />
                </div>
              </div>

              <div className="p-3 bg-slate-100 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">{t('tools.imageHistogram.avgLuminance')}</span>
                  <span className="font-mono font-bold text-slate-600">{stats.avgLuminance}</span>
                </div>
                <div className="mt-1 h-2 bg-slate-300 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-500" style={{ width: `${(stats.avgLuminance / 255) * 100}%` }} />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <div className="text-xs text-slate-500">{t('tools.imageHistogram.totalPixels')}</div>
                <div className="font-mono text-lg text-slate-700">{stats.totalPixels.toLocaleString()}</div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-400 text-center py-8">
              {t('tools.imageHistogram.selectHint')}
            </div>
          )}

          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-xs font-medium text-slate-500 mb-2">{t('tools.imageHistogram.tips')}</h4>
            <ul className="text-xs text-slate-500 space-y-1">
              <li>• {t('tools.imageHistogram.tip1')}</li>
              <li>• {t('tools.imageHistogram.tip2')}</li>
              <li>• {t('tools.imageHistogram.tip3')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
