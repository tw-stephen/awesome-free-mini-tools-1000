import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Item {
  id: string
  text: string
  weight: number
}

interface Decision {
  id: string
  title: string
  pros: Item[]
  cons: Item[]
  createdAt: string
}

export default function ProConsList() {
  const { t } = useTranslation()
  const [decisions, setDecisions] = useState<Decision[]>([])
  const [currentDecision, setCurrentDecision] = useState<Decision | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [newPro, setNewPro] = useState('')
  const [newCon, setNewCon] = useState('')
  const [proWeight, setProWeight] = useState(1)
  const [conWeight, setConWeight] = useState(1)

  useEffect(() => {
    const saved = localStorage.getItem('pros-cons-lists')
    if (saved) {
      const data = JSON.parse(saved)
      setDecisions(data)
      if (data.length > 0) setCurrentDecision(data[0])
    }
  }, [])

  const saveDecisions = (updated: Decision[]) => {
    setDecisions(updated)
    localStorage.setItem('pros-cons-lists', JSON.stringify(updated))
  }

  const createNewDecision = () => {
    if (!newTitle.trim()) return
    const decision: Decision = {
      id: Date.now().toString(),
      title: newTitle,
      pros: [],
      cons: [],
      createdAt: new Date().toISOString()
    }
    const updated = [decision, ...decisions]
    saveDecisions(updated)
    setCurrentDecision(decision)
    setNewTitle('')
  }

  const addPro = () => {
    if (!currentDecision || !newPro.trim()) return
    const item: Item = { id: Date.now().toString(), text: newPro, weight: proWeight }
    const updated = decisions.map(d => {
      if (d.id === currentDecision.id) {
        return { ...d, pros: [...d.pros, item] }
      }
      return d
    })
    saveDecisions(updated)
    setCurrentDecision(updated.find(d => d.id === currentDecision.id) || null)
    setNewPro('')
    setProWeight(1)
  }

  const addCon = () => {
    if (!currentDecision || !newCon.trim()) return
    const item: Item = { id: Date.now().toString(), text: newCon, weight: conWeight }
    const updated = decisions.map(d => {
      if (d.id === currentDecision.id) {
        return { ...d, cons: [...d.cons, item] }
      }
      return d
    })
    saveDecisions(updated)
    setCurrentDecision(updated.find(d => d.id === currentDecision.id) || null)
    setNewCon('')
    setConWeight(1)
  }

  const removeItem = (type: 'pros' | 'cons', itemId: string) => {
    if (!currentDecision) return
    const updated = decisions.map(d => {
      if (d.id === currentDecision.id) {
        return { ...d, [type]: d[type].filter(i => i.id !== itemId) }
      }
      return d
    })
    saveDecisions(updated)
    setCurrentDecision(updated.find(d => d.id === currentDecision.id) || null)
  }

  const deleteDecision = (id: string) => {
    const updated = decisions.filter(d => d.id !== id)
    saveDecisions(updated)
    setCurrentDecision(updated.length > 0 ? updated[0] : null)
  }

  const getScore = () => {
    if (!currentDecision) return { pros: 0, cons: 0, verdict: 'neutral' }
    const prosScore = currentDecision.pros.reduce((sum, p) => sum + p.weight, 0)
    const consScore = currentDecision.cons.reduce((sum, c) => sum + c.weight, 0)
    const verdict = prosScore > consScore ? 'positive' : prosScore < consScore ? 'negative' : 'neutral'
    return { pros: prosScore, cons: consScore, verdict }
  }

  const score = getScore()

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder={t('tools.proConsList.newDecision')}
            className="flex-1 px-3 py-2 border border-slate-300 rounded"
          />
          <button
            onClick={createNewDecision}
            disabled={!newTitle.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {t('tools.proConsList.create')}
          </button>
        </div>

        {decisions.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {decisions.map(d => (
              <button
                key={d.id}
                onClick={() => setCurrentDecision(d)}
                className={`px-3 py-1 rounded text-sm ${
                  currentDecision?.id === d.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 hover:bg-slate-200'
                }`}
              >
                {d.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {currentDecision && (
        <>
          <div className="card p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-bold text-lg">{currentDecision.title}</h2>
              <button
                onClick={() => deleteDecision(currentDecision.id)}
                className="text-red-500 text-sm"
              >
                {t('tools.proConsList.delete')}
              </button>
            </div>

            <div className={`p-3 rounded text-center ${
              score.verdict === 'positive' ? 'bg-green-100' :
              score.verdict === 'negative' ? 'bg-red-100' : 'bg-slate-100'
            }`}>
              <div className="text-sm text-slate-600">{t('tools.proConsList.verdict')}</div>
              <div className="text-xl font-bold">
                {score.verdict === 'positive' && t('tools.proConsList.doIt')}
                {score.verdict === 'negative' && t('tools.proConsList.dontDoIt')}
                {score.verdict === 'neutral' && t('tools.proConsList.undecided')}
              </div>
              <div className="text-sm text-slate-500 mt-1">
                {t('tools.proConsList.prosScore')}: {score.pros} | {t('tools.proConsList.consScore')}: {score.cons}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="card p-4 bg-green-50">
              <h3 className="font-medium text-green-700 mb-3">{t('tools.proConsList.pros')}</h3>

              <div className="space-y-2 mb-3">
                {currentDecision.pros.map(pro => (
                  <div key={pro.id} className="flex items-center gap-2 p-2 bg-white rounded">
                    <span className="flex-1 text-sm">{pro.text}</span>
                    <span className="text-xs text-slate-500">+{pro.weight}</span>
                    <button
                      onClick={() => removeItem('pros', pro.id)}
                      className="text-red-500 text-xs"
                    >
                      x
                    </button>
                  </div>
                ))}
                {currentDecision.pros.length === 0 && (
                  <div className="text-sm text-slate-400 text-center py-2">
                    {t('tools.proConsList.noPros')}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPro}
                  onChange={(e) => setNewPro(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addPro()}
                  placeholder={t('tools.proConsList.addPro')}
                  className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm"
                />
                <select
                  value={proWeight}
                  onChange={(e) => setProWeight(parseInt(e.target.value))}
                  className="w-14 px-1 py-1 border border-slate-300 rounded text-sm"
                >
                  {[1, 2, 3, 4, 5].map(w => (
                    <option key={w} value={w}>+{w}</option>
                  ))}
                </select>
                <button
                  onClick={addPro}
                  disabled={!newPro.trim()}
                  className="px-2 py-1 bg-green-500 text-white rounded text-sm disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>

            <div className="card p-4 bg-red-50">
              <h3 className="font-medium text-red-700 mb-3">{t('tools.proConsList.cons')}</h3>

              <div className="space-y-2 mb-3">
                {currentDecision.cons.map(con => (
                  <div key={con.id} className="flex items-center gap-2 p-2 bg-white rounded">
                    <span className="flex-1 text-sm">{con.text}</span>
                    <span className="text-xs text-slate-500">-{con.weight}</span>
                    <button
                      onClick={() => removeItem('cons', con.id)}
                      className="text-red-500 text-xs"
                    >
                      x
                    </button>
                  </div>
                ))}
                {currentDecision.cons.length === 0 && (
                  <div className="text-sm text-slate-400 text-center py-2">
                    {t('tools.proConsList.noCons')}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCon}
                  onChange={(e) => setNewCon(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCon()}
                  placeholder={t('tools.proConsList.addCon')}
                  className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm"
                />
                <select
                  value={conWeight}
                  onChange={(e) => setConWeight(parseInt(e.target.value))}
                  className="w-14 px-1 py-1 border border-slate-300 rounded text-sm"
                >
                  {[1, 2, 3, 4, 5].map(w => (
                    <option key={w} value={w}>-{w}</option>
                  ))}
                </select>
                <button
                  onClick={addCon}
                  disabled={!newCon.trim()}
                  className="px-2 py-1 bg-red-500 text-white rounded text-sm disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="card p-4 bg-blue-50">
        <h3 className="font-medium mb-2">{t('tools.proConsList.tips')}</h3>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>- {t('tools.proConsList.tip1')}</li>
          <li>- {t('tools.proConsList.tip2')}</li>
          <li>- {t('tools.proConsList.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
