export interface FaqEntry {
  question: string
  answer: string
}

export interface FaqContent {
  title: string
  intro: string
  items: FaqEntry[]
}

const FAQ_BY_LANGUAGE: Record<string, FaqContent> = {
  'zh-TW': {
    title: '常見問題',
    intro: '快速了解這個工具站如何運作，以及哪些內容最適合搜尋引擎與 AI 抓取。',
    items: [
      {
        question: 'Awesome Free Mini Tools 1000 是什麼？',
        answer:
          'Awesome Free Mini Tools 1000 是一個前端純本地執行的工具集合，提供文字處理、圖片處理、資料轉換、開發工具與生活工具等功能。大部分工具不需要註冊或上傳資料到伺服器。',
      },
      {
        question: '這些工具需要安裝或登入嗎？',
        answer:
          '不需要。這個站點以瀏覽器直接執行為主，常見任務可在本機完成，降低等待時間並保留資料隱私。',
      },
      {
        question: '哪些工具類型最適合在這裡找到？',
        answer:
          '你可以找到文字整理、編碼轉換、圖表產生、圖片編修、JSON 與 CSV 工具、密碼與開發輔助工具，以及其他適合日常工作流程的前端小工具。',
      },
    ],
  },
  en: {
    title: 'Frequently Asked Questions',
    intro: 'Quick answers about how the site works and what search engines or AI crawlers can reliably understand here.',
    items: [
      {
        question: 'What is Awesome Free Mini Tools 1000?',
        answer:
          'Awesome Free Mini Tools 1000 is a browser-first collection of utilities for text processing, image work, data conversion, developer workflows, and everyday tasks. Most tools run locally in the browser without sign-up or required server uploads.',
      },
      {
        question: 'Do these tools require installation or login?',
        answer:
          'No. The site is designed for direct in-browser use so common tasks can stay fast and private on the user device.',
      },
      {
        question: 'What kinds of tools can I find here?',
        answer:
          'The collection includes text utilities, encoding and conversion tools, chart generators, image editing helpers, JSON and CSV tools, password and developer helpers, plus many other frontend-only mini tools.',
      },
    ],
  },
}

export const getFaqContent = (language?: string): FaqContent => {
  if (!language) return FAQ_BY_LANGUAGE.en
  if (language.toLowerCase().startsWith('zh')) return FAQ_BY_LANGUAGE['zh-TW']
  return FAQ_BY_LANGUAGE.en
}

