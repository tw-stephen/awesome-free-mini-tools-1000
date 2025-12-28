import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function TextureMaker() {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [textureType, setTextureType] = useState<'noise' | 'wood' | 'marble' | 'fabric' | 'paper'>('noise')
  const [primaryColor, setPrimaryColor] = useState('#8B4513')
  const [secondaryColor, setSecondaryColor] = useState('#D2691E')
  const [intensity, setIntensity] = useState(50)
  const [scale, setScale] = useState(10)

  useEffect(() => {
    drawTexture()
  }, [textureType, primaryColor, secondaryColor, intensity, scale])

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 }
  }

  const drawTexture = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = 300
    const height = 300
    canvas.width = width
    canvas.height = height

    const imageData = ctx.createImageData(width, height)
    const data = imageData.data

    const color1 = hexToRgb(primaryColor)
    const color2 = hexToRgb(secondaryColor)

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4
        let value = 0

        switch (textureType) {
          case 'noise':
            value = Math.random()
            break
          case 'wood':
            const ring = Math.sin((x / scale) + Math.sin(y / (scale * 2)) * 3) * 0.5 + 0.5
            value = ring + (Math.random() - 0.5) * (intensity / 200)
            break
          case 'marble':
            const veins = Math.sin(x / scale + Math.sin(y / scale) * 5) * 0.5 + 0.5
            value = veins + (Math.random() - 0.5) * (intensity / 100)
            break
          case 'fabric':
            const warp = ((x % scale) < scale / 2 ? 1 : 0) * 0.3
            const weft = ((y % scale) < scale / 2 ? 1 : 0) * 0.3
            value = warp + weft + 0.4 + (Math.random() - 0.5) * (intensity / 200)
            break
          case 'paper':
            value = 0.85 + (Math.random() - 0.5) * (intensity / 200)
            break
        }

        value = Math.max(0, Math.min(1, value))

        data[i] = color1.r * (1 - value) + color2.r * value
        data[i + 1] = color1.g * (1 - value) + color2.g * value
        data[i + 2] = color1.b * (1 - value) + color2.b * value
        data[i + 3] = 255
      }
    }

    ctx.putImageData(imageData, 0, 0)
  }

  const downloadTexture = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = `texture-${textureType}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const textures = [
    { id: 'noise', name: 'Noise', icon: '▓' },
    { id: 'wood', name: 'Wood', icon: '🪵' },
    { id: 'marble', name: 'Marble', icon: '🪨' },
    { id: 'fabric', name: 'Fabric', icon: '🧵' },
    { id: 'paper', name: 'Paper', icon: '📄' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex justify-center mb-4">
          <canvas
            ref={canvasRef}
            className="border border-slate-200 rounded-lg"
          />
        </div>
        <button
          onClick={downloadTexture}
          className="w-full py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
        >
          {t('tools.textureMaker.download')}
        </button>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.textureMaker.type')}</h3>
        <div className="grid grid-cols-5 gap-2">
          {textures.map((tex) => (
            <button
              key={tex.id}
              onClick={() => setTextureType(tex.id as any)}
              className={`p-3 rounded-lg text-center ${
                textureType === tex.id ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <div className="text-xl">{tex.icon}</div>
              <div className="text-xs mt-1">{tex.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.textureMaker.colors')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.textureMaker.primary')}</label>
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-full h-10 cursor-pointer"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.textureMaker.secondary')}</label>
            <input
              type="color"
              value={secondaryColor}
              onChange={(e) => setSecondaryColor(e.target.value)}
              className="w-full h-10 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.textureMaker.settings')}</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-500 block mb-1">
              {t('tools.textureMaker.intensity')}: {intensity}%
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={intensity}
              onChange={(e) => setIntensity(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">
              {t('tools.textureMaker.scale')}: {scale}
            </label>
            <input
              type="range"
              min="5"
              max="50"
              value={scale}
              onChange={(e) => setScale(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
