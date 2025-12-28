import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '../../hooks/useClipboard'
import Button from '../../components/ui/Button'
import TextArea from '../../components/ui/TextArea'

// Hiragana to Katakana mapping (difference is 0x60)
const hiraganaToKatakana = (text: string): string => {
  if (!text) return ''
  return text.replace(/[\u3041-\u3096]/g, (char) =>
    String.fromCharCode(char.charCodeAt(0) + 0x60)
  )
}

// Katakana to Hiragana mapping
const katakanaToHiragana = (text: string): string => {
  if (!text) return ''
  return text.replace(/[\u30A1-\u30F6]/g, (char) =>
    String.fromCharCode(char.charCodeAt(0) - 0x60)
  )
}

// Romaji to Hiragana mapping
const romajiMap: Record<string, string> = {
  // Basic vowels
  'a': 'あ', 'i': 'い', 'u': 'う', 'e': 'え', 'o': 'お',
  // K row
  'ka': 'か', 'ki': 'き', 'ku': 'く', 'ke': 'け', 'ko': 'こ',
  // S row
  'sa': 'さ', 'si': 'し', 'shi': 'し', 'su': 'す', 'se': 'せ', 'so': 'そ',
  // T row
  'ta': 'た', 'ti': 'ち', 'chi': 'ち', 'tu': 'つ', 'tsu': 'つ', 'te': 'て', 'to': 'と',
  // N row
  'na': 'な', 'ni': 'に', 'nu': 'ぬ', 'ne': 'ね', 'no': 'の',
  // H row
  'ha': 'は', 'hi': 'ひ', 'hu': 'ふ', 'fu': 'ふ', 'he': 'へ', 'ho': 'ほ',
  // M row
  'ma': 'ま', 'mi': 'み', 'mu': 'む', 'me': 'め', 'mo': 'も',
  // Y row
  'ya': 'や', 'yu': 'ゆ', 'yo': 'よ',
  // R row
  'ra': 'ら', 'ri': 'り', 'ru': 'る', 're': 'れ', 'ro': 'ろ',
  // W row
  'wa': 'わ', 'wi': 'ゐ', 'we': 'ゑ', 'wo': 'を',
  // N
  'n': 'ん', "n'": 'ん',
  // Voiced K (G)
  'ga': 'が', 'gi': 'ぎ', 'gu': 'ぐ', 'ge': 'げ', 'go': 'ご',
  // Voiced S (Z)
  'za': 'ざ', 'zi': 'じ', 'ji': 'じ', 'zu': 'ず', 'ze': 'ぜ', 'zo': 'ぞ',
  // Voiced T (D)
  'da': 'だ', 'di': 'ぢ', 'du': 'づ', 'de': 'で', 'do': 'ど',
  // Voiced H (B)
  'ba': 'ば', 'bi': 'び', 'bu': 'ぶ', 'be': 'べ', 'bo': 'ぼ',
  // P row
  'pa': 'ぱ', 'pi': 'ぴ', 'pu': 'ぷ', 'pe': 'ぺ', 'po': 'ぽ',
  // Compound sounds
  'kya': 'きゃ', 'kyu': 'きゅ', 'kyo': 'きょ',
  'sha': 'しゃ', 'sya': 'しゃ', 'shu': 'しゅ', 'syu': 'しゅ', 'sho': 'しょ', 'syo': 'しょ',
  'cha': 'ちゃ', 'tya': 'ちゃ', 'chu': 'ちゅ', 'tyu': 'ちゅ', 'cho': 'ちょ', 'tyo': 'ちょ',
  'nya': 'にゃ', 'nyu': 'にゅ', 'nyo': 'にょ',
  'hya': 'ひゃ', 'hyu': 'ひゅ', 'hyo': 'ひょ',
  'mya': 'みゃ', 'myu': 'みゅ', 'myo': 'みょ',
  'rya': 'りゃ', 'ryu': 'りゅ', 'ryo': 'りょ',
  'gya': 'ぎゃ', 'gyu': 'ぎゅ', 'gyo': 'ぎょ',
  'ja': 'じゃ', 'zya': 'じゃ', 'ju': 'じゅ', 'zyu': 'じゅ', 'jo': 'じょ', 'zyo': 'じょ',
  'bya': 'びゃ', 'byu': 'びゅ', 'byo': 'びょ',
  'pya': 'ぴゃ', 'pyu': 'ぴゅ', 'pyo': 'ぴょ',
  // Small tsu (gemination)
  'kk': 'っk', 'ss': 'っs', 'tt': 'っt', 'pp': 'っp', 'cc': 'っc',
  // Long vowels
  'aa': 'ああ', 'ii': 'いい', 'uu': 'うう', 'ee': 'ええ', 'oo': 'おお',
  'ou': 'おう', 'ei': 'えい',
}

