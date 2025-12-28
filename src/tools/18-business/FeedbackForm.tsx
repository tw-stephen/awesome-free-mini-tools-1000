import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Field {
  id: number
  type: 'text' | 'email' | 'textarea' | 'select' | 'rating' | 'nps'
  label: string
  placeholder: string
  options: string[]
  required: boolean
}

export default function FeedbackForm() {
  const { t } = useTranslation()
  const [form, setForm] = useState({
    title: 'We Value Your Feedback',
    description: 'Please take a moment to share your thoughts with us.',
    submitButton: 'Submit Feedback',
    successMessage: 'Thank you for your feedback!',
  })

  const [fields, setFields] = useState<Field[]>([
    { id: 1, type: 'text', label: 'Name', placeholder: 'Your name', options: [], required: false },
    { id: 2, type: 'email', label: 'Email', placeholder: 'your@email.com', options: [], required: true },
    { id: 3, type: 'rating', label: 'How would you rate your experience?', placeholder: '', options: [], required: true },
    { id: 4, type: 'textarea', label: 'Comments', placeholder: 'Tell us more about your experience...', options: [], required: false },
  ])

  const fieldTypes = [
    { id: 'text', name: 'Text Input', icon: '📝' },
    { id: 'email', name: 'Email', icon: '📧' },
    { id: 'textarea', name: 'Text Area', icon: '📄' },
    { id: 'select', name: 'Dropdown', icon: '▼' },
    { id: 'rating', name: 'Star Rating', icon: '⭐' },
    { id: 'nps', name: 'NPS Score', icon: '📊' },
  ]

  const addField = (type: Field['type']) => {
    const fieldType = fieldTypes.find(f => f.id === type)
    setFields([...fields, {
      id: Date.now(),
      type,
      label: fieldType?.name || 'Field',
      placeholder: '',
      options: type === 'select' ? ['Option 1', 'Option 2', 'Option 3'] : [],
      required: false,
    }])
  }

  const updateField = (id: number, updates: Partial<Field>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f))
  }

  const removeField = (id: number) => {
    setFields(fields.filter(f => f.id !== id))
  }

  const moveField = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= fields.length) return
    const newFields = [...fields]
    ;[newFields[index], newFields[newIndex]] = [newFields[newIndex], newFields[index]]
    setFields(newFields)
  }

  const generateHTML = (): string => {
    let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${form.title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
    .form-group { margin-bottom: 20px; }
    label { display: block; margin-bottom: 5px; font-weight: 500; }
    input, select, textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px; box-sizing: border-box; }
    textarea { resize: vertical; min-height: 100px; }
    .required { color: red; }
    button { background: #007bff; color: white; padding: 12px 24px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; width: 100%; }
    button:hover { background: #0056b3; }
    .rating { display: flex; gap: 5px; }
    .rating span { font-size: 24px; cursor: pointer; }
    .nps { display: flex; gap: 5px; }
    .nps span { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: 1px solid #ddd; border-radius: 5px; cursor: pointer; }
  </style>
</head>
<body>
  <h1>${form.title}</h1>
  <p>${form.description}</p>
  <form>
`

    fields.forEach(field => {
      html += `    <div class="form-group">\n`
      html += `      <label>${field.label}${field.required ? ' <span class="required">*</span>' : ''}</label>\n`

      switch (field.type) {
        case 'text':
          html += `      <input type="text" placeholder="${field.placeholder}"${field.required ? ' required' : ''}>\n`
          break
        case 'email':
          html += `      <input type="email" placeholder="${field.placeholder}"${field.required ? ' required' : ''}>\n`
          break
        case 'textarea':
          html += `      <textarea placeholder="${field.placeholder}"${field.required ? ' required' : ''}></textarea>\n`
          break
        case 'select':
          html += `      <select${field.required ? ' required' : ''}>\n`
          html += `        <option value="">Select an option...</option>\n`
          field.options.forEach(opt => {
            html += `        <option value="${opt}">${opt}</option>\n`
          })
          html += `      </select>\n`
          break
        case 'rating':
          html += `      <div class="rating">\n`
          for (let i = 1; i <= 5; i++) {
            html += `        <span>☆</span>\n`
          }
          html += `      </div>\n`
          break
        case 'nps':
          html += `      <div class="nps">\n`
          for (let i = 0; i <= 10; i++) {
            html += `        <span>${i}</span>\n`
          }
          html += `      </div>\n`
          break
      }

      html += `    </div>\n`
    })

    html += `    <button type="submit">${form.submitButton}</button>
  </form>
</body>
</html>`

    return html
  }

  const generateText = (): string => {
    let doc = `${'═'.repeat(50)}\n`
    doc += `${form.title}\n`
    doc += `${'═'.repeat(50)}\n\n`
    doc += `${form.description}\n\n`

    fields.forEach((field, index) => {
      doc += `${index + 1}. ${field.label}${field.required ? ' *' : ''}\n`
      switch (field.type) {
        case 'text':
        case 'email':
          doc += `   [${field.placeholder || 'Enter text'}]\n`
          break
        case 'textarea':
          doc += `   [${field.placeholder || 'Enter comments'}]\n`
          break
        case 'select':
          field.options.forEach(opt => {
            doc += `   ○ ${opt}\n`
          })
          break
        case 'rating':
          doc += `   ☆ ☆ ☆ ☆ ☆\n`
          break
        case 'nps':
          doc += `   0  1  2  3  4  5  6  7  8  9  10\n`
          break
      }
      doc += '\n'
    })

    doc += `[${form.submitButton}]\n`

    return doc
  }

  const copyHTML = () => {
    navigator.clipboard.writeText(generateHTML())
  }

  const copyText = () => {
    navigator.clipboard.writeText(generateText())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.feedbackForm.settings')}</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Form Title"
            className="w-full px-3 py-2 border border-slate-300 rounded font-medium"
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Form description"
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={form.submitButton}
              onChange={(e) => setForm({ ...form, submitButton: e.target.value })}
              placeholder="Submit button text"
              className="px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="text"
              value={form.successMessage}
              onChange={(e) => setForm({ ...form, successMessage: e.target.value })}
              placeholder="Success message"
              className="px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.feedbackForm.addField')}</h3>
        <div className="flex flex-wrap gap-2">
          {fieldTypes.map(type => (
            <button
              key={type.id}
              onClick={() => addField(type.id as Field['type'])}
              className="px-3 py-2 bg-slate-100 rounded hover:bg-slate-200 text-sm"
            >
              {type.icon} {type.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => {
          const fieldType = fieldTypes.find(f => f.id === field.type)
          return (
            <div key={field.id} className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-400">{fieldType?.icon}</span>
                <div className="flex gap-1">
                  <button onClick={() => moveField(index, 'up')} disabled={index === 0} className="px-2 py-1 text-slate-400 hover:text-slate-600 disabled:opacity-30">↑</button>
                  <button onClick={() => moveField(index, 'down')} disabled={index === fields.length - 1} className="px-2 py-1 text-slate-400 hover:text-slate-600 disabled:opacity-30">↓</button>
                  <button onClick={() => removeField(field.id)} className="px-2 py-1 text-red-400 hover:text-red-600">×</button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => updateField(field.id, { label: e.target.value })}
                    placeholder="Field label"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded"
                  />
                  <label className="flex items-center gap-2 px-3">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) => updateField(field.id, { required: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm">Required</span>
                  </label>
                </div>
                {(field.type === 'text' || field.type === 'email' || field.type === 'textarea') && (
                  <input
                    type="text"
                    value={field.placeholder}
                    onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                    placeholder="Placeholder text"
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                  />
                )}
                {field.type === 'select' && (
                  <div className="space-y-1">
                    {field.options.map((opt, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const newOptions = [...field.options]
                            newOptions[i] = e.target.value
                            updateField(field.id, { options: newOptions })
                          }}
                          className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm"
                        />
                        <button
                          onClick={() => {
                            if (field.options.length > 2) {
                              updateField(field.id, { options: field.options.filter((_, idx) => idx !== i) })
                            }
                          }}
                          disabled={field.options.length <= 2}
                          className="text-red-400 hover:text-red-600 disabled:opacity-30"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => updateField(field.id, { options: [...field.options, `Option ${field.options.length + 1}`] })}
                      className="text-blue-500 hover:text-blue-600 text-sm"
                    >
                      + Add Option
                    </button>
                  </div>
                )}
                {field.type === 'rating' && (
                  <div className="text-yellow-400 text-2xl">☆ ☆ ☆ ☆ ☆</div>
                )}
                {field.type === 'nps' && (
                  <div className="flex gap-1">
                    {[0,1,2,3,4,5,6,7,8,9,10].map(n => (
                      <span key={n} className="w-8 h-8 flex items-center justify-center border border-slate-300 rounded text-sm">{n}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {fields.length === 0 && (
        <div className="card p-8 text-center text-slate-500">
          Add fields to build your feedback form
        </div>
      )}

      <div className="flex gap-2">
        <button onClick={copyHTML} className="flex-1 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium">
          Copy HTML
        </button>
        <button onClick={copyText} className="flex-1 py-3 bg-slate-200 rounded hover:bg-slate-300 font-medium">
          Copy Text
        </button>
      </div>
    </div>
  )
}
