import { useState } from 'react'

const ops: Record<string, string> = {
  Dilate: 'Expands bright regions. Fills small holes and gaps in foreground objects. Increases object size.',
  Erode:  'Shrinks bright regions. Removes small protrusions and isolated noise pixels. Reduces object size.',
  Open:   'Erosion followed by dilation. Removes small bright noise while preserving overall shape of larger objects.',
  Close:  'Dilation followed by erosion. Fills small dark holes inside objects and connects nearby components.',
}

export default function ImageMorphologyTool() {
  const [operation, setOperation] = useState('Open')
  const [kernelSize, setKernelSize] = useState(3)

  const validKernel = kernelSize % 2 === 1 ? kernelSize : kernelSize + 1
  const area = validKernel * validKernel
  const passes = operation === 'Open' || operation === 'Close' ? 2 : 1

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Image Morphology Tool</h2>
      <div>
        <label className="text-sm font-medium block mb-1">Operation</label>
        <select value={operation} onChange={(e) => setOperation(e.target.value)} className="w-full border rounded p-2">
          {Object.keys(ops).map((k) => <option key={k}>{k}</option>)}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium block mb-1">Kernel Size: {kernelSize} {kernelSize % 2 === 0 && '→ adjusted to ' + validKernel}</label>
        <input type="number" min={1} max={21} value={kernelSize}
          onChange={(e) => setKernelSize(Number(e.target.value))} className="w-full border rounded p-2" />
        <p className="text-xs text-gray-400 mt-1">Must be odd. Even values are automatically adjusted.</p>
      </div>
      <div className="p-3 bg-gray-100 rounded space-y-2 text-sm">
        <p className="text-gray-700">{ops[operation]}</p>
        <div className="grid grid-cols-3 gap-2 mt-1">
          <div className="bg-white rounded p-2 text-center"><p className="text-xs text-gray-500">Kernel</p><p className="font-semibold">{validKernel}×{validKernel}</p></div>
          <div className="bg-white rounded p-2 text-center"><p className="text-xs text-gray-500">Area</p><p className="font-semibold">{area} px</p></div>
          <div className="bg-white rounded p-2 text-center"><p className="text-xs text-gray-500">Passes</p><p className="font-semibold">{passes}</p></div>
        </div>
      </div>
    </div>
  )
}
