import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface Element {
  id: string
  type: 'text' | 'rect' | 'circle'
  x: number
  y: number
  width?: number
  height?: number
  radius?: number
  fill: string
  text?: string
  fontSize?: number
}

export default function InfographicGenerator() {
  const { t } = useTranslation()
  const [elements, setElements] = useState<Element[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  
  // Dragging state
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const addElement = (type: Element['type']) => {
    const id = Date.now().toString()
    const newElement: Element = {
      id,
      type,
      x: 100,
      y: 100,
      fill: type === 'text' ? '#333333' : '#3b82f6',
      ...(type === 'rect' && { width: 100, height: 100 }),
      ...(type === 'circle' && { radius: 50 }),
      ...(type === 'text' && { text: 'Text', fontSize: 24 }),
    }
    setElements([...elements, newElement])
    setSelectedId(id)
  }

  const updateElement = (id: string, updates: Partial<Element>) => {
    setElements(elements.map(el => el.id === id ? { ...el, ...updates } : el))
  }

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setSelectedId(id)
    setIsDragging(true)
    const element = elements.find(el => el.id === id)
    if (element) {
      setDragOffset({
        x: e.clientX - element.x,
        y: e.clientY - element.y
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && selectedId) {
      const x = e.clientX - dragOffset.x
      const y = e.clientY - dragOffset.y
      updateElement(selectedId, { x, y })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const deleteSelected = () => {
    if (selectedId) {
      setElements(elements.filter(el => el.id !== selectedId))
      setSelectedId(null)
    }
  }

  const downloadImage = () => {
    if (!svgRef.current) return
    
    const svgData = new XMLSerializer().serializeToString(svgRef.current)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    // Set dimensions (fixed for now or based on viewBox)
    canvas.width = 800
    canvas.height = 600
    
    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
        const url = canvas.toDataURL('image/png')
        const a = document.createElement('a')
        a.href = url
        a.download = 'infographic.png'
        a.click()
      }
    }
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  const selectedElement = elements.find(el => el.id === selectedId)

  return (
    <div className="flex flex-col gap-4 h-[600px]">
      <div className="flex gap-2 flex-wrap">
        <Button onClick={() => addElement('rect')}>{t('tools.infographicGenerator.addRect')}</Button>
        <Button onClick={() => addElement('circle')}>{t('tools.infographicGenerator.addCircle')}</Button>
        <Button onClick={() => addElement('text')}>{t('tools.infographicGenerator.addText')}</Button>
        <div className="flex-1" />
        <Button variant="secondary" onClick={downloadImage}>{t('common.download')}</Button>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Canvas Area */}
        <div 
          className="flex-1 border border-slate-200 rounded-lg bg-white overflow-hidden shadow-inner relative"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <svg 
            ref={svgRef}
            viewBox="0 0 800 600" 
            className="w-full h-full select-none"
            onClick={() => setSelectedId(null)}
          >
            {elements.map(el => (
              <g 
                key={el.id}
                transform={`translate(${el.x}, ${el.y})`}
                onMouseDown={(e) => handleMouseDown(e, el.id)}
                className="cursor-move"
                style={{ outline: selectedId === el.id ? '2px solid #3b82f6' : 'none' }}
              >
                {el.type === 'rect' && (
                  <rect width={el.width} height={el.height} fill={el.fill} />
                )}
                {el.type === 'circle' && (
                  <circle r={el.radius} fill={el.fill} />
                )}
                {el.type === 'text' && (
                  <text fontSize={el.fontSize} fill={el.fill} dy="1em">{el.text}</text>
                )}
              </g>
            ))}
          </svg>
          <div className="absolute bottom-2 right-2 text-xs text-slate-400 pointer-events-none">
            800 x 600
          </div>
        </div>

        {/* Properties Panel */}
        <div className="w-64 border-l border-slate-200 pl-4 flex flex-col gap-4 overflow-y-auto">
          <h3 className="font-semibold text-slate-700">{t('tools.infographicGenerator.properties')}</h3>
          
          {selectedElement ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Color</label>
                <input 
                  type="color" 
                  value={selectedElement.fill} 
                  onChange={(e) => updateElement(selectedElement.id, { fill: e.target.value })}
                  className="w-full h-8 rounded cursor-pointer"
                />
              </div>
              
              {selectedElement.type === 'text' && (
                <>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Text</label>
                    <input 
                      type="text" 
                      value={selectedElement.text} 
                      onChange={(e) => updateElement(selectedElement.id, { text: e.target.value })}
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Font Size</label>
                    <input 
                      type="number" 
                      value={selectedElement.fontSize} 
                      onChange={(e) => updateElement(selectedElement.id, { fontSize: Number(e.target.value) })}
                      className="input w-full"
                    />
                  </div>
                </>
              )}

              {selectedElement.type === 'rect' && (
                <>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Width</label>
                    <input 
                      type="number" 
                      value={selectedElement.width} 
                      onChange={(e) => updateElement(selectedElement.id, { width: Number(e.target.value) })}
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Height</label>
                    <input 
                      type="number" 
                      value={selectedElement.height} 
                      onChange={(e) => updateElement(selectedElement.id, { height: Number(e.target.value) })}
                      className="input w-full"
                    />
                  </div>
                </>
              )}

              {selectedElement.type === 'circle' && (
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Radius</label>
                  <input 
                    type="number" 
                    value={selectedElement.radius} 
                    onChange={(e) => updateElement(selectedElement.id, { radius: Number(e.target.value) })}
                    className="input w-full"
                  />
                </div>
              )}

              <Button variant="secondary" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50" onClick={deleteSelected}>
                {t('tools.infographicGenerator.delete')}
              </Button>
            </div>
          ) : (
            <div className="text-sm text-slate-400">
              {t('tools.infographicGenerator.selectHint')}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
