import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface Node {
  id: string
  x: number
  y: number
  label: string
  color: string
}

interface Link {
  id: string
  sourceId: string
  targetId: string
  label: string
}

export default function RelationshipDiagramGenerator() {
  const { t } = useTranslation()
  const svgRef = useRef<SVGSVGElement>(null)
  
  const [nodes, setNodes] = useState<Node[]>([
    { id: '1', x: 200, y: 300, label: 'Person A', color: '#3b82f6' },
    { id: '2', x: 600, y: 300, label: 'Person B', color: '#ef4444' }
  ])
  const [links, setLinks] = useState<Link[]>([
    { id: 'l1', sourceId: '1', targetId: '2', label: 'Friends' }
  ])
  
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [mode, setMode] = useState<'select' | 'addNode' | 'addLink'>('select')
  const [linkStartNodeId, setLinkStartNodeId] = useState<string | null>(null)
  
  // Dragging
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const handleSvgClick = (e: React.MouseEvent) => {
    if (mode === 'addNode') {
      const rect = svgRef.current?.getBoundingClientRect()
      if (!rect) return
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      const newNode: Node = {
        id: Date.now().toString(),
        x,
        y,
        label: 'New Person',
        color: '#3b82f6'
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
      } else {
        if (linkStartNodeId !== id) {
          // Create link
          const newLink: Link = {
            id: Date.now().toString(),
            sourceId: linkStartNodeId,
            targetId: id,
            label: 'Relation'
          }
          setLinks([...links, newLink])
          setLinkStartNodeId(null)
          setMode('select')
        }
      }
      return
    }

    setSelectedNodeId(id)
    setIsDragging(true)
    const node = nodes.find(n => n.id === id)
    if (node) {
      setDragOffset({
        x: e.clientX - node.x,
        y: e.clientY - node.y
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && selectedNodeId && mode === 'select') {
      const x = e.clientX - dragOffset.x
      const y = e.clientY - dragOffset.y
      setNodes(nodes.map(n => n.id === selectedNodeId ? { ...n, x, y } : n))
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const updateSelectedNode = (updates: Partial<Node>) => {
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
        a.download = 'relationship-diagram.png'
        a.href = canvas.toDataURL('image/png')
        a.click()
      }
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
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
            {t('tools.relationshipDiagram.select')}
          </button>
          <button 
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${mode === 'addNode' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            onClick={() => setMode('addNode')}
          >
            {t('tools.relationshipDiagram.addNode')}
          </button>
          <button 
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${mode === 'addLink' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            onClick={() => setMode('addLink')}
          >
            {t('tools.relationshipDiagram.addLink')}
          </button>
        </div>
        
        {mode === 'addLink' && linkStartNodeId && (
          <span className="text-sm text-primary-600 animate-pulse">
            {t('tools.relationshipDiagram.selectTarget')}
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
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="28"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
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
                    stroke="#94a3b8"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                  />
                  <text x={midX} y={midY} dy="-5" textAnchor="middle" fill="#64748b" fontSize="12" className="bg-white">
                    {link.label}
                  </text>
                </g>
              )
            })}

            {/* Nodes */}
            {nodes.map(node => (
              <g 
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                className="cursor-move"
                style={{ outline: selectedNodeId === node.id ? '2px solid #3b82f6' : 'none' }}
              >
                <circle r="20" fill={node.color} />
                <text 
                  dy="35" 
                  textAnchor="middle" 
                  className="text-sm font-medium select-none pointer-events-none"
                  fill="#1e293b"
                >
                  {node.label}
                </text>
              </g>
            ))}
          </svg>
          
          <div className="absolute bottom-2 right-2 text-xs text-slate-400 pointer-events-none">
            800 x 600
          </div>
        </div>

        {/* Properties Panel */}
        <div className="w-64 border-l border-slate-200 pl-4 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-700">{t('tools.relationshipDiagram.properties')}</h3>
          
          {selectedNode ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.relationshipDiagram.label')}</label>
                <input 
                  type="text" 
                  value={selectedNode.label} 
                  onChange={(e) => updateSelectedNode({ label: e.target.value })}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.relationshipDiagram.color')}</label>
                <input 
                  type="color" 
                  value={selectedNode.color} 
                  onChange={(e) => updateSelectedNode({ color: e.target.value })}
                  className="w-full h-8 rounded cursor-pointer"
                />
              </div>
              <Button variant="secondary" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50" onClick={deleteSelected}>
                {t('tools.relationshipDiagram.delete')}
              </Button>
            </div>
          ) : (
            <div className="text-sm text-slate-400">
              {t('tools.relationshipDiagram.selectHint')}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
