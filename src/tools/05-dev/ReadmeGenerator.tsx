import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

export default function ReadmeGenerator() {
  const { t } = useTranslation()
  const [projectName, setProjectName] = useState('My Awesome Project')
  const [description, setDescription] = useState('A brief description of what this project does and who its for.')
  const [installation, setInstallation] = useState('npm install my-project')
  const [usage, setUsage] = useState('import myProject from "my-project"\n\nmyProject.doSomething()')
  const [features, setFeatures] = useState(['Feature 1', 'Feature 2', 'Feature 3'])
  const [technologies, setTechnologies] = useState(['React', 'TypeScript', 'Node.js'])
  const [author, setAuthor] = useState('')
  const [license, setLicense] = useState('MIT')
  const [repo, setRepo] = useState('')
  const [badges, setBadges] = useState({
    npm: false,
    build: false,
    coverage: false,
    license: true,
  })
  const { copy, copied } = useClipboard()

  const output = useMemo(() => {
    const lines: string[] = []

    // Title
    lines.push(`# ${projectName}`)
    lines.push('')

    // Badges
    const badgeLines: string[] = []
    if (badges.npm && repo) {
      const pkgName = projectName.toLowerCase().replace(/\s+/g, '-')
      badgeLines.push(`![npm version](https://img.shields.io/npm/v/${pkgName})`)
    }
    if (badges.build) {
      badgeLines.push(`![Build Status](https://img.shields.io/github/actions/workflow/status/${repo}/ci.yml)`)
    }
    if (badges.coverage) {
      badgeLines.push(`![Coverage](https://img.shields.io/codecov/c/github/${repo})`)
    }
    if (badges.license) {
      badgeLines.push(`![License](https://img.shields.io/badge/license-${license}-blue)`)
    }
    if (badgeLines.length > 0) {
      lines.push(badgeLines.join(' '))
      lines.push('')
    }

    // Description
    lines.push(description)
    lines.push('')

    // Features
    if (features.filter(Boolean).length > 0) {
      lines.push('## Features')
      lines.push('')
      for (const feature of features.filter(Boolean)) {
        lines.push(`- ${feature}`)
      }
      lines.push('')
    }

    // Technologies
    if (technologies.filter(Boolean).length > 0) {
      lines.push('## Built With')
      lines.push('')
      for (const tech of technologies.filter(Boolean)) {
        lines.push(`- ${tech}`)
      }
      lines.push('')
    }

    // Installation
    if (installation) {
      lines.push('## Installation')
      lines.push('')
      lines.push('```bash')
      lines.push(installation)
      lines.push('```')
      lines.push('')
    }

    // Usage
    if (usage) {
      lines.push('## Usage')
      lines.push('')
      lines.push('```javascript')
      lines.push(usage)
      lines.push('```')
      lines.push('')
    }

    // Contributing
    lines.push('## Contributing')
    lines.push('')
    lines.push('Contributions are always welcome!')
    lines.push('')
    lines.push('1. Fork the repository')
    lines.push('2. Create your feature branch (`git checkout -b feature/amazing-feature`)')
    lines.push('3. Commit your changes (`git commit -m "Add some amazing feature"`)')
    lines.push('4. Push to the branch (`git push origin feature/amazing-feature`)')
    lines.push('5. Open a Pull Request')
    lines.push('')

    // License
    lines.push('## License')
    lines.push('')
    lines.push(`This project is licensed under the ${license} License - see the [LICENSE](LICENSE) file for details.`)
    lines.push('')

    // Author
    if (author) {
      lines.push('## Author')
      lines.push('')
      lines.push(`**${author}**`)
      lines.push('')
    }

    return lines.join('\n')
  }, [projectName, description, installation, usage, features, technologies, author, license, repo, badges])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-4">
          {t('tools.readmeGenerator.projectInfo')}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">{t('tools.readmeGenerator.projectName')}</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">{t('tools.readmeGenerator.description')}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.readmeGenerator.author')}</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.readmeGenerator.license')}</label>
              <select
                value={license}
                onChange={(e) => setLicense(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              >
                <option value="MIT">MIT</option>
                <option value="Apache-2.0">Apache-2.0</option>
                <option value="GPL-3.0">GPL-3.0</option>
                <option value="BSD-3-Clause">BSD-3-Clause</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">{t('tools.readmeGenerator.repoPath')} (user/repo)</label>
            <input
              type="text"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              placeholder="username/repository"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-mono"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.readmeGenerator.badges')}</h3>
        <div className="flex flex-wrap gap-4">
          {Object.entries(badges).map(([key, value]) => (
            <label key={key} className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => setBadges({ ...badges, [key]: e.target.checked })}
              />
              {key}
            </label>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.readmeGenerator.features')}</h3>
        <div className="space-y-2">
          {features.map((f, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={f}
                onChange={(e) => setFeatures(features.map((x, j) => j === i ? e.target.value : x))}
                className="flex-1 px-3 py-1 border border-slate-300 rounded text-sm"
              />
              <button onClick={() => setFeatures(features.filter((_, j) => j !== i))} className="text-red-500">✕</button>
            </div>
          ))}
          <Button variant="secondary" onClick={() => setFeatures([...features, ''])}>
            + {t('tools.readmeGenerator.addFeature')}
          </Button>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.readmeGenerator.technologies')}</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {technologies.map((tech, i) => (
            <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm flex items-center gap-1">
              {tech}
              <button onClick={() => setTechnologies(technologies.filter((_, j) => j !== i))} className="text-blue-500">✕</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add technology"
            className="flex-1 px-3 py-1 border border-slate-300 rounded text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value) {
                setTechnologies([...technologies, e.currentTarget.value])
                e.currentTarget.value = ''
              }
            }}
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.readmeGenerator.installation')}</h3>
        <textarea
          value={installation}
          onChange={(e) => setInstallation(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-mono"
        />
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.readmeGenerator.usage')}</h3>
        <textarea
          value={usage}
          onChange={(e) => setUsage(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-mono"
        />
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">README.md</h3>
          <Button variant="secondary" onClick={() => copy(output)}>
            {copied ? t('common.copied') : t('common.copy')}
          </Button>
        </div>

        <pre className="p-3 bg-slate-50 rounded-lg overflow-x-auto max-h-96">
          <code className="font-mono text-xs text-slate-800 whitespace-pre-wrap">{output}</code>
        </pre>
      </div>
    </div>
  )
}
