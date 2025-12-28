import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

export default function MarkdownTableGenerator() {
  const { t } = useTranslation()
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(3)
  const [data, setData] = useState<string[][]>([
    ['Header 1', 'Header 2', 'Header 3'],
    ['Row 1, Col 1', 'Row 1, Col 2', 'Row 1, Col 3'],
    ['Row 2, Col 1', 'Row 2, Col 2', 'Row 2, Col 3'],
  ])
  const [alignment, setAlignment] = useState<('left' | 'center' | 'right')[]>(['left', 'left', 'left'])
  const { copy, copied } = useClipboard()

  const updateCell = (row: number, col: number, value: string) => {
    const newData = [...data]
    if (!newData[row]) newData[row] = []
    newData[row][col] = value
    setData(newData)
  }

  const updateAlignment = (col: number, value: 'left' | 'center' | 'right') => {
    const newAlignment = [...alignment]
    newAlignment[col] = value
    setAlignment(newAlignment)
  }

  const addRow = () => {
    setRows(rows + 1)
    setData([...data, Array(cols).fill('')])
  }

  const addCol = () => {
    setCols(cols + 1)
    setData(data.map(row => [...row, '']))
    setAlignment([...alignment, 'left'])
  }

  const removeRow = () => {
    if (rows <= 2) return
    setRows(rows - 1)
    setData(data.slice(0, -1))
  }

  const removeCol = () => {
    if (cols <= 1) return
    setCols(cols - 1)
    setData(data.map(row => row.slice(0, -1)))
    setAlignment(alignment.slice(0, -1))
  }

  const markdown = useMemo(() => {
    if (data.length === 0 || cols === 0) return ''

    const lines: string[] = []

    // Header row
    const headers = data[0] || []
    lines.push('| ' + headers.slice(0, cols).map(h => h || ' ').join(' | ') + ' |')

    // Separator row with alignment
    const separators = alignment.slice(0, cols).map(align => {
      switch (align) {
        case 'left': return ':---'
        case 'center': return ':---:'
        case 'right': return '---:'
        default: return '---'
      }
    })
    lines.push('| ' + separators.join(' | ') + ' |')

    // Data rows
    for (let i = 1; i < rows; i++) {
      const row = data[i] || []
      lines.push('| ' + row.slice(0, cols).map(c => c || ' ').join(' | ') + ' |')
    }

    return lines.join('\n')
  }, [data, cols, rows, alignment])

  const htmlPreview = useMemo(() => {
    if (data.length === 0 || cols === 0) return ''

    const headers = data[0] || []
    let html = '<table class="w-full border-collapse">\n<thead>\n<tr>\n'

    for (let i = 0; i < cols; i++) {
      const align = alignment[i]
      html += `<th class="border border-slate-300 p-2 bg-slate-100 text-${align}">${headers[i] || ''}</th>\n`
    }
    html += '</tr>\n</thead>\n<tbody>\n'

    for (let i = 1; i < rows; i++) {
      const row = data[i] || []
      html += '<tr>\n'
      for (let j = 0; j < cols; j++) {
        const align = alignment[j]
        html += `<td class="border border-slate-300 p-2 text-${align}">${row[j] || ''}</td>\n`
      }
      html += '</tr>\n'
    }

    html += '</tbody>\n</table>'
    return html
  }, [data, cols, rows, alignment])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.markdownTableGenerator.tableSize')}
          </h3>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={addRow}>
              + {t('tools.markdownTableGenerator.row')}
            </Button>
            <Button variant="secondary" onClick={addCol}>
              + {t('tools.markdownTableGenerator.column')}
            </Button>
            <Button variant="secondary" onClick={removeRow} disabled={rows <= 2}>
              - {t('tools.markdownTableGenerator.row')}
            </Button>
            <Button variant="secondary" onClick={removeCol} disabled={cols <= 1}>
              - {t('tools.markdownTableGenerator.column')}
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-1 text-xs text-slate-500"></th>
                {Array.from({ length: cols }).map((_, i) => (
                  <th key={i} className="p-1">
                    <select
                      value={alignment[i] || 'left'}
                      onChange={(e) => updateAlignment(i, e.target.value as 'left' | 'center' | 'right')}
                      className="w-full px-1 py-0.5 text-xs border border-slate-300 rounded"
                    >
                      <option value="left">← {t('tools.markdownTableGenerator.left')}</option>
                      <option value="center">↔ {t('tools.markdownTableGenerator.center')}</option>
                      <option value="right">→ {t('tools.markdownTableGenerator.right')}</option>
                    </select>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rows }).map((_, i) => (
                <tr key={i}>
                  <td className="p-1 text-xs text-slate-500 text-center">
                    {i === 0 ? 'H' : i}
                  </td>
                  {Array.from({ length: cols }).map((_, j) => (
                    <td key={j} className="p-1">
                      <input
                        type="text"
                        value={data[i]?.[j] || ''}
                        onChange={(e) => updateCell(i, j, e.target.value)}
                        className={`w-full px-2 py-1 border rounded text-sm ${
                          i === 0 ? 'border-blue-300 bg-blue-50 font-medium' : 'border-slate-300'
                        }`}
                        placeholder={i === 0 ? `Header ${j + 1}` : `R${i}C${j + 1}`}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.markdownTableGenerator.markdown')}
          </h3>
          <Button variant="secondary" onClick={() => copy(markdown)}>
            {copied ? t('common.copied') : t('common.copy')}
          </Button>
        </div>

        <pre className="p-3 bg-slate-50 rounded-lg overflow-x-auto">
          <code className="font-mono text-sm text-slate-800">{markdown}</code>
        </pre>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.markdownTableGenerator.preview')}
        </h3>

        <div
          className="overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: htmlPreview }}
        />
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.markdownTableGenerator.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.markdownTableGenerator.tip1')}</li>
          <li>{t('tools.markdownTableGenerator.tip2')}</li>
          <li>{t('tools.markdownTableGenerator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
