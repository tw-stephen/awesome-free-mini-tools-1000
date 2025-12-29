import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function AsciiArtGenerator() {
  const { t } = useTranslation()
  const [text, setText] = useState('')
  const [style, setStyle] = useState<'standard' | 'banner' | 'block' | 'bubble' | 'digital'>('standard')

  const asciiChars: Record<string, Record<string, string[]>> = {
    standard: {
      A: ['  *  ', ' * * ', '*****', '*   *', '*   *'],
      B: ['**** ', '*   *', '**** ', '*   *', '**** '],
      C: [' ****', '*    ', '*    ', '*    ', ' ****'],
      D: ['**** ', '*   *', '*   *', '*   *', '**** '],
      E: ['*****', '*    ', '***  ', '*    ', '*****'],
      F: ['*****', '*    ', '***  ', '*    ', '*    '],
      G: [' ****', '*    ', '*  **', '*   *', ' *** '],
      H: ['*   *', '*   *', '*****', '*   *', '*   *'],
      I: ['*****', '  *  ', '  *  ', '  *  ', '*****'],
      J: ['*****', '   * ', '   * ', '*  * ', ' **  '],
      K: ['*   *', '*  * ', '***  ', '*  * ', '*   *'],
      L: ['*    ', '*    ', '*    ', '*    ', '*****'],
      M: ['*   *', '** **', '* * *', '*   *', '*   *'],
      N: ['*   *', '**  *', '* * *', '*  **', '*   *'],
      O: [' *** ', '*   *', '*   *', '*   *', ' *** '],
      P: ['**** ', '*   *', '**** ', '*    ', '*    '],
      Q: [' *** ', '*   *', '* * *', '*  **', ' ****'],
      R: ['**** ', '*   *', '**** ', '*  * ', '*   *'],
      S: [' ****', '*    ', ' *** ', '    *', '**** '],
      T: ['*****', '  *  ', '  *  ', '  *  ', '  *  '],
      U: ['*   *', '*   *', '*   *', '*   *', ' *** '],
      V: ['*   *', '*   *', '*   *', ' * * ', '  *  '],
      W: ['*   *', '*   *', '* * *', '** **', '*   *'],
      X: ['*   *', ' * * ', '  *  ', ' * * ', '*   *'],
      Y: ['*   *', ' * * ', '  *  ', '  *  ', '  *  '],
      Z: ['*****', '   * ', '  *  ', ' *   ', '*****'],
      ' ': ['     ', '     ', '     ', '     ', '     '],
      '0': [' *** ', '*   *', '*   *', '*   *', ' *** '],
      '1': ['  *  ', ' **  ', '  *  ', '  *  ', '*****'],
      '2': [' *** ', '*   *', '  ** ', ' *   ', '*****'],
      '3': ['**** ', '    *', ' *** ', '    *', '**** '],
      '4': ['*   *', '*   *', '*****', '    *', '    *'],
      '5': ['*****', '*    ', '**** ', '    *', '**** '],
      '6': [' *** ', '*    ', '**** ', '*   *', ' *** '],
      '7': ['*****', '    *', '   * ', '  *  ', '  *  '],
      '8': [' *** ', '*   *', ' *** ', '*   *', ' *** '],
      '9': [' *** ', '*   *', ' ****', '    *', ' *** '],
    },
    banner: {
      A: ['#####', '#   #', '#####', '#   #', '#   #'],
      B: ['#### ', '#   #', '#### ', '#   #', '#### '],
      C: [' ####', '#    ', '#    ', '#    ', ' ####'],
      D: ['#### ', '#   #', '#   #', '#   #', '#### '],
      E: ['#####', '#    ', '###  ', '#    ', '#####'],
      F: ['#####', '#    ', '###  ', '#    ', '#    '],
      G: [' ####', '#    ', '#  ##', '#   #', ' ### '],
      H: ['#   #', '#   #', '#####', '#   #', '#   #'],
      I: ['#####', '  #  ', '  #  ', '  #  ', '#####'],
      J: ['#####', '   # ', '   # ', '#  # ', ' ##  '],
      K: ['#   #', '#  # ', '###  ', '#  # ', '#   #'],
      L: ['#    ', '#    ', '#    ', '#    ', '#####'],
      M: ['#   #', '## ##', '# # #', '#   #', '#   #'],
      N: ['#   #', '##  #', '# # #', '#  ##', '#   #'],
      O: [' ### ', '#   #', '#   #', '#   #', ' ### '],
      P: ['#### ', '#   #', '#### ', '#    ', '#    '],
      Q: [' ### ', '#   #', '# # #', '#  ##', ' ####'],
      R: ['#### ', '#   #', '#### ', '#  # ', '#   #'],
      S: [' ####', '#    ', ' ### ', '    #', '#### '],
      T: ['#####', '  #  ', '  #  ', '  #  ', '  #  '],
      U: ['#   #', '#   #', '#   #', '#   #', ' ### '],
      V: ['#   #', '#   #', '#   #', ' # # ', '  #  '],
      W: ['#   #', '#   #', '# # #', '## ##', '#   #'],
      X: ['#   #', ' # # ', '  #  ', ' # # ', '#   #'],
      Y: ['#   #', ' # # ', '  #  ', '  #  ', '  #  '],
      Z: ['#####', '   # ', '  #  ', ' #   ', '#####'],
      ' ': ['     ', '     ', '     ', '     ', '     '],
    },
    block: {
      A: ['[][][]', '[]  []', '[][][]', '[]  []', '[]  []'],
      B: ['[][][][]', '[]    []', '[][][][]', '[]    []', '[][][][]'],
      C: ['  [][][]', '[]      ', '[]      ', '[]      ', '  [][][]'],
      D: ['[][][]  ', '[]    []', '[]    []', '[]    []', '[][][]  '],
      E: ['[][][][][]', '[]        ', '[][][]    ', '[]        ', '[][][][][]'],
      F: ['[][][][][]', '[]        ', '[][][]    ', '[]        ', '[]        '],
      ' ': ['      ', '      ', '      ', '      ', '      '],
    },
  }

  const generateAscii = (): string => {
    const chars = asciiChars[style] || asciiChars.standard
    const upperText = text.toUpperCase()
    const lines: string[] = ['', '', '', '', '']

    for (const char of upperText) {
      const charArt = chars[char] || chars[' '] || ['     ', '     ', '     ', '     ', '     ']
      for (let i = 0; i < 5; i++) {
        lines[i] += charArt[i] + ' '
      }
    }

    return lines.join('\n')
  }

  const generateBubble = (): string => {
    const bubbleMap: Record<string, string> = {
      A: '\u24B6', B: '\u24B7', C: '\u24B8', D: '\u24B9', E: '\u24BA',
      F: '\u24BB', G: '\u24BC', H: '\u24BD', I: '\u24BE', J: '\u24BF',
      K: '\u24C0', L: '\u24C1', M: '\u24C2', N: '\u24C3', O: '\u24C4',
      P: '\u24C5', Q: '\u24C6', R: '\u24C7', S: '\u24C8', T: '\u24C9',
      U: '\u24CA', V: '\u24CB', W: '\u24CC', X: '\u24CD', Y: '\u24CE',
      Z: '\u24CF',
      a: '\u24D0', b: '\u24D1', c: '\u24D2', d: '\u24D3', e: '\u24D4',
      f: '\u24D5', g: '\u24D6', h: '\u24D7', i: '\u24D8', j: '\u24D9',
      k: '\u24DA', l: '\u24DB', m: '\u24DC', n: '\u24DD', o: '\u24DE',
      p: '\u24DF', q: '\u24E0', r: '\u24E1', s: '\u24E2', t: '\u24E3',
      u: '\u24E4', v: '\u24E5', w: '\u24E6', x: '\u24E7', y: '\u24E8',
      z: '\u24E9',
      '0': '\u24EA', '1': '\u2460', '2': '\u2461', '3': '\u2462', '4': '\u2463',
      '5': '\u2464', '6': '\u2465', '7': '\u2466', '8': '\u2467', '9': '\u2468',
    }
    return text.split('').map(c => bubbleMap[c] || c).join(' ')
  }

  const generateDigital = (): string => {
    const digitalMap: Record<string, string[]> = {
      '0': [' _ ', '| |', '|_|'],
      '1': ['   ', '  |', '  |'],
      '2': [' _ ', ' _|', '|_ '],
      '3': [' _ ', ' _|', ' _|'],
      '4': ['   ', '|_|', '  |'],
      '5': [' _ ', '|_ ', ' _|'],
      '6': [' _ ', '|_ ', '|_|'],
      '7': [' _ ', '  |', '  |'],
      '8': [' _ ', '|_|', '|_|'],
      '9': [' _ ', '|_|', ' _|'],
      ' ': ['   ', '   ', '   '],
    }
    const lines: string[] = ['', '', '']
    for (const char of text) {
      const charArt = digitalMap[char] || digitalMap[' ']
      if (charArt) {
        for (let i = 0; i < 3; i++) {
          lines[i] += charArt[i] + ' '
        }
      }
    }
    return lines.join('\n')
  }

  const getOutput = (): string => {
    if (!text) return ''
    if (style === 'bubble') return generateBubble()
    if (style === 'digital') return generateDigital()
    return generateAscii()
  }

  const output = getOutput()

  const styles = ['standard', 'banner', 'block', 'bubble', 'digital'] as const

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium">{t('tools.asciiArtGenerator.input')}</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('tools.asciiArtGenerator.placeholder')}
          className="w-full px-3 py-2 border rounded"
          maxLength={20}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">{t('tools.asciiArtGenerator.style')}</label>
        <div className="flex flex-wrap gap-2">
          {styles.map((s) => (
            <button
              key={s}
              onClick={() => setStyle(s)}
              className={`px-4 py-2 rounded capitalize ${
                style === s ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {t(`tools.asciiArtGenerator.${s}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-2">{t('tools.asciiArtGenerator.output')}</h3>
        <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto font-mono text-sm whitespace-pre">
          {output || t('tools.asciiArtGenerator.empty')}
        </pre>
      </div>

      <button
        onClick={() => navigator.clipboard.writeText(output)}
        disabled={!output}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {t('common.copy')}
      </button>
    </div>
  )
}
