import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Phrase {
  id: string
  english: string
  translations: Record<string, string>
  category: string
  pronunciation?: Record<string, string>
}

const phrases: Phrase[] = [
  // Greetings
  { id: '1', english: 'Hello', category: 'greetings', translations: { ja: 'こんにちは', zh: '你好', ko: '안녕하세요', fr: 'Bonjour', es: 'Hola', de: 'Hallo', th: 'สวัสดี' }, pronunciation: { ja: 'Konnichiwa', zh: 'Nǐ hǎo', ko: 'Annyeonghaseyo', th: 'Sawadee' } },
  { id: '2', english: 'Goodbye', category: 'greetings', translations: { ja: 'さようなら', zh: '再見', ko: '안녕히 가세요', fr: 'Au revoir', es: 'Adiós', de: 'Auf Wiedersehen', th: 'ลาก่อน' }, pronunciation: { ja: 'Sayounara', zh: 'Zàijiàn', ko: 'Annyeonghi gaseyo', th: 'La gon' } },
  { id: '3', english: 'Thank you', category: 'greetings', translations: { ja: 'ありがとう', zh: '謝謝', ko: '감사합니다', fr: 'Merci', es: 'Gracias', de: 'Danke', th: 'ขอบคุณ' }, pronunciation: { ja: 'Arigatou', zh: 'Xièxiè', ko: 'Gamsahamnida', th: 'Khob khun' } },
  { id: '4', english: 'Please', category: 'greetings', translations: { ja: 'お願いします', zh: '請', ko: '제발', fr: 'S\'il vous plaît', es: 'Por favor', de: 'Bitte', th: 'กรุณา' }, pronunciation: { ja: 'Onegaishimasu', zh: 'Qǐng', ko: 'Jebal' } },
  { id: '5', english: 'Excuse me', category: 'greetings', translations: { ja: 'すみません', zh: '不好意思', ko: '실례합니다', fr: 'Excusez-moi', es: 'Disculpe', de: 'Entschuldigung', th: 'ขอโทษ' }, pronunciation: { ja: 'Sumimasen', zh: 'Bù hǎo yìsi', ko: 'Sillyehamnida' } },
  { id: '6', english: 'Sorry', category: 'greetings', translations: { ja: 'ごめんなさい', zh: '對不起', ko: '미안합니다', fr: 'Désolé', es: 'Lo siento', de: 'Es tut mir leid', th: 'ขอโทษ' }, pronunciation: { ja: 'Gomen nasai', zh: 'Duìbùqǐ', ko: 'Mianhamnida' } },
  { id: '7', english: 'Yes', category: 'greetings', translations: { ja: 'はい', zh: '是', ko: '네', fr: 'Oui', es: 'Sí', de: 'Ja', th: 'ใช่' }, pronunciation: { ja: 'Hai', zh: 'Shì', ko: 'Ne', th: 'Chai' } },
  { id: '8', english: 'No', category: 'greetings', translations: { ja: 'いいえ', zh: '不是', ko: '아니요', fr: 'Non', es: 'No', de: 'Nein', th: 'ไม่' }, pronunciation: { ja: 'Iie', zh: 'Bùshì', ko: 'Aniyo', th: 'Mai' } },

  // Directions
  { id: '9', english: 'Where is...?', category: 'directions', translations: { ja: '...はどこですか?', zh: '...在哪裡?', ko: '...어디에 있어요?', fr: 'Où est...?', es: '¿Dónde está...?', de: 'Wo ist...?', th: '...อยู่ที่ไหน?' } },
  { id: '10', english: 'Left', category: 'directions', translations: { ja: '左', zh: '左', ko: '왼쪽', fr: 'Gauche', es: 'Izquierda', de: 'Links', th: 'ซ้าย' }, pronunciation: { ja: 'Hidari', zh: 'Zuǒ', ko: 'Oenjjok' } },
  { id: '11', english: 'Right', category: 'directions', translations: { ja: '右', zh: '右', ko: '오른쪽', fr: 'Droite', es: 'Derecha', de: 'Rechts', th: 'ขวา' }, pronunciation: { ja: 'Migi', zh: 'Yòu', ko: 'Oreunjjok' } },
  { id: '12', english: 'Straight ahead', category: 'directions', translations: { ja: 'まっすぐ', zh: '直走', ko: '직진', fr: 'Tout droit', es: 'Recto', de: 'Geradeaus', th: 'ตรงไป' }, pronunciation: { ja: 'Massugu', zh: 'Zhí zǒu', ko: 'Jikjin' } },

  // Food
  { id: '13', english: 'I would like...', category: 'food', translations: { ja: '...をください', zh: '我要...', ko: '...주세요', fr: 'Je voudrais...', es: 'Quisiera...', de: 'Ich möchte...', th: 'ฉันต้องการ...' } },
  { id: '14', english: 'Water', category: 'food', translations: { ja: '水', zh: '水', ko: '물', fr: 'Eau', es: 'Agua', de: 'Wasser', th: 'น้ำ' }, pronunciation: { ja: 'Mizu', zh: 'Shuǐ', ko: 'Mul' } },
  { id: '15', english: 'The bill please', category: 'food', translations: { ja: 'お会計お願いします', zh: '買單', ko: '계산서 주세요', fr: 'L\'addition s\'il vous plaît', es: 'La cuenta por favor', de: 'Die Rechnung bitte', th: 'เช็คบิลด้วย' } },
  { id: '16', english: 'Delicious', category: 'food', translations: { ja: 'おいしい', zh: '好吃', ko: '맛있어요', fr: 'Délicieux', es: 'Delicioso', de: 'Lecker', th: 'อร่อย' }, pronunciation: { ja: 'Oishii', zh: 'Hǎo chī', ko: 'Masisseoyo' } },

  // Emergency
  { id: '17', english: 'Help!', category: 'emergency', translations: { ja: '助けて!', zh: '救命!', ko: '도와주세요!', fr: 'Au secours!', es: '¡Ayuda!', de: 'Hilfe!', th: 'ช่วยด้วย!' }, pronunciation: { ja: 'Tasukete', zh: 'Jiùmìng', ko: 'Dowajuseyo' } },
  { id: '18', english: 'I need a doctor', category: 'emergency', translations: { ja: '医者が必要です', zh: '我需要看醫生', ko: '의사가 필요해요', fr: 'J\'ai besoin d\'un médecin', es: 'Necesito un médico', de: 'Ich brauche einen Arzt', th: 'ฉันต้องการหมอ' } },
  { id: '19', english: 'Hospital', category: 'emergency', translations: { ja: '病院', zh: '醫院', ko: '병원', fr: 'Hôpital', es: 'Hospital', de: 'Krankenhaus', th: 'โรงพยาบาล' }, pronunciation: { ja: 'Byouin', zh: 'Yīyuàn', ko: 'Byeongwon' } },
  { id: '20', english: 'Police', category: 'emergency', translations: { ja: '警察', zh: '警察', ko: '경찰', fr: 'Police', es: 'Policía', de: 'Polizei', th: 'ตำรวจ' }, pronunciation: { ja: 'Keisatsu', zh: 'Jǐngchá', ko: 'Gyeongchal' } },

  // Shopping
  { id: '21', english: 'How much?', category: 'shopping', translations: { ja: 'いくらですか?', zh: '多少錢?', ko: '얼마예요?', fr: 'Combien?', es: '¿Cuánto cuesta?', de: 'Wie viel?', th: 'เท่าไหร่?' }, pronunciation: { ja: 'Ikura desu ka', zh: 'Duōshao qián', ko: 'Eolmayeyo' } },
  { id: '22', english: 'Too expensive', category: 'shopping', translations: { ja: '高すぎます', zh: '太貴了', ko: '너무 비싸요', fr: 'Trop cher', es: 'Demasiado caro', de: 'Zu teuer', th: 'แพงไป' }, pronunciation: { ja: 'Takasugimasu', zh: 'Tài guì le', ko: 'Neomu bissayo' } },

  // Transportation
  { id: '23', english: 'Train station', category: 'transport', translations: { ja: '駅', zh: '火車站', ko: '기차역', fr: 'Gare', es: 'Estación de tren', de: 'Bahnhof', th: 'สถานีรถไฟ' }, pronunciation: { ja: 'Eki', zh: 'Huǒchē zhàn', ko: 'Gichayeok' } },
  { id: '24', english: 'Airport', category: 'transport', translations: { ja: '空港', zh: '機場', ko: '공항', fr: 'Aéroport', es: 'Aeropuerto', de: 'Flughafen', th: 'สนามบิน' }, pronunciation: { ja: 'Kuukou', zh: 'Jīchǎng', ko: 'Gonghang' } },
  { id: '25', english: 'Taxi', category: 'transport', translations: { ja: 'タクシー', zh: '計程車', ko: '택시', fr: 'Taxi', es: 'Taxi', de: 'Taxi', th: 'แท็กซี่' }, pronunciation: { ja: 'Takushii', zh: 'Jìchéng chē', ko: 'Taeksi' } },
]

