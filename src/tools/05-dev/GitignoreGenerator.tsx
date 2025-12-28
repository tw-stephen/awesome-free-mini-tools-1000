import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

interface Template {
  name: string
  category: string
  patterns: string[]
}

export default function GitignoreGenerator() {
  const { t } = useTranslation()
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>(['node'])
  const [customPatterns, setCustomPatterns] = useState('')
  const { copy, copied } = useClipboard()

  const templates: Template[] = [
    {
      name: 'node',
      category: 'Languages',
      patterns: [
        '# Dependencies',
        'node_modules/',
        'package-lock.json',
        'yarn.lock',
        'pnpm-lock.yaml',
        '',
        '# Build output',
        'dist/',
        'build/',
        '.next/',
        '.nuxt/',
        '',
        '# Logs',
        'npm-debug.log*',
        'yarn-debug.log*',
        'yarn-error.log*',
        '',
        '# Environment',
        '.env',
        '.env.local',
        '.env.*.local',
      ]
    },
    {
      name: 'python',
      category: 'Languages',
      patterns: [
        '# Byte-compiled',
        '__pycache__/',
        '*.py[cod]',
        '*$py.class',
        '',
        '# Virtual environments',
        'venv/',
        'env/',
        '.venv/',
        '',
        '# Distribution',
        'dist/',
        'build/',
        '*.egg-info/',
        '',
        '# IDE',
        '.idea/',
        '.vscode/',
      ]
    },
    {
      name: 'java',
      category: 'Languages',
      patterns: [
        '# Compiled class files',
        '*.class',
        '',
        '# Package files',
        '*.jar',
        '*.war',
        '*.ear',
        '',
        '# Build directories',
        'target/',
        'build/',
        'out/',
        '',
        '# IDE',
        '.idea/',
        '*.iml',
        '.settings/',
        '.project',
        '.classpath',
      ]
    },
    {
      name: 'rust',
      category: 'Languages',
      patterns: [
        '# Generated files',
        'target/',
        'Cargo.lock',
        '',
        '# IDE',
        '.idea/',
        '*.iml',
      ]
    },
    {
      name: 'go',
      category: 'Languages',
      patterns: [
        '# Binaries',
        '*.exe',
        '*.exe~',
        '*.dll',
        '*.so',
        '*.dylib',
        '',
        '# Test binary',
        '*.test',
        '',
        '# Output',
        '*.out',
        'vendor/',
      ]
    },
    {
      name: 'macos',
      category: 'OS',
      patterns: [
        '.DS_Store',
        '.AppleDouble',
        '.LSOverride',
        '._*',
        '.Spotlight-V100',
        '.Trashes',
      ]
    },
    {
      name: 'windows',
      category: 'OS',
      patterns: [
        'Thumbs.db',
        'ehthumbs.db',
        'Desktop.ini',
        '$RECYCLE.BIN/',
        '*.lnk',
      ]
    },
    {
      name: 'linux',
      category: 'OS',
      patterns: [
        '*~',
        '.fuse_hidden*',
        '.nfs*',
      ]
    },
    {
      name: 'vscode',
      category: 'IDE',
      patterns: [
        '.vscode/*',
        '!.vscode/settings.json',
        '!.vscode/tasks.json',
        '!.vscode/launch.json',
        '!.vscode/extensions.json',
      ]
    },
    {
      name: 'jetbrains',
      category: 'IDE',
      patterns: [
        '.idea/',
        '*.iml',
        '*.ipr',
        '*.iws',
        'out/',
      ]
    },
    {
      name: 'vim',
      category: 'IDE',
      patterns: [
        '[._]*.s[a-v][a-z]',
        '[._]*.sw[a-p]',
        '[._]s[a-rt-v][a-z]',
        '[._]ss[a-gi-z]',
        '[._]sw[a-p]',
        'Session.vim',
        'Sessionx.vim',
      ]
    },
  ]

  const categories = [...new Set(templates.map(t => t.category))]

  const toggleTemplate = (name: string) => {
    if (selectedTemplates.includes(name)) {
      setSelectedTemplates(selectedTemplates.filter(t => t !== name))
    } else {
      setSelectedTemplates([...selectedTemplates, name])
    }
  }

  const output = useMemo(() => {
    const sections: string[] = []

    for (const name of selectedTemplates) {
      const template = templates.find(t => t.name === name)
      if (template) {
        sections.push(`# ===== ${template.name.toUpperCase()} =====`)
        sections.push(...template.patterns)
        sections.push('')
      }
    }

    if (customPatterns.trim()) {
      sections.push('# ===== CUSTOM =====')
      sections.push(customPatterns.trim())
    }

    return sections.join('\n')
  }, [selectedTemplates, customPatterns])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-4">
          {t('tools.gitignoreGenerator.selectTemplates')}
        </h3>

        {categories.map(category => (
          <div key={category} className="mb-4">
            <p className="text-xs text-slate-500 mb-2">{category}</p>
            <div className="flex flex-wrap gap-2">
              {templates
                .filter(t => t.category === category)
                .map(template => (
                  <button
                    key={template.name}
                    onClick={() => toggleTemplate(template.name)}
                    className={`px-3 py-1.5 text-sm rounded border ${
                      selectedTemplates.includes(template.name)
                        ? 'bg-blue-100 border-blue-300 text-blue-700'
                        : 'bg-slate-50 border-slate-300 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {template.name}
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.gitignoreGenerator.customPatterns')}
        </h3>
        <textarea
          value={customPatterns}
          onChange={(e) => setCustomPatterns(e.target.value)}
          placeholder={t('tools.gitignoreGenerator.customPlaceholder')}
          rows={4}
          className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-mono"
        />
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">
            .gitignore
          </h3>
          <Button variant="secondary" onClick={() => copy(output)}>
            {copied ? t('common.copied') : t('common.copy')}
          </Button>
        </div>

        <pre className="p-3 bg-slate-50 rounded-lg overflow-x-auto max-h-96">
          <code className="font-mono text-xs text-slate-800">{output || t('tools.gitignoreGenerator.selectAtLeastOne')}</code>
        </pre>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.gitignoreGenerator.patternSyntax')}
        </h3>
        <div className="text-sm text-slate-600 space-y-2">
          <p><code className="bg-slate-100 px-1">*</code> - {t('tools.gitignoreGenerator.syntaxWildcard')}</p>
          <p><code className="bg-slate-100 px-1">**</code> - {t('tools.gitignoreGenerator.syntaxDoubleWildcard')}</p>
          <p><code className="bg-slate-100 px-1">?</code> - {t('tools.gitignoreGenerator.syntaxQuestion')}</p>
          <p><code className="bg-slate-100 px-1">/</code> - {t('tools.gitignoreGenerator.syntaxSlash')}</p>
          <p><code className="bg-slate-100 px-1">!</code> - {t('tools.gitignoreGenerator.syntaxNegate')}</p>
          <p><code className="bg-slate-100 px-1">#</code> - {t('tools.gitignoreGenerator.syntaxComment')}</p>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.gitignoreGenerator.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.gitignoreGenerator.tip1')}</li>
          <li>{t('tools.gitignoreGenerator.tip2')}</li>
          <li>{t('tools.gitignoreGenerator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
