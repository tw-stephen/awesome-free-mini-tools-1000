import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '../../hooks/useClipboard'
import Button from '../../components/ui/Button'
import TextArea from '../../components/ui/TextArea'

// Pinyin to Bopomofo (Zhuyin) mapping
const pinyinToBopomofo: Record<string, string> = {
  // Initials
  'b': 'ㄅ', 'p': 'ㄆ', 'm': 'ㄇ', 'f': 'ㄈ',
  'd': 'ㄉ', 't': 'ㄊ', 'n': 'ㄋ', 'l': 'ㄌ',
  'g': 'ㄍ', 'k': 'ㄎ', 'h': 'ㄏ',
  'j': 'ㄐ', 'q': 'ㄑ', 'x': 'ㄒ',
  'zh': 'ㄓ', 'ch': 'ㄔ', 'sh': 'ㄕ', 'r': 'ㄖ',
  'z': 'ㄗ', 'c': 'ㄘ', 's': 'ㄙ',
  // Finals
  'a': 'ㄚ', 'o': 'ㄛ', 'e': 'ㄜ', 'ê': 'ㄝ',
  'ai': 'ㄞ', 'ei': 'ㄟ', 'ao': 'ㄠ', 'ou': 'ㄡ',
  'an': 'ㄢ', 'en': 'ㄣ', 'ang': 'ㄤ', 'eng': 'ㄥ', 'er': 'ㄦ',
  'i': 'ㄧ', 'u': 'ㄨ', 'ü': 'ㄩ', 'v': 'ㄩ',
  'ia': 'ㄧㄚ', 'ie': 'ㄧㄝ', 'iao': 'ㄧㄠ', 'iu': 'ㄧㄡ', 'iou': 'ㄧㄡ',
  'ian': 'ㄧㄢ', 'in': 'ㄧㄣ', 'iang': 'ㄧㄤ', 'ing': 'ㄧㄥ',
  'ua': 'ㄨㄚ', 'uo': 'ㄨㄛ', 'uai': 'ㄨㄞ', 'ui': 'ㄨㄟ', 'uei': 'ㄨㄟ',
  'uan': 'ㄨㄢ', 'un': 'ㄨㄣ', 'uen': 'ㄨㄣ', 'uang': 'ㄨㄤ', 'ong': 'ㄨㄥ',
  'üe': 'ㄩㄝ', 've': 'ㄩㄝ', 'üan': 'ㄩㄢ', 'van': 'ㄩㄢ',
  'ün': 'ㄩㄣ', 'vn': 'ㄩㄣ', 'iong': 'ㄩㄥ',
  // Tone marks
  'ā': 'ㄚ', 'á': 'ㄚˊ', 'ǎ': 'ㄚˇ', 'à': 'ㄚˋ',
  'ē': 'ㄜ', 'é': 'ㄜˊ', 'ě': 'ㄜˇ', 'è': 'ㄜˋ',
  'ī': 'ㄧ', 'í': 'ㄧˊ', 'ǐ': 'ㄧˇ', 'ì': 'ㄧˋ',
  'ō': 'ㄛ', 'ó': 'ㄛˊ', 'ǒ': 'ㄛˇ', 'ò': 'ㄛˋ',
  'ū': 'ㄨ', 'ú': 'ㄨˊ', 'ǔ': 'ㄨˇ', 'ù': 'ㄨˋ',
  'ǖ': 'ㄩ', 'ǘ': 'ㄩˊ', 'ǚ': 'ㄩˇ', 'ǜ': 'ㄩˋ',
}

// Bopomofo to Pinyin mapping
const bopomofoToPinyin: Record<string, string> = {
  // Initials
  'ㄅ': 'b', 'ㄆ': 'p', 'ㄇ': 'm', 'ㄈ': 'f',
  'ㄉ': 'd', 'ㄊ': 't', 'ㄋ': 'n', 'ㄌ': 'l',
  'ㄍ': 'g', 'ㄎ': 'k', 'ㄏ': 'h',
  'ㄐ': 'j', 'ㄑ': 'q', 'ㄒ': 'x',
  'ㄓ': 'zh', 'ㄔ': 'ch', 'ㄕ': 'sh', 'ㄖ': 'r',
  'ㄗ': 'z', 'ㄘ': 'c', 'ㄙ': 's',
  // Finals
  'ㄚ': 'a', 'ㄛ': 'o', 'ㄜ': 'e', 'ㄝ': 'ê',
  'ㄞ': 'ai', 'ㄟ': 'ei', 'ㄠ': 'ao', 'ㄡ': 'ou',
  'ㄢ': 'an', 'ㄣ': 'en', 'ㄤ': 'ang', 'ㄥ': 'eng', 'ㄦ': 'er',
  'ㄧ': 'i', 'ㄨ': 'u', 'ㄩ': 'ü',
  // Tones
  'ˊ': '2', 'ˇ': '3', 'ˋ': '4', '˙': '5',
}

