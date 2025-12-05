import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface FlowNode {
  id: string
  x: number
  y: number
  label: string
  type: 'start' | 'end' | 'process' | 'decision' | 'io'
}

interface FlowLink {
  id: string
  sourceId: string
  targetId: string
  label: string
}

const nodeColors: Record<FlowNode['type'], string> = {
  start: '#22c55e',
  end: '#ef4444',
  process: '#3b82f6',
  decision: '#f59e0b',
  io: '#8b5cf6'
}

export default function FlowchartGenerator() {
  const { t } = useTranslation()
  const svgRef = useRef<SVGSVGElement>(null)

  const [nodes, setNodes] = useState<FlowNode[]>([
    { id: '1', x: 400, y: 50, label: 'Start', type: 'start' },
    { id: '2', x: 400, y: 150, label: 'Process', type: 'process' },
    { id: '3', x: 400, y: 250, label: 'Decision?', type: 'decision' },
    { id: '4', x: 250, y: 350, label: 'Yes Action', type: 'process' },
    { id: '5', x: 550, y: 350, label: 'No Action', type: 'process' },
    { id: '6', x: 400, y: 450, label: 'End', type: 'end' }
  ])
  const [links, setLinks] = useState<FlowLink[]>([
    { id: 'l1', sourceId: '1', targetId: '2', label: '' },
    { id: 'l2', sourceId: '2', targetId: '3', label: '' },
    { id: 'l3', sourceId: '3', targetId: '4', label: 'Yes' },
    { id: 'l4', sourceId: '3', targetId: '5', label: 'No' },
    { id: 'l5', sourceId: '4', targetId: '6', label: '' },
    { id: 'l6', sourceId: '5', targetId: '6', label: '' }
  ])

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [mode, setMode] = useState<'select' | 'addNode' | 'addLink'>('select')
  const [newNodeType, setNewNodeType] = useState<FlowNode['type']>('process')
  const [linkStartNodeId, setLinkStartNodeId] = useState<string | null>(null)

  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const handleSvgClick = (e: React.MouseEvent) => {
    if (mode === 'addNode') {
      const rect = svgRef.current?.getBoundingClientRect()
      if (!rect) return
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const newNode: FlowNode = {
        id: Date.now().toString(),
        x,
        y,
        label: newNodeType === 'decision' ? 'Condition?' : newNodeType.charAt(0).toUpperCase() + newNodeType.slice(1),
        type: newNodeType
      }
      setNodes([...nodes, newNode])
      setMode('select')
    } else {
      setSelectedNodeId(null)
      setLinkStartNodeId(null)
    }
  }

  const handleNodeMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()

    if (mode === 'addLink') {
      if (linkStartNodeId === null) {
        setLinkStartNodeId(id)
      } else if (linkStartNodeId !== id) {
        const newLink: FlowLink = {
          id: Date.now().toString(),
          sourceId: linkStartNodeId,
          targetId: id,
          label: ''
        }
        setLinks([...links, newLink])
        setLinkStartNodeId(null)
        setMode('select')
      }
      return
    }

    setSelectedNodeId(id)
    setIsDragging(true)
    const node = nodes.find(n => n.id === id)
    if (node) {
      const rect = svgRef.current?.getBoundingClientRect()
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left - node.x,
          y: e.clientY - rect.top - node.y
        })
      }
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && selectedNodeId && mode === 'select') {
      const rect = svgRef.current?.getBoundingClientRect()
      if (!rect) return
      const x = e.clientX - rect.left - dragOffset.x
      const y = e.clientY - rect.top - dragOffset.y
      setNodes(nodes.map(n => n.id === selectedNodeId ? { ...n, x, y } : n))
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const updateSelectedNode = (updates: Partial<FlowNode>) => {
    if (selectedNodeId) {
      setNodes(nodes.map(n => n.id === selectedNodeId ? { ...n, ...updates } : n))
    }
  }

  const deleteSelected = () => {
    if (selectedNodeId) {
      setNodes(nodes.filter(n => n.id !== selectedNodeId))
      setLinks(links.filter(l => l.sourceId !== selectedNodeId && l.targetId !== selectedNodeId))
      setSelectedNodeId(null)
    }
  }

  const downloadImage = () => {
    if (!svgRef.current) return
    const svgData = new XMLSerializer().serializeToString(svgRef.current)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    canvas.width = 800
    canvas.height = 600
    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
        const a = document.createElement('a')
        a.download = 'flowchart.png'
        a.href = canvas.toDataURL('image/png')
        a.click()
      }
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  const renderNode = (node: FlowNode) => {
    const isSelected = selectedNodeId === node.id
    const color = nodeColors[node.type]

    switch (node.type) {
      case 'start':
      case 'end':
        return (
          <g key={node.id} transform={`translate(${node.x}, ${node.y})`} onMouseDown={(e) => handleNodeMouseDown(e, node.id)} className="cursor-move">
            <ellipse rx="40" ry="25" fill={color} stroke={isSelected ? '#1e40af' : '#fff'} strokeWidth={isSelected ? 3 : 2} />
            <text textAnchor="middle" dy="5" fill="white" fontSize="12" fontWeight="500" className="select-none pointer-events-none">{node.label}</text>
          </g>
        )
      case 'process':
        return (
          <g key={node.id} transform={`translate(${node.x}, ${node.y})`} onMouseDown={(e) => handleNodeMouseDown(e, node.id)} className="cursor-move">
            <rect x="-50" y="-25" width="100" height="50" rx="4" fill={color} stroke={isSelected ? '#1e40af' : '#fff'} strokeWidth={isSelected ? 3 : 2} />
            <text textAnchor="middle" dy="5" fill="white" fontSize="12" fontWeight="500" className="select-none pointer-events-none">{node.label}</text>
          </g>
        )
      case 'decision':
        return (
          <g key={node.id} transform={`translate(${node.x}, ${node.y})`} onMouseDown={(e) => handleNodeMouseDown(e, node.id)} className="cursor-move">
            <polygon points="0,-35 50,0 0,35 -50,0" fill={color} stroke={isSelected ? '#1e40af' : '#fff'} strokeWidth={isSelected ? 3 : 2} />
            <text textAnchor="middle" dy="5" fill="white" fontSize="11" fontWeight="500" className="select-none pointer-events-none">{node.label}</text>
          </g>
        )
      case 'io':
        return (
          <g key={node.id} transform={`translate(${node.x}, ${node.y})`} onMouseDown={(e) => handleNodeMouseDown(e, node.id)} className="cursor-move">
            <polygon points="-40,-25 50,-25 40,25 -50,25" fill={color} stroke={isSelected ? '#1e40af' : '#fff'} strokeWidth={isSelected ? 3 : 2} />
            <text textAnchor="middle" dy="5" fill="white" fontSize="12" fontWeight="500" className="select-none pointer-events-none">{node.label}</text>
          </g>
        )
    }
  }

  const selectedNode = nodes.find(n => n.id === selectedNodeId)

  return (
    <div className="flex flex-col gap-4 h-[600px]">
      <div className="flex gap-2 flex-wrap items-center">
        <div className="flex rounded-lg bg-slate-100 p-1">
          <button
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${mode === 'select' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            onClick={() => setMode('select')}
          >
            {t('tools.flowchart.select')}
          </button>
          <button
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${mode === 'addNode' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            onClick={() => setMode('addNode')}
          >
            {t('tools.flowchart.addNode')}
          </button>
          <button
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${mode === 'addLink' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            onClick={() => setMode('addLink')}
          >
            {t('tools.flowchart.addLink')}
          </button>
        </div>

        {mode === 'addNode' && (
          <select
            value={newNodeType}
            onChange={(e) => setNewNodeType(e.target.value as FlowNode['type'])}
            className="input py-1 text-sm"
          >
            <option value="start">{t('tools.flowchart.types.start')}</option>
            <option value="end">{t('tools.flowchart.types.end')}</option>
            <option value="process">{t('tools.flowchart.types.process')}</option>
            <option value="decision">{t('tools.flowchart.types.decision')}</option>
            <option value="io">{t('tools.flowchart.types.io')}</option>
          </select>
        )}

        {mode === 'addLink' && linkStartNodeId && (
          <span className="text-sm text-primary-600 animate-pulse">
            {t('tools.flowchart.selectTarget')}
          </span>
        )}

        <div className="flex-1" />
        <Button variant="secondary" onClick={downloadImage}>{t('common.download')}</Button>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        <div
          className="flex-1 border border-slate-200 rounded-lg bg-white overflow-hidden shadow-inner relative cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleSvgClick}
        >
          <svg
            ref={svgRef}
            viewBox="0 0 800 600"
            className="w-full h-full select-none"
          >
            <defs>
              <marker id="flowArrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
              </marker>
            </defs>

            {/* Links */}
            {links.map(link => {
              const source = nodes.find(n => n.id === link.sourceId)
              const target = nodes.find(n => n.id === link.targetId)
              if (!source || !target) return null

              const midX = (source.x + target.x) / 2
              const midY = (source.y + target.y) / 2

              return (
                <g key={link.id}>
                  <line
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    stroke="#64748b"
                    strokeWidth="2"
                    markerEnd="url(#flowArrow)"
                  />
                  {link.label && (
                    <text x={midX} y={midY} dy="-5" textAnchor="middle" fill="#475569" fontSize="11" fontWeight="500">
                      {link.label}
                    </text>
                  )}
                </g>
              )
            })}

            {/* Nodes */}
            {nodes.map(renderNode)}
          </svg>

          <div className="absolute bottom-2 right-2 text-xs text-slate-400 pointer-events-none">
            800 x 600
          </div>
        </div>

        {/* Properties Panel */}
        <div className="w-64 border-l border-slate-200 pl-4 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-700">{t('tools.flowchart.properties')}</h3>

          {selectedNode ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.flowchart.label')}</label>
                <input
                  type="text"
                  value={selectedNode.label}
                  onChange={(e) => updateSelectedNode({ label: e.target.value })}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.flowchart.type')}</label>
                <select
                  value={selectedNode.type}
                  onChange={(e) => updateSelectedNode({ type: e.target.value as FlowNode['type'] })}
                  className="input w-full"
                >
                  <option value="start">{t('tools.flowchart.types.start')}</option>
                  <option value="end">{t('tools.flowchart.types.end')}</option>
                  <option value="process">{t('tools.flowchart.types.process')}</option>
                  <option value="decision">{t('tools.flowchart.types.decision')}</option>
                  <option value="io">{t('tools.flowchart.types.io')}</option>
                </select>
              </div>
              <Button variant="secondary" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50" onClick={deleteSelected}>
                {t('tools.flowchart.delete')}
              </Button>
            </div>
          ) : (
            <div className="text-sm text-slate-400">
              {t('tools.flowchart.selectHint')}
            </div>
          )}

          {/* Legend */}
          <div className="mt-auto pt-4 border-t border-slate-200">
            <h4 className="text-xs font-medium text-slate-500 mb-2">{t('tools.flowchart.legend')}</h4>
            <div className="space-y-1 text-xs">
              {Object.entries(nodeColors).map(([type, color]) => (
                <div key={type} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
                  <span className="text-slate-600 capitalize">{t(`tools.flowchart.types.${type}`)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
