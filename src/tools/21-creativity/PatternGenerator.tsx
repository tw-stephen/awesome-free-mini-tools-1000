import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

type PatternType = 'stripes' | 'dots' | 'checkerboard' | 'zigzag' | 'waves' | 'triangles'

export default function PatternGenerator() {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [patternType, setPatternType] = useState<PatternType>('stripes')
  const [color1, setColor1] = useState('#3b82f6')
  const [color2, setColor2] = useState('#ffffff')
  const [size, setSize] = useState(20)
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    drawPattern()
  }, [patternType, color1, color2, size, rotation])

  const drawPattern = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    ctx.save()
    ctx.fillStyle = color2
    ctx.fillRect(0, 0, width, height)

    ctx.translate(width / 2, height / 2)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.translate(-width / 2, -height / 2)

    ctx.fillStyle = color1

    switch (patternType) {
      case 'stripes':
        for (let x = -height; x < width + height; x += size * 2) {
          ctx.fillRect(x, -height, size, height * 3)
        }
        break

      case 'dots':
        for (let y = 0; y < height + size; y += size) {
          for (let x = 0; x < width + size; x += size) {
            ctx.beginPath()
            ctx.arc(x, y, size / 4, 0, Math.PI * 2)
            ctx.fill()
          }
        }
        break

      case 'checkerboard':
        for (let y = 0; y < height + size; y += size) {
          for (let x = 0; x < width + size; x += size) {
            if ((Math.floor(x / size) + Math.floor(y / size)) % 2 === 0) {
              ctx.fillRect(x, y, size, size)
            }
          }
        }
        break

      case 'zigzag':
        ctx.strokeStyle = color1
        ctx.lineWidth = size / 4
        for (let y = -size; y < height + size * 2; y += size) {
          ctx.beginPath()
          for (let x = -size; x < width + size * 2; x += size) {
            const yOffset = (x / size) % 2 === 0 ? 0 : size / 2
            if (x === -size) {
              ctx.moveTo(x, y + yOffset)
            } else {
              ctx.lineTo(x, y + yOffset)
            }
          }
          ctx.stroke()
        }
        break

      case 'waves':
        ctx.strokeStyle = color1
        ctx.lineWidth = size / 4
        for (let y = 0; y < height + size * 2; y += size) {
          ctx.beginPath()
          for (let x = -size; x < width + size * 2; x += 2) {
            const yOffset = Math.sin((x / size) * Math.PI) * (size / 3)
            if (x === -size) {
              ctx.moveTo(x, y + yOffset)
            } else {
              ctx.lineTo(x, y + yOffset)
            }
          }
          ctx.stroke()
        }
        break

      case 'triangles':
        for (let y = -size; y < height + size * 2; y += size) {
          for (let x = -size; x < width + size * 2; x += size) {
            const offset = Math.floor(y / size) % 2 === 0 ? 0 : size / 2
            ctx.beginPath()
            ctx.moveTo(x + offset, y)
            ctx.lineTo(x + size / 2 + offset, y + size)
            ctx.lineTo(x - size / 2 + offset, y + size)
            ctx.closePath()
            if ((Math.floor(x / size) + Math.floor(y / size)) % 2 === 0) {
              ctx.fill()
            }
          }
        }
        break
    }

    ctx.restore()
  }

  const downloadPattern = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `pattern-${patternType}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const generateCSS = (): string => {
    switch (patternType) {
      case 'stripes':
        return `background: repeating-linear-gradient(
  ${rotation}deg,
  ${color1},
  ${color1} ${size}px,
  ${color2} ${size}px,
  ${color2} ${size * 2}px
);`
      case 'dots':
        return `background: radial-gradient(circle, ${color1} ${size / 4}px, transparent ${size / 4}px);
background-size: ${size}px ${size}px;
background-color: ${color2};`
      case 'checkerboard':
        return `background:
  linear-gradient(45deg, ${color1} 25%, transparent 25%),
  linear-gradient(-45deg, ${color1} 25%, transparent 25%),
  linear-gradient(45deg, transparent 75%, ${color1} 75%),
  linear-gradient(-45deg, transparent 75%, ${color1} 75%);
background-size: ${size * 2}px ${size * 2}px;
background-position: 0 0, ${size}px 0, ${size}px -${size}px, 0px ${size}px;
background-color: ${color2};`
      default:
        return `/* Use the downloaded PNG image as background */
background-image: url('pattern-${patternType}.png');
background-repeat: repeat;`
    }
  }

  const patterns: PatternType[] = ['stripes', 'dots', 'checkerboard', 'zigzag', 'waves', 'triangles']

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {patterns.map((p) => (
          <button
            key={p}
            onClick={() => setPatternType(p)}
            className={`px-3 py-2 rounded text-sm capitalize ${
              patternType === p ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {t(`tools.patternGenerator.${p}`)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">{t('tools.patternGenerator.color1')}</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={color1}
              onChange={(e) => setColor1(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={color1}
              onChange={(e) => setColor1(e.target.value)}
              className="flex-1 px-3 py-2 border rounded font-mono text-sm"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">{t('tools.patternGenerator.color2')}</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={color2}
              onChange={(e) => setColor2(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={color2}
              onChange={(e) => setColor2(e.target.value)}
              className="flex-1 px-3 py-2 border rounded font-mono text-sm"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            {t('tools.patternGenerator.size')}: {size}px
          </label>
          <input
            type="range"
            min="5"
            max="100"
            value={size}
            onChange={(e) => setSize(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            {t('tools.patternGenerator.rotation')}: {rotation}deg
          </label>
          <input
            type="range"
            min="0"
            max="360"
            value={rotation}
            onChange={(e) => setRotation(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <div className="card p-4">
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className="w-full rounded border"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={downloadPattern}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('common.download')} PNG
        </button>
        <button
          onClick={() => navigator.clipboard.writeText(generateCSS())}
          className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {t('common.copy')} CSS
        </button>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-2">{t('tools.patternGenerator.cssCode')}</h3>
        <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
          {generateCSS()}
        </pre>
      </div>
    </div>
  )
}