// Common full syllables mapping
const syllables: Record<string, string> = {
  // Common syllables pinyin -> bopomofo
  'ba': 'ㄅㄚ', 'bo': 'ㄅㄛ', 'bi': 'ㄅㄧ', 'bu': 'ㄅㄨ',
  'pa': 'ㄆㄚ', 'po': 'ㄆㄛ', 'pi': 'ㄆㄧ', 'pu': 'ㄆㄨ',
  'ma': 'ㄇㄚ', 'mo': 'ㄇㄛ', 'me': 'ㄇㄜ', 'mi': 'ㄇㄧ', 'mu': 'ㄇㄨ',
  'fa': 'ㄈㄚ', 'fo': 'ㄈㄛ', 'fu': 'ㄈㄨ',
  'da': 'ㄉㄚ', 'de': 'ㄉㄜ', 'di': 'ㄉㄧ', 'du': 'ㄉㄨ',
  'ta': 'ㄊㄚ', 'te': 'ㄊㄜ', 'ti': 'ㄊㄧ', 'tu': 'ㄊㄨ',
  'na': 'ㄋㄚ', 'ne': 'ㄋㄜ', 'ni': 'ㄋㄧ', 'nu': 'ㄋㄨ', 'nü': 'ㄋㄩ', 'nv': 'ㄋㄩ',
  'la': 'ㄌㄚ', 'le': 'ㄌㄜ', 'li': 'ㄌㄧ', 'lu': 'ㄌㄨ', 'lü': 'ㄌㄩ', 'lv': 'ㄌㄩ',
  'ga': 'ㄍㄚ', 'ge': 'ㄍㄜ', 'gu': 'ㄍㄨ',
  'ka': 'ㄎㄚ', 'ke': 'ㄎㄜ', 'ku': 'ㄎㄨ',
  'ha': 'ㄏㄚ', 'he': 'ㄏㄜ', 'hu': 'ㄏㄨ',
  'ji': 'ㄐㄧ', 'ju': 'ㄐㄩ',
  'qi': 'ㄑㄧ', 'qu': 'ㄑㄩ',
  'xi': 'ㄒㄧ', 'xu': 'ㄒㄩ',
  'zhi': 'ㄓ', 'chi': 'ㄔ', 'shi': 'ㄕ', 'ri': 'ㄖ',
  'zi': 'ㄗ', 'ci': 'ㄘ', 'si': 'ㄙ',
  'zha': 'ㄓㄚ', 'zhe': 'ㄓㄜ', 'zhu': 'ㄓㄨ',
  'cha': 'ㄔㄚ', 'che': 'ㄔㄜ', 'chu': 'ㄔㄨ',
  'sha': 'ㄕㄚ', 'she': 'ㄕㄜ', 'shu': 'ㄕㄨ',
  'za': 'ㄗㄚ', 'ze': 'ㄗㄜ', 'zu': 'ㄗㄨ',
  'ca': 'ㄘㄚ', 'ce': 'ㄘㄜ', 'cu': 'ㄘㄨ',
  'sa': 'ㄙㄚ', 'se': 'ㄙㄜ', 'su': 'ㄙㄨ',
  'wo': 'ㄨㄛ', 'wa': 'ㄨㄚ', 'wei': 'ㄨㄟ', 'wan': 'ㄨㄢ', 'wen': 'ㄨㄣ', 'wang': 'ㄨㄤ', 'weng': 'ㄨㄥ',
  'yi': 'ㄧ', 'ya': 'ㄧㄚ', 'ye': 'ㄧㄝ', 'yao': 'ㄧㄠ', 'you': 'ㄧㄡ',
  'yan': 'ㄧㄢ', 'yin': 'ㄧㄣ', 'yang': 'ㄧㄤ', 'ying': 'ㄧㄥ',
  'yu': 'ㄩ', 'yue': 'ㄩㄝ', 'yuan': 'ㄩㄢ', 'yun': 'ㄩㄣ', 'yong': 'ㄩㄥ',
  'ai': 'ㄞ', 'ei': 'ㄟ', 'ao': 'ㄠ', 'ou': 'ㄡ',
  'an': 'ㄢ', 'en': 'ㄣ', 'ang': 'ㄤ', 'eng': 'ㄥ', 'er': 'ㄦ',
  'ni': 'ㄋㄧ', 'wo': 'ㄨㄛ', 'men': 'ㄇㄣ', 'hao': 'ㄏㄠ',
  'zhong': 'ㄓㄨㄥ', 'guo': 'ㄍㄨㄛ', 'ren': 'ㄖㄣ',
  'xue': 'ㄒㄩㄝ', 'sheng': 'ㄕㄥ',
  'nin': 'ㄋㄧㄣ', 'nin': 'ㄋㄧㄣ',
  'xie': 'ㄒㄧㄝ', 'xian': 'ㄒㄧㄢ',
  'jia': 'ㄐㄧㄚ', 'qian': 'ㄑㄧㄢ',
  'bie': 'ㄅㄧㄝ', 'pie': 'ㄆㄧㄝ', 'mie': 'ㄇㄧㄝ',
  'die': 'ㄉㄧㄝ', 'tie': 'ㄊㄧㄝ', 'nie': 'ㄋㄧㄝ', 'lie': 'ㄌㄧㄝ',
  'jie': 'ㄐㄧㄝ', 'qie': 'ㄑㄧㄝ',
  'biao': 'ㄅㄧㄠ', 'piao': 'ㄆㄧㄠ', 'miao': 'ㄇㄧㄠ',
  'diao': 'ㄉㄧㄠ', 'tiao': 'ㄊㄧㄠ', 'niao': 'ㄋㄧㄠ', 'liao': 'ㄌㄧㄠ',
  'jiao': 'ㄐㄧㄠ', 'qiao': 'ㄑㄧㄠ', 'xiao': 'ㄒㄧㄠ',
  'liu': 'ㄌㄧㄡ', 'jiu': 'ㄐㄧㄡ', 'qiu': 'ㄑㄧㄡ', 'xiu': 'ㄒㄧㄡ',
  'niu': 'ㄋㄧㄡ', 'diu': 'ㄉㄧㄡ', 'miu': 'ㄇㄧㄡ',
  'bian': 'ㄅㄧㄢ', 'pian': 'ㄆㄧㄢ', 'mian': 'ㄇㄧㄢ',
  'dian': 'ㄉㄧㄢ', 'tian': 'ㄊㄧㄢ', 'nian': 'ㄋㄧㄢ', 'lian': 'ㄌㄧㄢ',
  'jian': 'ㄐㄧㄢ', 'qian': 'ㄑㄧㄢ',
  'bin': 'ㄅㄧㄣ', 'pin': 'ㄆㄧㄣ', 'min': 'ㄇㄧㄣ',
  'lin': 'ㄌㄧㄣ', 'jin': 'ㄐㄧㄣ', 'qin': 'ㄑㄧㄣ', 'xin': 'ㄒㄧㄣ',
  'bing': 'ㄅㄧㄥ', 'ping': 'ㄆㄧㄥ', 'ming': 'ㄇㄧㄥ',
  'ding': 'ㄉㄧㄥ', 'ting': 'ㄊㄧㄥ', 'ning': 'ㄋㄧㄥ', 'ling': 'ㄌㄧㄥ',
  'jing': 'ㄐㄧㄥ', 'qing': 'ㄑㄧㄥ', 'xing': 'ㄒㄧㄥ',
  'biang': 'ㄅㄧㄤ', 'niang': 'ㄋㄧㄤ', 'liang': 'ㄌㄧㄤ',
  'jiang': 'ㄐㄧㄤ', 'qiang': 'ㄑㄧㄤ', 'xiang': 'ㄒㄧㄤ',
  'gua': 'ㄍㄨㄚ', 'kua': 'ㄎㄨㄚ', 'hua': 'ㄏㄨㄚ',
  'zhua': 'ㄓㄨㄚ', 'shua': 'ㄕㄨㄚ',
  'guo': 'ㄍㄨㄛ', 'kuo': 'ㄎㄨㄛ', 'huo': 'ㄏㄨㄛ',
  'zhuo': 'ㄓㄨㄛ', 'chuo': 'ㄔㄨㄛ', 'shuo': 'ㄕㄨㄛ', 'ruo': 'ㄖㄨㄛ',
  'zuo': 'ㄗㄨㄛ', 'cuo': 'ㄘㄨㄛ', 'suo': 'ㄙㄨㄛ',
  'guai': 'ㄍㄨㄞ', 'kuai': 'ㄎㄨㄞ', 'huai': 'ㄏㄨㄞ',
  'zhuai': 'ㄓㄨㄞ', 'chuai': 'ㄔㄨㄞ', 'shuai': 'ㄕㄨㄞ',
  'gui': 'ㄍㄨㄟ', 'kui': 'ㄎㄨㄟ', 'hui': 'ㄏㄨㄟ',
  'zhui': 'ㄓㄨㄟ', 'chui': 'ㄔㄨㄟ', 'shui': 'ㄕㄨㄟ', 'rui': 'ㄖㄨㄟ',
  'zui': 'ㄗㄨㄟ', 'cui': 'ㄘㄨㄟ', 'sui': 'ㄙㄨㄟ',
  'dui': 'ㄉㄨㄟ', 'tui': 'ㄊㄨㄟ',
  'guan': 'ㄍㄨㄢ', 'kuan': 'ㄎㄨㄢ', 'huan': 'ㄏㄨㄢ',
  'zhuan': 'ㄓㄨㄢ', 'chuan': 'ㄔㄨㄢ', 'shuan': 'ㄕㄨㄢ', 'ruan': 'ㄖㄨㄢ',
  'zuan': 'ㄗㄨㄢ', 'cuan': 'ㄘㄨㄢ', 'suan': 'ㄙㄨㄢ',
  'duan': 'ㄉㄨㄢ', 'tuan': 'ㄊㄨㄢ', 'nuan': 'ㄋㄨㄢ', 'luan': 'ㄌㄨㄢ',
  'gun': 'ㄍㄨㄣ', 'kun': 'ㄎㄨㄣ', 'hun': 'ㄏㄨㄣ',
  'zhun': 'ㄓㄨㄣ', 'chun': 'ㄔㄨㄣ', 'shun': 'ㄕㄨㄣ', 'run': 'ㄖㄨㄣ',
  'zun': 'ㄗㄨㄣ', 'cun': 'ㄘㄨㄣ', 'sun': 'ㄙㄨㄣ',
  'dun': 'ㄉㄨㄣ', 'tun': 'ㄊㄨㄣ', 'lun': 'ㄌㄨㄣ',
  'guang': 'ㄍㄨㄤ', 'kuang': 'ㄎㄨㄤ', 'huang': 'ㄏㄨㄤ',
  'zhuang': 'ㄓㄨㄤ', 'chuang': 'ㄔㄨㄤ', 'shuang': 'ㄕㄨㄤ',
  'gong': 'ㄍㄨㄥ', 'kong': 'ㄎㄨㄥ', 'hong': 'ㄏㄨㄥ',
  'dong': 'ㄉㄨㄥ', 'tong': 'ㄊㄨㄥ', 'nong': 'ㄋㄨㄥ', 'long': 'ㄌㄨㄥ',
  'que': 'ㄑㄩㄝ', 'jue': 'ㄐㄩㄝ', 'lue': 'ㄌㄩㄝ', 'nue': 'ㄋㄩㄝ',
  'quan': 'ㄑㄩㄢ', 'juan': 'ㄐㄩㄢ', 'xuan': 'ㄒㄩㄢ',
  'qun': 'ㄑㄩㄣ', 'jun': 'ㄐㄩㄣ', 'xun': 'ㄒㄩㄣ',
  'qiong': 'ㄑㄩㄥ', 'jiong': 'ㄐㄩㄥ', 'xiong': 'ㄒㄩㄥ',
}

