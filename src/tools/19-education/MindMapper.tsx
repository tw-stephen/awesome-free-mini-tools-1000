import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Node {
  id: number
  text: string
  children: Node[]
  color: string
}

export default function MindMapper() {
  const { t } = useTranslation()
  const [root, setRoot] = useState<Node>({
    id: 1,
    text: 'Central Topic',
    children: [],
    color: '#3b82f6',
  })
  const [selectedId, setSelectedId] = useState<number | null>(1)

  const colors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
  ]

  const findNode = (node: Node, id: number): Node | null => {
    if (node.id === id) return node
    for (const child of node.children) {
      const found = findNode(child, id)
      if (found) return found
    }
    return null
  }

  const findParent = (node: Node, id: number, parent: Node | null = null): Node | null => {
    if (node.id === id) return parent
    for (const child of node.children) {
      const found = findParent(child, id, node)
      if (found) return found
    }
    return null
  }

  const updateNode = (node: Node, id: number, updates: Partial<Node>): Node => {
    if (node.id === id) {
      return { ...node, ...updates }
    }
    return {
      ...node,
      children: node.children.map(child => updateNode(child, id, updates)),
    }
  }

  const addChild = (parentId: number) => {
    const newNode: Node = {
      id: Date.now(),
      text: 'New Topic',
      children: [],
      color: colors[Math.floor(Math.random() * colors.length)],
    }

    const addToNode = (node: Node): Node => {
      if (node.id === parentId) {
        return { ...node, children: [...node.children, newNode] }
      }
      return { ...node, children: node.children.map(addToNode) }
    }

    setRoot(addToNode(root))
    setSelectedId(newNode.id)
  }

  const deleteNode = (id: number) => {
    if (id === root.id) return

    const removeFromNode = (node: Node): Node => {
      return {
        ...node,
        children: node.children
          .filter(child => child.id !== id)
          .map(removeFromNode),
      }
    }

    setRoot(removeFromNode(root))
    setSelectedId(root.id)
  }

  const updateText = (id: number, text: string) => {
    setRoot(updateNode(root, id, { text }))
  }

  const updateColor = (id: number, color: string) => {
    setRoot(updateNode(root, id, { color }))
  }

  const generateText = (node: Node, level: number = 0): string => {
    const indent = '  '.repeat(level)
    let result = `${indent}${level === 0 ? '' : '- '}${node.text}\n`
    node.children.forEach(child => {
      result += generateText(child, level + 1)
    })
    return result
  }

  const copyMindMap = () => {
    navigator.clipboard.writeText(generateText(root))
  }

  const countNodes = (node: Node): number => {
    return 1 + node.children.reduce((sum, child) => sum + countNodes(child), 0)
  }

  const RenderNode = ({ node, level = 0 }: { node: Node; level?: number }) => {
    const isSelected = selectedId === node.id
    const isRoot = level === 0

    return (
      <div className={`${isRoot ? '' : 'ml-6 border-l-2 pl-4'}`} style={{ borderColor: node.color }}>
        <div
          onClick={() => setSelectedId(node.id)}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded cursor-pointer mb-2
            ${isSelected ? 'ring-2 ring-blue-400' : ''}`}
          style={{ backgroundColor: `${node.color}20` }}
        >
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: node.color }} />
          <input
            type="text"
            value={node.text}
            onChange={(e) => updateText(node.id, e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="bg-transparent border-none focus:outline-none font-medium"
            style={{ color: node.color }}
          />
        </div>
        {node.children.length > 0 && (
          <div className="space-y-1">
            {node.children.map(child => (
              <RenderNode key={child.id} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  const selectedNode = selectedId ? findNode(root, selectedId) : null

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.mindMapper.controls')}</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => selectedId && addChild(selectedId)}
            disabled={!selectedId}
            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300"
          >
            Add Child
          </button>
          <button
            onClick={() => selectedId && deleteNode(selectedId)}
            disabled={!selectedId || selectedId === root.id}
            className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-slate-300"
          >
            Delete
          </button>
          <button
            onClick={copyMindMap}
            className="px-3 py-2 bg-slate-200 rounded hover:bg-slate-300"
          >
            {t('tools.mindMapper.export')}
          </button>
        </div>

        {selectedNode && (
          <div className="mt-3 pt-3 border-t">
            <label className="text-sm text-slate-500 block mb-2">Node Color</label>
            <div className="flex gap-2">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => updateColor(selectedNode.id, color)}
                  className={`w-8 h-8 rounded-full ${selectedNode.color === color ? 'ring-2 ring-offset-2' : ''}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="card p-4 bg-slate-50">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">Total Nodes</span>
          <span className="font-medium">{countNodes(root)}</span>
        </div>
      </div>

      <div className="card p-6 min-h-[400px] overflow-auto">
        <RenderNode node={root} />
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.mindMapper.tips')}</h3>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• Click a node to select it</li>
          <li>• Add children to selected nodes</li>
          <li>• Change colors to organize topics</li>
          <li>• Export as text outline for notes</li>
        </ul>
      </div>
    </div>
  )
}
