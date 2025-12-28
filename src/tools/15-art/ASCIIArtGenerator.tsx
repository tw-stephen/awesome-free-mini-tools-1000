import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'

export default function ASCIIArtGenerator() {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [asciiArt, setAsciiArt] = useState('')
  const [width, setWidth] = useState(80)
  const [charset, setCharset] = useState<'standard' | 'blocks' | 'detailed'>('standard')
  const [inverted, setInverted] = useState(false)

  const charsets = {
    standard: ' .:-=+*#%@',
    blocks: ' ░▒▓█',
    detailed: ' .\'`^",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$',
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const img = new Image()
    img.onload = () => {
      generateASCII(img)
    }
    img.src = URL.createObjectURL(file)
  }

  const generateASCII = (img: HTMLImageElement) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Calculate height based on aspect ratio (chars are taller than wide)
    const aspectRatio = img.height / img.width
    const height = Math.floor(width * aspectRatio * 0.5)

    canvas.width = width
    canvas.height = height

    ctx.drawImage(img, 0, 0, width, height)

    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data

    const chars = inverted ? charsets[charset].split('').reverse().join('') : charsets[charset]
    let result = ''

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]

        // Convert to grayscale
        const gray = 0.299 * r + 0.587 * g + 0.114 * b
        const charIndex = Math.floor((gray / 255) * (chars.length - 1))
        result += chars[charIndex]
      }
      result += '\n'
    }

    setAsciiArt(result)
  }

  const copyArt = () => {
    navigator.clipboard.writeText(asciiArt)
  }

  const downloadArt = () => {
    const blob = new Blob([asciiArt], { type: 'text/plain' })
    const link = document.createElement('a')
    link.download = 'ascii-art.txt'
    link.href = URL.createObjectURL(blob)
    link.click()
  }

  const presets = [
    { text: '  ___  \n / _ \\ \n| | | |\n| |_| |\n \\___/ ', name: 'O' },
    { text: ' _   _ \n| | | |\n| |_| |\n|  _  |\n|_| |_|', name: 'H' },
    { text: ' _____\n|_   _|\n  | |  \n  | |  \n |___| ', name: 'I' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block w-full py-12 border-2 border-dashed border-slate-300 rounded-lg text-center cursor-pointer hover:border-blue-500">
          <div className="text-4xl mb-2">🖼️</div>
          <div className="text-slate-600">{t('tools.asciiArtGenerator.upload')}</div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.asciiArtGenerator.settings')}</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-500 block mb-1">
              {t('tools.asciiArtGenerator.width')}: {width} chars
            </label>
            <input
              type="range"
              min="40"
              max="120"
              value={width}
              onChange={(e) => setWidth(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm text-slate-500 block mb-2">{t('tools.asciiArtGenerator.charset')}</label>
            <div className="flex gap-2">
              {(Object.keys(charsets) as Array<keyof typeof charsets>).map((key) => (
                <button
                  key={key}
                  onClick={() => setCharset(key)}
                  className={`flex-1 py-2 rounded capitalize ${
                    charset === key ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={inverted}
              onChange={(e) => setInverted(e.target.checked)}
              className="w-4 h-4"
            />
            <span>{t('tools.asciiArtGenerator.invert')}</span>
          </label>
        </div>
      </div>

      {asciiArt && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">{t('tools.asciiArtGenerator.result')}</h3>
            <div className="flex gap-2">
              <button
                onClick={copyArt}
                className="px-3 py-1 bg-slate-100 rounded text-sm hover:bg-slate-200"
              >
                {t('tools.asciiArtGenerator.copy')}
              </button>
              <button
                onClick={downloadArt}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              >
                {t('tools.asciiArtGenerator.download')}
              </button>
            </div>
          </div>
          <div className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre className="font-mono text-xs leading-none whitespace-pre">{asciiArt}</pre>
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.asciiArtGenerator.examples')}</h3>
        <div className="grid grid-cols-3 gap-4">
          {presets.map((preset, i) => (
            <div key={i} className="bg-slate-100 p-3 rounded text-center">
              <pre className="font-mono text-xs leading-tight">{preset.text}</pre>
              <div className="text-sm text-slate-500 mt-2">{preset.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.asciiArtGenerator.tips')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• {t('tools.asciiArtGenerator.tip1')}</li>
          <li>• {t('tools.asciiArtGenerator.tip2')}</li>
          <li>• {t('tools.asciiArtGenerator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
