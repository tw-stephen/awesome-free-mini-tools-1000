import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface OrgNode {
  id: string
  name: string
  title: string
  children: OrgNode[]
  collapsed?: boolean
}

interface Position {
  x: number
  y: number
  width: number
}

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#22c55e', '#f59e0b', '#ef4444']

export default function OrgChartGenerator() {
  const { t } = useTranslation()
  const svgRef = useRef<SVGSVGElement>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const [root, setRoot] = useState<OrgNode>({
    id: 'root',
    name: 'John Smith',
    title: 'CEO',
    children: [
      {
        id: '1',
        name: 'Alice Johnson',
        title: 'CTO',
        children: [
          { id: '1-1', name: 'Bob Wilson', title: 'Dev Lead', children: [] },
          { id: '1-2', name: 'Carol Davis', title: 'QA Lead', children: [] }
        ]
      },
      {
        id: '2',
        name: 'David Brown',
        title: 'CFO',
        children: [
          { id: '2-1', name: 'Eve Taylor', title: 'Accountant', children: [] }
        ]
      },
      {
        id: '3',
        name: 'Frank Miller',
        title: 'COO',
        children: []
      }
    ]
  })

  const [positions, setPositions] = useState<Map<string, Position>>(new Map())

  const NODE_WIDTH = 120
  const NODE_HEIGHT = 60
  const H_GAP = 20
  const V_GAP = 60

  useEffect(() => {
    const newPositions = new Map<string, Position>()

    const calculateWidth = (node: OrgNode): number => {
      if (node.children.length === 0 || node.collapsed) {
        return NODE_WIDTH
      }
      const childrenWidth = node.children.reduce((sum, child) => sum + calculateWidth(child) + H_GAP, -H_GAP)
      return Math.max(NODE_WIDTH, childrenWidth)
    }

    const calculatePositions = (node: OrgNode, x: number, y: number, depth: number) => {
      const width = calculateWidth(node)
      newPositions.set(node.id, { x: x + width / 2, y, width })

      if (!node.collapsed && node.children.length > 0) {
        let childX = x
        node.children.forEach(child => {
          const childWidth = calculateWidth(child)
          calculatePositions(child, childX, y + NODE_HEIGHT + V_GAP, depth + 1)
          childX += childWidth + H_GAP
        })
      }
    }

    const totalWidth = calculateWidth(root)
    calculatePositions(root, 400 - totalWidth / 2, 30, 0)
    setPositions(newPositions)
  }, [root])

  const findNode = (node: OrgNode, id: string): OrgNode | null => {
    if (node.id === id) return node
    for (const child of node.children) {
      const found = findNode(child, id)
      if (found) return found
    }
    return null
  }

  const getDepth = (id: string): number => {
    const getDepthRecursive = (node: OrgNode, currentDepth: number): number => {
      if (node.id === id) return currentDepth
      for (const child of node.children) {
        const depth = getDepthRecursive(child, currentDepth + 1)
        if (depth >= 0) return depth
      }
      return -1
    }
    return getDepthRecursive(root, 0)
  }

  const updateNode = (id: string, updates: Partial<OrgNode>) => {
    const updateRecursive = (node: OrgNode): OrgNode => {
      if (node.id === id) {
        return { ...node, ...updates }
      }
      return { ...node, children: node.children.map(updateRecursive) }
    }
    setRoot(updateRecursive(root))
  }

  const addChild = (parentId: string) => {
    const newId = Date.now().toString()
    const updateRecursive = (node: OrgNode): OrgNode => {
      if (node.id === parentId) {
        return {
          ...node,
          collapsed: false,
          children: [...node.children, { id: newId, name: 'New Person', title: 'Title', children: [] }]
        }
      }
      return { ...node, children: node.children.map(updateRecursive) }
    }
    setRoot(updateRecursive(root))
    setSelectedId(newId)
  }

  const deleteNode = (id: string) => {
    if (id === 'root') return
    const deleteRecursive = (node: OrgNode): OrgNode => {
      return {
        ...node,
        children: node.children.filter(child => child.id !== id).map(deleteRecursive)
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

  const renderConnections = (node: OrgNode): JSX.Element[] => {
    const elements: JSX.Element[] = []
    const pos = positions.get(node.id)
    if (!pos || node.collapsed) return elements

    node.children.forEach(child => {
      const childPos = positions.get(child.id)
      if (childPos) {
        elements.push(
          <path
            key={`conn-${child.id}`}
            d={`M ${pos.x} ${pos.y + NODE_HEIGHT}
                L ${pos.x} ${pos.y + NODE_HEIGHT + V_GAP / 2}
                L ${childPos.x} ${pos.y + NODE_HEIGHT + V_GAP / 2}
                L ${childPos.x} ${childPos.y}`}
            stroke="#94a3b8"
            strokeWidth="2"
            fill="none"
          />
        )
        elements.push(...renderConnections(child))
      }
    })
    return elements
  }

  const renderNodes = (node: OrgNode): JSX.Element[] => {
    const elements: JSX.Element[] = []
    const pos = positions.get(node.id)
    if (!pos) return elements

    const isSelected = selectedId === node.id
    const depth = getDepth(node.id)
    const color = COLORS[depth % COLORS.length]

    elements.push(
      <g
        key={node.id}
        transform={`translate(${pos.x - NODE_WIDTH / 2}, ${pos.y})`}
        onClick={(e) => { e.stopPropagation(); setSelectedId(node.id) }}
        onDoubleClick={(e) => { e.stopPropagation(); toggleCollapse(node.id) }}
        className="cursor-pointer"
      >
        <rect
          width={NODE_WIDTH}
          height={NODE_HEIGHT}
          rx="6"
          fill="white"
          stroke={isSelected ? '#3b82f6' : color}
          strokeWidth={isSelected ? 3 : 2}
          filter="url(#shadow)"
        />
        <rect
          width={NODE_WIDTH}
          height="6"
          rx="6"
          fill={color}
        />
        <text
          x={NODE_WIDTH / 2}
          y="28"
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fill="#1e293b"
          className="select-none pointer-events-none"
        >
          {node.name.length > 14 ? node.name.slice(0, 14) + '...' : node.name}
        </text>
        <text
          x={NODE_WIDTH / 2}
          y="44"
          textAnchor="middle"
          fontSize="10"
          fill="#64748b"
          className="select-none pointer-events-none"
        >
          {node.title.length > 16 ? node.title.slice(0, 16) + '...' : node.title}
        </text>
        {node.children.length > 0 && (
          <g transform={`translate(${NODE_WIDTH / 2}, ${NODE_HEIGHT})`}>
            <circle r="10" fill={node.collapsed ? color : 'white'} stroke={color} strokeWidth="2" />
            <text
              textAnchor="middle"
              dy="4"
              fontSize="12"
              fontWeight="bold"
              fill={node.collapsed ? 'white' : color}
              className="select-none pointer-events-none"
            >
              {node.collapsed ? '+' : '-'}
            </text>
          </g>
        )}
      </g>
    )

    if (!node.collapsed) {
      node.children.forEach(child => {
        elements.push(...renderNodes(child))
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
        a.download = 'org-chart.png'
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
          {t('tools.orgChart.addMember')}
        </Button>
        {selectedId && selectedId !== 'root' && (
          <Button variant="secondary" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => deleteNode(selectedId)}>
            {t('tools.orgChart.delete')}
          </Button>
        )}
        <div className="flex-1" />
        <Button variant="secondary" onClick={downloadImage}>{t('common.download')}</Button>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        <div
          className="flex-1 border border-slate-200 rounded-lg bg-slate-50 overflow-auto shadow-inner relative"
          onClick={() => setSelectedId(null)}
        >
          <svg
            ref={svgRef}
            viewBox="0 0 800 600"
            className="w-full h-full select-none"
          >
            <defs>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1" />
              </filter>
            </defs>
            <rect width="800" height="600" fill="#f8fafc" />
            {renderConnections(root)}
            {renderNodes(root)}
          </svg>

          <div className="absolute bottom-2 left-2 text-xs text-slate-400 pointer-events-none">
            {t('tools.orgChart.hint')}
          </div>
        </div>

        <div className="w-64 border-l border-slate-200 pl-4 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-700">{t('tools.orgChart.properties')}</h3>

          {selectedNode ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.orgChart.name')}</label>
                <input
                  type="text"
                  value={selectedNode.name}
                  onChange={(e) => updateNode(selectedId!, { name: e.target.value })}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.orgChart.title')}</label>
                <input
                  type="text"
                  value={selectedNode.title}
                  onChange={(e) => updateNode(selectedId!, { title: e.target.value })}
                  className="input w-full"
                />
              </div>
              <div className="text-xs text-slate-500">
                {t('tools.orgChart.reports')}: {selectedNode.children.length}
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-400">
              {t('tools.orgChart.selectHint')}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
