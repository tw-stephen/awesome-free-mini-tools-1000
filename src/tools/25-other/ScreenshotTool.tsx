import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface ScreenshotSettings {
  format: 'png' | 'jpeg' | 'webp'
  quality: number
  scale: number
  backgroundColor: string
  useTransparent: boolean
}

export default function ScreenshotTool() {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)
  const captureAreaRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [content, setContent] = useState<string | null>(null)
  const [contentType, setContentType] = useState<'html' | 'image'>('html')
  const [htmlContent, setHtmlContent] = useState('<div style="padding: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-family: system-ui; border-radius: 12px;">\n  <h1 style="margin: 0 0 16px 0;">Hello World!</h1>\n  <p style="margin: 0; opacity: 0.9;">This is a sample content for screenshot.</p>\n</div>')
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [settings, setSettings] = useState<ScreenshotSettings>({
    format: 'png',
    quality: 92,
    scale: 2,
    backgroundColor: '#ffffff',
    useTransparent: false
  })

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setContent(event.target?.result as string)
      setContentType('image')
    }
    reader.readAsDataURL(file)
  }

  const captureScreenshot = async () => {
    const element = captureAreaRef.current
    if (!element) return

    try {
      // @ts-ignore - html2canvas is loaded dynamically
      const html2canvas = (await import('html2canvas')).default

      const canvas = await html2canvas(element, {
        scale: settings.scale,
        backgroundColor: settings.useTransparent ? null : settings.backgroundColor,
        useCORS: true,
        logging: false
      })

      const mimeType = `image/${settings.format}`
      const quality = settings.format === 'png' ? undefined : settings.quality / 100
      const dataUrl = canvas.toDataURL(mimeType, quality)

      setScreenshot(dataUrl)
    } catch (error) {
      // Fallback: use canvas directly for simple content
      const element = captureAreaRef.current
      if (!element) return

      const canvas = document.createElement('canvas')
      const rect = element.getBoundingClientRect()
      canvas.width = rect.width * settings.scale
      canvas.height = rect.height * settings.scale

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.scale(settings.scale, settings.scale)
      ctx.fillStyle = settings.useTransparent ? 'transparent' : settings.backgroundColor
      ctx.fillRect(0, 0, rect.width, rect.height)

      const mimeType = `image/${settings.format}`
      const quality = settings.format === 'png' ? undefined : settings.quality / 100
      const dataUrl = canvas.toDataURL(mimeType, quality)

      setScreenshot(dataUrl)
    }
  }

  const downloadScreenshot = () => {
    if (!screenshot) return

    const link = document.createElement('a')
    link.href = screenshot
    link.download = `screenshot-${Date.now()}.${settings.format}`
    link.click()
  }

  const copyToClipboard = async () => {
    if (!screenshot) return

    try {
      const response = await fetch(screenshot)
      const blob = await response.blob()
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ])
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  useEffect(() => {
    if (contentType === 'html') {
      setContent(htmlContent)
    }
  }, [htmlContent, contentType])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <Button onClick={() => setContentType('html')} variant={contentType === 'html' ? 'primary' : 'secondary'}>
          {t('tools.screenshotTool.htmlMode')}
        </Button>
        <Button onClick={() => fileInputRef.current?.click()} variant={contentType === 'image' ? 'primary' : 'secondary'}>
          {t('tools.screenshotTool.imageMode')}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
        <div className="flex-1" />
        <Button onClick={captureScreenshot}>
          {t('tools.screenshotTool.capture')}
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-4" ref={containerRef}>
          {contentType === 'html' && (
            <div>
              <label className="block text-xs text-slate-500 mb-2">{t('tools.screenshotTool.htmlInput')}</label>
              <textarea
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                className="w-full h-32 p-3 font-mono text-sm border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter HTML content..."
              />
            </div>
          )}

          <div>
            <label className="block text-xs text-slate-500 mb-2">{t('tools.screenshotTool.preview')}</label>
            <div
              className="p-4 bg-slate-100 rounded-lg min-h-[200px] overflow-auto"
              style={{ backgroundColor: settings.useTransparent ? 'transparent' : settings.backgroundColor }}
            >
              <div
                ref={captureAreaRef}
                className="inline-block"
                style={{ backgroundColor: settings.useTransparent ? 'transparent' : settings.backgroundColor }}
              >
                {contentType === 'html' ? (
                  <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                ) : content ? (
                  <img src={content} alt="Content" className="max-w-full" />
                ) : (
                  <div className="text-slate-400 p-8">{t('tools.screenshotTool.placeholder')}</div>
                )}
              </div>
            </div>
          </div>

          {screenshot && (
            <div>
              <label className="block text-xs text-slate-500 mb-2">{t('tools.screenshotTool.result')}</label>
              <div className="p-4 bg-slate-100 rounded-lg">
                <img src={screenshot} alt="Screenshot" className="max-w-full shadow-lg rounded" />
              </div>
              <div className="flex gap-2 mt-2">
                <Button onClick={downloadScreenshot} variant="secondary">
                  {t('tools.screenshotTool.download')}
                </Button>
                <Button onClick={copyToClipboard} variant="secondary">
                  {t('tools.screenshotTool.copyToClipboard')}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="w-64 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-700">{t('tools.screenshotTool.settings')}</h3>

          <div>
            <label className="block text-xs text-slate-500 mb-1">{t('tools.screenshotTool.format')}</label>
            <select
              value={settings.format}
              onChange={(e) => setSettings({ ...settings, format: e.target.value as 'png' | 'jpeg' | 'webp' })}
              className="w-full p-2 border border-slate-200 rounded text-sm"
            >
              <option value="png">PNG</option>
              <option value="jpeg">JPEG</option>
              <option value="webp">WebP</option>
            </select>
          </div>

          {settings.format !== 'png' && (
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.screenshotTool.quality')}: {settings.quality}%
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={settings.quality}
                onChange={(e) => setSettings({ ...settings, quality: Number(e.target.value) })}
                className="w-full"
              />
            </div>
          )}

          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.screenshotTool.scale')}: {settings.scale}x
            </label>
            <input
              type="range"
              min="1"
              max="4"
              step="0.5"
              value={settings.scale}
              onChange={(e) => setSettings({ ...settings, scale: Number(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={settings.useTransparent}
                onChange={(e) => setSettings({ ...settings, useTransparent: e.target.checked })}
                className="rounded"
              />
              {t('tools.screenshotTool.transparent')}
            </label>
          </div>

          {!settings.useTransparent && (
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.screenshotTool.backgroundColor')}</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.backgroundColor}
                  onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                  className="flex-1 p-2 border border-slate-200 rounded text-sm font-mono"
                />
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-xs font-medium text-slate-500 mb-2">{t('tools.screenshotTool.tips')}</h4>
            <ul className="text-xs text-slate-500 space-y-1">
              <li>• {t('tools.screenshotTool.tip1')}</li>
              <li>• {t('tools.screenshotTool.tip2')}</li>
              <li>• {t('tools.screenshotTool.tip3')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
