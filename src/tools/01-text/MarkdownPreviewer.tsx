import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '../../hooks/useClipboard'
import Button from '../../components/ui/Button'
import TextArea from '../../components/ui/TextArea'

// Simple markdown parser
const parseMarkdown = (text: string): string => {
  if (!text) return ''

  let html = text
    // Escape HTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Headers
  html = html.replace(/^###### (.+)$/gm, '<h6 class="text-sm font-bold mt-4 mb-2">$1</h6>')
  html = html.replace(/^##### (.+)$/gm, '<h5 class="text-base font-bold mt-4 mb-2">$1</h5>')
  html = html.replace(/^#### (.+)$/gm, '<h4 class="text-lg font-bold mt-4 mb-2">$1</h4>')
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-4 mb-2">$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mt-4 mb-2">$1</h1>')

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  html = html.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>')
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>')
  html = html.replace(/_(.+?)_/g, '<em>$1</em>')

  // Strikethrough
  html = html.replace(/~~(.+?)~~/g, '<del>$1</del>')

  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, _lang, code) => {
    return `<pre class="bg-slate-800 text-slate-100 p-4 rounded-lg overflow-x-auto my-3"><code>${code.trim()}</code></pre>`
  })

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')

  // Blockquotes
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote class="border-l-4 border-slate-300 pl-4 my-2 text-slate-600 italic">$1</blockquote>')

  // Horizontal rule
  html = html.replace(/^(---|\*\*\*|___)$/gm, '<hr class="border-t border-slate-300 my-4">')

  // Unordered lists
  html = html.replace(/^[\*\-\+] (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-500 hover:underline" target="_blank" rel="noopener">$1</a>')

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded my-2">')

  // Paragraphs - wrap lines that aren't already wrapped
  html = html
    .split('\n\n')
    .map((block) => {
      if (
        block.startsWith('<h') ||
        block.startsWith('<pre') ||
        block.startsWith('<blockquote') ||
        block.startsWith('<hr') ||
        block.startsWith('<li') ||
        block.startsWith('<ul') ||
        block.startsWith('<ol')
      ) {
        return block
      }
      return `<p class="my-2">${block.replace(/\n/g, '<br>')}</p>`
    })
    .join('')

  // Wrap consecutive list items
  html = html.replace(/(<li[^>]*>.*?<\/li>\s*)+/g, '<ul class="my-2">$&</ul>')

  return html
}

const sampleMarkdown = `# Markdown Preview

This is a **bold** and *italic* text demo.

## Features

- Supports headers (h1-h6)
- **Bold** and *italic* text
- ~~Strikethrough~~
- \`inline code\`
- Code blocks
- Blockquotes
- Lists (ordered and unordered)
- [Links](https://example.com)

> This is a blockquote

### Code Example

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

1. First item
2. Second item
3. Third item

---

That's all folks!
`

export default function MarkdownPreviewer() {
  const { t } = useTranslation()
  const [markdown, setMarkdown] = useState('')
  const { copied, copy } = useClipboard()

  const html = useMemo(() => parseMarkdown(markdown), [markdown])

  const loadSample = () => {
    setMarkdown(sampleMarkdown)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button variant="secondary" onClick={loadSample}>
          {t('tools.markdownPreviewer.loadSample')}
        </Button>
        <Button variant="secondary" onClick={() => setMarkdown('')} disabled={!markdown}>
          {t('common.clear')}
        </Button>
        <Button onClick={() => copy(html)} disabled={!html}>
          {copied ? t('common.copied') : t('tools.markdownPreviewer.copyHtml')}
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {t('tools.markdownPreviewer.markdown')}
          </label>
          <TextArea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder={t('tools.markdownPreviewer.markdownPlaceholder')}
            rows={20}
            className="font-mono text-sm"
          />
        </div>

        <div className="card p-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {t('tools.markdownPreviewer.preview')}
          </label>
          <div
            className="min-h-[500px] p-4 border border-slate-200 rounded-lg overflow-auto prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{
              __html: html || `<p class="text-slate-400">${t('tools.markdownPreviewer.placeholder')}</p>`,
            }}
          />
        </div>
      </div>
    </div>
  )
}
