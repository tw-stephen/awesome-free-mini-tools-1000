import { useState, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface Subtitle {
  id: string
  startTime: number
  endTime: number
  text: string
}

export default function SubtitleEditor() {
  const { t } = useTranslation()
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [subtitles, setSubtitles] = useState<Subtitle[]>([])
  const [currentTime, setCurrentTime] = useState(0)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [format, setFormat] = useState<'srt' | 'vtt'>('srt')

  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('video/')) {
      if (videoUrl) URL.revokeObjectURL(videoUrl)
      setVideoFile(file)
      setVideoUrl(URL.createObjectURL(file))
    }
  }

  const handleSubtitleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const text = await file.text()
    const parsed = parseSubtitle(text)
    setSubtitles(parsed)
  }

  const parseSubtitle = (text: string): Subtitle[] => {
    const lines = text.split('\n')
    const subs: Subtitle[] = []
    let i = 0

    while (i < lines.length) {
      const line = lines[i].trim()

      // Skip empty lines and index numbers
      if (!line || /^\d+$/.test(line)) {
        i++
        continue
      }

      // Look for timestamp line
      const timeMatch = line.match(
        /(\d{2}:\d{2}:\d{2}[,\.]\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}[,\.]\d{3})/
      )

      if (timeMatch) {
        const startTime = parseTimestamp(timeMatch[1])
        const endTime = parseTimestamp(timeMatch[2])
        i++

        // Collect text lines
        const textLines: string[] = []
        while (i < lines.length && lines[i].trim() && !/^\d+$/.test(lines[i].trim())) {
          textLines.push(lines[i].trim())
          i++
        }

        subs.push({
          id: Date.now().toString() + subs.length,
          startTime,
          endTime,
          text: textLines.join('\n'),
        })
      } else {
        i++
      }
    }

    return subs
  }

  const parseTimestamp = (ts: string): number => {
    const parts = ts.replace(',', '.').split(':')
    const hours = parseInt(parts[0])
    const minutes = parseInt(parts[1])
    const seconds = parseFloat(parts[2])
    return hours * 3600 + minutes * 60 + seconds
  }

  const formatTimestamp = (seconds: number, forFormat: 'srt' | 'vtt'): string => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    const ms = Math.floor((seconds % 1) * 1000)
    const separator = forFormat === 'srt' ? ',' : '.'
    return `${hours.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}${separator}${ms
      .toString()
      .padStart(3, '0')}`
  }

  const formatDisplayTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    const ms = Math.floor((seconds % 1) * 100)
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
  }

  const addSubtitle = () => {
    const newSub: Subtitle = {
      id: Date.now().toString(),
      startTime: currentTime,
      endTime: currentTime + 3,
      text: '',
    }
    setSubtitles([...subtitles, newSub].sort((a, b) => a.startTime - b.startTime))
    setEditingId(newSub.id)
  }

  const updateSubtitle = (id: string, updates: Partial<Subtitle>) => {
    setSubtitles(
      subtitles
        .map((s) => (s.id === id ? { ...s, ...updates } : s))
        .sort((a, b) => a.startTime - b.startTime)
    )
  }

  const deleteSubtitle = (id: string) => {
    setSubtitles(subtitles.filter((s) => s.id !== id))
  }

  const exportSubtitles = useCallback(() => {
    let content = ''

    if (format === 'srt') {
      subtitles.forEach((sub, index) => {
        content += `${index + 1}\n`
        content += `${formatTimestamp(sub.startTime, 'srt')} --> ${formatTimestamp(
          sub.endTime,
          'srt'
        )}\n`
        content += `${sub.text}\n\n`
      })
    } else {
      content = 'WEBVTT\n\n'
      subtitles.forEach((sub, index) => {
        content += `${index + 1}\n`
        content += `${formatTimestamp(sub.startTime, 'vtt')} --> ${formatTimestamp(
          sub.endTime,
          'vtt'
        )}\n`
        content += `${sub.text}\n\n`
      })
    }

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `subtitles.${format}`
    link.click()
    URL.revokeObjectURL(url)
  }, [subtitles, format])

  const getCurrentSubtitle = (): Subtitle | undefined => {
    return subtitles.find((s) => currentTime >= s.startTime && currentTime <= s.endTime)
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const seekToSubtitle = (sub: Subtitle) => {
    if (videoRef.current) {
      videoRef.current.currentTime = sub.startTime
    }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleVideoSelect}
            className="hidden"
            id="subtitle-video-input"
          />
          <label
            htmlFor="subtitle-video-input"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition"
          >
            {t('tools.subtitleEditor.selectVideo')}
          </label>

          <input
            type="file"
            accept=".srt,.vtt"
            onChange={handleSubtitleImport}
            className="hidden"
            id="subtitle-file-input"
          />
          <label
            htmlFor="subtitle-file-input"
            className="px-4 py-2 bg-green-500 text-white rounded-lg cursor-pointer hover:bg-green-600 transition"
          >
            {t('tools.subtitleEditor.importSubtitle')}
          </label>
        </div>

        {videoFile && (
          <div className="text-sm text-slate-600 mb-4">{videoFile.name}</div>
        )}

        {videoUrl && (
          <div className="relative">
            <video
              ref={videoRef}
              src={videoUrl}
              onTimeUpdate={handleTimeUpdate}
              controls
              className="w-full rounded-lg"
              style={{ maxHeight: 400 }}
            />
            {getCurrentSubtitle() && (
              <div className="absolute bottom-16 left-0 right-0 text-center">
                <span className="bg-black/70 text-white px-4 py-2 rounded text-lg">
                  {getCurrentSubtitle()?.text}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {videoUrl && (
        <>
          <div className="card p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-700">
                {t('tools.subtitleEditor.subtitles')} ({subtitles.length})
              </h3>
              <Button variant="primary" onClick={addSubtitle}>
                {t('tools.subtitleEditor.addSubtitle')}
              </Button>
            </div>

            <div className="text-sm text-slate-500 mb-4">
              {t('tools.subtitleEditor.currentTime')}: {formatDisplayTime(currentTime)}
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {subtitles.map((sub) => (
                <div
                  key={sub.id}
                  className={`p-3 rounded-lg ${
                    currentTime >= sub.startTime && currentTime <= sub.endTime
                      ? 'bg-blue-50 border border-blue-200'
                      : 'bg-slate-50'
                  }`}
                >
                  {editingId === sub.id ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">
                            {t('tools.subtitleEditor.start')}
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            value={sub.startTime.toFixed(2)}
                            onChange={(e) =>
                              updateSubtitle(sub.id, { startTime: parseFloat(e.target.value) })
                            }
                            className="w-full px-2 py-1 text-sm border border-slate-300 rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">
                            {t('tools.subtitleEditor.end')}
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            value={sub.endTime.toFixed(2)}
                            onChange={(e) =>
                              updateSubtitle(sub.id, { endTime: parseFloat(e.target.value) })
                            }
                            className="w-full px-2 py-1 text-sm border border-slate-300 rounded"
                          />
                        </div>
                      </div>
                      <textarea
                        value={sub.text}
                        onChange={(e) => updateSubtitle(sub.id, { text: e.target.value })}
                        placeholder={t('tools.subtitleEditor.enterText')}
                        className="w-full px-2 py-1 text-sm border border-slate-300 rounded resize-none"
                        rows={2}
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-2 py-1 text-sm bg-slate-200 rounded hover:bg-slate-300"
                        >
                          {t('tools.subtitleEditor.done')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => seekToSubtitle(sub)}
                      >
                        <div className="text-xs text-slate-400 mb-1">
                          {formatDisplayTime(sub.startTime)} - {formatDisplayTime(sub.endTime)}
                        </div>
                        <div className="text-sm text-slate-700">
                          {sub.text || <span className="italic text-slate-400">(empty)</span>}
                        </div>
                      </div>
                      <div className="flex gap-1 ml-2">
                        <button
                          onClick={() => setEditingId(sub.id)}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                        >
                          {t('tools.subtitleEditor.edit')}
                        </button>
                        <button
                          onClick={() => deleteSubtitle(sub.id)}
                          className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200"
                        >
                          {t('tools.subtitleEditor.delete')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {subtitles.length > 0 && (
            <div className="card p-4">
              <h3 className="text-sm font-medium text-slate-700 mb-3">
                {t('tools.subtitleEditor.export')}
              </h3>

              <div className="flex items-center gap-4 mb-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="format"
                    checked={format === 'srt'}
                    onChange={() => setFormat('srt')}
                  />
                  <span>SRT</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="format"
                    checked={format === 'vtt'}
                    onChange={() => setFormat('vtt')}
                  />
                  <span>WebVTT</span>
                </label>
              </div>

              <Button variant="primary" onClick={exportSubtitles}>
                {t('tools.subtitleEditor.download')}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
