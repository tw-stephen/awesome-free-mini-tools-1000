import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface WheelItem {
  id: number
  text: string
  color: string
}

const defaultColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  '#BB8FCE', '#85C1E9', '#F8B500', '#00CED1',
]

export default function SpinWheel() {
  const { t } = useTranslation()
  const [items, setItems] = useState<WheelItem[]>([
    { id: 1, text: 'Option 1', color: defaultColors[0] },
    { id: 2, text: 'Option 2', color: defaultColors[1] },
    { id: 3, text: 'Option 3', color: defaultColors[2] },
    { id: 4, text: 'Option 4', color: defaultColors[3] },
  ])
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [winner, setWinner] = useState<WheelItem | null>(null)
  const [newItem, setNewItem] = useState('')
  const [history, setHistory] = useState<{ item: string; timestamp: Date }[]>([])
  const wheelRef = useRef<SVGSVGElement>(null)

  const addItem = () => {
    if (newItem.trim() && items.length < 12) {
      setItems([
        ...items,
        {
          id: Date.now(),
          text: newItem.trim(),
          color: defaultColors[items.length % defaultColors.length],
        },
      ])
      setNewItem('')
    }
  }

  const removeItem = (id: number) => {
    if (items.length > 2) {
      setItems(items.filter((item) => item.id !== id))
    }
  }

  const spin = () => {
    if (spinning || items.length < 2) return

    setSpinning(true)
    setWinner(null)

    const array = new Uint32Array(1)
    crypto.getRandomValues(array)
    const randomIndex = array[0] % items.length

    const baseRotation = 360 * 5 // 5 full rotations
    const segmentAngle = 360 / items.length
    const targetAngle = 360 - (randomIndex * segmentAngle + segmentAngle / 2)
    const newRotation = rotation + baseRotation + targetAngle

    setRotation(newRotation)

    setTimeout(() => {
      setSpinning(false)
      setWinner(items[randomIndex])
      setHistory((prev) => [
        { item: items[randomIndex].text, timestamp: new Date() },
        ...prev.slice(0, 9),
      ])
    }, 4000)
  }

  const renderWheel = () => {
    const size = 280
    const center = size / 2
    const radius = size / 2 - 10

    return (
      <svg
        ref={wheelRef}
        width={size}
        height={size}
        className="transition-transform duration-[4000ms] ease-out"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {items.map((item, index) => {
          const angle = 360 / items.length
          const startAngle = index * angle - 90
          const endAngle = startAngle + angle

          const startRad = (startAngle * Math.PI) / 180
          const endRad = (endAngle * Math.PI) / 180

          const x1 = center + radius * Math.cos(startRad)
          const y1 = center + radius * Math.sin(startRad)
          const x2 = center + radius * Math.cos(endRad)
          const y2 = center + radius * Math.sin(endRad)

          const largeArc = angle > 180 ? 1 : 0

          const midAngle = startAngle + angle / 2
          const midRad = (midAngle * Math.PI) / 180
          const textRadius = radius * 0.65
          const textX = center + textRadius * Math.cos(midRad)
          const textY = center + textRadius * Math.sin(midRad)

          return (
            <g key={item.id}>
              <path
                d={`M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                fill={item.color}
                stroke="white"
                strokeWidth="2"
              />
              <text
                x={textX}
                y={textY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="12"
                fontWeight="bold"
                transform={`rotate(${midAngle + 90}, ${textX}, ${textY})`}
                className="select-none"
              >
                {item.text.length > 10 ? item.text.substring(0, 10) + '...' : item.text}
              </text>
            </g>
          )
        })}
        <circle cx={center} cy={center} r="20" fill="white" stroke="#333" strokeWidth="2" />
      </svg>
    )
  }

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <div className="relative flex justify-center mb-6">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
            <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[25px] border-t-red-500" />
          </div>
          {renderWheel()}
        </div>

        {winner && !spinning && (
          <div className="text-center mb-4 p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-green-600 mb-1">{t('tools.spinWheel.winner')}</div>
            <div className="text-2xl font-bold text-green-700">{winner.text}</div>
          </div>
        )}

        <button
          onClick={spin}
          disabled={spinning || items.length < 2}
          className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50"
        >
          {spinning ? t('tools.spinWheel.spinning') : t('tools.spinWheel.spin')}
        </button>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.spinWheel.options')} ({items.length}/12)
        </h3>

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
            placeholder={t('tools.spinWheel.addOption')}
            className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
            disabled={items.length >= 12}
          />
          <button
            onClick={addItem}
            disabled={!newItem.trim() || items.length >= 12}
            className="px-4 py-2 bg-green-500 text-white rounded font-medium hover:bg-green-600 disabled:opacity-50"
          >
            +
          </button>
        </div>

        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 p-2 bg-slate-50 rounded"
            >
              <div
                className="w-6 h-6 rounded"
                style={{ backgroundColor: item.color }}
              />
              <input
                type="text"
                value={item.text}
                onChange={(e) =>
                  setItems(
                    items.map((i) =>
                      i.id === item.id ? { ...i, text: e.target.value } : i
                    )
                  )
                }
                className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm"
              />
              {items.length > 2 && (
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {history.length > 0 && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-700">
              {t('tools.spinWheel.history')}
            </h3>
            <button
              onClick={() => setHistory([])}
              className="text-xs text-red-500 hover:text-red-700"
            >
              {t('common.clear')}
            </button>
          </div>
          <div className="space-y-1">
            {history.map((h, i) => (
              <div key={i} className="flex justify-between text-sm py-1 border-b border-slate-100">
                <span className="font-medium">{h.item}</span>
                <span className="text-slate-400">{h.timestamp.toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.spinWheel.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.spinWheel.tip1')}</li>
          <li>{t('tools.spinWheel.tip2')}</li>
          <li>{t('tools.spinWheel.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