// Reverse mapping: Hiragana to Romaji
const hiraganaToRomaji: Record<string, string> = {
  'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
  'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
  'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
  'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
  'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
  'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
  'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
  'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
  'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
  'わ': 'wa', 'を': 'wo', 'ん': 'n',
  'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
  'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
  'だ': 'da', 'ぢ': 'di', 'づ': 'du', 'で': 'de', 'ど': 'do',
  'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
  'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
  'きゃ': 'kya', 'きゅ': 'kyu', 'きょ': 'kyo',
  'しゃ': 'sha', 'しゅ': 'shu', 'しょ': 'sho',
  'ちゃ': 'cha', 'ちゅ': 'chu', 'ちょ': 'cho',
  'にゃ': 'nya', 'にゅ': 'nyu', 'にょ': 'nyo',
  'ひゃ': 'hya', 'ひゅ': 'hyu', 'ひょ': 'hyo',
  'みゃ': 'mya', 'みゅ': 'myu', 'みょ': 'myo',
  'りゃ': 'rya', 'りゅ': 'ryu', 'りょ': 'ryo',
  'ぎゃ': 'gya', 'ぎゅ': 'gyu', 'ぎょ': 'gyo',
  'じゃ': 'ja', 'じゅ': 'ju', 'じょ': 'jo',
  'びゃ': 'bya', 'びゅ': 'byu', 'びょ': 'byo',
  'ぴゃ': 'pya', 'ぴゅ': 'pyu', 'ぴょ': 'pyo',
  'っ': '',
  'ぁ': 'a', 'ぃ': 'i', 'ぅ': 'u', 'ぇ': 'e', 'ぉ': 'o',
  'ゃ': 'ya', 'ゅ': 'yu', 'ょ': 'yo',
}

const romajiToHiragana = (text: string): string => {
  if (!text) return ''
  let result = text.toLowerCase()

  // Sort by length descending to match longer patterns first
  const sortedEntries = Object.entries(romajiMap).sort((a, b) => b[0].length - a[0].length)

  for (const [romaji, hiragana] of sortedEntries) {
    result = result.split(romaji).join(hiragana)
  }

  return result
}

const kanaToRomaji = (text: string): string => {
  if (!text) return ''
  // First convert katakana to hiragana
  let result = katakanaToHiragana(text)

  // Sort by length descending to match compound sounds first
  const sortedEntries = Object.entries(hiraganaToRomaji).sort((a, b) => b[0].length - a[0].length)

  for (const [hiragana, romaji] of sortedEntries) {
    result = result.split(hiragana).join(romaji)
  }

  // Handle っ (gemination)
  result = result.replace(/っ([a-z])/g, '$1$1')

  return result
}

