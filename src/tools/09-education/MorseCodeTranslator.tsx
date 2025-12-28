import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function MorseCodeTranslator() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<'toMorse' | 'fromMorse'>('toMorse')

  const morseMap: Record<string, string> = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
    '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
    '8': '---..', '9': '----.', '.': '.-.-.-', ',': '--..--', '?': '..--..',
    "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
    '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.',
    '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
    ' ': '/',
  }

  const reverseMorseMap = useMemo(() => {
    const reversed: Record<string, string> = {}
    Object.entries(morseMap).forEach(([char, morse]) => {
      reversed[morse] = char
    })
    return reversed
  }, [])

  const result = useMemo(() => {
    if (mode === 'toMorse') {
      return input.toUpperCase().split('').map(char => morseMap[char] || char).join(' ')
    } else {
      const words = input.split(' / ')
      return words.map(word => {
        const letters = word.split(' ')
        return letters.map(morse => reverseMorseMap[morse] || morse).join('')
      }).join(' ')
    }
  }, [input, mode, reverseMorseMap])

  const playMorse = () => {
    if (!('AudioContext' in window)) return

    const context = new AudioContext()
    const dotDuration = 0.1
    let time = context.currentTime

    const morse = mode === 'toMorse' ? result : input

    morse.split('').forEach(char => {
      if (char === '.') {
        const osc = context.createOscillator()
        const gain = context.createGain()
        osc.connect(gain)
        gain.connect(context.destination)
        osc.frequency.value = 600
        gain.gain.value = 0.5
        osc.start(time)
        osc.stop(time + dotDuration)
        time += dotDuration + dotDuration
      } else if (char === '-') {
        const osc = context.createOscillator()
        const gain = context.createGain()
        osc.connect(gain)
        gain.connect(context.destination)
        osc.frequency.value = 600
        gain.gain.value = 0.5
        osc.start(time)
        osc.stop(time + dotDuration * 3)
        time += dotDuration * 3 + dotDuration
      } else if (char === ' ') {
        time += dotDuration * 3
      } else if (char === '/') {
        time += dotDuration * 7
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => { setMode('toMorse'); setInput('') }}
          className={`flex-1 py-2 rounded font-medium ${mode === 'toMorse' ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
        >
          {t('tools.morseCodeTranslator.textToMorse')}
        </button>
        <button
          onClick={() => { setMode('fromMorse'); setInput('') }}
          className={`flex-1 py-2 rounded font-medium ${mode === 'fromMorse' ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
        >
          {t('tools.morseCodeTranslator.morseToText')}
        </button>
      </div>

      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {mode === 'toMorse' ? t('tools.morseCodeTranslator.enterText') : t('tools.morseCodeTranslator.enterMorse')}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'toMorse' ? 'Hello World' : '.... . .-.. .-.. --- / .-- --- .-. .-.. -..'}
          className="w-full px-3 py-2 border border-slate-300 rounded font-mono resize-none"
          rows={3}
        />
        {mode === 'fromMorse' && (
          <p className="text-xs text-slate-500 mt-1">
            {t('tools.morseCodeTranslator.morseHint')}
          </p>
        )}
      </div>

      {result && (
        <div className="card p-4 bg-blue-50">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium text-slate-700">
              {t('tools.morseCodeTranslator.result')}
            </h3>
            <div className="flex gap-2">
              {mode === 'toMorse' && (
                <button
                  onClick={playMorse}
                  className="px-3 py-1 text-sm bg-green-500 text-white rounded"
                >
                  🔊 {t('tools.morseCodeTranslator.play')}
                </button>
              )}
              <button
                onClick={() => navigator.clipboard.writeText(result)}
                className="px-3 py-1 text-sm bg-slate-200 rounded"
              >
                {t('common.copy')}
              </button>
            </div>
          </div>
          <p className="font-mono text-lg break-all">{result}</p>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.morseCodeTranslator.reference')}
        </h3>
        <div className="grid grid-cols-4 gap-2 text-xs font-mono">
          {Object.entries(morseMap).slice(0, 36).map(([char, morse]) => (
            <div key={char} className="flex justify-between p-1 bg-slate-50 rounded">
              <span className="font-bold">{char === ' ' ? '␣' : char}</span>
              <span className="text-slate-500">{morse}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.morseCodeTranslator.tips')}
        </h3>
        <div className="text-xs text-slate-500 space-y-1">
          <p>• {t('tools.morseCodeTranslator.tip1')}</p>
          <p>• {t('tools.morseCodeTranslator.tip2')}</p>
          <p>• {t('tools.morseCodeTranslator.tip3')}</p>
        </div>
      </div>
    </div>
  )
}
