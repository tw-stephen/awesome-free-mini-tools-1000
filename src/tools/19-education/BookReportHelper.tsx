import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Character {
  name: string
  description: string
  role: string
}

export default function BookReportHelper() {
  const { t } = useTranslation()
  const [bookInfo, setBookInfo] = useState({
    title: '',
    author: '',
    genre: '',
    pages: '',
    yearPublished: '',
  })
  const [setting, setSetting] = useState({ time: '', place: '' })
  const [characters, setCharacters] = useState<Character[]>([])
  const [plot, setPlot] = useState({
    beginning: '',
    middle: '',
    climax: '',
    end: '',
  })
  const [themes, setThemes] = useState<string[]>([])
  const [newTheme, setNewTheme] = useState('')
  const [personalReflection, setPersonalReflection] = useState({
    opinion: '',
    favoriteQuote: '',
    recommendation: '',
    rating: 0,
  })
  const [newCharacter, setNewCharacter] = useState({ name: '', description: '', role: 'Supporting' })

  const roles = ['Protagonist', 'Antagonist', 'Supporting', 'Minor']

  const addCharacter = () => {
    if (!newCharacter.name.trim()) return
    setCharacters([...characters, newCharacter])
    setNewCharacter({ name: '', description: '', role: 'Supporting' })
  }

  const removeCharacter = (index: number) => {
    setCharacters(characters.filter((_, i) => i !== index))
  }

  const addTheme = () => {
    if (!newTheme.trim() || themes.includes(newTheme)) return
    setThemes([...themes, newTheme])
    setNewTheme('')
  }

  const removeTheme = (index: number) => {
    setThemes(themes.filter((_, i) => i !== index))
  }

  const generateReport = (): string => {
    let report = `BOOK REPORT\n${'='.repeat(50)}\n\n`

    // Book Information
    report += `BOOK INFORMATION\n`
    report += `-`.repeat(20) + '\n'
    report += `Title: ${bookInfo.title || 'N/A'}\n`
    report += `Author: ${bookInfo.author || 'N/A'}\n`
    if (bookInfo.genre) report += `Genre: ${bookInfo.genre}\n`
    if (bookInfo.pages) report += `Pages: ${bookInfo.pages}\n`
    if (bookInfo.yearPublished) report += `Year Published: ${bookInfo.yearPublished}\n`
    report += '\n'

    // Setting
    if (setting.time || setting.place) {
      report += `SETTING\n`
      report += `-`.repeat(20) + '\n'
      if (setting.time) report += `Time: ${setting.time}\n`
      if (setting.place) report += `Place: ${setting.place}\n`
      report += '\n'
    }

    // Characters
    if (characters.length > 0) {
      report += `CHARACTERS\n`
      report += `-`.repeat(20) + '\n'
      characters.forEach(c => {
        report += `• ${c.name} (${c.role})\n`
        if (c.description) report += `  ${c.description}\n`
      })
      report += '\n'
    }

    // Plot Summary
    report += `PLOT SUMMARY\n`
    report += `-`.repeat(20) + '\n'
    if (plot.beginning) report += `Beginning: ${plot.beginning}\n\n`
    if (plot.middle) report += `Middle: ${plot.middle}\n\n`
    if (plot.climax) report += `Climax: ${plot.climax}\n\n`
    if (plot.end) report += `End: ${plot.end}\n\n`

    // Themes
    if (themes.length > 0) {
      report += `THEMES\n`
      report += `-`.repeat(20) + '\n'
      themes.forEach(t => report += `• ${t}\n`)
      report += '\n'
    }

    // Personal Reflection
    report += `PERSONAL REFLECTION\n`
    report += `-`.repeat(20) + '\n'
    if (personalReflection.rating > 0) {
      report += `Rating: ${'★'.repeat(personalReflection.rating)}${'☆'.repeat(5 - personalReflection.rating)}\n`
    }
    if (personalReflection.opinion) report += `Opinion: ${personalReflection.opinion}\n\n`
    if (personalReflection.favoriteQuote) report += `Favorite Quote: "${personalReflection.favoriteQuote}"\n\n`
    if (personalReflection.recommendation) report += `Recommendation: ${personalReflection.recommendation}\n`

    return report
  }

  const copyReport = () => {
    navigator.clipboard.writeText(generateReport())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.bookReportHelper.bookInfo')}</h3>
        <div className="space-y-2">
          <input
            type="text"
            value={bookInfo.title}
            onChange={(e) => setBookInfo({ ...bookInfo, title: e.target.value })}
            placeholder="Book Title"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="text"
            value={bookInfo.author}
            onChange={(e) => setBookInfo({ ...bookInfo, author: e.target.value })}
            placeholder="Author"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              value={bookInfo.genre}
              onChange={(e) => setBookInfo({ ...bookInfo, genre: e.target.value })}
              placeholder="Genre"
              className="px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="text"
              value={bookInfo.pages}
              onChange={(e) => setBookInfo({ ...bookInfo, pages: e.target.value })}
              placeholder="Pages"
              className="px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="text"
              value={bookInfo.yearPublished}
              onChange={(e) => setBookInfo({ ...bookInfo, yearPublished: e.target.value })}
              placeholder="Year"
              className="px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.bookReportHelper.setting')}</h3>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={setting.time}
            onChange={(e) => setSetting({ ...setting, time: e.target.value })}
            placeholder="Time period"
            className="px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="text"
            value={setting.place}
            onChange={(e) => setSetting({ ...setting, place: e.target.value })}
            placeholder="Place/Location"
            className="px-3 py-2 border border-slate-300 rounded"
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.bookReportHelper.characters')} ({characters.length})</h3>
        <div className="space-y-2 mb-3">
          {characters.map((char, i) => (
            <div key={i} className="flex items-start justify-between p-2 bg-slate-50 rounded">
              <div>
                <span className="font-medium">{char.name}</span>
                <span className="text-sm text-slate-500 ml-2">({char.role})</span>
                {char.description && <div className="text-sm text-slate-600">{char.description}</div>}
              </div>
              <button onClick={() => removeCharacter(i)} className="text-red-400 hover:text-red-600">×</button>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-2">
          <input
            type="text"
            value={newCharacter.name}
            onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
            placeholder="Name"
            className="px-2 py-1 border border-slate-300 rounded text-sm"
          />
          <input
            type="text"
            value={newCharacter.description}
            onChange={(e) => setNewCharacter({ ...newCharacter, description: e.target.value })}
            placeholder="Description"
            className="px-2 py-1 border border-slate-300 rounded text-sm"
          />
          <select
            value={newCharacter.role}
            onChange={(e) => setNewCharacter({ ...newCharacter, role: e.target.value })}
            className="px-2 py-1 border border-slate-300 rounded text-sm"
          >
            {roles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <button
            onClick={addCharacter}
            disabled={!newCharacter.name.trim()}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm disabled:bg-slate-300"
          >
            Add
          </button>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.bookReportHelper.plot')}</h3>
        <div className="space-y-2">
          <textarea
            value={plot.beginning}
            onChange={(e) => setPlot({ ...plot, beginning: e.target.value })}
            placeholder="Beginning - How does the story start?"
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none text-sm"
          />
          <textarea
            value={plot.middle}
            onChange={(e) => setPlot({ ...plot, middle: e.target.value })}
            placeholder="Middle - What happens next?"
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none text-sm"
          />
          <textarea
            value={plot.climax}
            onChange={(e) => setPlot({ ...plot, climax: e.target.value })}
            placeholder="Climax - What is the turning point?"
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none text-sm"
          />
          <textarea
            value={plot.end}
            onChange={(e) => setPlot({ ...plot, end: e.target.value })}
            placeholder="End - How does it resolve?"
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none text-sm"
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.bookReportHelper.themes')}</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {themes.map((theme, i) => (
            <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full flex items-center gap-1">
              {theme}
              <button onClick={() => removeTheme(i)} className="text-purple-500 hover:text-purple-700">×</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTheme}
            onChange={(e) => setNewTheme(e.target.value)}
            placeholder="Add a theme (e.g., friendship, courage)"
            className="flex-1 px-3 py-2 border border-slate-300 rounded"
            onKeyPress={(e) => e.key === 'Enter' && addTheme()}
          />
          <button
            onClick={addTheme}
            disabled={!newTheme.trim()}
            className="px-4 py-2 bg-purple-500 text-white rounded disabled:bg-slate-300"
          >
            Add
          </button>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.bookReportHelper.reflection')}</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-slate-500 block mb-1">Your Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setPersonalReflection({ ...personalReflection, rating: star })}
                  className="text-2xl"
                >
                  {star <= personalReflection.rating ? '★' : '☆'}
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={personalReflection.opinion}
            onChange={(e) => setPersonalReflection({ ...personalReflection, opinion: e.target.value })}
            placeholder="What did you think of this book?"
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
          <input
            type="text"
            value={personalReflection.favoriteQuote}
            onChange={(e) => setPersonalReflection({ ...personalReflection, favoriteQuote: e.target.value })}
            placeholder="Favorite quote from the book"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <textarea
            value={personalReflection.recommendation}
            onChange={(e) => setPersonalReflection({ ...personalReflection, recommendation: e.target.value })}
            placeholder="Would you recommend this book? Why or why not?"
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
        </div>
      </div>

      <button
        onClick={copyReport}
        className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600 font-medium"
      >
        {t('tools.bookReportHelper.generate')}
      </button>
    </div>
  )
}