export default function KanaConverter() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<'hira-kata' | 'romaji-hira'>('hira-kata')
  const [input1, setInput1] = useState('')
  const [input2, setInput2] = useState('')
  const { copied: copied1, copy: copy1 } = useClipboard()
  const { copied: copied2, copy: copy2 } = useClipboard()

  const handleInput1Change = (val: string) => {
    setInput1(val)
    if (mode === 'hira-kata') {
      setInput2(hiraganaToKatakana(val))
    } else {
      setInput2(romajiToHiragana(val))
    }
  }

  const handleInput2Change = (val: string) => {
    setInput2(val)
    if (mode === 'hira-kata') {
      setInput1(katakanaToHiragana(val))
    } else {
      setInput1(kanaToRomaji(val))
    }
  }

  const handleModeChange = (newMode: 'hira-kata' | 'romaji-hira') => {
    setMode(newMode)
    setInput1('')
    setInput2('')
  }

  const label1 = mode === 'hira-kata' ? t('tools.kanaConverter.hiragana') : t('tools.kanaConverter.romaji')
  const label2 = mode === 'hira-kata' ? t('tools.kanaConverter.katakana') : t('tools.kanaConverter.hiragana')
  const placeholder1 = mode === 'hira-kata' ? t('tools.kanaConverter.hiraganaPlaceholder') : t('tools.kanaConverter.romajiPlaceholder')
  const placeholder2 = mode === 'hira-kata' ? t('tools.kanaConverter.katakanaPlaceholder') : t('tools.kanaConverter.hiraganaPlaceholder')

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-700">
            {t('tools.kanaConverter.mode')}
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => handleModeChange('hira-kata')}
              className={`px-3 py-1 text-sm rounded ${mode === 'hira-kata' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              {t('tools.kanaConverter.hiraKata')}
            </button>
            <button
              onClick={() => handleModeChange('romaji-hira')}
              className={`px-3 py-1 text-sm rounded ${mode === 'romaji-hira' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              {t('tools.kanaConverter.romajiHira')}
            </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-slate-700">{label1}</label>
          </div>
          <TextArea
            value={input1}
            onChange={(e) => handleInput1Change(e.target.value)}
            placeholder={placeholder1}
            rows={10}
            className="font-mono text-lg"
          />
          <div className="mt-3 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => handleInput1Change('')} disabled={!input1}>
              {t('common.clear')}
            </Button>
            <Button onClick={() => copy1(input1)} disabled={!input1}>
              {copied1 ? t('common.copied') : t('common.copy')}
            </Button>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-slate-700">{label2}</label>
          </div>
          <TextArea
            value={input2}
            onChange={(e) => handleInput2Change(e.target.value)}
            placeholder={placeholder2}
            rows={10}
            className="font-mono text-lg"
          />
          <div className="mt-3 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => handleInput2Change('')} disabled={!input2}>
              {t('common.clear')}
            </Button>
            <Button onClick={() => copy2(input2)} disabled={!input2}>
              {copied2 ? t('common.copied') : t('common.copy')}
            </Button>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.kanaConverter.reference')}</h3>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2 text-center text-sm">
          {[
            ['あ', 'ア', 'a'], ['い', 'イ', 'i'], ['う', 'ウ', 'u'], ['え', 'エ', 'e'], ['お', 'オ', 'o'],
            ['か', 'カ', 'ka'], ['き', 'キ', 'ki'], ['く', 'ク', 'ku'], ['け', 'ケ', 'ke'], ['こ', 'コ', 'ko'],
            ['さ', 'サ', 'sa'], ['し', 'シ', 'shi'], ['す', 'ス', 'su'], ['せ', 'セ', 'se'], ['そ', 'ソ', 'so'],
            ['た', 'タ', 'ta'], ['ち', 'チ', 'chi'], ['つ', 'ツ', 'tsu'], ['て', 'テ', 'te'], ['と', 'ト', 'to'],
          ].map(([h, k, r], i) => (
            <div key={i} className="bg-slate-50 p-2 rounded">
              <div className="text-base">{h} {k}</div>
              <div className="text-slate-500 text-xs">{r}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
