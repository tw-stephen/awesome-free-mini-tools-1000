import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface WheelItem {
  text: string
  color: string
}

export default function FortuneWheel() {
  const { t } = useTranslation()
  const [items, setItems] = useState<WheelItem[]>([
    { text: 'Prize 1', color: '#FF6384' },
    { text: 'Prize 2', color: '#36A2EB' },
    { text: 'Prize 3', color: '#FFCE56' },
    { text: 'Prize 4', color: '#4BC0C0' },
    { text: 'Prize 5', color: '#9966FF' },
    { text: 'Prize 6', color: '#FF9F40' },
  ])
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [newItem, setNewItem] = useState('')
  const [showEdit, setShowEdit] = useState(false)

  const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF', '#7BC225']

  const spinWheel = () => {
    if (spinning || items.length < 2) return

    setSpinning(true)
    setResult(null)

    // Random spins between 5-10 full rotations plus random angle
    const spins = 5 + Math.random() * 5
    const randomAngle = Math.random() * 360
    const totalRotation = rotation + (spins * 360) + randomAngle

    setRotation(totalRotation)

    // Calculate result after spin
    setTimeout(() => {
      const normalizedRotation = totalRotation % 360
      const segmentAngle = 360 / items.length
      // The pointer is at the top (0 degrees), so we need to account for that
      const winningIndex = Math.floor((360 - normalizedRotation + segmentAngle / 2) / segmentAngle) % items.length
      setResult(items[winningIndex].text)
      setSpinning(false)
    }, 4000)
  }

  const addItem = () => {
    if (!newItem.trim()) return
    const color = colors[items.length % colors.length]
    setItems([...items, { text: newItem.trim(), color }])
    setNewItem('')
  }

  const removeItem = (index: number) => {
    if (items.length <= 2) return
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, text: string) => {
    setItems(items.map((item, i) => i === index ? { ...item, text } : item))
  }

  const segmentAngle = 360 / items.length

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <div className="relative w-64 h-64 mx-auto mb-4">
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
            <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-red-500" />
          </div>

          {/* Wheel */}
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none'
            }}
          >
            {items.map((item, i) => {
              const startAngle = (i * segmentAngle - 90) * (Math.PI / 180)
              const endAngle = ((i + 1) * segmentAngle - 90) * (Math.PI / 180)
              const x1 = 100 + 100 * Math.cos(startAngle)
              const y1 = 100 + 100 * Math.sin(startAngle)
              const x2 = 100 + 100 * Math.cos(endAngle)
              const y2 = 100 + 100 * Math.sin(endAngle)
              const largeArcFlag = segmentAngle > 180 ? 1 : 0

              const midAngle = ((i + 0.5) * segmentAngle - 90) * (Math.PI / 180)
              const textX = 100 + 60 * Math.cos(midAngle)
              const textY = 100 + 60 * Math.sin(midAngle)
              const textRotation = (i + 0.5) * segmentAngle

              return (
                <g key={i}>
                  <path
                    d={`M 100 100 L ${x1} ${y1} A 100 100 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                    fill={item.color}
                    stroke="white"
                    strokeWidth="2"
                  />
                  <text
                    x={textX}
                    y={textY}
                    fill="white"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                  >
                    {item.text.length > 10 ? item.text.slice(0, 10) + '...' : item.text}
                  </text>
                </g>
              )
            })}
            <circle cx="100" cy="100" r="15" fill="white" stroke="#333" strokeWidth="2" />
          </svg>
        </div>

        <div className="text-center">
          <button
            onClick={spinWheel}
            disabled={spinning || items.length < 2}
            className="px-8 py-3 bg-blue-500 text-white rounded-lg font-bold text-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {spinning ? '🎰 Spinning...' : `🎯 ${t('tools.fortuneWheel.spin')}`}
          </button>
        </div>

        {result && (
          <div className="mt-4 p-4 bg-green-100 rounded-lg text-center">
            <div className="text-sm text-green-600 mb-1">{t('tools.fortuneWheel.result')}:</div>
            <div className="text-2xl font-bold text-green-700">🎉 {result}</div>
          </div>
        )}
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.fortuneWheel.items')} ({items.length})</h3>
          <button
            onClick={() => setShowEdit(!showEdit)}
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            {showEdit ? t('tools.fortuneWheel.done') : t('tools.fortuneWheel.edit')}
          </button>
        </div>

        {showEdit && (
          <>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder={t('tools.fortuneWheel.addItem')}
                className="flex-1 px-3 py-2 border border-slate-300 rounded"
                onKeyPress={(e) => e.key === 'Enter' && addItem()}
              />
              <button
                onClick={addItem}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                +
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: item.color }}
                  />
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => updateItem(i, e.target.value)}
                    className="flex-1 px-2 py-1 border border-slate-200 rounded text-sm"
                  />
                  <button
                    onClick={() => removeItem(i)}
                    disabled={items.length <= 2}
                    className="text-red-500 hover:text-red-600 disabled:opacity-30"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {!showEdit && (
          <div className="flex flex-wrap gap-2">
            {items.map((item, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded text-white text-sm"
                style={{ backgroundColor: item.color }}
              >
                {item.text}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.fortuneWheel.howToUse')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• {t('tools.fortuneWheel.instruction1')}</li>
          <li>• {t('tools.fortuneWheel.instruction2')}</li>
          <li>• {t('tools.fortuneWheel.instruction3')}</li>
        </ul>
      </div>
    </div>
  )
}
