import { useState, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import TextArea from '../../components/ui/TextArea'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

export default function Base64ImageEncoder() {
  const { t } = useTranslation()
  const [base64, setBase64] = useState('')
  const [preview, setPreview] = useState('')
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number; type: string } | null>(null)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { copy, copied } = useClipboard()

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError(t('tools.base64ImageEncoder.notImage'))
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(t('tools.base64ImageEncoder.tooLarge'))
      return
    }

    setError('')
    setFileInfo({ name: file.name, size: file.size, type: file.type })

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setBase64(result)
      setPreview(result)
    }
    reader.onerror = () => {
      setError(t('tools.base64ImageEncoder.readError'))
    }
    reader.readAsDataURL(file)
  }, [t])

  const handleBase64Input = useCallback((value: string) => {
    setBase64(value)
    setFileInfo(null)

    if (!value.trim()) {
      setPreview('')
      setError('')
      return
    }

    try {
      // Check if it's a valid data URL or raw base64
      let dataUrl = value.trim()
      if (!dataUrl.startsWith('data:')) {
        // Try to detect image type and add data URL prefix
        dataUrl = `data:image/png;base64,${dataUrl}`
      }

      // Test if it's valid by creating an image
      const img = new Image()
      img.onload = () => {
        setPreview(dataUrl)
        setError('')
      }
      img.onerror = () => {
        setPreview('')
        setError(t('tools.base64ImageEncoder.invalidBase64'))
      }
      img.src = dataUrl
    } catch {
      setError(t('tools.base64ImageEncoder.invalidBase64'))
      setPreview('')
    }
  }, [t])

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const getRawBase64 = (): string => {
    if (!base64) return ''
    const match = base64.match(/base64,(.+)/)
    return match ? match[1] : base64
  }

  const getCssBackground = (): string => {
    return `background-image: url('${base64}');`
  }

  const getHtmlImg = (): string => {
    return `<img src="${base64}" alt="image" />`
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.base64ImageEncoder.uploadImage')}
        </h3>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
        >
          <div className="text-slate-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-slate-600">{t('tools.base64ImageEncoder.dropOrClick')}</p>
          <p className="text-xs text-slate-400 mt-1">{t('tools.base64ImageEncoder.maxSize')}</p>
        </div>

        {fileInfo && (
          <div className="mt-3 p-3 bg-slate-50 rounded">
            <p className="text-sm text-slate-700">{fileInfo.name}</p>
            <p className="text-xs text-slate-500">
              {fileInfo.type} • {formatSize(fileInfo.size)}
            </p>
          </div>
        )}

        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.base64ImageEncoder.base64String')}
          </h3>
          <Button variant="secondary" onClick={() => { setBase64(''); setPreview(''); setFileInfo(null); }}>
            {t('common.clear')}
          </Button>
        </div>

        <TextArea
          value={base64}
          onChange={(e) => handleBase64Input(e.target.value)}
          placeholder={t('tools.base64ImageEncoder.base64Placeholder')}
          rows={6}
          className="font-mono text-xs"
        />

        {base64 && (
          <div className="mt-2 text-xs text-slate-500">
            {t('tools.base64ImageEncoder.stringLength')}: {base64.length.toLocaleString()} {t('tools.base64ImageEncoder.characters')}
          </div>
        )}
      </div>

      {preview && (
        <>
          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.base64ImageEncoder.preview')}
            </h3>
            <div className="flex justify-center p-4 bg-slate-100 rounded-lg">
              <img
                src={preview}
                alt="Preview"
                className="max-w-full max-h-64 object-contain"
              />
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.base64ImageEncoder.copyOptions')}
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-600">{t('tools.base64ImageEncoder.rawBase64')}</span>
                  <Button variant="secondary" onClick={() => copy(getRawBase64())}>
                    {copied ? t('common.copied') : t('common.copy')}
                  </Button>
                </div>
                <div className="p-2 bg-slate-50 rounded text-xs font-mono text-slate-600 break-all max-h-20 overflow-y-auto">
                  {getRawBase64().slice(0, 200)}...
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-600">{t('tools.base64ImageEncoder.dataUrl')}</span>
                  <Button variant="secondary" onClick={() => copy(base64)}>
                    {copied ? t('common.copied') : t('common.copy')}
                  </Button>
                </div>
                <div className="p-2 bg-slate-50 rounded text-xs font-mono text-slate-600 break-all max-h-20 overflow-y-auto">
                  {base64.slice(0, 200)}...
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-600">{t('tools.base64ImageEncoder.cssBackground')}</span>
                  <Button variant="secondary" onClick={() => copy(getCssBackground())}>
                    {copied ? t('common.copied') : t('common.copy')}
                  </Button>
                </div>
                <div className="p-2 bg-slate-50 rounded text-xs font-mono text-slate-600 break-all max-h-20 overflow-y-auto">
                  {getCssBackground().slice(0, 200)}...
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-600">{t('tools.base64ImageEncoder.htmlImg')}</span>
                  <Button variant="secondary" onClick={() => copy(getHtmlImg())}>
                    {copied ? t('common.copied') : t('common.copy')}
                  </Button>
                </div>
                <div className="p-2 bg-slate-50 rounded text-xs font-mono text-slate-600 break-all max-h-20 overflow-y-auto">
                  {getHtmlImg().slice(0, 200)}...
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.base64ImageEncoder.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.base64ImageEncoder.tip1')}</li>
          <li>{t('tools.base64ImageEncoder.tip2')}</li>
          <li>{t('tools.base64ImageEncoder.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
