import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface MetadataInfo {
  field: string
  value: string
  risk: 'high' | 'medium' | 'low'
}

export default function MetadataStripper() {
  const { t } = useTranslation()
  const [file, setFile] = useState<File | null>(null)
  const [metadata, setMetadata] = useState<MetadataInfo[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [strippedFile, setStrippedFile] = useState<Blob | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const extractImageMetadata = (dataView: DataView): MetadataInfo[] => {
    const extracted: MetadataInfo[] = []

    // Check for JPEG EXIF data
    if (dataView.getUint8(0) === 0xFF && dataView.getUint8(1) === 0xD8) {
      let offset = 2

      while (offset < dataView.byteLength) {
        if (dataView.getUint8(offset) !== 0xFF) break

        const marker = dataView.getUint8(offset + 1)
        const length = dataView.getUint16(offset + 2, false)

        // APP1 marker (EXIF)
        if (marker === 0xE1) {
          extracted.push({
            field: 'EXIF Data',
            value: `${length} bytes of EXIF metadata found`,
            risk: 'high',
          })
        }

        // APP13 marker (Photoshop)
        if (marker === 0xED) {
          extracted.push({
            field: 'Photoshop Data',
            value: `${length} bytes of Photoshop metadata`,
            risk: 'medium',
          })
        }

        offset += 2 + length
      }
    }

    return extracted
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setIsProcessing(true)
    setMetadata([])
    setStrippedFile(null)

    const extractedMetadata: MetadataInfo[] = []

    // Basic file info
    extractedMetadata.push({
      field: 'File Name',
      value: selectedFile.name,
      risk: 'low',
    })

    extractedMetadata.push({
      field: 'File Size',
      value: `${(selectedFile.size / 1024).toFixed(1)} KB`,
      risk: 'low',
    })

    extractedMetadata.push({
      field: 'Last Modified',
      value: new Date(selectedFile.lastModified).toLocaleString(),
      risk: 'medium',
    })

    extractedMetadata.push({
      field: 'MIME Type',
      value: selectedFile.type,
      risk: 'low',
    })

    // Read file for EXIF data
    if (selectedFile.type.startsWith('image/')) {
      try {
        const arrayBuffer = await selectedFile.arrayBuffer()
        const dataView = new DataView(arrayBuffer)
        const imageMetadata = extractImageMetadata(dataView)
        extractedMetadata.push(...imageMetadata)

        // Add common metadata warnings
        if (selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/tiff') {
          extractedMetadata.push({
            field: 'Potential GPS Data',
            value: 'JPEG/TIFF files often contain location data',
            risk: 'high',
          })
          extractedMetadata.push({
            field: 'Potential Camera Info',
            value: 'May contain camera model, settings, serial number',
            risk: 'medium',
          })
          extractedMetadata.push({
            field: 'Potential Author Info',
            value: 'May contain creator name, software used',
            risk: 'medium',
          })
        }
      } catch (err) {
        console.error('Error reading metadata:', err)
      }
    }

    setMetadata(extractedMetadata)
    setIsProcessing(false)
  }

  const stripMetadata = async () => {
    if (!file) return

    setIsProcessing(true)

    try {
      if (file.type.startsWith('image/')) {
        // For images, draw to canvas to strip metadata
        const img = new Image()
        const url = URL.createObjectURL(file)

        await new Promise<void>((resolve, reject) => {
          img.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext('2d')
            ctx?.drawImage(img, 0, 0)

            canvas.toBlob((blob) => {
              if (blob) {
                setStrippedFile(blob)
              }
              URL.revokeObjectURL(url)
              resolve()
            }, 'image/png', 0.95)
          }
          img.onerror = reject
          img.src = url
        })
      }
    } catch (err) {
      console.error('Error stripping metadata:', err)
    }

    setIsProcessing(false)
  }

  const downloadStripped = () => {
    if (!strippedFile || !file) return

    const url = URL.createObjectURL(strippedFile)
    const a = document.createElement('a')
    a.href = url
    a.download = `stripped_${file.name.replace(/\.[^.]+$/, '.png')}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getRiskColor = (risk: MetadataInfo['risk']): string => {
    switch (risk) {
      case 'high': return 'bg-red-50 border-red-200 text-red-700'
      case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-700'
      case 'low': return 'bg-green-50 border-green-200 text-green-700'
    }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.metadataStripper.select')}</h3>
        <div
          className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-4xl mb-2">🖼️</div>
          <p className="text-slate-600">Click to select an image</p>
          <p className="text-sm text-slate-400 mt-1">JPEG, PNG, TIFF, etc.</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {isProcessing && (
        <div className="card p-8 text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-slate-600">Processing...</p>
        </div>
      )}

      {metadata.length > 0 && !isProcessing && (
        <>
          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.metadataStripper.found')}</h3>
            <div className="space-y-2">
              {metadata.map((item, i) => (
                <div key={i} className={`p-3 rounded border ${getRiskColor(item.risk)}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.field}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      item.risk === 'high' ? 'bg-red-200' :
                      item.risk === 'medium' ? 'bg-yellow-200' : 'bg-green-200'
                    }`}>
                      {item.risk} risk
                    </span>
                  </div>
                  <p className="text-sm mt-1 opacity-80">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={stripMetadata}
              disabled={isProcessing || !file?.type.startsWith('image/')}
              className="flex-1 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300 font-medium"
            >
              {t('tools.metadataStripper.strip')}
            </button>
            {strippedFile && (
              <button
                onClick={downloadStripped}
                className="flex-1 py-3 bg-green-500 text-white rounded hover:bg-green-600 font-medium"
              >
                {t('tools.metadataStripper.download')}
              </button>
            )}
          </div>

          {strippedFile && (
            <div className="card p-4 bg-green-50">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✓</span>
                <div>
                  <h4 className="font-medium text-green-700">Metadata Stripped</h4>
                  <p className="text-sm text-green-600">
                    Clean image ready. Size: {(strippedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <div className="card p-4 bg-yellow-50">
        <h4 className="font-medium mb-2">{t('tools.metadataStripper.warning')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• Images can contain GPS coordinates revealing where they were taken</li>
          <li>• Camera info can identify the device used</li>
          <li>• Timestamps reveal when photos were taken</li>
          <li>• Always strip metadata before sharing sensitive images</li>
        </ul>
      </div>

      <div className="card p-4 bg-blue-50">
        <h4 className="font-medium mb-2">{t('tools.metadataStripper.info')}</h4>
        <p className="text-sm text-slate-600">
          This tool strips metadata by re-encoding images. The output is a clean PNG file
          with no embedded metadata. All processing happens locally in your browser.
        </p>
      </div>
    </div>
  )
}
