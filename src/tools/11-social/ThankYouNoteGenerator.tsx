import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type Occasion = 'gift' | 'interview' | 'hospitality' | 'help' | 'wedding' | 'business' | 'teacher' | 'general'
type Tone = 'formal' | 'casual' | 'heartfelt' | 'professional'

export default function ThankYouNoteGenerator() {
  const { t } = useTranslation()
  const [occasion, setOccasion] = useState<Occasion>('general')
  const [tone, setTone] = useState<Tone>('casual')
  const [recipientName, setRecipientName] = useState('')
  const [senderName, setSenderName] = useState('')
  const [specificDetail, setSpecificDetail] = useState('')
  const [generatedNote, setGeneratedNote] = useState('')
  const [copied, setCopied] = useState(false)

  const templates: Record<Occasion, Record<Tone, string[]>> = {
    gift: {
      formal: [
        'Dear {recipient},\n\nI am writing to express my sincere gratitude for {detail}. Your thoughtfulness means a great deal to me.\n\nWith appreciation,\n{sender}',
        'Dear {recipient},\n\nThank you so much for {detail}. I truly appreciate your kind gesture and thoughtfulness.\n\nSincerely,\n{sender}'
      ],
      casual: [
        'Hey {recipient}!\n\nThank you so much for {detail}! I absolutely love it and can\'t wait to use it.\n\nYou\'re the best!\n{sender}',
        'Hi {recipient}!\n\nOMG, thank you for {detail}! It\'s perfect and you really didn\'t have to. But I\'m so glad you did!\n\nXoxo,\n{sender}'
      ],
      heartfelt: [
        'Dear {recipient},\n\nWords cannot express how touched I am by {detail}. It\'s clear you put so much thought into it, and that means the world to me.\n\nWith all my love,\n{sender}',
        'Dearest {recipient},\n\nReceiving {detail} brought tears to my eyes. Your kindness and generosity never cease to amaze me.\n\nForever grateful,\n{sender}'
      ],
      professional: [
        'Dear {recipient},\n\nThank you for {detail}. Your generosity is greatly appreciated.\n\nBest regards,\n{sender}',
        'Dear {recipient},\n\nI wanted to take a moment to thank you for {detail}. It was very thoughtful of you.\n\nKind regards,\n{sender}'
      ]
    },
    interview: {
      formal: [
        'Dear {recipient},\n\nThank you for taking the time to meet with me today regarding {detail}. I am very excited about the opportunity and look forward to hearing from you.\n\nSincerely,\n{sender}',
        'Dear {recipient},\n\nI appreciate the opportunity to discuss {detail} with you. After our conversation, I am even more enthusiastic about the position.\n\nBest regards,\n{sender}'
      ],
      casual: [
        'Hi {recipient},\n\nThanks so much for chatting with me about {detail}! I really enjoyed our conversation and learning more about the team.\n\nLooking forward to next steps!\n{sender}',
        'Hey {recipient}!\n\nJust wanted to say thanks for meeting with me! I\'m really excited about {detail} and hope to join the team soon.\n\nCheers,\n{sender}'
      ],
      heartfelt: [
        'Dear {recipient},\n\nI am deeply grateful for the opportunity to interview for {detail}. Our conversation confirmed that this is exactly where I want to be.\n\nWith sincere appreciation,\n{sender}',
        'Dear {recipient},\n\nThank you for the wonderful interview experience. Speaking with you about {detail} was truly inspiring.\n\nWarmly,\n{sender}'
      ],
      professional: [
        'Dear {recipient},\n\nThank you for the interview regarding {detail}. I am confident that my skills and experience align well with the position requirements.\n\nProfessionally yours,\n{sender}',
        'Dear {recipient},\n\nI wanted to express my gratitude for the interview opportunity for {detail}. I look forward to contributing to your team\'s success.\n\nBest regards,\n{sender}'
      ]
    },
    hospitality: {
      formal: [
        'Dear {recipient},\n\nThank you for your gracious hospitality during {detail}. Your warmth and generosity made my stay truly memorable.\n\nWith gratitude,\n{sender}',
        'Dear {recipient},\n\nI am writing to express my appreciation for {detail}. Your kindness in hosting me was exceptional.\n\nSincerely,\n{sender}'
      ],
      casual: [
        'Hey {recipient}!\n\nThanks for having me over for {detail}! I had such a great time and your hospitality was amazing.\n\nLet\'s do it again soon!\n{sender}',
        'Hi {recipient}!\n\nJust wanted to say thanks for {detail}! You\'re such an awesome host and I had a blast.\n\nUntil next time,\n{sender}'
      ],
      heartfelt: [
        'Dear {recipient},\n\nYour hospitality during {detail} touched my heart deeply. You went above and beyond to make me feel welcome and at home.\n\nForever grateful,\n{sender}',
        'Dearest {recipient},\n\nI cannot thank you enough for {detail}. Your kindness and warmth will stay with me always.\n\nWith love,\n{sender}'
      ],
      professional: [
        'Dear {recipient},\n\nThank you for your hospitality during {detail}. Your attention to detail and warm welcome were much appreciated.\n\nBest regards,\n{sender}',
        'Dear {recipient},\n\nI wanted to express my gratitude for {detail}. Your professionalism and hospitality made the experience exceptional.\n\nKind regards,\n{sender}'
      ]
    },
    help: {
      formal: [
        'Dear {recipient},\n\nI am truly grateful for your assistance with {detail}. Your help made a significant difference.\n\nWith sincere thanks,\n{sender}',
        'Dear {recipient},\n\nThank you for taking the time to help me with {detail}. I deeply appreciate your support.\n\nSincerely,\n{sender}'
      ],
      casual: [
        'Hey {recipient}!\n\nYou\'re a lifesaver! Thanks so much for helping me with {detail}. I seriously couldn\'t have done it without you.\n\nYou rock!\n{sender}',
        'Hi {recipient}!\n\nThank you, thank you, thank you for {detail}! You\'re the best friend/person ever!\n\nOwes you one,\n{sender}'
      ],
      heartfelt: [
        'Dear {recipient},\n\nYour willingness to help me with {detail} means more than I can express. You are a true blessing in my life.\n\nWith deepest gratitude,\n{sender}',
        'Dearest {recipient},\n\nI am overwhelmed by your generosity in helping with {detail}. Your kindness restores my faith in humanity.\n\nForever thankful,\n{sender}'
      ],
      professional: [
        'Dear {recipient},\n\nThank you for your valuable assistance with {detail}. Your expertise and support were instrumental to our success.\n\nBest regards,\n{sender}',
        'Dear {recipient},\n\nI wanted to formally thank you for your help with {detail}. Your contribution is greatly appreciated.\n\nProfessionally yours,\n{sender}'
      ]
    },
    wedding: {
      formal: [
        'Dear {recipient},\n\nThank you for celebrating our special day with us and for {detail}. Your presence and generosity meant so much.\n\nWith love and gratitude,\n{sender}',
        'Dear {recipient},\n\nWe are deeply grateful for {detail} and for sharing in our joy. Thank you for being part of our wedding celebration.\n\nWith heartfelt thanks,\n{sender}'
      ],
      casual: [
        'Hey {recipient}!\n\nThank you so much for {detail} and for celebrating with us! We had such a blast and are so grateful you were there.\n\nLove,\n{sender}',
        'Hi {recipient}!\n\nWe\'re still on cloud nine from the wedding! Thanks for {detail} - you really didn\'t have to but we love it!\n\nXoxo,\n{sender}'
      ],
      heartfelt: [
        'Dear {recipient},\n\nAs we begin our journey together, we are filled with gratitude for your love, support, and {detail}. You have touched our hearts deeply.\n\nWith all our love,\n{sender}',
        'Dearest {recipient},\n\nThank you from the bottom of our hearts for {detail}. Having you at our wedding made it even more special.\n\nForever grateful,\n{sender}'
      ],
      professional: [
        'Dear {recipient},\n\nThank you for attending our wedding and for {detail}. We truly appreciate your thoughtfulness.\n\nWarm regards,\n{sender}',
        'Dear {recipient},\n\nWe wanted to express our gratitude for {detail}. Thank you for celebrating this milestone with us.\n\nBest wishes,\n{sender}'
      ]
    },
    business: {
      formal: [
        'Dear {recipient},\n\nThank you for {detail}. We truly value our business relationship and look forward to continued collaboration.\n\nSincerely,\n{sender}',
        'Dear {recipient},\n\nI wanted to express my appreciation for {detail}. Your partnership means a great deal to our organization.\n\nWith regards,\n{sender}'
      ],
      casual: [
        'Hi {recipient}!\n\nJust wanted to drop a quick note to say thanks for {detail}. It\'s great working with you!\n\nCheers,\n{sender}',
        'Hey {recipient}!\n\nThanks for {detail}! Really appreciate you and looking forward to more great work together.\n\nBest,\n{sender}'
      ],
      heartfelt: [
        'Dear {recipient},\n\nI am genuinely grateful for {detail}. Working with you has been a privilege and I value our relationship beyond business.\n\nWith sincere appreciation,\n{sender}',
        'Dear {recipient},\n\nThank you for {detail}. Your trust and support have been instrumental to our success.\n\nWith heartfelt thanks,\n{sender}'
      ],
      professional: [
        'Dear {recipient},\n\nThank you for {detail}. We appreciate your continued business and look forward to serving you in the future.\n\nBest regards,\n{sender}',
        'Dear {recipient},\n\nI wanted to formally thank you for {detail}. Your partnership is highly valued.\n\nProfessionally yours,\n{sender}'
      ]
    },
    teacher: {
      formal: [
        'Dear {recipient},\n\nThank you for {detail}. Your dedication to education has made a lasting impact on my learning journey.\n\nWith respect and gratitude,\n{sender}',
        'Dear {recipient},\n\nI am grateful for {detail}. Your commitment to teaching excellence has inspired me greatly.\n\nSincerely,\n{sender}'
      ],
      casual: [
        'Hi {recipient}!\n\nThank you for {detail}! You\'re seriously the best teacher ever and I\'ve learned so much from you.\n\nYour biggest fan,\n{sender}',
        'Hey {recipient}!\n\nJust wanted to say thanks for {detail}! You made class actually fun and interesting.\n\nGratefully,\n{sender}'
      ],
      heartfelt: [
        'Dear {recipient},\n\nWords cannot express how grateful I am for {detail}. You have shaped who I am today, and I will carry your lessons forever.\n\nWith deepest appreciation,\n{sender}',
        'Dearest {recipient},\n\nThank you for {detail}. You saw potential in me when I couldn\'t see it myself. I am forever changed because of your guidance.\n\nWith love and respect,\n{sender}'
      ],
      professional: [
        'Dear {recipient},\n\nThank you for {detail}. Your professional approach to education has been exemplary.\n\nWith respect,\n{sender}',
        'Dear {recipient},\n\nI wanted to express my appreciation for {detail}. Your expertise and dedication are truly admirable.\n\nBest regards,\n{sender}'
      ]
    },
    general: {
      formal: [
        'Dear {recipient},\n\nThank you for {detail}. Your kindness is deeply appreciated.\n\nWith gratitude,\n{sender}',
        'Dear {recipient},\n\nI wanted to express my sincere thanks for {detail}. It meant more to me than you know.\n\nSincerely,\n{sender}'
      ],
      casual: [
        'Hey {recipient}!\n\nThanks so much for {detail}! You\'re awesome!\n\nCheers,\n{sender}',
        'Hi {recipient}!\n\nJust a quick note to say thank you for {detail}! Really appreciate it!\n\nBest,\n{sender}'
      ],
      heartfelt: [
        'Dear {recipient},\n\nFrom the bottom of my heart, thank you for {detail}. Your kindness has touched my soul.\n\nForever grateful,\n{sender}',
        'Dearest {recipient},\n\nI am overwhelmed with gratitude for {detail}. You are a beautiful person inside and out.\n\nWith love,\n{sender}'
      ],
      professional: [
        'Dear {recipient},\n\nThank you for {detail}. Your assistance is greatly appreciated.\n\nBest regards,\n{sender}',
        'Dear {recipient},\n\nI wanted to formally express my thanks for {detail}.\n\nKind regards,\n{sender}'
      ]
    }
  }

  const generate = () => {
    const occasionTemplates = templates[occasion][tone]
    const template = occasionTemplates[Math.floor(Math.random() * occasionTemplates.length)]

    const note = template
      .replace(/{recipient}/g, recipientName || 'Friend')
      .replace(/{sender}/g, senderName || 'Your Name')
      .replace(/{detail}/g, specificDetail || 'your kindness')

    setGeneratedNote(note)
  }

  const copy = () => {
    navigator.clipboard.writeText(generatedNote)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.thankYouNoteGenerator.occasion')}
        </label>
        <div className="flex flex-wrap gap-2">
          {(['gift', 'interview', 'hospitality', 'help', 'wedding', 'business', 'teacher', 'general'] as const).map(o => (
            <button
              key={o}
              onClick={() => setOccasion(o)}
              className={`px-3 py-1.5 rounded text-sm capitalize ${
                occasion === o ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {t(`tools.thankYouNoteGenerator.occasion${o.charAt(0).toUpperCase() + o.slice(1)}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.thankYouNoteGenerator.tone')}
        </label>
        <div className="flex flex-wrap gap-2">
          {(['formal', 'casual', 'heartfelt', 'professional'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTone(t)}
              className={`px-3 py-1.5 rounded text-sm capitalize ${
                tone === t ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.thankYouNoteGenerator.recipient')}
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="John"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.thankYouNoteGenerator.sender')}
            </label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Your Name"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-1">
            {t('tools.thankYouNoteGenerator.detail')}
          </label>
          <input
            type="text"
            value={specificDetail}
            onChange={(e) => setSpecificDetail(e.target.value)}
            placeholder={t('tools.thankYouNoteGenerator.detailPlaceholder')}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>
      </div>

      <button
        onClick={generate}
        className="w-full py-3 bg-blue-500 text-white rounded font-medium"
      >
        {t('tools.thankYouNoteGenerator.generate')}
      </button>

      {generatedNote && (
        <div className="card p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">{t('tools.thankYouNoteGenerator.result')}</h3>
            <button
              onClick={copy}
              className="text-sm text-blue-500"
            >
              {copied ? t('tools.thankYouNoteGenerator.copied') : t('tools.thankYouNoteGenerator.copy')}
            </button>
          </div>
          <div className="bg-slate-50 p-4 rounded whitespace-pre-line">
            {generatedNote}
          </div>
          <button
            onClick={generate}
            className="mt-3 w-full py-2 bg-slate-100 rounded text-sm"
          >
            {t('tools.thankYouNoteGenerator.tryAnother')}
          </button>
        </div>
      )}
    </div>
  )
}
