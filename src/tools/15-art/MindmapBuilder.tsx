import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface MindmapNode {
  id: number
  text: string
  children: MindmapNode[]
}

export default function MindmapBuilder() {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [root, setRoot] = useState<MindmapNode>({
    id: 1,
    text: 'Main Idea',
    children: [
      { id: 2, text: 'Topic 1', children: [
        { id: 5, text: 'Subtopic 1.1', children: [] },
        { id: 6, text: 'Subtopic 1.2', children: [] },
      ]},
      { id: 3, text: 'Topic 2', children: [] },
      { id: 4, text: 'Topic 3', children: [
        { id: 7, text: 'Subtopic 3.1', children: [] },
      ]},
    ],
  })
  const [colors] = useState(['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'])
  const [selectedId, setSelectedId] = useState<number | null>(null)

  useEffect(() => {
    drawMindmap()
  }, [root])

  const drawMindmap = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = 500
    const height = 400
    canvas.width = width
    canvas.height = height

    // Background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)

    // Draw from center
    const centerX = width / 2
    const centerY = height / 2

    // Draw root
    drawNode(ctx, root.text, centerX, centerY, '#3B82F6', true)

    // Draw children in a circle
    const childCount = root.children.length
    root.children.forEach((child, i) => {
      const angle = (Math.PI * 2 / childCount) * i - Math.PI / 2
      const radius = 120
      const childX = centerX + Math.cos(angle) * radius
      const childY = centerY + Math.sin(angle) * radius

      // Connection line
      ctx.strokeStyle = colors[i % colors.length]
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(childX, childY)
      ctx.stroke()

      // Child node
      drawNode(ctx, child.text, childX, childY, colors[i % colors.length], false)

      // Grandchildren
      const grandchildCount = child.children.length
      child.children.forEach((grandchild, j) => {
        const gcAngle = angle + (Math.PI / 4) * (j - (grandchildCount - 1) / 2)
        const gcRadius = 80
        const gcX = childX + Math.cos(gcAngle) * gcRadius
        const gcY = childY + Math.sin(gcAngle) * gcRadius

        ctx.strokeStyle = colors[i % colors.length]
        ctx.lineWidth = 2
        ctx.globalAlpha = 0.7
        ctx.beginPath()
        ctx.moveTo(childX, childY)
        ctx.lineTo(gcX, gcY)
        ctx.stroke()
        ctx.globalAlpha = 1

        drawNode(ctx, grandchild.text, gcX, gcY, colors[i % colors.length], false, true)
      })
    })
  }

  const drawNode = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color: string, isRoot: boolean, isSmall = false) => {
    const padding = isRoot ? 20 : isSmall ? 8 : 12
    const fontSize = isRoot ? 16 : isSmall ? 11 : 13
    ctx.font = `${isRoot ? 'bold ' : ''}${fontSize}px Arial`
    const textWidth = ctx.measureText(text).width
    const boxWidth = textWidth + padding * 2
    const boxHeight = isRoot ? 40 : isSmall ? 24 : 30

    // Background
    ctx.fillStyle = isRoot ? color : '#ffffff'
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.roundRect(x - boxWidth / 2, y - boxHeight / 2, boxWidth, boxHeight, boxHeight / 2)
    ctx.fill()
    ctx.stroke()

    // Text
    ctx.fillStyle = isRoot ? '#ffffff' : '#1F2937'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, x, y)
  }

  const updateNodeText = (nodeId: number, newText: string) => {
    const updateRecursive = (node: MindmapNode): MindmapNode => {
      if (node.id === nodeId) {
        return { ...node, text: newText }
      }
      return { ...node, children: node.children.map(updateRecursive) }
    }
    setRoot(updateRecursive(root))
  }

  const addChild = (parentId: number) => {
    const maxId = getMaxId(root)
    const addRecursive = (node: MindmapNode): MindmapNode => {
      if (node.id === parentId) {
        return {
          ...node,
          children: [...node.children, { id: maxId + 1, text: 'New Topic', children: [] }]
        }
      }
      return { ...node, children: node.children.map(addRecursive) }
    }
    setRoot(addRecursive(root))
  }

  const removeNode = (nodeId: number) => {
    if (nodeId === root.id) return
    const removeRecursive = (node: MindmapNode): MindmapNode => {
      return {
        ...node,
        children: node.children.filter(c => c.id !== nodeId).map(removeRecursive)
      }
    }
    setRoot(removeRecursive(root))
  }

  const getMaxId = (node: MindmapNode): number => {
    return Math.max(node.id, ...node.children.map(getMaxId))
  }

  const downloadMindmap = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'mindmap.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const renderNodeList = (node: MindmapNode, depth = 0): JSX.Element[] => {
    const elements: JSX.Element[] = []

    elements.push(
      <div
        key={node.id}
        className={`flex gap-2 items-center p-2 rounded ${depth === 0 ? 'bg-blue-50' : 'bg-slate-50'}`}
        style={{ marginLeft: depth * 20 }}
      >
        <input
          type="text"
          value={node.text}
          onChange={(e) => updateNodeText(node.id, e.target.value)}
          className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm"
        />
        <button
          onClick={() => addChild(node.id)}
          className="px-2 py-1 bg-green-100 text-green-600 rounded text-sm hover:bg-green-200"
          title="Add child"
        >
          +
        </button>
        {depth > 0 && (
          <button
            onClick={() => removeNode(node.id)}
            className="text-red-500 hover:text-red-600"
          >
            ×
          </button>
        )}
      </div>
    )

    node.children.forEach(child => {
      elements.push(...renderNodeList(child, depth + 1))
    })

    return elements
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex justify-center mb-4 overflow-x-auto">
          <canvas ref={canvasRef} className="border border-slate-200 rounded" />
        </div>
        <button
          onClick={downloadMindmap}
          className="w-full py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
        >
          {t('tools.mindmapBuilder.download')}
        </button>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.mindmapBuilder.nodes')}</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {renderNodeList(root)}
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.mindmapBuilder.tips')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• {t('tools.mindmapBuilder.tip1')}</li>
          <li>• {t('tools.mindmapBuilder.tip2')}</li>
          <li>• {t('tools.mindmapBuilder.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
