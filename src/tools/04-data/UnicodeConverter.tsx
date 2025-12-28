import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import TextArea from '../../components/ui/TextArea'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

export default function UnicodeConverter() {
  const { t } = useTranslation()
  const [text, setText] = useState('Hello 你好 🌍')
  const [format, setFormat] = useState<'codepoint' | 'utf8' | 'utf16' | 'html'>('codepoint')
  const { copy, copied } = useClipboard()

  const textToUnicode = useCallback(
    (input: string): string => {
      const chars = [...input] // Handle surrogate pairs correctly

      switch (format) {
        case 'codepoint':
          return chars.map((char) => `U+${char.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0')}`).join(' ')

        case 'utf8':
          return chars
            .map((char) => {
              const encoder = new TextEncoder()
              const bytes = encoder.encode(char)
              return Array.from(bytes)
                .map((b) => b.toString(16).toUpperCase().padStart(2, '0'))
                .join(' ')
            })
            .join(' ')

        case 'utf16':
          return chars
            .map((char) => {
              const codes: string[] = []
              for (let i = 0; i < char.length; i++) {
                codes.push(char.charCodeAt(i).toString(16).toUpperCase().padStart(4, '0'))
              }
              return codes.join(' ')
            })
            .join(' ')

        case 'html':
          return chars.map((char) => `&#${char.codePointAt(0)};`).join('')
      }
    },
    [format]
  )

  const unicodeToText = useCallback(
    (input: string): string => {
      try {
        switch (format) {
          case 'codepoint':
            return input
              .split(/\s+/)
              .map((code) => {
                const match = code.match(/^U\+([0-9A-Fa-f]+)$/i)
                if (match) {
                  return String.fromCodePoint(parseInt(match[1], 16))
                }
                return ''
              })
              .join('')

          case 'utf8':
            const bytes = input.split(/\s+/).map((b) => parseInt(b, 16))
            const decoder = new TextDecoder('utf-8')
            return decoder.decode(new Uint8Array(bytes))

          case 'utf16':
            const codes = input.split(/\s+/).map((c) => parseInt(c, 16))
            let result = ''
            for (let i = 0; i < codes.length; i++) {
              if (codes[i] >= 0xd800 && codes[i] <= 0xdbff && codes[i + 1]) {
                result += String.fromCharCode(codes[i], codes[i + 1])
                i++
              } else {
                result += String.fromCharCode(codes[i])
              }
            }
            return result

          case 'html':
            return input.replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(parseInt(code, 10)))
        }
      } catch {
        return ''
      }
    },
    [format]
  )

  const unicodeOutput = textToUnicode(text)

  const getCharacterInfo = (char: string) => {
    const codePoint = char.codePointAt(0)!
    const encoder = new TextEncoder()
    const utf8Bytes = encoder.encode(char)

    return {
      char,
      codePoint,
      codePointHex: `U+${codePoint.toString(16).toUpperCase().padStart(4, '0')}`,
      utf8: Array.from(utf8Bytes)
        .map((b) => b.toString(16).toUpperCase().padStart(2, '0'))
        .join(' '),
      utf8Length: utf8Bytes.length,
      utf16Length: char.length,
      html: `&#${codePoint};`,
    }
  }

  const characters = [...text].map(getCharacterInfo)

  const commonEmojis = ['😀', '😂', '❤️', '👍', '🎉', '🔥', '✨', '🌟', '💯', '🚀', '🌍', '🎵']

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.unicodeConverter.input')}
        </h3>

        <div className="space-y-3">
          <TextArea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Hello 你好 🌍"
            rows={3}
            className="font-mono"
          />

          <div className="flex gap-2 flex-wrap">
            {commonEmojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setText(text + emoji)}
                className="text-xl p-1 hover:bg-slate-100 rounded"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.unicodeConverter.format')}
        </h3>

        <div className="grid grid-cols-4 gap-2 mb-4">
          {(['codepoint', 'utf8', 'utf16', 'html'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={`px-3 py-2 rounded-lg text-sm ${
                format === f
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t(`tools.unicodeConverter.${f}`)}
            </button>
          ))}
        </div>

        <div className="bg-slate-50 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">
              {t('tools.unicodeConverter.output')}
            </span>
            <Button variant="secondary" onClick={() => copy(unicodeOutput)}>
              {copied ? t('common.copied') : t('common.copy')}
            </Button>
          </div>
          <p className="font-mono text-sm text-slate-800 break-all">{unicodeOutput || '-'}</p>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.unicodeConverter.decode')}
        </h3>

        <TextArea
          placeholder={
            format === 'codepoint'
              ? 'U+0048 U+0065 U+006C U+006C U+006F'
              : format === 'utf8'
                ? '48 65 6C 6C 6F'
                : format === 'utf16'
                  ? '0048 0065 006C 006C 006F'
                  : '&#72;&#101;&#108;&#108;&#111;'
          }
          rows={2}
          className="font-mono text-sm"
          onChange={(e) => {
            const decoded = unicodeToText(e.target.value)
            if (decoded) setText(decoded)
          }}
        />
      </div>

      {characters.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.unicodeConverter.charDetails')}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-600">
                  <th className="pb-2">{t('tools.unicodeConverter.char')}</th>
                  <th className="pb-2">{t('tools.unicodeConverter.codepoint')}</th>
                  <th className="pb-2">UTF-8</th>
                  <th className="pb-2">UTF-16</th>
                  <th className="pb-2">HTML</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {characters.slice(0, 20).map((info, i) => (
                  <tr key={i} className="border-t border-slate-100">
                    <td className="py-2 text-xl">{info.char}</td>
                    <td className="py-2 text-slate-700">{info.codePointHex}</td>
                    <td className="py-2 text-slate-600">{info.utf8}</td>
                    <td className="py-2 text-slate-600">
                      {info.utf16Length} unit{info.utf16Length > 1 ? 's' : ''}
                    </td>
                    <td className="py-2 text-slate-600">{info.html}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {characters.length > 20 && (
              <p className="text-sm text-slate-500 mt-2">
                ... and {characters.length - 20} more characters
              </p>
            )}
          </div>
        </div>
      )}

      <div className="card p-4 bg-blue-50 border border-blue-200">
        <h3 className="text-sm font-medium text-blue-800 mb-2">
          {t('tools.unicodeConverter.stats')}
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-mono text-blue-600">{[...text].length}</p>
            <p className="text-xs text-blue-700">{t('tools.unicodeConverter.characters')}</p>
          </div>
          <div>
            <p className="text-2xl font-mono text-blue-600">
              {new TextEncoder().encode(text).length}
            </p>
            <p className="text-xs text-blue-700">{t('tools.unicodeConverter.utf8Bytes')}</p>
          </div>
          <div>
            <p className="text-2xl font-mono text-blue-600">{text.length}</p>
            <p className="text-xs text-blue-700">{t('tools.unicodeConverter.utf16Units')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
