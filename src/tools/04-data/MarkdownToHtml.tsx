import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import TextArea from '../../components/ui/TextArea'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

export default function MarkdownToHtml() {
  const { t } = useTranslation()
  const [markdown, setMarkdown] = useState(`# Hello World

This is a **bold** text and this is *italic*.

## Features

- List item 1
- List item 2
- List item 3

### Code Example

\`\`\`javascript
console.log('Hello World');
\`\`\`

> This is a blockquote

[Link](https://example.com)
`)
  const [showPreview, setShowPreview] = useState(true)
  const { copy, copied } = useClipboard()

  const convertToHtml = useCallback((md: string): string => {
    let html = md

    // Headers
    html = html.replace(/^######\s+(.*)$/gm, '<h6>$1</h6>')
    html = html.replace(/^#####\s+(.*)$/gm, '<h5>$1</h5>')
    html = html.replace(/^####\s+(.*)$/gm, '<h4>$1</h4>')
    html = html.replace(/^###\s+(.*)$/gm, '<h3>$1</h3>')
    html = html.replace(/^##\s+(.*)$/gm, '<h2>$1</h2>')
    html = html.replace(/^#\s+(.*)$/gm, '<h1>$1</h1>')

    // Code blocks
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre><code class="language-${lang || 'plaintext'}">${code.trim()}</code></pre>`
    })

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>')

    // Bold and italic
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
    html = html.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>')
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>')
    html = html.replace(/_(.+?)_/g, '<em>$1</em>')

    // Strikethrough
    html = html.replace(/~~(.+?)~~/g, '<del>$1</del>')

    // Blockquotes
    html = html.replace(/^>\s+(.*)$/gm, '<blockquote>$1</blockquote>')
    html = html.replace(/<\/blockquote>\n<blockquote>/g, '\n')

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')

    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')

    // Horizontal rules
    html = html.replace(/^---$/gm, '<hr />')
    html = html.replace(/^\*\*\*$/gm, '<hr />')

    // Unordered lists
    html = html.replace(/^[-*+]\s+(.*)$/gm, '<li>$1</li>')
    html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>\n${match}</ul>\n`)

    // Ordered lists
    html = html.replace(/^\d+\.\s+(.*)$/gm, '<li>$1</li>')

    // Line breaks
    html = html.replace(/\n\n/g, '</p>\n<p>')
    html = html.replace(/^(?!<[hupob]|<li|<pre|<code|<hr|<img|<a|<del|<strong|<em)(.+)$/gm, '<p>$1</p>')

    // Clean up
    html = html.replace(/<p><\/p>/g, '')
    html = html.replace(/<p>(<[hupob]|<li|<pre|<hr|<ul|<ol)/g, '$1')
    html = html.replace(/(<\/[hupob].*>|<\/li>|<\/pre>|<hr \/>|<\/ul>|<\/ol>)<\/p>/g, '$1')

    return html.trim()
  }, [])

  const htmlOutput = convertToHtml(markdown)

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.markdownToHtml.input')}
          </h3>
          <Button variant="secondary" onClick={() => setMarkdown('')}>
            {t('common.clear')}
          </Button>
        </div>
        <TextArea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          placeholder={t('tools.markdownToHtml.inputPlaceholder')}
          rows={12}
          className="font-mono text-sm"
        />
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.markdownToHtml.output')}
          </h3>
          <div className="flex gap-2">
            <Button
              variant={showPreview ? 'secondary' : 'primary'}
              onClick={() => setShowPreview(false)}
            >
              HTML
            </Button>
            <Button
              variant={showPreview ? 'primary' : 'secondary'}
              onClick={() => setShowPreview(true)}
            >
              {t('tools.markdownToHtml.preview')}
            </Button>
            <Button variant="secondary" onClick={() => copy(htmlOutput)}>
              {copied ? t('common.copied') : t('common.copy')}
            </Button>
          </div>
        </div>

        {showPreview ? (
          <div
            className="prose prose-sm max-w-none p-4 bg-white border border-slate-200 rounded-lg"
            dangerouslySetInnerHTML={{ __html: htmlOutput }}
          />
        ) : (
          <TextArea
            value={htmlOutput}
            readOnly
            rows={12}
            className="font-mono text-sm bg-slate-50"
          />
        )}
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.markdownToHtml.syntax')}
        </h3>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <p><code># Heading 1</code></p>
            <p><code>## Heading 2</code></p>
            <p><code>**bold**</code></p>
            <p><code>*italic*</code></p>
            <p><code>~~strikethrough~~</code></p>
          </div>
          <div className="space-y-2">
            <p><code>[link](url)</code></p>
            <p><code>![image](url)</code></p>
            <p><code>`code`</code></p>
            <p><code>- list item</code></p>
            <p><code>&gt; blockquote</code></p>
          </div>
        </div>
      </div>
    </div>
  )
}
