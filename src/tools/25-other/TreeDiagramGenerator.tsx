import { useState, useRef, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'
import TextArea from '../../components/ui/TextArea'

interface TreeNode {
  name: string
  children: TreeNode[]
  x?: number
  y?: number
}

export default function TreeDiagramGenerator() {
  const { t } = useTranslation()
  const svgRef = useRef<SVGSVGElement>(null)
  const [inputText, setInputText] = useState(`Root
  Child 1
    Grandchild 1.1
    Grandchild 1.2
  Child 2
    Grandchild 2.1`)

  const treeData = useMemo(() => {
    const lines = inputText.split('\n').filter(line => line.trim())
    if (lines.length === 0) return null

    const root: TreeNode = { name: 'Root', children: [] }
    const stack: { node: TreeNode; level: number }[] = []

    // Heuristic to find root or create a dummy one if multiple roots
    // For simplicity, we assume the first line is root or we wrap everything
    
    lines.forEach((line, index) => {
      const trimmed = line.trim()
      // Calculate indentation (2 spaces = 1 level)
      const level = line.search(/\S/) / 2

      const newNode: TreeNode = { name: trimmed, children: [] }

      if (index === 0) {
        stack.push({ node: newNode, level })
        return
      }

      // Find parent
      while (stack.length > 0 && stack[stack.length - 1].level >= level) {
        stack.pop()
      }

      if (stack.length > 0) {
        stack[stack.length - 1].node.children.push(newNode)
      } else {
        // Fallback if indentation is weird, just add to a new root?
        // Or assume the first item was the actual root.
        // If we are here, it means we have a new top-level item (sibling to root)
        // Let's just push to stack to keep track but it might not attach to anything if it's root sibling.
        // Let's wrap everything in a virtual root if strictly needed, but let's try to handle the first line as actual root.
      }
      stack.push({ node: newNode, level })
    })

    // If the user's input format implies the first line is the root, we use the first item of stack history?
    // Actually, the stack logic above builds a tree if indentation is correct.
    // We need to return the node that corresponds to the first line.
    // Let's re-parse simpler:
    
    const rootNodes: TreeNode[] = []
    const levelStack: { node: TreeNode; level: number }[] = []

    lines.forEach(line => {
      const content = line.trim()
      const level = Math.floor((line.length - line.trimLeft().length) / 2)
      const node = { name: content, children: [] }

      if (level === 0) {
        rootNodes.push(node)
        levelStack.length = 0 // Clear stack
        levelStack.push({ node, level })
      } else {
        // Pop until we find the parent (level - 1)
        while (levelStack.length > 0 && levelStack[levelStack.length - 1].level >= level) {
          levelStack.pop()
        }
        
        if (levelStack.length > 0) {
          levelStack[levelStack.length - 1].node.children.push(node)
        }
        levelStack.push({ node, level })
      }
    })

    return rootNodes.length > 0 ? rootNodes[0] : null
  }, [inputText])

  // Simple Tree Layout Algorithm
  const layoutTree = (root: TreeNode | null) => {
    if (!root) return { nodes: [], links: [], width: 0, height: 0 }

    const nodeWidth = 120
    const nodeHeight = 40
    const gapX = 50
    const gapY = 60
    const nodes: any[] = []
    const links: any[] = []

    // Assign depths and traverse to determine vertical positions (y)
    // We'll implement a simple algorithm: 
    // DFS to assign Y based on leaf index
    
    let currentY = 0
    
    const assignPositions = (node: TreeNode, depth: number) => {
      // Process children first to center parent? Or simple top-down?
      // Let's do a simple "leaf counting" layout or "layer" layout.
      // Vertical tree: depth = y, horizontal spacing = x
      // Horizontal tree (often easier for text): depth = x, vertical spacing = y
      
      // Let's do Horizontal Tree: Root on left
      
      if (node.children.length === 0) {
        node.y = currentY
        currentY += gapY
      } else {
        node.children.forEach(child => assignPositions(child, depth + 1))
        // Parent Y is average of first and last child
        const firstChild = node.children[0]
        const lastChild = node.children[node.children.length - 1]
        node.y = (firstChild.y! + lastChild.y!) / 2
      }
      
      node.x = depth * (nodeWidth + gapX) + 50 // 50 padding
      
      nodes.push({ ...node, id: Math.random() }) // flatten for rendering
      node.children.forEach(child => {
        links.push({ source: node, target: child })
      })
    }

    assignPositions(root, 0)
    
    const height = currentY + gapY
    const maxDepth = Math.max(...nodes.map(n => n.x)) + nodeWidth + 50
    
    return { nodes, links, width: maxDepth, height }
  }

  const { nodes, links, width, height } = useMemo(() => layoutTree(treeData), [treeData])

  const downloadImage = () => {
    if (!svgRef.current) return
    const svgData = new XMLSerializer().serializeToString(svgRef.current)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    canvas.width = width
    canvas.height = height
    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
        const a = document.createElement('a')
        a.download = 'tree-diagram.png'
        a.href = canvas.toDataURL('image/png')
        a.click()
      }
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-200px)] min-h-[600px]">
      <div className="w-full md:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex-1 flex flex-col">
          <h3 className="font-semibold text-slate-700 mb-2">{t('tools.treeDiagram.input')}</h3>
          <p className="text-xs text-slate-500 mb-2">{t('tools.treeDiagram.hint')}</p>
          <TextArea 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 font-mono text-sm"
            placeholder="Root&#10;  Child 1&#10;    Grandchild"
          />
        </div>
      </div>

      <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        <div className="p-2 border-b border-slate-100 flex justify-end bg-slate-50">
          <Button variant="secondary" onClick={downloadImage} disabled={!treeData}>
            {t('common.download')}
          </Button>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          {treeData ? (
            <svg 
              ref={svgRef}
              width={width} 
              height={height}
              className="min-w-full min-h-full"
            >
              <g>
                {links.map((link, i) => (
                  <path
                    key={i}
                    d={`M${link.source.x + 120},${link.source.y + 20} 
                       C${link.source.x + 120 + 50},${link.source.y + 20} 
                        ${link.target.x - 50},${link.target.y + 20} 
                        ${link.target.x},${link.target.y + 20}`}
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="2"
                  />
                ))}
                {nodes.map((node, i) => (
                  <g key={i} transform={`translate(${node.x}, ${node.y})`}>
                    <rect
                      width="120"
                      height="40"
                      rx="6"
                      fill="#eff6ff"
                      stroke="#3b82f6"
                      strokeWidth="1"
                    />
                    <text
                      x="60"
                      y="20"
                      dy="0.3em"
                      textAnchor="middle"
                      className="text-xs font-medium fill-slate-700"
                      style={{ fontSize: '12px' }}
                    >
                      {node.name.length > 15 ? node.name.substring(0, 14) + '...' : node.name}
                    </text>
                  </g>
                ))}
              </g>
            </svg>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              {t('tools.treeDiagram.empty')}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
