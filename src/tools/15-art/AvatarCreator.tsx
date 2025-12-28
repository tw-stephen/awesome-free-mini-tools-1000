import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function AvatarCreator() {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [bgColor, setBgColor] = useState('#3B82F6')
  const [skinTone, setSkinTone] = useState('#FFDAB9')
  const [hairColor, setHairColor] = useState('#4A2C2A')
  const [hairStyle, setHairStyle] = useState<'short' | 'long' | 'bald' | 'curly'>('short')
  const [eyeStyle, setEyeStyle] = useState<'normal' | 'happy' | 'surprised' | 'wink'>('normal')
  const [accessories, setAccessories] = useState<'none' | 'glasses' | 'sunglasses' | 'hat'>('none')

  useEffect(() => {
    drawAvatar()
  }, [bgColor, skinTone, hairColor, hairStyle, eyeStyle, accessories])

  const drawAvatar = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const size = 200
    canvas.width = size
    canvas.height = size

    // Background
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, size, size)

    const centerX = size / 2
    const centerY = size / 2

    // Draw hair back for long styles
    if (hairStyle === 'long') {
      ctx.fillStyle = hairColor
      ctx.beginPath()
      ctx.ellipse(centerX, centerY + 20, 55, 80, 0, 0, Math.PI * 2)
      ctx.fill()
    }

    // Face
    ctx.fillStyle = skinTone
    ctx.beginPath()
    ctx.arc(centerX, centerY, 50, 0, Math.PI * 2)
    ctx.fill()

    // Hair
    ctx.fillStyle = hairColor
    if (hairStyle === 'short') {
      ctx.beginPath()
      ctx.arc(centerX, centerY - 20, 45, Math.PI, 0)
      ctx.fill()
    } else if (hairStyle === 'curly') {
      for (let i = 0; i < 8; i++) {
        const angle = Math.PI + (Math.PI * i) / 8
        const x = centerX + Math.cos(angle) * 45
        const y = centerY - 20 + Math.sin(angle) * 45
        ctx.beginPath()
        ctx.arc(x, y, 15, 0, Math.PI * 2)
        ctx.fill()
      }
    } else if (hairStyle === 'long') {
      ctx.beginPath()
      ctx.arc(centerX, centerY - 15, 50, Math.PI, 0)
      ctx.fill()
    }

    // Eyes
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.ellipse(centerX - 18, centerY - 5, 12, eyeStyle === 'happy' ? 6 : 10, 0, 0, Math.PI * 2)
    ctx.fill()
    if (eyeStyle !== 'wink') {
      ctx.beginPath()
      ctx.ellipse(centerX + 18, centerY - 5, 12, eyeStyle === 'happy' ? 6 : 10, 0, 0, Math.PI * 2)
      ctx.fill()
    }

    // Pupils
    ctx.fillStyle = '#4A2C2A'
    if (eyeStyle === 'surprised') {
      ctx.beginPath()
      ctx.arc(centerX - 18, centerY - 5, 6, 0, Math.PI * 2)
      ctx.arc(centerX + 18, centerY - 5, 6, 0, Math.PI * 2)
      ctx.fill()
    } else if (eyeStyle === 'happy') {
      ctx.beginPath()
      ctx.arc(centerX - 18, centerY - 5, 4, 0, Math.PI * 2)
      ctx.arc(centerX + 18, centerY - 5, 4, 0, Math.PI * 2)
      ctx.fill()
    } else if (eyeStyle === 'wink') {
      ctx.beginPath()
      ctx.arc(centerX - 18, centerY - 5, 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#4A2C2A'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(centerX + 18, centerY - 5, 8, 0, Math.PI)
      ctx.stroke()
    } else {
      ctx.beginPath()
      ctx.arc(centerX - 18, centerY - 5, 5, 0, Math.PI * 2)
      ctx.arc(centerX + 18, centerY - 5, 5, 0, Math.PI * 2)
      ctx.fill()
    }

    // Mouth
    ctx.strokeStyle = '#c0392b'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.beginPath()
    if (eyeStyle === 'happy') {
      ctx.arc(centerX, centerY + 15, 15, 0.2, Math.PI - 0.2)
    } else if (eyeStyle === 'surprised') {
      ctx.fillStyle = '#c0392b'
      ctx.beginPath()
      ctx.ellipse(centerX, centerY + 20, 10, 12, 0, 0, Math.PI * 2)
      ctx.fill()
    } else {
      ctx.moveTo(centerX - 15, centerY + 20)
      ctx.quadraticCurveTo(centerX, centerY + 28, centerX + 15, centerY + 20)
    }
    ctx.stroke()

    // Accessories
    if (accessories === 'glasses' || accessories === 'sunglasses') {
      ctx.strokeStyle = '#1F2937'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.ellipse(centerX - 18, centerY - 5, 15, 12, 0, 0, Math.PI * 2)
      ctx.ellipse(centerX + 18, centerY - 5, 15, 12, 0, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(centerX - 3, centerY - 5)
      ctx.lineTo(centerX + 3, centerY - 5)
      ctx.stroke()

      if (accessories === 'sunglasses') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
        ctx.beginPath()
        ctx.ellipse(centerX - 18, centerY - 5, 14, 11, 0, 0, Math.PI * 2)
        ctx.ellipse(centerX + 18, centerY - 5, 14, 11, 0, 0, Math.PI * 2)
        ctx.fill()
      }
    } else if (accessories === 'hat') {
      ctx.fillStyle = '#1F2937'
      ctx.fillRect(centerX - 50, centerY - 55, 100, 10)
      ctx.fillRect(centerX - 30, centerY - 90, 60, 35)
    }
  }

  const downloadAvatar = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'avatar.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const skinTones = ['#FFDAB9', '#F5DEB3', '#DEB887', '#D2B48C', '#BC8F8F', '#8B7355']
  const hairColors = ['#000000', '#4A2C2A', '#8B4513', '#DAA520', '#FF6B6B', '#9400D3']

  return (
    <div className="space-y-4">
      <div className="card p-4 text-center">
        <canvas
          ref={canvasRef}
          className="mx-auto border border-slate-200 rounded-lg"
        />
        <button
          onClick={downloadAvatar}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
        >
          {t('tools.avatarCreator.download')}
        </button>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.avatarCreator.colors')}</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.avatarCreator.bgColor')}</label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-full h-10 cursor-pointer"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-2">{t('tools.avatarCreator.skinTone')}</label>
            <div className="flex gap-2">
              {skinTones.map((tone) => (
                <button
                  key={tone}
                  onClick={() => setSkinTone(tone)}
                  className={`w-8 h-8 rounded-full ${skinTone === tone ? 'ring-2 ring-blue-500' : ''}`}
                  style={{ backgroundColor: tone }}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-2">{t('tools.avatarCreator.hairColor')}</label>
            <div className="flex gap-2">
              {hairColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setHairColor(color)}
                  className={`w-8 h-8 rounded-full ${hairColor === color ? 'ring-2 ring-blue-500' : ''}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.avatarCreator.style')}</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-slate-500 block mb-2">{t('tools.avatarCreator.hairStyle')}</label>
            <div className="flex gap-2">
              {(['short', 'long', 'curly', 'bald'] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => setHairStyle(style)}
                  className={`flex-1 py-2 rounded capitalize ${
                    hairStyle === style ? 'bg-blue-500 text-white' : 'bg-slate-100'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-2">{t('tools.avatarCreator.expression')}</label>
            <div className="flex gap-2">
              {(['normal', 'happy', 'surprised', 'wink'] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => setEyeStyle(style)}
                  className={`flex-1 py-2 rounded capitalize ${
                    eyeStyle === style ? 'bg-blue-500 text-white' : 'bg-slate-100'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-2">{t('tools.avatarCreator.accessories')}</label>
            <div className="flex gap-2">
              {(['none', 'glasses', 'sunglasses', 'hat'] as const).map((acc) => (
                <button
                  key={acc}
                  onClick={() => setAccessories(acc)}
                  className={`flex-1 py-2 rounded capitalize ${
                    accessories === acc ? 'bg-blue-500 text-white' : 'bg-slate-100'
                  }`}
                >
                  {acc}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
