import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'

export default function IconPreviewer() {
  const { t } = useTranslation()
  const [iconSrc, setIconSrc] = useState<string>('')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [showGrid, setShowGrid] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const previewSizes = [16, 24, 32, 48, 64, 96, 128, 256]
  const contextPreviews = [
    { name: 'Browser Tab', size: 16, padding: 4 },
    { name: 'Desktop Icon', size: 48, padding: 8 },
    { name: 'Mobile App', size: 60, padding: 10 },
    { name: 'App Store', size: 128, padding: 16 },
  ]

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setIconSrc(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handlePaste = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read()
      for (const item of clipboardItems) {
        const imageTypes = item.types.filter((type) => type.startsWith('image/'))
        if (imageTypes.length > 0) {
          const blob = await item.getType(imageTypes[0])
          const reader = new FileReader()
          reader.onload = (event) => {
            setIconSrc(event.target?.result as string)
          }
          reader.readAsDataURL(blob)
          break
        }
      }
    } catch (err) {
      console.error('Failed to read clipboard:', err)
    }
  }

  const downloadResized = (size: number) => {
    if (!iconSrc) return

    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, size, size)
      ctx.drawImage(img, 0, 0, size, size)

      const link = document.createElement('a')
      link.download = `icon-${size}x${size}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    }
    img.src = iconSrc
  }

  const downloadAll = () => {
    previewSizes.forEach((size, i) => {
      setTimeout(() => downloadResized(size), i * 200)
    })
  }

  return (
    <div className="space-y-6">
      <div className="card p-4">
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="flex-1"
            />
            <button
              onClick={handlePaste}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
            >
              {t('tools.iconPreviewer.paste')}
            </button>
          </div>

          <div className="flex gap-4 items-center">
            <div className="flex gap-2 items-center">
              <label className="text-sm">{t('tools.iconPreviewer.background')}:</label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer"
              />
              <button
                onClick={() => setBgColor('#ffffff')}
                className="px-2 py-1 text-xs bg-white border rounded"
              >
                White
              </button>
              <button
                onClick={() => setBgColor('#000000')}
                className="px-2 py-1 text-xs bg-black text-white rounded"
              >
                Black
              </button>
              <button
                onClick={() => setBgColor('transparent')}
                className="px-2 py-1 text-xs bg-gray-100 rounded"
              >
                None
              </button>
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showGrid}
                onChange={(e) => setShowGrid(e.target.checked)}
              />
              <span className="text-sm">{t('tools.iconPreviewer.showGrid')}</span>
            </label>
          </div>
        </div>
      </div>

      {iconSrc ? (
        <>
          <div className="card p-4">
            <h3 className="font-medium mb-4">{t('tools.iconPreviewer.sizePreviews')}</h3>
            <div className="flex flex-wrap gap-4 items-end">
              {previewSizes.map((size) => (
                <div key={size} className="text-center">
                  <div
                    className={`inline-block p-1 rounded ${showGrid ? 'bg-[url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAldEVYdFRpdGxlAENoZWNrZXJib2FyZCBwYXR0ZXJuIDE2eDEyIHB4ZWxz77+9aQAAABd0RVh0QXV0aG9yAExhcG8gQ2FsYW1hbmRyZWnfkRkAAAAodEVYdERlc2NyaXB0aW9uAEEgY2hlY2tlcmJvYXJkIHBhdHRlcm4uDQr//w+NAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAKklEQVQ4jWNgGAWjYBSMglEwCkYBGWD0f///fyoqKjIwMDAw/P//fxQMAACrhQT/Y6cqHAAAAABJRU5ErkJggg==)]' : ''}`}
                    style={{ backgroundColor: bgColor === 'transparent' ? undefined : bgColor }}
                  >
                    <img
                      src={iconSrc}
                      alt={`${size}px`}
                      style={{ width: size, height: size }}
                      className="block"
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{size}px</div>
                  <button
                    onClick={() => downloadResized(size)}
                    className="text-xs text-blue-500 hover:underline"
                  >
                    {t('common.download')}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-medium mb-4">{t('tools.iconPreviewer.contextPreviews')}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {contextPreviews.map((context) => (
                <div key={context.name} className="text-center">
                  <div className="text-sm text-gray-600 mb-2">{context.name}</div>
                  <div
                    className="inline-block rounded-xl shadow-lg"
                    style={{
                      padding: context.padding,
                      backgroundColor: bgColor === 'transparent' ? '#ffffff' : bgColor,
                    }}
                  >
                    <img
                      src={iconSrc}
                      alt={context.name}
                      style={{ width: context.size, height: context.size }}
                      className="block rounded"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-medium mb-4">{t('tools.iconPreviewer.faviconPreview')}</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-gray-100 rounded-t-lg px-3 py-2">
                <div
                  className="w-4 h-4 mr-2 rounded-sm"
                  style={{ backgroundColor: bgColor === 'transparent' ? '#ffffff' : bgColor }}
                >
                  <img src={iconSrc} alt="favicon" className="w-full h-full" />
                </div>
                <span className="text-sm text-gray-600">Page Title</span>
                <span className="ml-4 text-gray-400">x</span>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-medium mb-4">{t('tools.iconPreviewer.mobilePreview')}</h3>
            <div className="flex gap-8 justify-center">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">iOS</div>
                <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg">
                  <img src={iconSrc} alt="iOS" className="w-full h-full" />
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">Android</div>
                <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg">
                  <img src={iconSrc} alt="Android" className="w-full h-full" />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={downloadAll}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t('tools.iconPreviewer.downloadAll')}
          </button>
        </>
      ) : (
        <div className="card p-12 text-center text-gray-400">
          {t('tools.iconPreviewer.uploadHint')}
        </div>
      )}
    </div>
  )
}
