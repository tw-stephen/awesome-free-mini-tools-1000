import { useState, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '../../hooks/useClipboard'

export default function MorseCodeConverter() {
  const { t } = useTranslation()
  const { copy, copied } = useClipboard()
  const [mode, setMode] = useState<'toMorse' | 'toText'>('toMorse')
  const [textInput, setTextInput] = useState('')
  const [morseInput, setMorseInput] = useState('')
  const audioContextRef = useRef<AudioContext | null>(null)

  const morseCode: Record<string, string> = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..',
    '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
    '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
    '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--',
    '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...',
    ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-',
    '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
  }

  const reverseMorseCode = Object.fromEntries(
    Object.entries(morseCode).map(([k, v]) => [v, k])
  )

  const textToMorse = (text: string): string => {
    return text
      .toUpperCase()
      .split('')
      .map((char) => {
        if (char === ' ') return '/'
        return morseCode[char] || ''
      })
      .filter((m) => m)
      .join(' ')
  }

  const morseToText = (morse: string): string => {
    return morse
      .split(' ')
      .map((code) => {
        if (code === '/' || code === '') return ' '
        return reverseMorseCode[code] || '?'
      })
      .join('')
      .replace(/\s+/g, ' ')
      .trim()
  }

  const morseResult = useMemo(() => {
    if (!textInput.trim()) return ''
    return textToMorse(textInput)
  }, [textInput])

  const textResult = useMemo(() => {
    if (!morseInput.trim()) return ''
    return morseToText(morseInput)
  }, [morseInput])

  const playMorse = async (morse: string) => {
    if (!morse) return

    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    const ctx = audioContextRef.current

    const dotDuration = 0.1
    const dashDuration = dotDuration * 3
    const symbolGap = dotDuration
    const letterGap = dotDuration * 3
    const wordGap = dotDuration * 7

    let currentTime = ctx.currentTime

    const playTone = (duration: number, startTime: number) => {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.frequency.value = 600
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.3, startTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration)

      oscillator.start(startTime)
      oscillator.stop(startTime + duration)
    }

    for (const char of morse) {
      if (char === '.') {
        playTone(dotDuration, currentTime)
        currentTime += dotDuration + symbolGap
      } else if (char === '-') {
        playTone(dashDuration, currentTime)
        currentTime += dashDuration + symbolGap
      } else if (char === ' ') {
        currentTime += letterGap
      } else if (char === '/') {
        currentTime += wordGap
      }
    }
  }

  const result = mode === 'toMorse' ? morseResult : textResult

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode('toMorse')}
            className={`flex-1 py-2 px-4 rounded text-sm font-medium ${
              mode === 'toMorse' ? 'bg-blue-500 text-white' : 'bg-slate-200'
            }`}
          >
            {t('tools.morseCodeConverter.toMorse')}
          </button>
          <button
            onClick={() => setMode('toText')}
            className={`flex-1 py-2 px-4 rounded text-sm font-medium ${
              mode === 'toText' ? 'bg-blue-500 text-white' : 'bg-slate-200'
            }`}
          >
            {t('tools.morseCodeConverter.toText')}
          </button>
        </div>

        {mode === 'toMorse' ? (
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.morseCodeConverter.enterText')}
            </label>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Hello World"
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        ) : (
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.morseCodeConverter.enterMorse')}
            </label>
            <textarea
              value={morseInput}
              onChange={(e) => setMorseInput(e.target.value)}
              placeholder=".... . .-.. .-.. --- / .-- --- .-. .-.. -.."
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-mono"
            />
            <div className="text-xs text-slate-400 mt-1">
              {t('tools.morseCodeConverter.morseHint')}
            </div>
          </div>
        )}
      </div>

      {result && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-700">
              {t('tools.morseCodeConverter.result')}
            </h3>
            <div className="flex gap-2">
              {mode === 'toMorse' && (
                <button
                  onClick={() => playMorse(result)}
                  className="text-sm text-green-500 hover:text-green-700"
                >
                  🔊 {t('tools.morseCodeConverter.play')}
                </button>
              )}
              <button
                onClick={() => copy(result)}
                className="text-sm text-blue-500 hover:text-blue-700"
              >
                {copied ? t('common.copied') : t('common.copy')}
              </button>
            </div>
          </div>

          <div className={`p-4 rounded ${mode === 'toMorse' ? 'bg-slate-100' : 'bg-blue-50'}`}>
            <div className={`break-all ${mode === 'toMorse' ? 'font-mono text-xl tracking-wider' : 'text-lg'}`}>
              {result}
            </div>
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.morseCodeConverter.reference')}
        </h3>
        <div className="grid grid-cols-6 gap-2 text-center text-sm">
          {Object.entries(morseCode).slice(0, 36).map(([char, code]) => (
            <div
              key={char}
              className="p-2 bg-slate-50 rounded cursor-pointer hover:bg-slate-100"
              onClick={() => {
                if (mode === 'toMorse') {
                  setTextInput((prev) => prev + char)
                } else {
                  setMorseInput((prev) => (prev ? prev + ' ' : '') + code)
                }
              }}
            >
              <div className="font-bold">{char}</div>
              <div className="font-mono text-xs text-slate-500">{code}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.morseCodeConverter.timing')}
        </h3>
        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xl">.</span>
            <span>{t('tools.morseCodeConverter.dot')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xl">-</span>
            <span>{t('tools.morseCodeConverter.dash')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xl">/</span>
            <span>{t('tools.morseCodeConverter.wordSeparator')}</span>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.morseCodeConverter.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.morseCodeConverter.tip1')}</li>
          <li>{t('tools.morseCodeConverter.tip2')}</li>
          <li>{t('tools.morseCodeConverter.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
