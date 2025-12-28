import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface DataPoint {
  label: string
  value: number
}

export default function ChartMaker() {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie' | 'donut'>('bar')
  const [data, setData] = useState<DataPoint[]>([
    { label: 'Jan', value: 30 },
    { label: 'Feb', value: 45 },
    { label: 'Mar', value: 25 },
    { label: 'Apr', value: 60 },
    { label: 'May', value: 40 },
  ])
  const [title, setTitle] = useState('Monthly Sales')
  const [colors] = useState(['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'])

  useEffect(() => {
    drawChart()
  }, [chartType, data, title, colors])

  const drawChart = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = 400
    const height = 300
    canvas.width = width
    canvas.height = height

    // Background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)

    // Title
    ctx.fillStyle = '#1F2937'
    ctx.font = 'bold 16px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(title, width / 2, 25)

    switch (chartType) {
      case 'bar':
        drawBarChart(ctx, width, height)
        break
      case 'line':
        drawLineChart(ctx, width, height)
        break
      case 'pie':
        drawPieChart(ctx, width, height, false)
        break
      case 'donut':
        drawPieChart(ctx, width, height, true)
        break
    }
  }

  const drawBarChart = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const padding = 50
    const chartWidth = width - padding * 2
    const chartHeight = height - 100
    const barWidth = chartWidth / data.length - 20
    const maxValue = Math.max(...data.map(d => d.value))

    // Y axis
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(padding, 50)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // Bars
    data.forEach((item, i) => {
      const barHeight = (item.value / maxValue) * chartHeight
      const x = padding + 20 + i * (barWidth + 20)
      const y = height - padding - barHeight

      ctx.fillStyle = colors[i % colors.length]
      ctx.fillRect(x, y, barWidth, barHeight)

      // Label
      ctx.fillStyle = '#666666'
      ctx.font = '12px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(item.label, x + barWidth / 2, height - 30)
      ctx.fillText(String(item.value), x + barWidth / 2, y - 10)
    })
  }

  const drawLineChart = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const padding = 50
    const chartWidth = width - padding * 2
    const chartHeight = height - 100
    const maxValue = Math.max(...data.map(d => d.value))

    // Grid
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1
    for (let i = 0; i <= 5; i++) {
      const y = 50 + (chartHeight / 5) * i
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
    }

    // Line
    ctx.strokeStyle = colors[0]
    ctx.lineWidth = 3
    ctx.beginPath()

    data.forEach((item, i) => {
      const x = padding + (chartWidth / (data.length - 1)) * i
      const y = 50 + chartHeight - (item.value / maxValue) * chartHeight

      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()

    // Points
    data.forEach((item, i) => {
      const x = padding + (chartWidth / (data.length - 1)) * i
      const y = 50 + chartHeight - (item.value / maxValue) * chartHeight

      ctx.fillStyle = colors[0]
      ctx.beginPath()
      ctx.arc(x, y, 6, 0, Math.PI * 2)
      ctx.fill()

      // Label
      ctx.fillStyle = '#666666'
      ctx.font = '12px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(item.label, x, height - 30)
    })
  }

  const drawPieChart = (ctx: CanvasRenderingContext2D, width: number, height: number, isDonut: boolean) => {
    const centerX = width / 2
    const centerY = height / 2 + 20
    const radius = 100
    const total = data.reduce((sum, d) => sum + d.value, 0)

    let startAngle = -Math.PI / 2

    data.forEach((item, i) => {
      const sliceAngle = (item.value / total) * Math.PI * 2
      const endAngle = startAngle + sliceAngle

      ctx.fillStyle = colors[i % colors.length]
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()
      ctx.fill()

      // Label line
      const midAngle = startAngle + sliceAngle / 2
      const labelRadius = radius * 1.2
      const labelX = centerX + Math.cos(midAngle) * labelRadius
      const labelY = centerY + Math.sin(midAngle) * labelRadius

      ctx.fillStyle = '#666666'
      ctx.font = '11px Arial'
      ctx.textAlign = midAngle > Math.PI / 2 && midAngle < Math.PI * 1.5 ? 'right' : 'left'
      ctx.fillText(`${item.label} (${Math.round(item.value / total * 100)}%)`, labelX, labelY)

      startAngle = endAngle
    })

    if (isDonut) {
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius * 0.5, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  const updateDataValue = (index: number, value: number) => {
    setData(data.map((d, i) => i === index ? { ...d, value } : d))
  }

  const updateDataLabel = (index: number, label: string) => {
    setData(data.map((d, i) => i === index ? { ...d, label } : d))
  }

  const addDataPoint = () => {
    if (data.length < 8) {
      setData([...data, { label: `Item ${data.length + 1}`, value: 50 }])
    }
  }

  const removeDataPoint = (index: number) => {
    if (data.length > 2) {
      setData(data.filter((_, i) => i !== index))
    }
  }

  const downloadChart = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = `chart-${chartType}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex justify-center mb-4">
          <canvas ref={canvasRef} className="border border-slate-200 rounded" />
        </div>
        <button
          onClick={downloadChart}
          className="w-full py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
        >
          {t('tools.chartMaker.download')}
        </button>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.chartMaker.type')}</h3>
        <div className="grid grid-cols-4 gap-2">
          {(['bar', 'line', 'pie', 'donut'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              className={`py-2 rounded capitalize ${
                chartType === type ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.chartMaker.title')}</h3>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.chartMaker.data')}</h3>
          {data.length < 8 && (
            <button
              onClick={addDataPoint}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              + Add
            </button>
          )}
        </div>
        <div className="space-y-2">
          {data.map((item, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                type="text"
                value={item.label}
                onChange={(e) => updateDataLabel(i, e.target.value)}
                className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm"
              />
              <input
                type="number"
                value={item.value}
                onChange={(e) => updateDataValue(i, parseInt(e.target.value) || 0)}
                className="w-20 px-2 py-1 border border-slate-300 rounded text-sm"
              />
              <div
                className="w-6 h-6 rounded"
                style={{ backgroundColor: colors[i % colors.length] }}
              />
              {data.length > 2 && (
                <button
                  onClick={() => removeDataPoint(i)}
                  className="text-red-500 hover:text-red-600"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
