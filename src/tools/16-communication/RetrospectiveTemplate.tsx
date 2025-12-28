import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Item {
  id: number
  text: string
}

export default function RetrospectiveTemplate() {
  const { t } = useTranslation()
  const [template, setTemplate] = useState<'standard' | 'sailboat' | 'starfish' | 'fourL'>('standard')
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')

  const [wentWell, setWentWell] = useState<Item[]>([{ id: 1, text: '' }])
  const [improve, setImprove] = useState<Item[]>([{ id: 1, text: '' }])
  const [actions, setActions] = useState<Item[]>([{ id: 1, text: '' }])

  const addItem = (setter: React.Dispatch<React.SetStateAction<Item[]>>, items: Item[]) => {
    setter([...items, { id: Date.now(), text: '' }])
  }

  const updateItem = (setter: React.Dispatch<React.SetStateAction<Item[]>>, items: Item[], id: number, text: string) => {
    setter(items.map(item => item.id === id ? { ...item, text } : item))
  }

  const removeItem = (setter: React.Dispatch<React.SetStateAction<Item[]>>, items: Item[], id: number) => {
    if (items.length > 1) {
      setter(items.filter(item => item.id !== id))
    }
  }

  const templateNames = {
    standard: { well: 'What went well?', improve: 'What to improve?', actions: 'Action items' },
    sailboat: { well: 'Wind (What pushed us forward?)', improve: 'Anchors (What held us back?)', actions: 'Islands (Goals)' },
    starfish: { well: 'Keep Doing', improve: 'Stop Doing', actions: 'Start Doing' },
    fourL: { well: 'Liked', improve: 'Lacked', actions: 'Learned' },
  }

  const generateRetro = (): string => {
    const names = templateNames[template]
    let retro = `RETROSPECTIVE${title ? `: ${title}` : ''}\n`
    retro += `Date: ${date || new Date().toLocaleDateString()}\n`
    retro += `Template: ${template.charAt(0).toUpperCase() + template.slice(1)}\n`
    retro += `${'='.repeat(50)}\n\n`

    retro += `${names.well}\n${'─'.repeat(30)}\n`
    wentWell.forEach((item, i) => {
      if (item.text) retro += `${i + 1}. ${item.text}\n`
    })
    retro += '\n'

    retro += `${names.improve}\n${'─'.repeat(30)}\n`
    improve.forEach((item, i) => {
      if (item.text) retro += `${i + 1}. ${item.text}\n`
    })
    retro += '\n'

    retro += `${names.actions}\n${'─'.repeat(30)}\n`
    actions.forEach((item, i) => {
      if (item.text) retro += `${i + 1}. ${item.text}\n`
    })

    return retro
  }

  const copyRetro = () => {
    navigator.clipboard.writeText(generateRetro())
  }

  const ItemList = ({
    items,
    setter,
    placeholder,
    color,
  }: {
    items: Item[]
    setter: React.Dispatch<React.SetStateAction<Item[]>>
    placeholder: string
    color: string
  }) => (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="flex gap-2">
          <input
            type="text"
            value={item.text}
            onChange={(e) => updateItem(setter, items, item.id, e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 border border-slate-300 rounded"
          />
          {items.length > 1 && (
            <button
              onClick={() => removeItem(setter, items, item.id)}
              className="px-2 text-red-500 hover:bg-red-50 rounded"
            >
              X
            </button>
          )}
        </div>
      ))}
      <button
        onClick={() => addItem(setter, items)}
        className={`w-full py-2 border-2 border-dashed rounded text-sm ${color}`}
      >
        + Add item
      </button>
    </div>
  )

  const templates = [
    { id: 'standard', name: 'Standard' },
    { id: 'sailboat', name: 'Sailboat' },
    { id: 'starfish', name: 'Starfish' },
    { id: 'fourL', name: '4Ls' },
  ]

  const names = templateNames[template]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.retrospectiveTemplate.title')}</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Sprint 1, Q4 Review, etc."
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.retrospectiveTemplate.date')}</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.retrospectiveTemplate.template')}</h3>
        <div className="flex gap-2">
          {templates.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => setTemplate(tmpl.id as typeof template)}
              className={`flex-1 py-2 rounded ${
                template === tmpl.id ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {tmpl.name}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium text-green-700 mb-3">{names.well}</h3>
        <ItemList
          items={wentWell}
          setter={setWentWell}
          placeholder="What worked well..."
          color="border-green-300 text-green-600 hover:border-green-500"
        />
      </div>

      <div className="card p-4">
        <h3 className="font-medium text-red-700 mb-3">{names.improve}</h3>
        <ItemList
          items={improve}
          setter={setImprove}
          placeholder="What needs improvement..."
          color="border-red-300 text-red-600 hover:border-red-500"
        />
      </div>

      <div className="card p-4">
        <h3 className="font-medium text-blue-700 mb-3">{names.actions}</h3>
        <ItemList
          items={actions}
          setter={setActions}
          placeholder="Action to take..."
          color="border-blue-300 text-blue-600 hover:border-blue-500"
        />
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.retrospectiveTemplate.preview')}</h3>
        <pre className="bg-slate-100 p-4 rounded text-sm whitespace-pre-wrap font-mono">
          {generateRetro()}
        </pre>
        <button
          onClick={copyRetro}
          className="w-full mt-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('tools.retrospectiveTemplate.copy')}
        </button>
      </div>
    </div>
  )
}