const languages = [
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'th', name: 'Thai', flag: '🇹🇭' },
]

const categories = [
  { id: 'greetings', name: 'Greetings', icon: '👋' },
  { id: 'directions', name: 'Directions', icon: '🧭' },
  { id: 'food', name: 'Food & Dining', icon: '🍽️' },
  { id: 'emergency', name: 'Emergency', icon: '🚨' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️' },
  { id: 'transport', name: 'Transportation', icon: '🚇' },
]

export default function TravelPhrasebook() {
  const { t } = useTranslation()
  const [selectedLanguage, setSelectedLanguage] = useState('ja')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const filteredPhrases = phrases.filter(phrase => {
    const matchesCategory = selectedCategory === 'all' || phrase.category === selectedCategory
    const matchesSearch = searchTerm === '' ||
      phrase.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phrase.translations[selectedLanguage]?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(id)) {
      newFavorites.delete(id)
    } else {
      newFavorites.add(id)
    }
    setFavorites(newFavorites)
  }

  const selectedLang = languages.find(l => l.code === selectedLanguage)

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.travelPhrasebook.selectLanguage')}</h3>
        <div className="flex flex-wrap gap-2">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => setSelectedLanguage(lang.code)}
              className={`px-3 py-2 rounded flex items-center gap-2 ${
                selectedLanguage === lang.code ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder={t('tools.travelPhrasebook.searchPhrases')}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.travelPhrasebook.categories')}</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedCategory === 'all' ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                selectedCategory === cat.id ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {favorites.size > 0 && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.travelPhrasebook.favorites')}</h3>
          <div className="space-y-2">
            {phrases.filter(p => favorites.has(p.id)).map(phrase => (
              <div key={phrase.id} className="p-3 bg-yellow-50 rounded border border-yellow-200">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{phrase.english}</div>
                    <div className="text-lg mt-1">{phrase.translations[selectedLanguage]}</div>
                    {phrase.pronunciation?.[selectedLanguage] && (
                      <div className="text-sm text-slate-500 italic">
                        {phrase.pronunciation[selectedLanguage]}
                      </div>
                    )}
                  </div>
                  <button onClick={() => toggleFavorite(phrase.id)} className="text-yellow-500">
                    ★
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="font-medium mb-3">
          {t('tools.travelPhrasebook.phrases')} ({filteredPhrases.length})
        </h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredPhrases.map(phrase => {
            const cat = categories.find(c => c.id === phrase.category)
            return (
              <div key={phrase.id} className="p-3 bg-slate-50 rounded">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{cat?.icon}</span>
                      <span className="font-medium">{phrase.english}</span>
                    </div>
                    <div className="text-lg mt-1 flex items-center gap-2">
                      <span>{selectedLang?.flag}</span>
                      <span>{phrase.translations[selectedLanguage]}</span>
                    </div>
                    {phrase.pronunciation?.[selectedLanguage] && (
                      <div className="text-sm text-slate-500 italic mt-1">
                        Pronunciation: {phrase.pronunciation[selectedLanguage]}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => toggleFavorite(phrase.id)}
                    className={favorites.has(phrase.id) ? 'text-yellow-500' : 'text-slate-300'}
                  >
                    ★
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
