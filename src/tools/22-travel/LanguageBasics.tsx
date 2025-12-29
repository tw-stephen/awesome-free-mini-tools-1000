import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface LanguageData {
  code: string
  name: string
  flag: string
  basics: {
    alphabet?: string[]
    numbers: { num: string; word: string; pronunciation: string }[]
    greetings: { phrase: string; translation: string; pronunciation: string }[]
    essentialWords: { word: string; translation: string; pronunciation: string }[]
  }
}

const languages: LanguageData[] = [
  {
    code: 'ja',
    name: 'Japanese',
    flag: '🇯🇵',
    basics: {
      numbers: [
        { num: '1', word: '一', pronunciation: 'ichi' },
        { num: '2', word: '二', pronunciation: 'ni' },
        { num: '3', word: '三', pronunciation: 'san' },
        { num: '4', word: '四', pronunciation: 'yon/shi' },
        { num: '5', word: '五', pronunciation: 'go' },
        { num: '6', word: '六', pronunciation: 'roku' },
        { num: '7', word: '七', pronunciation: 'nana/shichi' },
        { num: '8', word: '八', pronunciation: 'hachi' },
        { num: '9', word: '九', pronunciation: 'kyu/ku' },
        { num: '10', word: '十', pronunciation: 'ju' },
      ],
      greetings: [
        { phrase: 'おはようございます', translation: 'Good morning', pronunciation: 'Ohayou gozaimasu' },
        { phrase: 'こんにちは', translation: 'Hello', pronunciation: 'Konnichiwa' },
        { phrase: 'こんばんは', translation: 'Good evening', pronunciation: 'Konbanwa' },
        { phrase: 'おやすみなさい', translation: 'Good night', pronunciation: 'Oyasuminasai' },
        { phrase: 'さようなら', translation: 'Goodbye', pronunciation: 'Sayounara' },
      ],
      essentialWords: [
        { word: 'はい', translation: 'Yes', pronunciation: 'hai' },
        { word: 'いいえ', translation: 'No', pronunciation: 'iie' },
        { word: 'ありがとう', translation: 'Thank you', pronunciation: 'arigatou' },
        { word: 'すみません', translation: 'Excuse me', pronunciation: 'sumimasen' },
        { word: 'お願いします', translation: 'Please', pronunciation: 'onegaishimasu' },
      ],
    },
  },
  {
    code: 'zh',
    name: 'Chinese (Mandarin)',
    flag: '🇨🇳',
    basics: {
      numbers: [
        { num: '1', word: '一', pronunciation: 'yī' },
        { num: '2', word: '二', pronunciation: 'èr' },
        { num: '3', word: '三', pronunciation: 'sān' },
        { num: '4', word: '四', pronunciation: 'sì' },
        { num: '5', word: '五', pronunciation: 'wǔ' },
        { num: '6', word: '六', pronunciation: 'liù' },
        { num: '7', word: '七', pronunciation: 'qī' },
        { num: '8', word: '八', pronunciation: 'bā' },
        { num: '9', word: '九', pronunciation: 'jiǔ' },
        { num: '10', word: '十', pronunciation: 'shí' },
      ],
      greetings: [
        { phrase: '早上好', translation: 'Good morning', pronunciation: 'Zǎoshang hǎo' },
        { phrase: '你好', translation: 'Hello', pronunciation: 'Nǐ hǎo' },
        { phrase: '晚上好', translation: 'Good evening', pronunciation: 'Wǎnshang hǎo' },
        { phrase: '晚安', translation: 'Good night', pronunciation: 'Wǎn\'ān' },
        { phrase: '再見', translation: 'Goodbye', pronunciation: 'Zàijiàn' },
      ],
      essentialWords: [
        { word: '是', translation: 'Yes', pronunciation: 'shì' },
        { word: '不是', translation: 'No', pronunciation: 'bù shì' },
        { word: '謝謝', translation: 'Thank you', pronunciation: 'xièxiè' },
        { word: '不好意思', translation: 'Excuse me', pronunciation: 'bù hǎo yìsi' },
        { word: '請', translation: 'Please', pronunciation: 'qǐng' },
      ],
    },
  },
  {
    code: 'ko',
    name: 'Korean',
    flag: '🇰🇷',
    basics: {
      numbers: [
        { num: '1', word: '일/하나', pronunciation: 'il/hana' },
        { num: '2', word: '이/둘', pronunciation: 'i/dul' },
        { num: '3', word: '삼/셋', pronunciation: 'sam/set' },
        { num: '4', word: '사/넷', pronunciation: 'sa/net' },
        { num: '5', word: '오/다섯', pronunciation: 'o/daseot' },
        { num: '6', word: '육/여섯', pronunciation: 'yuk/yeoseot' },
        { num: '7', word: '칠/일곱', pronunciation: 'chil/ilgop' },
        { num: '8', word: '팔/여덟', pronunciation: 'pal/yeodeol' },
        { num: '9', word: '구/아홉', pronunciation: 'gu/ahop' },
        { num: '10', word: '십/열', pronunciation: 'sip/yeol' },
      ],
      greetings: [
        { phrase: '안녕하세요', translation: 'Hello', pronunciation: 'Annyeonghaseyo' },
        { phrase: '안녕히 가세요', translation: 'Goodbye (to leaving person)', pronunciation: 'Annyeonghi gaseyo' },
        { phrase: '안녕히 계세요', translation: 'Goodbye (to staying person)', pronunciation: 'Annyeonghi gyeseyo' },
        { phrase: '잘 자요', translation: 'Good night', pronunciation: 'Jal jayo' },
      ],
      essentialWords: [
        { word: '네', translation: 'Yes', pronunciation: 'ne' },
        { word: '아니요', translation: 'No', pronunciation: 'aniyo' },
        { word: '감사합니다', translation: 'Thank you', pronunciation: 'gamsahamnida' },
        { word: '죄송합니다', translation: 'I\'m sorry', pronunciation: 'joesonghamnida' },
        { word: '주세요', translation: 'Please give me', pronunciation: 'juseyo' },
      ],
    },
  },
  {
    code: 'es',
    name: 'Spanish',
    flag: '🇪🇸',
    basics: {
      numbers: [
        { num: '1', word: 'uno', pronunciation: 'OO-no' },
        { num: '2', word: 'dos', pronunciation: 'dohs' },
        { num: '3', word: 'tres', pronunciation: 'trehs' },
        { num: '4', word: 'cuatro', pronunciation: 'KWAH-tro' },
        { num: '5', word: 'cinco', pronunciation: 'SEEN-ko' },
        { num: '6', word: 'seis', pronunciation: 'says' },
        { num: '7', word: 'siete', pronunciation: 'see-EH-tay' },
        { num: '8', word: 'ocho', pronunciation: 'OH-cho' },
        { num: '9', word: 'nueve', pronunciation: 'NWEH-bay' },
        { num: '10', word: 'diez', pronunciation: 'dee-EHS' },
      ],
      greetings: [
        { phrase: 'Buenos días', translation: 'Good morning', pronunciation: 'BWEH-nohs DEE-ahs' },
        { phrase: 'Hola', translation: 'Hello', pronunciation: 'OH-la' },
        { phrase: 'Buenas tardes', translation: 'Good afternoon', pronunciation: 'BWEH-nahs TAR-dehs' },
        { phrase: 'Buenas noches', translation: 'Good night', pronunciation: 'BWEH-nahs NO-chehs' },
        { phrase: 'Adiós', translation: 'Goodbye', pronunciation: 'ah-dee-OHS' },
      ],
      essentialWords: [
        { word: 'Sí', translation: 'Yes', pronunciation: 'see' },
        { word: 'No', translation: 'No', pronunciation: 'no' },
        { word: 'Gracias', translation: 'Thank you', pronunciation: 'GRAH-see-ahs' },
        { word: 'Perdón', translation: 'Excuse me', pronunciation: 'pehr-DOHN' },
        { word: 'Por favor', translation: 'Please', pronunciation: 'por fah-VOR' },
      ],
    },
  },
  {
    code: 'fr',
    name: 'French',
    flag: '🇫🇷',
    basics: {
      numbers: [
        { num: '1', word: 'un', pronunciation: 'uhn' },
        { num: '2', word: 'deux', pronunciation: 'duh' },
        { num: '3', word: 'trois', pronunciation: 'twah' },
        { num: '4', word: 'quatre', pronunciation: 'katr' },
        { num: '5', word: 'cinq', pronunciation: 'sank' },
        { num: '6', word: 'six', pronunciation: 'sees' },
        { num: '7', word: 'sept', pronunciation: 'set' },
        { num: '8', word: 'huit', pronunciation: 'weet' },
        { num: '9', word: 'neuf', pronunciation: 'nuhf' },
        { num: '10', word: 'dix', pronunciation: 'dees' },
      ],
      greetings: [
        { phrase: 'Bonjour', translation: 'Hello/Good day', pronunciation: 'bohn-ZHOOR' },
        { phrase: 'Bonsoir', translation: 'Good evening', pronunciation: 'bohn-SWAHR' },
        { phrase: 'Bonne nuit', translation: 'Good night', pronunciation: 'bun NWEE' },
        { phrase: 'Au revoir', translation: 'Goodbye', pronunciation: 'oh ruh-VWAHR' },
        { phrase: 'Salut', translation: 'Hi/Bye (informal)', pronunciation: 'sah-LOO' },
      ],
      essentialWords: [
        { word: 'Oui', translation: 'Yes', pronunciation: 'wee' },
        { word: 'Non', translation: 'No', pronunciation: 'nohn' },
        { word: 'Merci', translation: 'Thank you', pronunciation: 'mehr-SEE' },
        { word: 'Excusez-moi', translation: 'Excuse me', pronunciation: 'eks-koo-zay-MWAH' },
        { word: 'S\'il vous plaît', translation: 'Please', pronunciation: 'seel voo PLAY' },
      ],
    },
  },
]

