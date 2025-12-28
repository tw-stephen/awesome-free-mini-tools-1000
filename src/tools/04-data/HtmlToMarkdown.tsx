import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import TextArea from '../../components/ui/TextArea'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

export default function HtmlToMarkdown() {
  const { t } = useTranslation()
  const [html, setHtml] = useState(`<h1>Hello World</h1>

<p>This is a <strong>bold</strong> text and this is <em>italic</em>.</p>

<h2>Features</h2>

<ul>
  <li>List item 1</li>
  <li>List item 2</li>
  <li>List item 3</li>
</ul>

<h3>Code Example</h3>

<pre><code>console.log('Hello World');</code></pre>

<blockquote>This is a blockquote</blockquote>

<p><a href="https://example.com">Link</a></p>
`)
  const { copy, copied } = useClipboard()

  const convertToMarkdown = useCallback((htmlStr: string): string => {
    let md = htmlStr

    // Remove extra whitespace
    md = md.replace(/>\s+</g, '><')

    // Headers
    md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
    md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
    md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
    md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
    md = md.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n')
    md = md.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n')

    // Bold and italic
    md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    md = md.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    md = md.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
    md = md.replace(/<del[^>]*>(.*?)<\/del>/gi, '~~$1~~')
    md = md.replace(/<s[^>]*>(.*?)<\/s>/gi, '~~$1~~')

    // Links
    md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')

    // Images
    md = md.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)')
    md = md.replace(/<img[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*\/?>/gi, '![$1]($2)')
    md = md.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, '![]($1)')

    // Code blocks
    md = md.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, '```\n$1\n```\n\n')

    // Inline code
    md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')

    // Blockquotes
    md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, content) => {
      return content
        .split('\n')
        .map((line: string) => `> ${line.trim()}`)
        .join('\n') + '\n\n'
    })

    // Lists
    md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, content) => {
      return (
        content.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n').trim() + '\n\n'
      )
    })

    md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, content) => {
      let index = 0
      return (
        content.replace(/<li[^>]*>(.*?)<\/li>/gi, () => {
          index++
          return `${index}. $1\n`
        }).trim() + '\n\n'
      )
    })

    // Horizontal rules
    md = md.replace(/<hr\s*\/?>/gi, '---\n\n')

    // Paragraphs
    md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')

    // Line breaks
    md = md.replace(/<br\s*\/?>/gi, '\n')

    // Remove remaining tags
    md = md.replace(/<[^>]+>/g, '')

    // Decode HTML entities
    md = md.replace(/&nbsp;/g, ' ')
    md = md.replace(/&lt;/g, '<')
    md = md.replace(/&gt;/g, '>')
    md = md.replace(/&amp;/g, '&')
    md = md.replace(/&quot;/g, '"')
    md = md.replace(/&#39;/g, "'")

    // Clean up multiple newlines
    md = md.replace(/\n{3,}/g, '\n\n')

    return md.trim()
  }, [])

  const markdownOutput = convertToMarkdown(html)

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setHtml(text)
    } catch (e) {
      console.error('Failed to paste:', e)
    }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.htmlToMarkdown.input')}
          </h3>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handlePaste}>
              {t('common.paste')}
            </Button>
            <Button variant="secondary" onClick={() => setHtml('')}>
              {t('common.clear')}
            </Button>
          </div>
        </div>
        <TextArea
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          placeholder={t('tools.htmlToMarkdown.inputPlaceholder')}
          rows={12}
          className="font-mono text-sm"
        />
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.htmlToMarkdown.output')}
          </h3>
          <Button variant="secondary" onClick={() => copy(markdownOutput)}>
            {copied ? t('common.copied') : t('common.copy')}
          </Button>
        </div>
        <TextArea
          value={markdownOutput}
          readOnly
          rows={12}
          className="font-mono text-sm bg-slate-50"
        />
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.htmlToMarkdown.supported')}
        </h3>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p><code>&lt;h1&gt;-&lt;h6&gt;</code> → # Heading</p>
            <p><code>&lt;strong&gt;</code> → **bold**</p>
            <p><code>&lt;em&gt;</code> → *italic*</p>
            <p><code>&lt;del&gt;</code> → ~~strike~~</p>
          </div>
          <div className="space-y-1">
            <p><code>&lt;a&gt;</code> → [link](url)</p>
            <p><code>&lt;img&gt;</code> → ![alt](src)</p>
            <p><code>&lt;ul&gt;&lt;li&gt;</code> → - item</p>
            <p><code>&lt;blockquote&gt;</code> → &gt; quote</p>
          </div>
        </div>
      </div>
    </div>
  )
}
