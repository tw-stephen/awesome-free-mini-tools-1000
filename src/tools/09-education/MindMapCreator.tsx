import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Node {
  id: string
  text: string
  children: Node[]
}

export default function MindMapCreator() {
  const { t } = useTranslation()
  const [root, setRoot] = useState<Node>({ id: 'root', text: 'Main Topic', children: [] })
  const [selectedId, setSelectedId] = useState<string | null>('root')
  const [editText, setEditText] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('mindmap')
    if (saved) {
      try {
        setRoot(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load mindmap')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('mindmap', JSON.stringify(root))
  }, [root])

  const findNode = (node: Node, id: string): Node | null => {
    if (node.id === id) return node
    for (const child of node.children) {
      const found = findNode(child, id)
      if (found) return found
    }
    return null
  }

  const updateNode = (node: Node, id: string, newText: string): Node => {
    if (node.id === id) return { ...node, text: newText }
    return {
      ...node,
      children: node.children.map(child => updateNode(child, id, newText))
    }
  }

  const addChild = (node: Node, parentId: string): Node => {
    if (node.id === parentId) {
      return {
        ...node,
        children: [...node.children, { id: Date.now().toString(), text: 'New Node', children: [] }]
      }
    }
    return {
      ...node,
      children: node.children.map(child => addChild(child, parentId))
    }
  }

  const deleteNode = (node: Node, id: string): Node => {
    return {
      ...node,
      children: node.children
        .filter(child => child.id !== id)
        .map(child => deleteNode(child, id))
    }
  }

  const handleSelect = (id: string) => {
    setSelectedId(id)
    const node = findNode(root, id)
    if (node) setEditText(node.text)
  }

  const handleUpdate = () => {
    if (selectedId && editText.trim()) {
      setRoot(updateNode(root, selectedId, editText.trim()))
    }
  }

  const handleAddChild = () => {
    if (selectedId) {
      setRoot(addChild(root, selectedId))
    }
  }

  const handleDelete = () => {
    if (selectedId && selectedId !== 'root') {
      setRoot(deleteNode(root, selectedId))
      setSelectedId('root')
      setEditText(root.text)
    }
  }

  const renderNode = (node: Node, level: number = 0) => {
    const colors = ['bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-purple-100', 'bg-pink-100']
    const colorClass = colors[level % colors.length]

    return (
      <div key={node.id} className="ml-4">
        <div
          onClick={() => handleSelect(node.id)}
          className={`inline-block px-3 py-1 rounded cursor-pointer mb-2 ${colorClass} ${
            selectedId === node.id ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          {node.text}
        </div>
        {node.children.length > 0 && (
          <div className="border-l-2 border-slate-200 ml-4">
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  const exportAsText = () => {
    const toText = (node: Node, indent: number = 0): string => {
      const prefix = '  '.repeat(indent) + (indent > 0 ? '- ' : '')
      return prefix + node.text + '\n' + node.children.map(c => toText(c, indent + 1)).join('')
    }
    return toText(root)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleUpdate}
            onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
            placeholder={t('tools.mindMapCreator.nodeText')}
            className="flex-1 px-3 py-2 border border-slate-300 rounded"
          />
          <button
            onClick={handleAddChild}
            className="px-4 py-2 bg-blue-500 text-white rounded text-sm"
          >
            + {t('tools.mindMapCreator.addChild')}
          </button>
          {selectedId !== 'root' && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded text-sm"
            >
              {t('tools.mindMapCreator.delete')}
            </button>
          )}
        </div>
      </div>

      <div className="card p-4 overflow-x-auto">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.mindMapCreator.mindMap')}
        </h3>
        {renderNode(root)}
      </div>

      <div className="card p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.mindMapCreator.textExport')}
          </h3>
          <button
            onClick={() => navigator.clipboard.writeText(exportAsText())}
            className="px-3 py-1 text-sm bg-slate-100 rounded"
          >
            {t('common.copy')}
          </button>
        </div>
        <pre className="text-sm text-slate-600 p-3 bg-slate-50 rounded whitespace-pre-wrap overflow-x-auto">
          {exportAsText()}
        </pre>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.mindMapCreator.tips')}
        </h3>
        <div className="text-xs text-slate-500 space-y-1">
          <p>• {t('tools.mindMapCreator.tip1')}</p>
          <p>• {t('tools.mindMapCreator.tip2')}</p>
          <p>• {t('tools.mindMapCreator.tip3')}</p>
        </div>
      </div>
    </div>
  )
}