export default function LanguageBasics() {
  const { t } = useTranslation()
  const [selectedLanguage, setSelectedLanguage] = useState('ja')
  const [activeTab, setActiveTab] = useState<'greetings' | 'numbers' | 'essentials'>('greetings')

  const language = languages.find(l => l.code === selectedLanguage)

  const tabs = [
    { id: 'greetings', name: t('tools.languageBasics.greetings'), icon: '👋' },
    { id: 'numbers', name: t('tools.languageBasics.numbers'), icon: '🔢' },
    { id: 'essentials', name: t('tools.languageBasics.essentials'), icon: '💬' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.languageBasics.selectLanguage')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => setSelectedLanguage(lang.code)}
              className={`p-3 rounded text-center ${
                selectedLanguage === lang.code
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <div className="text-2xl">{lang.flag}</div>
              <div className="text-sm mt-1">{lang.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <div className="flex gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 py-2 rounded flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {language && (
        <div className="card p-4">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <span className="text-2xl">{language.flag}</span>
            <span>{language.name} - {tabs.find(t => t.id === activeTab)?.name}</span>
          </h3>

          {activeTab === 'greetings' && (
            <div className="space-y-3">
              {language.basics.greetings.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded">
                  <div className="text-xl font-medium">{item.phrase}</div>
                  <div className="text-slate-600">{item.translation}</div>
                  <div className="text-sm text-blue-600 italic">{item.pronunciation}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'numbers' && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {language.basics.numbers.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded text-center">
                  <div className="text-2xl font-bold text-blue-600">{item.num}</div>
                  <div className="text-lg">{item.word}</div>
                  <div className="text-sm text-slate-500">{item.pronunciation}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'essentials' && (
            <div className="space-y-3">
              {language.basics.essentialWords.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded flex items-center justify-between">
                  <div>
                    <div className="text-lg font-medium">{item.word}</div>
                    <div className="text-sm text-blue-600 italic">{item.pronunciation}</div>
                  </div>
                  <div className="text-slate-600">{item.translation}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="card p-4 bg-blue-50">
        <h3 className="font-medium mb-2">{t('tools.languageBasics.tip')}</h3>
        <p className="text-sm text-slate-600">
          {t('tools.languageBasics.tipText')}
        </p>
      </div>
    </div>
  )
}
