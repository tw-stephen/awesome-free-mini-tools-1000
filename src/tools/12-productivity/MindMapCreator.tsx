import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface MindMapNode {
  id: string
  text: string
  children: MindMapNode[]
  collapsed: boolean
}

interface MindMap {
  id: string
  title: string
  root: MindMapNode
  createdAt: string
}

export default function MindMapCreator() {
  const { t } = useTranslation()
  const [maps, setMaps] = useState<MindMap[]>([])
  const [currentMap, setCurrentMap] = useState<MindMap | null>(null)
  const [editingNode, setEditingNode] = useState<string | null>(null)
  const [_newNodeText, _setNewNodeText] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('mind-maps')
    if (saved) setMaps(JSON.parse(saved))
  }, [])

  const saveMaps = (updated: MindMap[]) => {
    setMaps(updated)
    localStorage.setItem('mind-maps', JSON.stringify(updated))
  }

  const createNewMap = () => {
    const newMap: MindMap = {
      id: Date.now().toString(),
      title: t('tools.mindMapCreator.newMap'),
      root: {
        id: 'root',
        text: t('tools.mindMapCreator.centralIdea'),
        children: [],
        collapsed: false
      },
      createdAt: new Date().toISOString()
    }
    setCurrentMap(newMap)
  }

  const saveCurrentMap = () => {
    if (!currentMap) return
    const existing = maps.find(m => m.id === currentMap.id)
    if (existing) {
      saveMaps(maps.map(m => m.id === currentMap.id ? currentMap : m))
    } else {
      saveMaps([...maps, currentMap])
    }
  }

  const deleteMap = (id: string) => {
    saveMaps(maps.filter(m => m.id !== id))
    if (currentMap?.id === id) setCurrentMap(null)
  }

  const updateNode = (nodeId: string, text: string, node: MindMapNode = currentMap!.root): MindMapNode => {
    if (node.id === nodeId) {
      return { ...node, text }
    }
    return {
      ...node,
      children: node.children.map(child => updateNode(nodeId, text, child))
    }
  }

  const addChildNode = (parentId: string, node: MindMapNode = currentMap!.root): MindMapNode => {
    if (node.id === parentId) {
      return {
        ...node,
        collapsed: false,
        children: [...node.children, {
          id: Date.now().toString(),
          text: t('tools.mindMapCreator.newNode'),
          children: [],
          collapsed: false
        }]
      }
    }
    return {
      ...node,
      children: node.children.map(child => addChildNode(parentId, child))
    }
  }

  const deleteNode = (nodeId: string, node: MindMapNode = currentMap!.root): MindMapNode => {
    return {
      ...node,
      children: node.children
        .filter(child => child.id !== nodeId)
        .map(child => deleteNode(nodeId, child))
    }
  }

  const toggleCollapse = (nodeId: string, node: MindMapNode = currentMap!.root): MindMapNode => {
    if (node.id === nodeId) {
      return { ...node, collapsed: !node.collapsed }
    }
    return {
      ...node,
      children: node.children.map(child => toggleCollapse(nodeId, child))
    }
  }

  const handleUpdateNode = (nodeId: string, text: string) => {
    if (!currentMap) return
    setCurrentMap({
      ...currentMap,
      root: updateNode(nodeId, text)
    })
    setEditingNode(null)
  }

  const handleAddChild = (parentId: string) => {
    if (!currentMap) return
    setCurrentMap({
      ...currentMap,
      root: addChildNode(parentId)
    })
  }

  const handleDeleteNode = (nodeId: string) => {
    if (!currentMap || nodeId === 'root') return
    setCurrentMap({
      ...currentMap,
      root: deleteNode(nodeId)
    })
  }

  const handleToggleCollapse = (nodeId: string) => {
    if (!currentMap) return
    setCurrentMap({
      ...currentMap,
      root: toggleCollapse(nodeId)
    })
  }

  const getNodeColors = (depth: number) => {
    const colors = [
      'bg-blue-100 border-blue-400',
      'bg-green-100 border-green-400',
      'bg-purple-100 border-purple-400',
      'bg-orange-100 border-orange-400',
      'bg-pink-100 border-pink-400',
      'bg-teal-100 border-teal-400'
    ]
    return colors[depth % colors.length]
  }

  const renderNode = (node: MindMapNode, depth: number = 0) => {
    const isEditing = editingNode === node.id

    return (
      <div key={node.id} className="relative">
        <div className={`flex items-center gap-2 mb-2`}>
          {depth > 0 && (
            <div className="w-4 border-t border-slate-300" />
          )}
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 ${getNodeColors(depth)} ${
              depth === 0 ? 'text-lg font-bold' : ''
            }`}
          >
            {node.children.length > 0 && (
              <button
                onClick={() => handleToggleCollapse(node.id)}
                className="w-5 h-5 flex items-center justify-center text-xs bg-white rounded"
              >
                {node.collapsed ? '+' : '-'}
              </button>
            )}
            {isEditing ? (
              <input
                type="text"
                defaultValue={node.text}
                onBlur={(e) => handleUpdateNode(node.id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleUpdateNode(node.id, e.currentTarget.value)
                  if (e.key === 'Escape') setEditingNode(null)
                }}
                autoFocus
                className="bg-transparent border-none outline-none min-w-[100px]"
              />
            ) : (
              <span
                onClick={() => setEditingNode(node.id)}
                className="cursor-pointer"
              >
                {node.text}
              </span>
            )}
            <div className="flex gap-1 ml-2">
              <button
                onClick={() => handleAddChild(node.id)}
                className="w-5 h-5 flex items-center justify-center text-xs bg-blue-500 text-white rounded"
                title={t('tools.mindMapCreator.addChild')}
              >
                +
              </button>
              {node.id !== 'root' && (
                <button
                  onClick={() => handleDeleteNode(node.id)}
                  className="w-5 h-5 flex items-center justify-center text-xs bg-red-500 text-white rounded"
                  title={t('tools.mindMapCreator.delete')}
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>
        {!node.collapsed && node.children.length > 0 && (
          <div className="ml-8 pl-4 border-l-2 border-slate-200">
            {node.children.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  const generateText = (node: MindMapNode, indent: number = 0): string => {
    const prefix = '  '.repeat(indent) + (indent > 0 ? '• ' : '')
    let text = prefix + node.text + '\n'
    node.children.forEach(child => {
      text += generateText(child, indent + 1)
    })
    return text
  }

  const copyAsText = () => {
    if (!currentMap) return
    const text = `${currentMap.title}\n${'='.repeat(40)}\n\n${generateText(currentMap.root)}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const countNodes = (node: MindMapNode): number => {
    return 1 + node.children.reduce((sum, child) => sum + countNodes(child), 0)
  }

  return (
    <div className="space-y-4">
      {!currentMap ? (
        <>
          <button
            onClick={createNewMap}
            className="w-full py-3 bg-blue-500 text-white rounded font-medium"
          >
            + {t('tools.mindMapCreator.createNew')}
          </button>

          {maps.length > 0 && (
            <div className="card p-4">
              <h3 className="font-medium text-slate-700 mb-3">{t('tools.mindMapCreator.savedMaps')}</h3>
              <div className="space-y-2">
                {maps.map(map => (
                  <div key={map.id} className="flex justify-between items-center p-3 bg-slate-50 rounded">
                    <div>
                      <div className="font-medium">{map.title}</div>
                      <div className="text-xs text-slate-500">
                        {countNodes(map.root)} {t('tools.mindMapCreator.nodes')} • {new Date(map.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentMap(map)}
                        className="text-sm text-blue-500"
                      >
                        {t('tools.mindMapCreator.open')}
                      </button>
                      <button
                        onClick={() => deleteMap(map.id)}
                        className="text-sm text-red-500"
                      >
                        {t('tools.mindMapCreator.delete')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="card p-4">
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={currentMap.title}
                onChange={(e) => setCurrentMap({ ...currentMap, title: e.target.value })}
                className="flex-1 px-3 py-2 border border-slate-300 rounded font-medium"
              />
              <button
                onClick={() => setCurrentMap(null)}
                className="px-4 py-2 bg-slate-100 rounded"
              >
                ←
              </button>
            </div>

            <div className="overflow-x-auto pb-4">
              {renderNode(currentMap.root)}
            </div>
          </div>

          <div className="flex gap-2 text-sm">
            <span className="text-slate-500">
              {countNodes(currentMap.root)} {t('tools.mindMapCreator.nodes')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={copyAsText}
              className={`py-2 rounded font-medium ${copied ? 'bg-green-500 text-white' : 'bg-slate-100'}`}
            >
              {copied ? '✓' : t('tools.mindMapCreator.copyAsText')}
            </button>
            <button
              onClick={saveCurrentMap}
              className="py-2 bg-blue-500 text-white rounded font-medium"
            >
              {t('tools.mindMapCreator.save')}
            </button>
          </div>

          <div className="card p-4 bg-blue-50">
            <h3 className="font-medium text-slate-700 mb-2">{t('tools.mindMapCreator.tips')}</h3>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• {t('tools.mindMapCreator.tip1')}</li>
              <li>• {t('tools.mindMapCreator.tip2')}</li>
              <li>• {t('tools.mindMapCreator.tip3')}</li>
            </ul>
          </div>
        </>
      )}
    </div>
  )
}
