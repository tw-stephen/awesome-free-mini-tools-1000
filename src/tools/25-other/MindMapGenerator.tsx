import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface MindNode {
  id: string
  text: string
  children: MindNode[]
  collapsed?: boolean
}

interface Position {
  x: number
  y: number
}

const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

export default function MindMapGenerator() {
  const { t } = useTranslation()
  const svgRef = useRef<SVGSVGElement>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const [root, setRoot] = useState<MindNode>({
    id: 'root',
    text: 'Main Topic',
    children: [
      {
        id: '1',
        text: 'Branch 1',
        children: [
          { id: '1-1', text: 'Sub-item 1.1', children: [] },
          { id: '1-2', text: 'Sub-item 1.2', children: [] }
        ]
      },
      {
        id: '2',
        text: 'Branch 2',
        children: [
          { id: '2-1', text: 'Sub-item 2.1', children: [] }
        ]
      },
      {
        id: '3',
        text: 'Branch 3',
        children: []
      }
    ]
  })

  const [positions, setPositions] = useState<Map<string, Position>>(new Map())

  // Calculate positions
  useEffect(() => {
    const newPositions = new Map<string, Position>()
    const centerX = 400
    const centerY = 300

    newPositions.set('root', { x: centerX, y: centerY })

    const calculateBranchPositions = (
      nodes: MindNode[],
      parentX: number,
      parentY: number,
      startAngle: number,
      endAngle: number,
      radius: number,
      depth: number
    ) => {
      if (nodes.length === 0) return

      const angleStep = (endAngle - startAngle) / nodes.length

      nodes.forEach((node, index) => {
        const angle = startAngle + angleStep * (index + 0.5)
        const x = parentX + Math.cos(angle) * radius
        const y = parentY + Math.sin(angle) * radius

        newPositions.set(node.id, { x, y })

        if (node.children.length > 0 && !node.collapsed) {
          const childRadius = Math.max(60, radius * 0.7)
          const spread = Math.min(Math.PI / 2, angleStep * 0.8)
          calculateBranchPositions(
            node.children,
            x,
            y,
            angle - spread / 2,
            angle + spread / 2,
            childRadius,
            depth + 1
          )
        }
      })
    }

    calculateBranchPositions(root.children, centerX, centerY, -Math.PI, Math.PI, 150, 0)
    setPositions(newPositions)
  }, [root])

  const findNode = (node: MindNode, id: string): MindNode | null => {
    if (node.id === id) return node
    for (const child of node.children) {
      const found = findNode(child, id)
      if (found) return found
    }
    return null
  }

  const findParent = (node: MindNode, id: string): MindNode | null => {
    for (const child of node.children) {
      if (child.id === id) return node
      const found = findParent(child, id)
      if (found) return found
    }
    return null
  }

  const updateNode = (id: string, updates: Partial<MindNode>) => {
    const updateRecursive = (node: MindNode): MindNode => {
      if (node.id === id) {
        return { ...node, ...updates }
      }
      return {
        ...node,
        children: node.children.map(updateRecursive)
      }
    }
    setRoot(updateRecursive(root))
  }

  const addChild = (parentId: string) => {
    const newId = Date.now().toString()
    const updateRecursive = (node: MindNode): MindNode => {
      if (node.id === parentId) {
        return {
          ...node,
          collapsed: false,
          children: [...node.children, { id: newId, text: 'New Item', children: [] }]
        }
      }
      return {
        ...node,
        children: node.children.map(updateRecursive)
      }
    }
    setRoot(updateRecursive(root))
    setSelectedId(newId)
  }

  const deleteNode = (id: string) => {
    if (id === 'root') return
    const deleteRecursive = (node: MindNode): MindNode => {
      return {
        ...node,
        children: node.children
          .filter(child => child.id !== id)
          .map(deleteRecursive)
      }
    }
    setRoot(deleteRecursive(root))
    setSelectedId(null)
  }

  const toggleCollapse = (id: string) => {
    const node = findNode(root, id)
    if (node && node.children.length > 0) {
      updateNode(id, { collapsed: !node.collapsed })
    }
  }

  const getDepth = (id: string): number => {
    const getDepthRecursive = (node: MindNode, currentDepth: number): number => {
      if (node.id === id) return currentDepth
      for (const child of node.children) {
        const depth = getDepthRecursive(child, currentDepth + 1)
        if (depth >= 0) return depth
      }
      return -1
    }
    return getDepthRecursive(root, 0)
  }

  const renderConnections = (node: MindNode, parentPos?: Position, colorIndex: number = 0) => {
    const pos = positions.get(node.id)
    if (!pos) return null

    const elements: JSX.Element[] = []

    if (parentPos) {
      const midX = (parentPos.x + pos.x) / 2
      elements.push(
        <path
          key={`conn-${node.id}`}
          d={`M ${parentPos.x} ${parentPos.y} Q ${midX} ${parentPos.y} ${pos.x} ${pos.y}`}
          stroke={COLORS[colorIndex % COLORS.length]}
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        />
      )
    }

    if (!node.collapsed) {
      node.children.forEach((child, index) => {
        const childColorIndex = node.id === 'root' ? index : colorIndex
        const childElements = renderConnections(child, pos, childColorIndex)
        if (childElements) elements.push(...childElements)
      })
    }

    return elements
  }

  const renderNodes = (node: MindNode, colorIndex: number = 0): JSX.Element[] => {
    const pos = positions.get(node.id)
    if (!pos) return []

    const elements: JSX.Element[] = []
    const isSelected = selectedId === node.id
    const isRoot = node.id === 'root'
    const color = isRoot ? '#1e293b' : COLORS[colorIndex % COLORS.length]
    const depth = getDepth(node.id)
    const fontSize = Math.max(10, 14 - depth * 2)
    const padding = Math.max(6, 12 - depth * 2)

    elements.push(
      <g
        key={node.id}
        transform={`translate(${pos.x}, ${pos.y})`}
        onClick={(e) => { e.stopPropagation(); setSelectedId(node.id) }}
        onDoubleClick={(e) => { e.stopPropagation(); toggleCollapse(node.id) }}
        className="cursor-pointer"
      >
        <rect
          x={-node.text.length * fontSize * 0.3 - padding}
          y={-fontSize - padding / 2}
          width={node.text.length * fontSize * 0.6 + padding * 2}
          height={fontSize * 2 + padding}
          rx="4"
          fill={isRoot ? color : 'white'}
          stroke={isSelected ? '#3b82f6' : color}
          strokeWidth={isSelected ? 3 : 2}
        />
        <text
          textAnchor="middle"
          dy="4"
          fill={isRoot ? 'white' : '#1e293b'}
          fontSize={fontSize}
          fontWeight={isRoot ? '600' : '500'}
          className="select-none pointer-events-none"
        >
          {node.text}
        </text>
        {node.children.length > 0 && (
          <circle
            cx={node.text.length * fontSize * 0.3 + padding + 8}
            cy="0"
            r="8"
            fill={node.collapsed ? color : 'white'}
            stroke={color}
            strokeWidth="2"
          />
        )}
        {node.children.length > 0 && (
          <text
            x={node.text.length * fontSize * 0.3 + padding + 8}
            y="4"
            textAnchor="middle"
            fontSize="10"
            fill={node.collapsed ? 'white' : color}
            fontWeight="bold"
            className="select-none pointer-events-none"
          >
            {node.collapsed ? '+' : '-'}
          </text>
        )}
      </g>
    )

    if (!node.collapsed) {
      node.children.forEach((child, index) => {
        const childColorIndex = node.id === 'root' ? index : colorIndex
        elements.push(...renderNodes(child, childColorIndex))
      })
    }

    return elements
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
        a.download = 'mindmap.png'
        a.href = canvas.toDataURL('image/png')
        a.click()
      }
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  const selectedNode = selectedId ? findNode(root, selectedId) : null

  return (
    <div className="flex flex-col gap-4 h-[600px]">
      <div className="flex gap-2 items-center">
        <Button variant="secondary" onClick={() => addChild(selectedId || 'root')}>
          {t('tools.mindMap.addChild')}
        </Button>
        {selectedId && selectedId !== 'root' && (
          <Button variant="secondary" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => deleteNode(selectedId)}>
            {t('tools.mindMap.delete')}
          </Button>
        )}
        <div className="flex-1" />
        <Button variant="secondary" onClick={downloadImage}>{t('common.download')}</Button>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        <div
          className="flex-1 border border-slate-200 rounded-lg bg-white overflow-hidden shadow-inner relative"
          onClick={() => setSelectedId(null)}
        >
          <svg
            ref={svgRef}
            viewBox="0 0 800 600"
            className="w-full h-full select-none"
          >
            {renderConnections(root)}
            {renderNodes(root)}
          </svg>

          <div className="absolute bottom-2 left-2 text-xs text-slate-400 pointer-events-none">
            {t('tools.mindMap.hint')}
          </div>
          <div className="absolute bottom-2 right-2 text-xs text-slate-400 pointer-events-none">
            800 x 600
          </div>
        </div>

        {/* Properties Panel */}
        <div className="w-64 border-l border-slate-200 pl-4 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-700">{t('tools.mindMap.properties')}</h3>

          {selectedNode ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.mindMap.text')}</label>
                <input
                  type="text"
                  value={selectedNode.text}
                  onChange={(e) => updateNode(selectedId!, { text: e.target.value })}
                  className="input w-full"
                />
              </div>
              <div className="text-xs text-slate-500">
                {t('tools.mindMap.children')}: {selectedNode.children.length}
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-400">
              {t('tools.mindMap.selectHint')}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
