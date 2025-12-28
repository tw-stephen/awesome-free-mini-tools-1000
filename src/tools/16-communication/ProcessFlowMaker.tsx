import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type NodeType = 'start' | 'end' | 'process' | 'decision' | 'document' | 'data'

interface FlowNode {
  id: number
  type: NodeType
  label: string
  nextYes?: number | null
  nextNo?: number | null
  next?: number | null
}

export default function ProcessFlowMaker() {
  const { t } = useTranslation()
  const [flowName, setFlowName] = useState('')
  const [nodes, setNodes] = useState<FlowNode[]>([
    { id: 1, type: 'start', label: 'Start', next: null }
  ])

  const addNode = (type: NodeType) => {
    const newNode: FlowNode = {
      id: Date.now(),
      type,
      label: type === 'start' ? 'Start' : type === 'end' ? 'End' : '',
      ...(type === 'decision' ? { nextYes: null, nextNo: null } : { next: null })
    }
    setNodes([...nodes, newNode])
  }

  const updateNode = (id: number, field: keyof FlowNode, value: string | number | null) => {
    setNodes(nodes.map(n => n.id === id ? { ...n, [field]: value } : n))
  }

  const removeNode = (id: number) => {
    const node = nodes.find(n => n.id === id)
    if (node?.type === 'start') return
    setNodes(nodes.filter(n => n.id !== id).map(n => ({
      ...n,
      next: n.next === id ? null : n.next,
      nextYes: n.nextYes === id ? null : n.nextYes,
      nextNo: n.nextNo === id ? null : n.nextNo
    })))
  }

  const nodeStyles: Record<NodeType, { shape: string; color: string; icon: string }> = {
    'start': { shape: 'rounded-full', color: 'bg-green-100 border-green-500', icon: '▶' },
    'end': { shape: 'rounded-full', color: 'bg-red-100 border-red-500', icon: '■' },
    'process': { shape: 'rounded', color: 'bg-blue-100 border-blue-500', icon: '⬜' },
    'decision': { shape: 'rotate-45', color: 'bg-yellow-100 border-yellow-500', icon: '◇' },
    'document': { shape: 'rounded-b-lg', color: 'bg-purple-100 border-purple-500', icon: '📄' },
    'data': { shape: 'skew-x-12', color: 'bg-cyan-100 border-cyan-500', icon: '🗃️' },
  }

  const generateFlow = (): string => {
    let text = `PROCESS FLOW\\n${'='.repeat(50)}\\n`
    text += `Name: ${flowName || '[Flow Name]'}\\n\\n`

    const getNodeLabel = (id: number | null | undefined): string => {
      if (!id) return 'None'
      const node = nodes.find(n => n.id === id)
      return node ? `"${node.label || node.type}"` : 'None'
    }

    text += `NODES\\n${'─'.repeat(30)}\\n`
    nodes.forEach((node, i) => {
      text += `${i + 1}. [${node.type.toUpperCase()}] ${node.label || '(unnamed)'}\\n`
      if (node.type === 'decision') {
        text += `   → Yes: ${getNodeLabel(node.nextYes)}\\n`
        text += `   → No: ${getNodeLabel(node.nextNo)}\\n`
      } else if (node.type !== 'end') {
        text += `   → Next: ${getNodeLabel(node.next)}\\n`
      }
    })

    text += `\\nFLOW DIAGRAM (ASCII)\\n${'─'.repeat(30)}\\n`
    const start = nodes.find(n => n.type === 'start')
    if (start) {
      text += generateAsciiFlow(start)
    }

    return text
  }

  const generateAsciiFlow = (node: FlowNode, visited: Set<number> = new Set()): string => {
    if (visited.has(node.id)) return '  (loop)\\n'
    visited.add(node.id)

    let text = ''
    const label = node.label || node.type

    if (node.type === 'start' || node.type === 'end') {
      text += `  ( ${label} )\\n`
    } else if (node.type === 'decision') {
      text += `  < ${label} >\\n`
      if (node.nextYes) {
        const yesNode = nodes.find(n => n.id === node.nextYes)
        text += `      |Yes\\n      v\\n`
        if (yesNode) text += generateAsciiFlow(yesNode, new Set(visited))
      }
      if (node.nextNo) {
        const noNode = nodes.find(n => n.id === node.nextNo)
        text += `      |No\\n      v\\n`
        if (noNode) text += generateAsciiFlow(noNode, new Set(visited))
      }
      return text
    } else {
      text += `  [ ${label} ]\\n`
    }

    if (node.next) {
      text += `      |\\n      v\\n`
      const nextNode = nodes.find(n => n.id === node.next)
      if (nextNode) text += generateAsciiFlow(nextNode, visited)
    }

    return text
  }

  const copyFlow = () => {
    navigator.clipboard.writeText(generateFlow())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="text-sm text-slate-500 block mb-1">{t('tools.processFlowMaker.name')}</label>
        <input
          type="text"
          value={flowName}
          onChange={(e) => setFlowName(e.target.value)}
          placeholder="Process flow name"
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.processFlowMaker.addNode')}</h3>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(nodeStyles) as NodeType[]).map((type) => (
            <button
              key={type}
              onClick={() => addNode(type)}
              className={`px-4 py-2 border-2 rounded ${nodeStyles[type].color} hover:opacity-80`}
            >
              {nodeStyles[type].icon} {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.processFlowMaker.nodes')}</h3>
        <div className="space-y-3">
          {nodes.map((node, index) => (
            <div
              key={node.id}
              className={`p-4 border-2 rounded ${nodeStyles[node.type].color}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{nodeStyles[node.type].icon}</span>
                  <span className="text-sm font-medium uppercase text-slate-600">{node.type}</span>
                  <span className="text-xs text-slate-400">#{index + 1}</span>
                </div>
                {node.type !== 'start' && (
                  <button
                    onClick={() => removeNode(node.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                )}
              </div>

              <input
                type="text"
                value={node.label}
                onChange={(e) => updateNode(node.id, 'label', e.target.value)}
                placeholder="Node label"
                className="w-full px-3 py-2 border border-slate-300 rounded mb-2"
              />

              {node.type === 'decision' ? (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-500">Yes →</label>
                    <select
                      value={node.nextYes || ''}
                      onChange={(e) => updateNode(node.id, 'nextYes', e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                    >
                      <option value="">None</option>
                      {nodes.filter(n => n.id !== node.id).map((n, i) => (
                        <option key={n.id} value={n.id}>
                          #{i + 1} {n.label || n.type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">No →</label>
                    <select
                      value={node.nextNo || ''}
                      onChange={(e) => updateNode(node.id, 'nextNo', e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                    >
                      <option value="">None</option>
                      {nodes.filter(n => n.id !== node.id).map((n, i) => (
                        <option key={n.id} value={n.id}>
                          #{i + 1} {n.label || n.type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : node.type !== 'end' && (
                <div>
                  <label className="text-xs text-slate-500">Next →</label>
                  <select
                    value={node.next || ''}
                    onChange={(e) => updateNode(node.id, 'next', e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                  >
                    <option value="">None</option>
                    {nodes.filter(n => n.id !== node.id).map((n, i) => (
                      <option key={n.id} value={n.id}>
                        #{i + 1} {n.label || n.type}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.processFlowMaker.legend')}</h3>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center">▶</span>
            <span>Start/End</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded bg-blue-100 border-2 border-blue-500 flex items-center justify-center">⬜</span>
            <span>Process</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 bg-yellow-100 border-2 border-yellow-500 flex items-center justify-center rotate-45">
              <span className="-rotate-45">◇</span>
            </span>
            <span>Decision</span>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.processFlowMaker.export')}</h3>
        <pre className="bg-slate-100 p-4 rounded text-sm whitespace-pre-wrap font-mono max-h-64 overflow-y-auto">
          {generateFlow()}
        </pre>
        <button
          onClick={copyFlow}
          className="w-full mt-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('tools.processFlowMaker.copy')}
        </button>
      </div>
    </div>
  )
}