// Reverse mapping for syllables
const syllablesReverse: Record<string, string> = Object.fromEntries(
  Object.entries(syllables).map(([k, v]) => [v, k])
)

const convertToBopomofo = (text: string): string => {
  if (!text) return ''
  let result = text.toLowerCase()

  // Sort by length descending to match longer patterns first
  const sortedSyllables = Object.entries(syllables).sort((a, b) => b[0].length - a[0].length)

  for (const [pinyin, bopomofo] of sortedSyllables) {
    result = result.split(pinyin).join(bopomofo)
  }

  return result
}

const convertToPinyin = (text: string): string => {
  if (!text) return ''
  let result = text

  // Sort by length descending to match longer patterns first
  const sortedReverse = Object.entries(syllablesReverse).sort((a, b) => b[0].length - a[0].length)

  for (const [bopomofo, pinyin] of sortedReverse) {
    result = result.split(bopomofo).join(pinyin)
  }

  // Handle individual bopomofo characters
  for (const [bopomofo, pinyin] of Object.entries(bopomofoToPinyin)) {
    result = result.split(bopomofo).join(pinyin)
  }

  return result
}

export default function BopomofoConverter() {
  const { t } = useTranslation()
  const [pinyinInput, setPinyinInput] = useState('')
  const [bopomofoInput, setBopomofoInput] = useState('')
  const { copied: pinyinCopied, copy: copyPinyin } = useClipboard()
  const { copied: bopomofoCopied, copy: copyBopomofo } = useClipboard()

  const handlePinyinChange = (val: string) => {
    setPinyinInput(val)
    setBopomofoInput(convertToBopomofo(val))
  }

  const handleBopomofoChange = (val: string) => {
    setBopomofoInput(val)
    setPinyinInput(convertToPinyin(val))
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-slate-700">
              {t('tools.bopomofoConverter.pinyin')}
            </label>
          </div>
          <TextArea
            value={pinyinInput}
            onChange={(e) => handlePinyinChange(e.target.value)}
            placeholder={t('tools.bopomofoConverter.pinyinPlaceholder')}
            rows={10}
            className="font-mono"
          />
          <div className="mt-3 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => handlePinyinChange('')} disabled={!pinyinInput}>
              {t('common.clear')}
            </Button>
            <Button onClick={() => copyPinyin(pinyinInput)} disabled={!pinyinInput}>
              {pinyinCopied ? t('common.copied') : t('common.copy')}
            </Button>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-slate-700">
              {t('tools.bopomofoConverter.bopomofo')}
            </label>
          </div>
          <TextArea
            value={bopomofoInput}
            onChange={(e) => handleBopomofoChange(e.target.value)}
            placeholder={t('tools.bopomofoConverter.bopomofoPlaceholder')}
            rows={10}
            className="font-mono text-lg"
          />
          <div className="mt-3 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => handleBopomofoChange('')} disabled={!bopomofoInput}>
              {t('common.clear')}
            </Button>
            <Button onClick={() => copyBopomofo(bopomofoInput)} disabled={!bopomofoInput}>
              {bopomofoCopied ? t('common.copied') : t('common.copy')}
            </Button>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.bopomofoConverter.reference')}</h3>
        <div className="grid grid-cols-7 md:grid-cols-14 gap-2 text-center text-sm">
          {['ㄅb', 'ㄆp', 'ㄇm', 'ㄈf', 'ㄉd', 'ㄊt', 'ㄋn', 'ㄌl', 'ㄍg', 'ㄎk', 'ㄏh', 'ㄐj', 'ㄑq', 'ㄒx'].map((pair) => (
            <div key={pair} className="bg-slate-50 p-2 rounded">
              <div className="text-lg">{pair[0]}</div>
              <div className="text-slate-500">{pair.slice(1)}</div>
            </div>
          ))}
          {['ㄓzh', 'ㄔch', 'ㄕsh', 'ㄖr', 'ㄗz', 'ㄘc', 'ㄙs', 'ㄚa', 'ㄛo', 'ㄜe', 'ㄞai', 'ㄟei', 'ㄠao', 'ㄡou'].map((pair) => (
            <div key={pair} className="bg-slate-50 p-2 rounded">
              <div className="text-lg">{pair[0]}</div>
              <div className="text-slate-500">{pair.slice(1)}</div>
            </div>
          ))}
          {['ㄢan', 'ㄣen', 'ㄤang', 'ㄥeng', 'ㄦer', 'ㄧi', 'ㄨu', 'ㄩü'].map((pair) => (
            <div key={pair} className="bg-slate-50 p-2 rounded">
              <div className="text-lg">{pair[0]}</div>
              <div className="text-slate-500">{pair.slice(1)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
