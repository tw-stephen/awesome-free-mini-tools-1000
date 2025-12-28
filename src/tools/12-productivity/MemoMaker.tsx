import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Memo {
  id: string
  to: string
  from: string
  cc: string
  date: string
  subject: string
  body: string
  urgent: boolean
  confidential: boolean
  createdAt: string
}

export default function MemoMaker() {
  const { t } = useTranslation()
  const [memos, setMemos] = useState<Memo[]>([])
  const [currentMemo, setCurrentMemo] = useState<Memo>({
    id: '',
    to: '',
    from: '',
    cc: '',
    date: new Date().toISOString().split('T')[0],
    subject: '',
    body: '',
    urgent: false,
    confidential: false,
    createdAt: ''
  })
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('memos')
    if (saved) setMemos(JSON.parse(saved))
  }, [])

  const saveMemos = (updated: Memo[]) => {
    setMemos(updated)
    localStorage.setItem('memos', JSON.stringify(updated))
  }

  const saveMemo = () => {
    if (!currentMemo.to || !currentMemo.subject) return
    const memo = {
      ...currentMemo,
      id: currentMemo.id || Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    const exists = memos.find(m => m.id === memo.id)
    if (exists) {
      saveMemos(memos.map(m => m.id === memo.id ? memo : m))
    } else {
      saveMemos([memo, ...memos])
    }
    clearMemo()
  }

  const loadMemo = (memo: Memo) => {
    setCurrentMemo(memo)
  }

  const deleteMemo = (id: string) => {
    saveMemos(memos.filter(m => m.id !== id))
  }

  const clearMemo = () => {
    setCurrentMemo({
      id: '',
      to: '',
      from: '',
      cc: '',
      date: new Date().toISOString().split('T')[0],
      subject: '',
      body: '',
      urgent: false,
      confidential: false,
      createdAt: ''
    })
  }

  const generateMemoText = () => {
    let text = ''
    if (currentMemo.urgent || currentMemo.confidential) {
      text += '═'.repeat(50) + '\n'
      if (currentMemo.urgent) text += '⚠️ URGENT\n'
      if (currentMemo.confidential) text += '🔒 CONFIDENTIAL\n'
      text += '═'.repeat(50) + '\n\n'
    }

    text += `MEMORANDUM\n${'─'.repeat(50)}\n\n`
    text += `TO:      ${currentMemo.to}\n`
    text += `FROM:    ${currentMemo.from}\n`
    if (currentMemo.cc) text += `CC:      ${currentMemo.cc}\n`
    text += `DATE:    ${currentMemo.date}\n`
    text += `SUBJECT: ${currentMemo.subject}\n\n`
    text += '─'.repeat(50) + '\n\n'
    text += currentMemo.body + '\n\n'
    text += '─'.repeat(50)

    return text
  }

  const copyMemo = () => {
    navigator.clipboard.writeText(generateMemoText())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const printMemo = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Memo - ${currentMemo.subject}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 700px; margin: 0 auto; }
            .header { border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; text-align: center; margin-bottom: 20px; }
            .field { margin: 8px 0; }
            .label { font-weight: bold; display: inline-block; width: 80px; }
            .body { margin-top: 20px; white-space: pre-wrap; line-height: 1.6; }
            .urgent { background: #fef3c7; padding: 10px; border: 2px solid #f59e0b; margin-bottom: 20px; text-align: center; font-weight: bold; }
            .confidential { background: #fee2e2; padding: 10px; border: 2px solid #ef4444; margin-bottom: 20px; text-align: center; font-weight: bold; }
          </style>
        </head>
        <body>
          ${currentMemo.urgent ? '<div class="urgent">⚠️ URGENT</div>' : ''}
          ${currentMemo.confidential ? '<div class="confidential">🔒 CONFIDENTIAL</div>' : ''}
          <div class="title">MEMORANDUM</div>
          <div class="header">
            <div class="field"><span class="label">TO:</span> ${currentMemo.to}</div>
            <div class="field"><span class="label">FROM:</span> ${currentMemo.from}</div>
            ${currentMemo.cc ? `<div class="field"><span class="label">CC:</span> ${currentMemo.cc}</div>` : ''}
            <div class="field"><span class="label">DATE:</span> ${currentMemo.date}</div>
            <div class="field"><span class="label">SUBJECT:</span> ${currentMemo.subject}</div>
          </div>
          <div class="body">${currentMemo.body.replace(/\n/g, '<br>')}</div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-slate-500 block mb-1">{t('tools.memoMaker.to')} *</label>
            <input
              type="text"
              value={currentMemo.to}
              onChange={(e) => setCurrentMemo({ ...currentMemo, to: e.target.value })}
              placeholder={t('tools.memoMaker.toPlaceholder')}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">{t('tools.memoMaker.from')}</label>
            <input
              type="text"
              value={currentMemo.from}
              onChange={(e) => setCurrentMemo({ ...currentMemo, from: e.target.value })}
              placeholder={t('tools.memoMaker.fromPlaceholder')}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-slate-500 block mb-1">{t('tools.memoMaker.cc')}</label>
            <input
              type="text"
              value={currentMemo.cc}
              onChange={(e) => setCurrentMemo({ ...currentMemo, cc: e.target.value })}
              placeholder={t('tools.memoMaker.ccPlaceholder')}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">{t('tools.memoMaker.date')}</label>
            <input
              type="date"
              value={currentMemo.date}
              onChange={(e) => setCurrentMemo({ ...currentMemo, date: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-500 block mb-1">{t('tools.memoMaker.subject')} *</label>
          <input
            type="text"
            value={currentMemo.subject}
            onChange={(e) => setCurrentMemo({ ...currentMemo, subject: e.target.value })}
            placeholder={t('tools.memoMaker.subjectPlaceholder')}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>

        <div>
          <label className="text-xs text-slate-500 block mb-1">{t('tools.memoMaker.body')}</label>
          <textarea
            value={currentMemo.body}
            onChange={(e) => setCurrentMemo({ ...currentMemo, body: e.target.value })}
            placeholder={t('tools.memoMaker.bodyPlaceholder')}
            rows={6}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={currentMemo.urgent}
              onChange={(e) => setCurrentMemo({ ...currentMemo, urgent: e.target.checked })}
            />
            <span className="text-sm">⚠️ {t('tools.memoMaker.urgent')}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={currentMemo.confidential}
              onChange={(e) => setCurrentMemo({ ...currentMemo, confidential: e.target.checked })}
            />
            <span className="text-sm">🔒 {t('tools.memoMaker.confidential')}</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={copyMemo}
          disabled={!currentMemo.to || !currentMemo.subject}
          className={`py-2 rounded ${copied ? 'bg-green-500 text-white' : 'bg-slate-100'} disabled:opacity-50`}
        >
          {copied ? '✓' : t('tools.memoMaker.copy')}
        </button>
        <button
          onClick={printMemo}
          disabled={!currentMemo.to || !currentMemo.subject}
          className="py-2 bg-slate-100 rounded disabled:opacity-50"
        >
          {t('tools.memoMaker.print')}
        </button>
        <button
          onClick={saveMemo}
          disabled={!currentMemo.to || !currentMemo.subject}
          className="py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {t('tools.memoMaker.save')}
        </button>
      </div>

      <button
        onClick={clearMemo}
        className="w-full py-2 bg-slate-100 rounded text-sm"
      >
        {t('tools.memoMaker.clear')}
      </button>

      {memos.length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium text-slate-700 mb-3">{t('tools.memoMaker.savedMemos')}</h3>
          <div className="space-y-2">
            {memos.map(memo => (
              <div key={memo.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <div className="flex-1 cursor-pointer" onClick={() => loadMemo(memo)}>
                  <div className="flex items-center gap-2">
                    {memo.urgent && <span>⚠️</span>}
                    {memo.confidential && <span>🔒</span>}
                    <span className="font-medium text-sm">{memo.subject}</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    {t('tools.memoMaker.to')}: {memo.to} • {memo.date}
                  </div>
                </div>
                <button
                  onClick={() => deleteMemo(memo.id)}
                  className="text-red-500 ml-2"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
