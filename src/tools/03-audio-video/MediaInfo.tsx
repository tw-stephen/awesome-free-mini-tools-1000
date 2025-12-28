import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '../../hooks/useClipboard'
import Button from '../../components/ui/Button'

interface MediaMetadata {
  type: 'audio' | 'video'
  fileName: string
  fileSize: number
  mimeType: string
  duration: number
  width?: number
  height?: number
  aspectRatio?: string
  videoCodec?: string
  audioChannels?: number
  sampleRate?: number
}

export default function MediaInfo() {
  const { t } = useTranslation()
  const [metadata, setMetadata] = useState<MediaMetadata | null>(null)
  const [mediaUrl, setMediaUrl] = useState<string | null>(null)
  const { copied, copy } = useClipboard()

  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (mediaUrl) {
      URL.revokeObjectURL(mediaUrl)
    }

    const url = URL.createObjectURL(file)
    setMediaUrl(url)

    const isVideo = file.type.startsWith('video/')
    const isAudio = file.type.startsWith('audio/')

    if (!isVideo && !isAudio) {
      alert(t('tools.mediaInfo.unsupportedFormat'))
      return
    }

    const partialMetadata: Partial<MediaMetadata> = {
      type: isVideo ? 'video' : 'audio',
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
    }

    if (isVideo && videoRef.current) {
      videoRef.current.src = url
      videoRef.current.onloadedmetadata = () => {
        const video = videoRef.current!
        const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
        const divisor = gcd(video.videoWidth, video.videoHeight)
        const aspectW = video.videoWidth / divisor
        const aspectH = video.videoHeight / divisor

        setMetadata({
          ...partialMetadata,
          type: 'video',
          duration: video.duration,
          width: video.videoWidth,
          height: video.videoHeight,
          aspectRatio: `${aspectW}:${aspectH}`,
        } as MediaMetadata)
      }
    } else if (isAudio && audioRef.current) {
      audioRef.current.src = url
      audioRef.current.onloadedmetadata = () => {
        const audio = audioRef.current!
        setMetadata({
          ...partialMetadata,
          type: 'audio',
          duration: audio.duration,
        } as MediaMetadata)
      }
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`
    return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`
  }

  const formatDuration = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    const ms = Math.floor((seconds % 1) * 1000)

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`
  }

  const formatBitrate = (bytes: number, seconds: number): string => {
    if (seconds === 0) return '0 kbps'
    const bitsPerSecond = (bytes * 8) / seconds
    if (bitsPerSecond < 1000) return `${Math.round(bitsPerSecond)} bps`
    if (bitsPerSecond < 1000000) return `${Math.round(bitsPerSecond / 1000)} kbps`
    return `${(bitsPerSecond / 1000000).toFixed(2)} Mbps`
  }

  const getMetadataText = (): string => {
    if (!metadata) return ''

    const lines = [
      `${t('tools.mediaInfo.fileName')}: ${metadata.fileName}`,
      `${t('tools.mediaInfo.fileSize')}: ${formatFileSize(metadata.fileSize)}`,
      `${t('tools.mediaInfo.mimeType')}: ${metadata.mimeType}`,
      `${t('tools.mediaInfo.duration')}: ${formatDuration(metadata.duration)}`,
      `${t('tools.mediaInfo.bitrate')}: ${formatBitrate(metadata.fileSize, metadata.duration)}`,
    ]

    if (metadata.type === 'video') {
      lines.push(
        `${t('tools.mediaInfo.resolution')}: ${metadata.width}×${metadata.height}`,
        `${t('tools.mediaInfo.aspectRatio')}: ${metadata.aspectRatio}`
      )
    }

    return lines.join('\n')
  }

  const clearFile = () => {
    if (mediaUrl) {
      URL.revokeObjectURL(mediaUrl)
    }
    setMediaUrl(null)
    setMetadata(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
            id="media-info-input"
          />
          <label
            htmlFor="media-info-input"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition"
          >
            {t('tools.mediaInfo.selectFile')}
          </label>
          {metadata && (
            <Button variant="secondary" onClick={clearFile}>
              {t('common.clear')}
            </Button>
          )}
        </div>

        <video ref={videoRef} className="hidden" />
        <audio ref={audioRef} className="hidden" />

        {mediaUrl && metadata?.type === 'video' && (
          <video
            src={mediaUrl}
            controls
            className="w-full max-w-2xl rounded-lg"
          />
        )}

        {mediaUrl && metadata?.type === 'audio' && (
          <audio
            src={mediaUrl}
            controls
            className="w-full"
          />
        )}
      </div>

      {metadata && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-700">
              {t('tools.mediaInfo.fileInfo')}
            </h3>
            <Button onClick={() => copy(getMetadataText())}>
              {copied ? t('common.copied') : t('common.copy')}
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <div className="text-xs text-slate-500 uppercase">
                  {t('tools.mediaInfo.fileName')}
                </div>
                <div className="text-sm font-medium text-slate-700 break-all">
                  {metadata.fileName}
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500 uppercase">
                  {t('tools.mediaInfo.fileSize')}
                </div>
                <div className="text-sm font-medium text-slate-700">
                  {formatFileSize(metadata.fileSize)} ({metadata.fileSize.toLocaleString()} bytes)
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500 uppercase">
                  {t('tools.mediaInfo.mimeType')}
                </div>
                <div className="text-sm font-medium text-slate-700">
                  {metadata.mimeType}
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500 uppercase">
                  {t('tools.mediaInfo.duration')}
                </div>
                <div className="text-sm font-medium text-slate-700">
                  {formatDuration(metadata.duration)} ({metadata.duration.toFixed(3)}s)
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-xs text-slate-500 uppercase">
                  {t('tools.mediaInfo.bitrate')}
                </div>
                <div className="text-sm font-medium text-slate-700">
                  {formatBitrate(metadata.fileSize, metadata.duration)}
                </div>
              </div>

              {metadata.type === 'video' && (
                <>
                  <div>
                    <div className="text-xs text-slate-500 uppercase">
                      {t('tools.mediaInfo.resolution')}
                    </div>
                    <div className="text-sm font-medium text-slate-700">
                      {metadata.width} × {metadata.height} pixels
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-500 uppercase">
                      {t('tools.mediaInfo.aspectRatio')}
                    </div>
                    <div className="text-sm font-medium text-slate-700">
                      {metadata.aspectRatio}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-500 uppercase">
                      {t('tools.mediaInfo.totalPixels')}
                    </div>
                    <div className="text-sm font-medium text-slate-700">
                      {((metadata.width! * metadata.height!) / 1000000).toFixed(2)} MP
                    </div>
                  </div>
                </>
              )}

              <div>
                <div className="text-xs text-slate-500 uppercase">
                  {t('tools.mediaInfo.mediaType')}
                </div>
                <div className="text-sm font-medium text-slate-700">
                  {metadata.type === 'video' ? t('tools.mediaInfo.video') : t('tools.mediaInfo.audio')}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!metadata && (
        <div className="card p-8 text-center text-slate-400">
          {t('tools.mediaInfo.dropHint')}
        </div>
      )}
    </div>
  )
}
