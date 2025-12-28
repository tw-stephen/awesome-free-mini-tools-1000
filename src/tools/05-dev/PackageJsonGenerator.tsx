import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

interface Dependency {
  name: string
  version: string
  dev: boolean
}

export default function PackageJsonGenerator() {
  const { t } = useTranslation()
  const [name, setName] = useState('my-project')
  const [version, setVersion] = useState('1.0.0')
  const [description, setDescription] = useState('A new project')
  const [main, setMain] = useState('index.js')
  const [author, setAuthor] = useState('')
  const [license, setLicense] = useState('MIT')
  const [keywords, setKeywords] = useState('')
  const [type, setType] = useState<'commonjs' | 'module'>('module')
  const [scripts, setScripts] = useState([
    { name: 'start', command: 'node index.js' },
    { name: 'dev', command: 'nodemon index.js' },
    { name: 'test', command: 'jest' },
  ])
  const [dependencies, setDependencies] = useState<Dependency[]>([])
  const { copy, copied } = useClipboard()

  const addScript = () => {
    setScripts([...scripts, { name: '', command: '' }])
  }

  const removeScript = (index: number) => {
    setScripts(scripts.filter((_, i) => i !== index))
  }

  const updateScript = (index: number, field: 'name' | 'command', value: string) => {
    setScripts(scripts.map((s, i) => i === index ? { ...s, [field]: value } : s))
  }

  const addDependency = (dev: boolean) => {
    setDependencies([...dependencies, { name: '', version: '^1.0.0', dev }])
  }

  const removeDependency = (index: number) => {
    setDependencies(dependencies.filter((_, i) => i !== index))
  }

  const updateDependency = (index: number, field: keyof Dependency, value: string | boolean) => {
    setDependencies(dependencies.map((d, i) => i === index ? { ...d, [field]: value } : d))
  }

  const commonDeps = [
    { name: 'express', version: '^4.18.2', dev: false },
    { name: 'axios', version: '^1.6.0', dev: false },
    { name: 'lodash', version: '^4.17.21', dev: false },
    { name: 'dotenv', version: '^16.3.1', dev: false },
    { name: 'cors', version: '^2.8.5', dev: false },
    { name: 'typescript', version: '^5.3.0', dev: true },
    { name: 'jest', version: '^29.7.0', dev: true },
    { name: 'nodemon', version: '^3.0.0', dev: true },
    { name: 'eslint', version: '^8.55.0', dev: true },
    { name: 'prettier', version: '^3.1.0', dev: true },
  ]

  const output = useMemo(() => {
    const pkg: Record<string, unknown> = {
      name: name.toLowerCase().replace(/[^a-z0-9-_]/g, '-'),
      version,
      description,
      main,
      type,
    }

    if (keywords) {
      pkg.keywords = keywords.split(',').map(k => k.trim()).filter(Boolean)
    }

    if (author) {
      pkg.author = author
    }

    pkg.license = license

    const scriptsObj: Record<string, string> = {}
    for (const s of scripts) {
      if (s.name && s.command) {
        scriptsObj[s.name] = s.command
      }
    }
    if (Object.keys(scriptsObj).length > 0) {
      pkg.scripts = scriptsObj
    }

    const deps: Record<string, string> = {}
    const devDeps: Record<string, string> = {}

    for (const d of dependencies) {
      if (d.name) {
        if (d.dev) {
          devDeps[d.name] = d.version
        } else {
          deps[d.name] = d.version
        }
      }
    }

    if (Object.keys(deps).length > 0) {
      pkg.dependencies = deps
    }
    if (Object.keys(devDeps).length > 0) {
      pkg.devDependencies = devDeps
    }

    return JSON.stringify(pkg, null, 2)
  }, [name, version, description, main, type, author, license, keywords, scripts, dependencies])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-4">
          {t('tools.packageJsonGenerator.basicInfo')}
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-mono"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">version</label>
            <input
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-mono"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs text-slate-500 mb-1">description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">main</label>
            <input
              type="text"
              value={main}
              onChange={(e) => setMain(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-mono"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as typeof type)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            >
              <option value="module">module (ESM)</option>
              <option value="commonjs">commonjs (CJS)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">license</label>
            <select
              value={license}
              onChange={(e) => setLicense(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            >
              <option value="MIT">MIT</option>
              <option value="Apache-2.0">Apache-2.0</option>
              <option value="GPL-3.0">GPL-3.0</option>
              <option value="BSD-3-Clause">BSD-3-Clause</option>
              <option value="ISC">ISC</option>
              <option value="UNLICENSED">UNLICENSED</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs text-slate-500 mb-1">keywords (comma separated)</label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="keyword1, keyword2, keyword3"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-slate-700">scripts</h3>
          <Button variant="secondary" onClick={addScript}>
            + {t('tools.packageJsonGenerator.addScript')}
          </Button>
        </div>

        <div className="space-y-2">
          {scripts.map((s, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={s.name}
                onChange={(e) => updateScript(i, 'name', e.target.value)}
                placeholder="script name"
                className="w-32 px-2 py-1 border border-slate-300 rounded text-sm font-mono"
              />
              <input
                type="text"
                value={s.command}
                onChange={(e) => updateScript(i, 'command', e.target.value)}
                placeholder="command"
                className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm font-mono"
              />
              <button onClick={() => removeScript(i)} className="text-red-500 px-2">✕</button>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-slate-700">dependencies</h3>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => addDependency(false)}>
              + dep
            </Button>
            <Button variant="secondary" onClick={() => addDependency(true)}>
              + devDep
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {commonDeps.map(dep => (
            <Button
              key={dep.name}
              variant="secondary"
              onClick={() => setDependencies([...dependencies, dep])}
            >
              + {dep.name} {dep.dev ? '(dev)' : ''}
            </Button>
          ))}
        </div>

        <div className="space-y-2">
          {dependencies.map((d, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                type="text"
                value={d.name}
                onChange={(e) => updateDependency(i, 'name', e.target.value)}
                placeholder="package name"
                className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm font-mono"
              />
              <input
                type="text"
                value={d.version}
                onChange={(e) => updateDependency(i, 'version', e.target.value)}
                placeholder="^1.0.0"
                className="w-24 px-2 py-1 border border-slate-300 rounded text-sm font-mono"
              />
              <label className="flex items-center gap-1 text-xs text-slate-500">
                <input
                  type="checkbox"
                  checked={d.dev}
                  onChange={(e) => updateDependency(i, 'dev', e.target.checked)}
                />
                dev
              </label>
              <button onClick={() => removeDependency(i)} className="text-red-500 px-2">✕</button>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">package.json</h3>
          <Button variant="secondary" onClick={() => copy(output)}>
            {copied ? t('common.copied') : t('common.copy')}
          </Button>
        </div>

        <pre className="p-3 bg-slate-50 rounded-lg overflow-x-auto max-h-96">
          <code className="font-mono text-xs text-slate-800">{output}</code>
        </pre>
      </div>
    </div>
  )
}
