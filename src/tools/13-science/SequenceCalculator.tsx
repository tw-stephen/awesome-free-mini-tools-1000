import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type SequenceType = 'arithmetic' | 'geometric' | 'fibonacci' | 'custom'

export default function SequenceCalculator() {
  const { t } = useTranslation()
  const [seqType, setSeqType] = useState<SequenceType>('arithmetic')

  // Arithmetic sequence
  const [a1, setA1] = useState('1')
  const [d, setD] = useState('2')
  const [nTerms, setNTerms] = useState('10')

  // Geometric sequence
  const [g1, setG1] = useState('2')
  const [r, setR] = useState('2')
  const [gTerms, setGTerms] = useState('10')

  // Fibonacci
  const [fibTerms, setFibTerms] = useState('10')

  // Custom sequence analysis
  const [customInput, setCustomInput] = useState('2, 4, 6, 8, 10')

  const [result, setResult] = useState<{
    sequence: number[]
    sum: number
    nthTerm?: number
    formula?: string
    type?: string
  } | null>(null)

  const calculateArithmetic = () => {
    const first = parseFloat(a1)
    const diff = parseFloat(d)
    const n = parseInt(nTerms)

    if (isNaN(first) || isNaN(diff) || isNaN(n) || n < 1) return

    const sequence: number[] = []
    for (let i = 0; i < n; i++) {
      sequence.push(first + i * diff)
    }

    const nthTerm = first + (n - 1) * diff
    const sum = (n * (first + nthTerm)) / 2

    setResult({
      sequence,
      sum,
      nthTerm,
      formula: `aₙ = ${first} + (n-1) × ${diff}`,
      type: t('tools.sequenceCalculator.arithmeticSeq'),
    })
  }

  const calculateGeometric = () => {
    const first = parseFloat(g1)
    const ratio = parseFloat(r)
    const n = parseInt(gTerms)

    if (isNaN(first) || isNaN(ratio) || isNaN(n) || n < 1) return

    const sequence: number[] = []
    for (let i = 0; i < n; i++) {
      sequence.push(first * Math.pow(ratio, i))
    }

    const nthTerm = first * Math.pow(ratio, n - 1)
    const sum = ratio === 1 ? first * n : first * (1 - Math.pow(ratio, n)) / (1 - ratio)

    setResult({
      sequence,
      sum,
      nthTerm,
      formula: `aₙ = ${first} × ${ratio}^(n-1)`,
      type: t('tools.sequenceCalculator.geometricSeq'),
    })
  }

  const calculateFibonacci = () => {
    const n = parseInt(fibTerms)
    if (isNaN(n) || n < 1) return

    const sequence: number[] = []
    for (let i = 0; i < n; i++) {
      if (i === 0) sequence.push(0)
      else if (i === 1) sequence.push(1)
      else sequence.push(sequence[i - 1] + sequence[i - 2])
    }

    const sum = sequence.reduce((a, b) => a + b, 0)

    setResult({
      sequence,
      sum,
      nthTerm: sequence[n - 1],
      formula: 'Fₙ = Fₙ₋₁ + Fₙ₋₂',
      type: t('tools.sequenceCalculator.fibonacciSeq'),
    })
  }

  const analyzeCustom = () => {
    const numbers = customInput
      .split(/[,\s]+/)
      .map(s => parseFloat(s.trim()))
      .filter(n => !isNaN(n))

    if (numbers.length < 2) return

    const sum = numbers.reduce((a, b) => a + b, 0)

    // Check if arithmetic
    const diffs = numbers.slice(1).map((n, i) => n - numbers[i])
    const isArithmetic = diffs.every(d => Math.abs(d - diffs[0]) < 0.0001)

    // Check if geometric
    const ratios = numbers.slice(1).map((n, i) => n / numbers[i])
    const isGeometric = numbers[0] !== 0 && ratios.every(r => Math.abs(r - ratios[0]) < 0.0001)

    let type = t('tools.sequenceCalculator.unknownSeq')
    let formula = ''

    if (isArithmetic) {
      type = t('tools.sequenceCalculator.arithmeticSeq')
      formula = `aₙ = ${numbers[0]} + (n-1) × ${diffs[0].toFixed(2)}`
    } else if (isGeometric) {
      type = t('tools.sequenceCalculator.geometricSeq')
      formula = `aₙ = ${numbers[0]} × ${ratios[0].toFixed(2)}^(n-1)`
    }

    setResult({
      sequence: numbers,
      sum,
      type,
      formula,
    })
  }

  const types = [
    { id: 'arithmetic', label: t('tools.sequenceCalculator.arithmetic') },
    { id: 'geometric', label: t('tools.sequenceCalculator.geometric') },
    { id: 'fibonacci', label: t('tools.sequenceCalculator.fibonacci') },
    { id: 'custom', label: t('tools.sequenceCalculator.custom') },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {types.map(type => (
          <button
            key={type.id}
            onClick={() => { setSeqType(type.id as SequenceType); setResult(null) }}
            className={`px-3 py-1.5 rounded text-sm ${
              seqType === type.id ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {seqType === 'arithmetic' && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.sequenceCalculator.arithmeticSeq')}</h3>
          <p className="text-sm text-slate-600 mb-4 font-mono">aₙ = a₁ + (n-1)d</p>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">a₁ ({t('tools.sequenceCalculator.firstTerm')})</label>
              <input
                type="number"
                value={a1}
                onChange={(e) => setA1(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">d ({t('tools.sequenceCalculator.difference')})</label>
              <input
                type="number"
                value={d}
                onChange={(e) => setD(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">n ({t('tools.sequenceCalculator.terms')})</label>
              <input
                type="number"
                min="1"
                max="100"
                value={nTerms}
                onChange={(e) => setNTerms(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
          </div>

          <button
            onClick={calculateArithmetic}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {t('tools.sequenceCalculator.generate')}
          </button>
        </div>
      )}

      {seqType === 'geometric' && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.sequenceCalculator.geometricSeq')}</h3>
          <p className="text-sm text-slate-600 mb-4 font-mono">aₙ = a₁ × r^(n-1)</p>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">a₁ ({t('tools.sequenceCalculator.firstTerm')})</label>
              <input
                type="number"
                value={g1}
                onChange={(e) => setG1(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">r ({t('tools.sequenceCalculator.ratio')})</label>
              <input
                type="number"
                value={r}
                onChange={(e) => setR(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">n ({t('tools.sequenceCalculator.terms')})</label>
              <input
                type="number"
                min="1"
                max="50"
                value={gTerms}
                onChange={(e) => setGTerms(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
          </div>

          <button
            onClick={calculateGeometric}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {t('tools.sequenceCalculator.generate')}
          </button>
        </div>
      )}

      {seqType === 'fibonacci' && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.sequenceCalculator.fibonacciSeq')}</h3>
          <p className="text-sm text-slate-600 mb-4 font-mono">Fₙ = Fₙ₋₁ + Fₙ₋₂ (F₀=0, F₁=1)</p>

          <div className="mb-4">
            <label className="block text-sm text-slate-600 mb-1">n ({t('tools.sequenceCalculator.terms')})</label>
            <input
              type="number"
              min="1"
              max="50"
              value={fibTerms}
              onChange={(e) => setFibTerms(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>

          <button
            onClick={calculateFibonacci}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {t('tools.sequenceCalculator.generate')}
          </button>
        </div>
      )}

      {seqType === 'custom' && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.sequenceCalculator.analyzeSequence')}</h3>

          <div className="mb-4">
            <label className="block text-sm text-slate-600 mb-1">
              {t('tools.sequenceCalculator.enterSequence')}
            </label>
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="2, 4, 6, 8, 10..."
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <p className="text-xs text-slate-500 mt-1">
              {t('tools.sequenceCalculator.separateHint')}
            </p>
          </div>

          <button
            onClick={analyzeCustom}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {t('tools.sequenceCalculator.analyze')}
          </button>
        </div>
      )}

      {result && (
        <div className="card p-4 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{t('tools.sequenceCalculator.type')}:</span>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-sm">
              {result.type}
            </span>
          </div>

          {result.formula && (
            <div className="p-3 bg-slate-50 rounded">
              <span className="text-sm text-slate-600">{t('tools.sequenceCalculator.formula')}:</span>
              <span className="ml-2 font-mono">{result.formula}</span>
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium mb-2">{t('tools.sequenceCalculator.sequence')}</h4>
            <div className="flex flex-wrap gap-2">
              {result.sequence.slice(0, 20).map((n, i) => (
                <span key={i} className="px-2 py-1 bg-slate-100 rounded font-mono text-sm">
                  {Number.isInteger(n) ? n : n.toFixed(4)}
                </span>
              ))}
              {result.sequence.length > 20 && (
                <span className="px-2 py-1 text-slate-400 text-sm">
                  ...+{result.sequence.length - 20} more
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-green-50 rounded text-center">
              <div className="text-sm text-green-600">{t('tools.sequenceCalculator.sum')}</div>
              <div className="text-xl font-bold text-green-700">
                {Number.isInteger(result.sum) ? result.sum : result.sum.toFixed(4)}
              </div>
            </div>
            {result.nthTerm !== undefined && (
              <div className="p-3 bg-purple-50 rounded text-center">
                <div className="text-sm text-purple-600">{t('tools.sequenceCalculator.lastTerm')}</div>
                <div className="text-xl font-bold text-purple-700">
                  {Number.isInteger(result.nthTerm) ? result.nthTerm : result.nthTerm.toFixed(4)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
