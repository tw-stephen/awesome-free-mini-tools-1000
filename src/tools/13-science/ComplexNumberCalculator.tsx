import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type Operation = 'add' | 'subtract' | 'multiply' | 'divide' | 'power' | 'conjugate' | 'magnitude'

interface Complex {
  real: number
  imag: number
}

export default function ComplexNumberCalculator() {
  const { t } = useTranslation()
  const [real1, setReal1] = useState('3')
  const [imag1, setImag1] = useState('4')
  const [real2, setReal2] = useState('1')
  const [imag2, setImag2] = useState('2')
  const [power, setPower] = useState('2')
  const [operation, setOperation] = useState<Operation>('add')
  const [result, setResult] = useState<{
    real: number
    imag: number
    magnitude: number
    angle: number
    polar: string
  } | null>(null)

  const formatComplex = (c: Complex): string => {
    if (c.imag === 0) return c.real.toFixed(4).replace(/\.?0+$/, '')
    if (c.real === 0) return `${c.imag.toFixed(4).replace(/\.?0+$/, '')}i`
    const sign = c.imag >= 0 ? '+' : ''
    return `${c.real.toFixed(4).replace(/\.?0+$/, '')} ${sign} ${c.imag.toFixed(4).replace(/\.?0+$/, '')}i`
  }

  const add = (a: Complex, b: Complex): Complex => ({
    real: a.real + b.real,
    imag: a.imag + b.imag,
  })

  const subtract = (a: Complex, b: Complex): Complex => ({
    real: a.real - b.real,
    imag: a.imag - b.imag,
  })

  const multiply = (a: Complex, b: Complex): Complex => ({
    real: a.real * b.real - a.imag * b.imag,
    imag: a.real * b.imag + a.imag * b.real,
  })

  const divide = (a: Complex, b: Complex): Complex => {
    const denom = b.real * b.real + b.imag * b.imag
    return {
      real: (a.real * b.real + a.imag * b.imag) / denom,
      imag: (a.imag * b.real - a.real * b.imag) / denom,
    }
  }

  const conjugate = (a: Complex): Complex => ({
    real: a.real,
    imag: -a.imag,
  })

  const magnitude = (a: Complex): number => {
    return Math.sqrt(a.real * a.real + a.imag * a.imag)
  }

  const angle = (a: Complex): number => {
    return Math.atan2(a.imag, a.real) * (180 / Math.PI)
  }

  const complexPower = (a: Complex, n: number): Complex => {
    const r = magnitude(a)
    const theta = Math.atan2(a.imag, a.real)
    const newR = Math.pow(r, n)
    const newTheta = theta * n
    return {
      real: newR * Math.cos(newTheta),
      imag: newR * Math.sin(newTheta),
    }
  }

  const calculate = () => {
    const z1: Complex = {
      real: parseFloat(real1) || 0,
      imag: parseFloat(imag1) || 0,
    }
    const z2: Complex = {
      real: parseFloat(real2) || 0,
      imag: parseFloat(imag2) || 0,
    }
    const n = parseInt(power) || 2

    let res: Complex

    switch (operation) {
      case 'add':
        res = add(z1, z2)
        break
      case 'subtract':
        res = subtract(z1, z2)
        break
      case 'multiply':
        res = multiply(z1, z2)
        break
      case 'divide':
        if (z2.real === 0 && z2.imag === 0) {
          setResult(null)
          return
        }
        res = divide(z1, z2)
        break
      case 'power':
        res = complexPower(z1, n)
        break
      case 'conjugate':
        res = conjugate(z1)
        break
      case 'magnitude':
        res = { real: magnitude(z1), imag: 0 }
        break
      default:
        res = z1
    }

    const mag = magnitude(res)
    const ang = angle(res)

    setResult({
      real: res.real,
      imag: res.imag,
      magnitude: mag,
      angle: ang,
      polar: `${mag.toFixed(4)} × (cos(${ang.toFixed(2)}°) + i×sin(${ang.toFixed(2)}°))`,
    })
  }

  const operations = [
    { id: 'add', label: 'z₁ + z₂', name: t('tools.complexNumberCalculator.add') },
    { id: 'subtract', label: 'z₁ - z₂', name: t('tools.complexNumberCalculator.subtract') },
    { id: 'multiply', label: 'z₁ × z₂', name: t('tools.complexNumberCalculator.multiply') },
    { id: 'divide', label: 'z₁ ÷ z₂', name: t('tools.complexNumberCalculator.divide') },
    { id: 'power', label: 'z₁ⁿ', name: t('tools.complexNumberCalculator.power') },
    { id: 'conjugate', label: 'z̄₁', name: t('tools.complexNumberCalculator.conjugate') },
    { id: 'magnitude', label: '|z₁|', name: t('tools.complexNumberCalculator.magnitude') },
  ]

  const needsSecondNumber = ['add', 'subtract', 'multiply', 'divide'].includes(operation)

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.complexNumberCalculator.z1')}</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="any"
            value={real1}
            onChange={(e) => setReal1(e.target.value)}
            className="w-24 px-3 py-2 border border-slate-300 rounded text-center"
            placeholder="Real"
          />
          <span className="text-lg">+</span>
          <input
            type="number"
            step="any"
            value={imag1}
            onChange={(e) => setImag1(e.target.value)}
            className="w-24 px-3 py-2 border border-slate-300 rounded text-center"
            placeholder="Imag"
          />
          <span className="text-lg font-bold">i</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {operations.map(op => (
          <button
            key={op.id}
            onClick={() => setOperation(op.id as Operation)}
            className={`px-3 py-1.5 rounded text-sm ${
              operation === op.id ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
            }`}
            title={op.name}
          >
            {op.label}
          </button>
        ))}
      </div>

      {needsSecondNumber && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.complexNumberCalculator.z2')}</h3>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="any"
              value={real2}
              onChange={(e) => setReal2(e.target.value)}
              className="w-24 px-3 py-2 border border-slate-300 rounded text-center"
              placeholder="Real"
            />
            <span className="text-lg">+</span>
            <input
              type="number"
              step="any"
              value={imag2}
              onChange={(e) => setImag2(e.target.value)}
              className="w-24 px-3 py-2 border border-slate-300 rounded text-center"
              placeholder="Imag"
            />
            <span className="text-lg font-bold">i</span>
          </div>
        </div>
      )}

      {operation === 'power' && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.complexNumberCalculator.exponent')}</h3>
          <input
            type="number"
            value={power}
            onChange={(e) => setPower(e.target.value)}
            className="w-24 px-3 py-2 border border-slate-300 rounded"
          />
        </div>
      )}

      <button
        onClick={calculate}
        className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {t('tools.complexNumberCalculator.calculate')}
      </button>

      {result && (
        <div className="card p-4 space-y-4">
          <div className="p-4 bg-green-50 rounded text-center">
            <div className="text-sm text-green-600 mb-1">{t('tools.complexNumberCalculator.result')}</div>
            <div className="text-2xl font-bold text-green-700 font-mono">
              {formatComplex({ real: result.real, imag: result.imag })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded">
              <div className="text-sm text-slate-600">{t('tools.complexNumberCalculator.realPart')}</div>
              <div className="font-mono font-bold">{result.real.toFixed(6)}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded">
              <div className="text-sm text-slate-600">{t('tools.complexNumberCalculator.imaginaryPart')}</div>
              <div className="font-mono font-bold">{result.imag.toFixed(6)}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded">
              <div className="text-sm text-slate-600">{t('tools.complexNumberCalculator.magnitudeLabel')}</div>
              <div className="font-mono font-bold">{result.magnitude.toFixed(6)}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded">
              <div className="text-sm text-slate-600">{t('tools.complexNumberCalculator.angle')}</div>
              <div className="font-mono font-bold">{result.angle.toFixed(2)}°</div>
            </div>
          </div>

          <div className="p-3 bg-purple-50 rounded">
            <div className="text-sm text-purple-600 mb-1">{t('tools.complexNumberCalculator.polarForm')}</div>
            <div className="font-mono text-sm">{result.polar}</div>
          </div>
        </div>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.complexNumberCalculator.formulas')}</h4>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2 bg-white rounded">(a+bi) + (c+di) = (a+c) + (b+d)i</div>
          <div className="p-2 bg-white rounded">(a+bi) × (c+di) = (ac-bd) + (ad+bc)i</div>
          <div className="p-2 bg-white rounded">|z| = √(a² + b²)</div>
          <div className="p-2 bg-white rounded">z̄ = a - bi</div>
        </div>
      </div>
    </div>
  )
}
