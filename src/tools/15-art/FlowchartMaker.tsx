import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface FlowNode {
  id: number
  type: 'start' | 'process' | 'decision' | 'end'
  text: string
  x: number
  y: number
}

export default function FlowchartMaker() {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [nodes, setNodes] = useState<FlowNode[]>([
    { id: 1, type: 'start', text: 'Start', x: 200, y: 50 },
    { id: 2, type: 'process', text: 'Process 1', x: 200, y: 150 },
    { id: 3, type: 'decision', text: 'Condition?', x: 200, y: 250 },
    { id: 4, type: 'process', text: 'Process 2', x: 200, y: 350 },
    { id: 5, type: 'end', text: 'End', x: 200, y: 450 },
  ])
  const [selectedNode, setSelectedNode] = useState<number | null>(null)
  const [primaryColor, setPrimaryColor] = useState('#3B82F6')

  useEffect(() => {
    drawFlowchart()
  }, [nodes, primaryColor])

  const drawFlowchart = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = 400
    const height = 520
    canvas.width = width
    canvas.height = height

    // Background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)

    // Draw connections
    ctx.strokeStyle = '#374151'
    ctx.lineWidth = 2
    for (let i = 0; i < nodes.length - 1; i++) {
      const current = nodes[i]
      const next = nodes[i + 1]
      ctx.beginPath()
      ctx.moveTo(current.x, current.y + 30)
      ctx.lineTo(next.x, next.y - 30)
      ctx.stroke()

      // Arrow
      const arrowSize = 8
      const angle = Math.atan2(next.y - 30 - (current.y + 30), next.x - current.x)
      ctx.beginPath()
      ctx.moveTo(next.x, next.y - 30)
      ctx.lineTo(
        next.x - arrowSize * Math.cos(angle - Math.PI / 6),
        next.y - 30 - arrowSize * Math.sin(angle - Math.PI / 6)
      )
      ctx.lineTo(
        next.x - arrowSize * Math.cos(angle + Math.PI / 6),
        next.y - 30 - arrowSize * Math.sin(angle + Math.PI / 6)
      )
      ctx.closePath()
      ctx.fillStyle = '#374151'
      ctx.fill()
    }

    // Draw nodes
    nodes.forEach((node) => {
      drawNode(ctx, node)
    })
  }

  const drawNode = (ctx: CanvasRenderingContext2D, node: FlowNode) => {
    ctx.fillStyle = node.type === 'decision' ? '#FEF3C7' : '#ffffff'
    ctx.strokeStyle = node.id === selectedNode ? primaryColor : '#374151'
    ctx.lineWidth = node.id === selectedNode ? 3 : 2

    switch (node.type) {
      case 'start':
      case 'end':
        // Oval/rounded
        ctx.beginPath()
        ctx.ellipse(node.x, node.y, 50, 25, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        break
      case 'process':
        // Rectangle
        ctx.beginPath()
        ctx.roundRect(node.x - 60, node.y - 25, 120, 50, 5)
        ctx.fill()
        ctx.stroke()
        break
      case 'decision':
        // Diamond
        ctx.beginPath()
        ctx.moveTo(node.x, node.y - 30)
        ctx.lineTo(node.x + 60, node.y)
        ctx.lineTo(node.x, node.y + 30)
        ctx.lineTo(node.x - 60, node.y)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        break
    }

    // Text
    ctx.fillStyle = '#1F2937'
    ctx.font = '14px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(node.text, node.x, node.y)
  }

  const updateNodeText = (id: number, text: string) => {
    setNodes(nodes.map(n => n.id === id ? { ...n, text } : n))
  }

  const updateNodeType = (id: number, type: FlowNode['type']) => {
    setNodes(nodes.map(n => n.id === id ? { ...n, type } : n))
  }

  const addNode = () => {
    const lastNode = nodes[nodes.length - 1]
    const newId = Math.max(...nodes.map(n => n.id)) + 1
    // Insert before end
    const newNode: FlowNode = {
      id: newId,
      type: 'process',
      text: `Process ${newId}`,
      x: 200,
      y: lastNode.y,
    }
    // Move end node down
    setNodes([
      ...nodes.slice(0, -1),
      newNode,
      { ...lastNode, y: lastNode.y + 100 }
    ])
  }

  const removeNode = (id: number) => {
    const node = nodes.find(n => n.id === id)
    if (node?.type === 'start' || node?.type === 'end' || nodes.length <= 3) return
    setNodes(nodes.filter(n => n.id !== id))
    if (selectedNode === id) setSelectedNode(null)
  }

  const downloadFlowchart = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'flowchart.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const nodeTypes = [
    { id: 'start', name: 'Start/End', icon: '○' },
    { id: 'process', name: 'Process', icon: '▢' },
    { id: 'decision', name: 'Decision', icon: '◇' },
    { id: 'end', name: 'End', icon: '○' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex justify-center mb-4">
          <canvas ref={canvasRef} className="border border-slate-200 rounded" />
        </div>
        <div className="flex gap-2">
          <button
            onClick={addNode}
            className="flex-1 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            {t('tools.flowchartMaker.addNode')}
          </button>
          <button
            onClick={downloadFlowchart}
            className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t('tools.flowchartMaker.download')}
          </button>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.flowchartMaker.nodes')}</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {nodes.map((node) => (
            <div
              key={node.id}
              className={`flex gap-2 items-center p-2 rounded ${
                selectedNode === node.id ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50'
              }`}
              onClick={() => setSelectedNode(node.id)}
            >
              <select
                value={node.type}
                onChange={(e) => updateNodeType(node.id, e.target.value as FlowNode['type'])}
                className="px-2 py-1 border border-slate-300 rounded text-sm"
                disabled={node.type === 'start' || node.type === 'end'}
              >
                {nodeTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.icon} {type.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={node.text}
                onChange={(e) => updateNodeText(node.id, e.target.value)}
                className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm"
              />
              {node.type !== 'start' && node.type !== 'end' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeNode(node.id)
                  }}
                  className="text-red-500 hover:text-red-600"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.flowchartMaker.accentColor')}</h3>
        <input
          type="color"
          value={primaryColor}
          onChange={(e) => setPrimaryColor(e.target.value)}
          className="w-full h-10 cursor-pointer"
        />
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.flowchartMaker.about')}</h4>
        <p className="text-sm text-slate-600">
          {t('tools.flowchartMaker.aboutText')}
        </p>
      </div>
    </div>
  )
}
