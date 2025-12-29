import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function FabricCalculator() {
  const { t } = useTranslation()
  const [projectType, setProjectType] = useState('cushion')
  const [fabricWidth, setFabricWidth] = useState('1.4')
  const [patternRepeat, setPatternRepeat] = useState('0')
  const [dimensions, setDimensions] = useState({
    length: '',
    width: '',
    height: '',
    quantity: '1',
    seamAllowance: '1.5',
  })

  const projectTypes = [
    { id: 'cushion', label: t('tools.fabricCalculator.cushion') },
    { id: 'curtain', label: t('tools.fabricCalculator.curtain') },
    { id: 'tablecloth', label: t('tools.fabricCalculator.tablecloth') },
    { id: 'bedding', label: t('tools.fabricCalculator.bedding') },
    { id: 'upholstery', label: t('tools.fabricCalculator.upholstery') },
    { id: 'custom', label: t('tools.fabricCalculator.custom') },
  ]

  const calculate = () => {
    const length = parseFloat(dimensions.length) || 0
    const width = parseFloat(dimensions.width) || 0
    const height = parseFloat(dimensions.height) || 0
    const quantity = parseInt(dimensions.quantity) || 1
    const seam = parseFloat(dimensions.seamAllowance) / 100 || 0.015 // Convert cm to m
    const fWidth = parseFloat(fabricWidth) || 1.4
    const pattern = parseFloat(patternRepeat) || 0

    let fabricNeeded = 0
    let cutPieces: { name: string; size: string }[] = []

    switch (projectType) {
      case 'cushion':
        // Two squares plus seam allowance
        const cushionSize = length + (seam * 2)
        const piecesAcross = Math.floor(fWidth / cushionSize)
        const rowsNeeded = Math.ceil((quantity * 2) / piecesAcross)
        fabricNeeded = rowsNeeded * cushionSize
        cutPieces = [{ name: t('tools.fabricCalculator.cushionPieces'), size: `${(cushionSize * 100).toFixed(1)}cm x ${(cushionSize * 100).toFixed(1)}cm x ${quantity * 2}` }]
        break

      case 'curtain':
        // Width with fullness factor (usually 2x) + hem
        const curtainWidth = (width * 2) + (seam * 2)
        const curtainLength = length + 0.15 + 0.1 // header + hem
        const panels = Math.ceil(curtainWidth / fWidth)
        fabricNeeded = curtainLength * panels * quantity
        if (pattern > 0) {
          fabricNeeded += pattern * panels * quantity
        }
        cutPieces = [{ name: t('tools.fabricCalculator.curtainPanels'), size: `${(curtainLength * 100).toFixed(1)}cm x ${(fWidth * 100).toFixed(1)}cm x ${panels * quantity}` }]
        break

      case 'tablecloth':
        // Table top + drop on all sides
        const drop = height || 0.3
        const tableLength = length + (drop * 2) + (seam * 2)
        const tableWidth = width + (drop * 2) + (seam * 2)
        const widths = Math.ceil(tableWidth / fWidth)
        fabricNeeded = tableLength * widths * quantity
        cutPieces = [{ name: t('tools.fabricCalculator.mainPiece'), size: `${(tableLength * 100).toFixed(1)}cm x ${(tableWidth * 100).toFixed(1)}cm` }]
        break

      case 'bedding':
        // Duvet cover: front + back + seam
        const duvetLength = (length + (seam * 2)) * 2
        const duvetWidth = width + (seam * 2)
        const duvetWidths = Math.ceil(duvetWidth / fWidth)
        fabricNeeded = duvetLength * duvetWidths * quantity
        cutPieces = [
          { name: t('tools.fabricCalculator.frontBack'), size: `${(length * 100 + seam * 200).toFixed(1)}cm x ${(duvetWidth * 100).toFixed(1)}cm x 2` },
        ]
        break

      case 'upholstery':
        // Rough estimate: length + width + height for all sides
        const upholsteryNeeded = ((length * width) + (length * height * 2) + (width * height * 2)) * 1.2
        fabricNeeded = upholsteryNeeded / fWidth * quantity
        cutPieces = [{ name: t('tools.fabricCalculator.estimated'), size: `${(fabricNeeded * 100).toFixed(1)}cm` }]
        break

      default:
        // Custom: simple rectangle
        const customLength = length + (seam * 2)
        const customWidth = width + (seam * 2)
        const customPieces = Math.floor(fWidth / customWidth) || 1
        const customRows = Math.ceil(quantity / customPieces)
        fabricNeeded = customLength * customRows
        cutPieces = [{ name: t('tools.fabricCalculator.pieces'), size: `${(customLength * 100).toFixed(1)}cm x ${(customWidth * 100).toFixed(1)}cm x ${quantity}` }]
    }

    // Add pattern repeat waste
    if (pattern > 0 && projectType !== 'curtain') {
      fabricNeeded *= 1.1
    }

    return {
      fabricNeeded: Math.ceil(fabricNeeded * 100) / 100,
      cutPieces,
      yards: fabricNeeded * 1.0936,
    }
  }

  const result = calculate()

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.fabricCalculator.projectType')}</h3>
        <div className="flex flex-wrap gap-2">
          {projectTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setProjectType(type.id)}
              className={`px-3 py-2 rounded text-sm ${
                projectType === type.id ? 'bg-pink-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.fabricCalculator.fabricInfo')}</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.fabricCalculator.fabricWidth')} (m)</label>
            <select
              value={fabricWidth}
              onChange={(e) => setFabricWidth(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            >
              <option value="0.9">90cm (36")</option>
              <option value="1.1">110cm (44")</option>
              <option value="1.4">140cm (54")</option>
              <option value="1.5">150cm (60")</option>
              <option value="2.8">280cm (110")</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.fabricCalculator.patternRepeat')} (m)</label>
            <input
              type="number"
              value={patternRepeat}
              onChange={(e) => setPatternRepeat(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
              placeholder="0"
              step="0.01"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.fabricCalculator.dimensions')}</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                {projectType === 'curtain' ? t('tools.fabricCalculator.finishedLength') : t('tools.fabricCalculator.length')} (m)
              </label>
              <input
                type="number"
                value={dimensions.length}
                onChange={(e) => setDimensions({ ...dimensions, length: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
                placeholder="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                {projectType === 'curtain' ? t('tools.fabricCalculator.finishedWidth') : t('tools.fabricCalculator.width')} (m)
              </label>
              <input
                type="number"
                value={dimensions.width}
                onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
                placeholder="0"
                step="0.01"
              />
            </div>
          </div>
          {(projectType === 'tablecloth' || projectType === 'upholstery') && (
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                {projectType === 'tablecloth' ? t('tools.fabricCalculator.drop') : t('tools.fabricCalculator.height')} (m)
              </label>
              <input
                type="number"
                value={dimensions.height}
                onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
                placeholder="0"
                step="0.01"
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-600 mb-1">{t('tools.fabricCalculator.quantity')}</label>
              <input
                type="number"
                value={dimensions.quantity}
                onChange={(e) => setDimensions({ ...dimensions, quantity: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
                placeholder="1"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">{t('tools.fabricCalculator.seamAllowance')} (cm)</label>
              <input
                type="number"
                value={dimensions.seamAllowance}
                onChange={(e) => setDimensions({ ...dimensions, seamAllowance: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
                placeholder="1.5"
                step="0.5"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4 bg-pink-50">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.fabricCalculator.result')}</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-600">{t('tools.fabricCalculator.fabricNeeded')}:</span>
            <span className="font-bold text-xl text-pink-600">{result.fabricNeeded} m</span>
          </div>
          <div className="flex justify-between text-sm text-slate-500">
            <span></span>
            <span>({result.yards.toFixed(2)} yards)</span>
          </div>
          {result.cutPieces.length > 0 && (
            <div className="pt-2 border-t border-pink-200">
              <div className="text-sm font-medium text-slate-700 mb-1">{t('tools.fabricCalculator.cutList')}:</div>
              {result.cutPieces.map((piece, i) => (
                <div key={i} className="text-sm text-slate-600">
                  {piece.name}: {piece.size}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.fabricCalculator.tips')}</h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.fabricCalculator.tip1')}</li>
          <li>{t('tools.fabricCalculator.tip2')}</li>
          <li>{t('tools.fabricCalculator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
