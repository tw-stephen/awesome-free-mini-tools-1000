import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

export default function DockerfileGenerator() {
  const { t } = useTranslation()
  const [baseImage, setBaseImage] = useState('node:18-alpine')
  const [workdir, setWorkdir] = useState('/app')
  const [copyFiles, setCopyFiles] = useState(['package*.json', '.'])
  const [runCommands, setRunCommands] = useState(['npm install', 'npm run build'])
  const [expose, setExpose] = useState('3000')
  const [entrypoint, setEntrypoint] = useState('')
  const [cmd, setCmd] = useState('npm start')
  const [env, setEnv] = useState([{ key: 'NODE_ENV', value: 'production' }])
  const [labels, setLabels] = useState([{ key: 'maintainer', value: '' }])
  const [multiStage, setMultiStage] = useState(false)
  const { copy, copied } = useClipboard()

  const output = useMemo(() => {
    const lines: string[] = []

    if (multiStage) {
      // Multi-stage build
      lines.push(`# Build stage`)
      lines.push(`FROM ${baseImage} AS builder`)
      lines.push('')
      lines.push(`WORKDIR ${workdir}`)
      lines.push('')

      // Copy files
      for (let i = 0; i < copyFiles.length; i += 2) {
        const src = copyFiles[i]
        const dest = copyFiles[i + 1] || '.'
        lines.push(`COPY ${src} ${dest}`)
      }
      lines.push('')

      // Run commands
      for (const cmd of runCommands) {
        if (cmd) lines.push(`RUN ${cmd}`)
      }
      lines.push('')

      lines.push(`# Production stage`)
      lines.push(`FROM ${baseImage} AS production`)
      lines.push('')
      lines.push(`WORKDIR ${workdir}`)
      lines.push('')
      lines.push(`COPY --from=builder ${workdir}/dist ./dist`)
      lines.push(`COPY --from=builder ${workdir}/node_modules ./node_modules`)
      lines.push('')
    } else {
      // Single stage
      lines.push(`FROM ${baseImage}`)
      lines.push('')
      lines.push(`WORKDIR ${workdir}`)
      lines.push('')

      // Copy files
      for (let i = 0; i < copyFiles.length; i += 2) {
        const src = copyFiles[i]
        const dest = copyFiles[i + 1] || '.'
        lines.push(`COPY ${src} ${dest}`)
      }
      lines.push('')

      // Run commands
      for (const cmd of runCommands) {
        if (cmd) lines.push(`RUN ${cmd}`)
      }
      lines.push('')
    }

    // Environment variables
    for (const e of env) {
      if (e.key) lines.push(`ENV ${e.key}=${e.value || '""'}`)
    }
    if (env.some(e => e.key)) lines.push('')

    // Labels
    for (const l of labels) {
      if (l.key && l.value) lines.push(`LABEL ${l.key}="${l.value}"`)
    }
    if (labels.some(l => l.key && l.value)) lines.push('')

    // Expose
    if (expose) {
      lines.push(`EXPOSE ${expose}`)
      lines.push('')
    }

    // Entrypoint
    if (entrypoint) {
      lines.push(`ENTRYPOINT ["${entrypoint}"]`)
    }

    // CMD
    if (cmd) {
      const cmdParts = cmd.split(' ')
      lines.push(`CMD [${cmdParts.map(p => `"${p}"`).join(', ')}]`)
    }

    return lines.join('\n')
  }, [baseImage, workdir, copyFiles, runCommands, expose, entrypoint, cmd, env, labels, multiStage])

  const presets = [
    {
      name: 'Node.js',
      config: {
        baseImage: 'node:18-alpine',
        workdir: '/app',
        copyFiles: ['package*.json', '.', '.', '.'],
        runCommands: ['npm install'],
        expose: '3000',
        cmd: 'npm start',
      }
    },
    {
      name: 'Python',
      config: {
        baseImage: 'python:3.11-slim',
        workdir: '/app',
        copyFiles: ['requirements.txt', '.', '.', '.'],
        runCommands: ['pip install --no-cache-dir -r requirements.txt'],
        expose: '8000',
        cmd: 'python app.py',
      }
    },
    {
      name: 'Go',
      config: {
        baseImage: 'golang:1.21-alpine',
        workdir: '/app',
        copyFiles: ['go.mod', 'go.sum', '.', '.', '.'],
        runCommands: ['go mod download', 'go build -o main .'],
        expose: '8080',
        cmd: './main',
      }
    },
    {
      name: 'Nginx',
      config: {
        baseImage: 'nginx:alpine',
        workdir: '/usr/share/nginx/html',
        copyFiles: ['dist/', '.'],
        runCommands: [],
        expose: '80',
        cmd: 'nginx -g daemon off;',
      }
    },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.dockerfileGenerator.presets')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {presets.map(preset => (
            <Button
              key={preset.name}
              variant="secondary"
              onClick={() => {
                setBaseImage(preset.config.baseImage)
                setWorkdir(preset.config.workdir)
                setCopyFiles(preset.config.copyFiles)
                setRunCommands(preset.config.runCommands)
                setExpose(preset.config.expose)
                setCmd(preset.config.cmd)
              }}
            >
              {preset.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-4">
          {t('tools.dockerfileGenerator.configuration')}
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">FROM (base image)</label>
              <input
                type="text"
                value={baseImage}
                onChange={(e) => setBaseImage(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">WORKDIR</label>
              <input
                type="text"
                value={workdir}
                onChange={(e) => setWorkdir(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">COPY (source destination pairs)</label>
            <div className="space-y-2">
              {Array.from({ length: Math.ceil(copyFiles.length / 2) }).map((_, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={copyFiles[i * 2] || ''}
                    onChange={(e) => {
                      const newFiles = [...copyFiles]
                      newFiles[i * 2] = e.target.value
                      setCopyFiles(newFiles)
                    }}
                    placeholder="source"
                    className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm font-mono"
                  />
                  <input
                    type="text"
                    value={copyFiles[i * 2 + 1] || ''}
                    onChange={(e) => {
                      const newFiles = [...copyFiles]
                      newFiles[i * 2 + 1] = e.target.value
                      setCopyFiles(newFiles)
                    }}
                    placeholder="destination"
                    className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm font-mono"
                  />
                </div>
              ))}
              <Button variant="secondary" onClick={() => setCopyFiles([...copyFiles, '', '.'])}>
                + Add COPY
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">RUN commands</label>
            <div className="space-y-2">
              {runCommands.map((cmd, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={cmd}
                    onChange={(e) => setRunCommands(runCommands.map((c, j) => j === i ? e.target.value : c))}
                    className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm font-mono"
                  />
                  <button onClick={() => setRunCommands(runCommands.filter((_, j) => j !== i))} className="text-red-500 px-2">✕</button>
                </div>
              ))}
              <Button variant="secondary" onClick={() => setRunCommands([...runCommands, ''])}>
                + Add RUN
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">EXPOSE</label>
              <input
                type="text"
                value={expose}
                onChange={(e) => setExpose(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">ENTRYPOINT</label>
              <input
                type="text"
                value={entrypoint}
                onChange={(e) => setEntrypoint(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">CMD</label>
              <input
                type="text"
                value={cmd}
                onChange={(e) => setCmd(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-mono"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={multiStage}
              onChange={(e) => setMultiStage(e.target.checked)}
            />
            {t('tools.dockerfileGenerator.multiStage')}
          </label>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">Dockerfile</h3>
          <Button variant="secondary" onClick={() => copy(output)}>
            {copied ? t('common.copied') : t('common.copy')}
          </Button>
        </div>

        <pre className="p-3 bg-slate-50 rounded-lg overflow-x-auto max-h-96">
          <code className="font-mono text-xs text-slate-800">{output}</code>
        </pre>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.dockerfileGenerator.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.dockerfileGenerator.tip1')}</li>
          <li>{t('tools.dockerfileGenerator.tip2')}</li>
          <li>{t('tools.dockerfileGenerator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
