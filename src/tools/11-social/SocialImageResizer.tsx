import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

type Platform = 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'youtube' | 'tiktok' | 'pinterest'
type Format = 'post' | 'story' | 'cover' | 'profile' | 'ad'

interface SizePreset {
  name: string
  width: number
  height: number
}

export default function SocialImageResizer() {
  const { t } = useTranslation()
  const [platform, setPlatform] = useState<Platform>('instagram')
  const [format, setFormat] = useState<Format>('post')
  const [image, setImage] = useState<string | null>(null)
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const presets: Record<Platform, Record<Format, SizePreset>> = {
    instagram: {
      post: { name: 'Square Post', width: 1080, height: 1080 },
      story: { name: 'Story/Reel', width: 1080, height: 1920 },
      cover: { name: 'Carousel', width: 1080, height: 1350 },
      profile: { name: 'Profile', width: 320, height: 320 },
      ad: { name: 'Landscape', width: 1080, height: 566 }
    },
    facebook: {
      post: { name: 'Post', width: 1200, height: 630 },
      story: { name: 'Story', width: 1080, height: 1920 },
      cover: { name: 'Cover', width: 820, height: 312 },
      profile: { name: 'Profile', width: 170, height: 170 },
      ad: { name: 'Ad', width: 1200, height: 628 }
    },
    twitter: {
      post: { name: 'Post', width: 1200, height: 675 },
      story: { name: 'Fleet', width: 1080, height: 1920 },
      cover: { name: 'Header', width: 1500, height: 500 },
      profile: { name: 'Profile', width: 400, height: 400 },
      ad: { name: 'Card', width: 800, height: 418 }
    },
    linkedin: {
      post: { name: 'Post', width: 1200, height: 627 },
      story: { name: 'Story', width: 1080, height: 1920 },
      cover: { name: 'Cover', width: 1584, height: 396 },
      profile: { name: 'Profile', width: 400, height: 400 },
      ad: { name: 'Sponsored', width: 1200, height: 627 }
    },
    youtube: {
      post: { name: 'Thumbnail', width: 1280, height: 720 },
      story: { name: 'Shorts', width: 1080, height: 1920 },
      cover: { name: 'Banner', width: 2560, height: 1440 },
      profile: { name: 'Profile', width: 800, height: 800 },
      ad: { name: 'Display Ad', width: 300, height: 250 }
    },
    tiktok: {
      post: { name: 'Video', width: 1080, height: 1920 },
      story: { name: 'Story', width: 1080, height: 1920 },
      cover: { name: 'Cover', width: 1080, height: 1920 },
      profile: { name: 'Profile', width: 200, height: 200 },
      ad: { name: 'In-Feed', width: 1080, height: 1920 }
    },
    pinterest: {
      post: { name: 'Pin', width: 1000, height: 1500 },
      story: { name: 'Story Pin', width: 1080, height: 1920 },
      cover: { name: 'Board Cover', width: 600, height: 600 },
      profile: { name: 'Profile', width: 165, height: 165 },
      ad: { name: 'Standard', width: 1000, height: 1500 }
    }
  }

  const currentPreset = presets[platform][format]

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        setOriginalSize({ width: img.width, height: img.height })
        setImage(event.target?.result as string)
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    if (!image || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = currentPreset.width
    canvas.height = currentPreset.height

    const img = new Image()
    img.onload = () => {
      // Calculate fit
      const imgRatio = img.width / img.height
      const canvasRatio = canvas.width / canvas.height

      let drawWidth, drawHeight, drawX, drawY

      if (imgRatio > canvasRatio) {
        drawHeight = canvas.height
        drawWidth = img.width * (canvas.height / img.height)
        drawX = (canvas.width - drawWidth) / 2
        drawY = 0
      } else {
        drawWidth = canvas.width
        drawHeight = img.height * (canvas.width / img.width)
        drawX = 0
        drawY = (canvas.height - drawHeight) / 2
      }

      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
    }
    img.src = image
  }, [image, currentPreset])

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = `${platform}_${format}_${currentPreset.width}x${currentPreset.height}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.socialImageResizer.platform')}
        </label>
        <div className="flex flex-wrap gap-2">
          {(['instagram', 'facebook', 'twitter', 'linkedin', 'youtube', 'tiktok', 'pinterest'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`px-3 py-1.5 rounded text-sm capitalize ${
                platform === p ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.socialImageResizer.format')}
        </label>
        <div className="flex flex-wrap gap-2">
          {(['post', 'story', 'cover', 'profile', 'ad'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={`px-3 py-1.5 rounded text-sm ${
                format === f ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {presets[platform][f].name}
            </button>
          ))}
        </div>
        <div className="mt-2 text-sm text-slate-500">
          {t('tools.socialImageResizer.size')}: {currentPreset.width} × {currentPreset.height}px
        </div>
      </div>

      <div className="card p-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-4 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-blue-400 hover:text-blue-500"
        >
          {image ? t('tools.socialImageResizer.changeImage') : t('tools.socialImageResizer.uploadImage')}
        </button>
        {originalSize.width > 0 && (
          <div className="mt-2 text-xs text-slate-500 text-center">
            {t('tools.socialImageResizer.original')}: {originalSize.width} × {originalSize.height}px
          </div>
        )}
      </div>

      {image && (
        <>
          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.socialImageResizer.preview')}
            </h3>
            <div className="flex justify-center">
              <canvas
                ref={canvasRef}
                className="max-w-full border border-slate-200 rounded"
                style={{ maxHeight: '400px', objectFit: 'contain' }}
              />
            </div>
          </div>

          <button
            onClick={downloadImage}
            className="w-full py-3 bg-blue-500 text-white rounded font-medium"
          >
            {t('tools.socialImageResizer.download')}
          </button>
        </>
      )}

      <div className="card p-4 bg-blue-50">
        <h3 className="font-medium text-slate-700 mb-2">{t('tools.socialImageResizer.tips')}</h3>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• {t('tools.socialImageResizer.tip1')}</li>
          <li>• {t('tools.socialImageResizer.tip2')}</li>
          <li>• {t('tools.socialImageResizer.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
