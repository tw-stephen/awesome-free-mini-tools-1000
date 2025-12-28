import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type Operation = 'add' | 'subtract' | 'multiply' | 'divide' | 'and' | 'or' | 'xor' | 'not' | 'shift'

export default function BinaryCalculator() {
  const { t } = useTranslation()
  const [binary1, setBinary1] = useState('1010')
  const [binary2, setBinary2] = useState('0110')
  const [operation, setOperation] = useState<Operation>('add')
  const [shiftAmount, setShiftAmount] = useState(1)
  const [shiftDirection, setShiftDirection] = useState<'left' | 'right'>('left')
  const [result, setResult] = useState<{
    binary: string
    decimal: number
    hex: string
  } | null>(null)
  const [error, setError] = useState('')

  const isValidBinary = (str: string): boolean => {
    return /^[01]+$/.test(str)
  }

  const calculate = () => {
    setError('')
    setResult(null)

    const clean1 = binary1.replace(/\s/g, '')
    const clean2 = binary2.replace(/\s/g, '')

    if (!isValidBinary(clean1)) {
      setError(t('tools.binaryCalculator.invalidBinary1'))
      return
    }

    if (operation !== 'not' && !isValidBinary(clean2)) {
      setError(t('tools.binaryCalculator.invalidBinary2'))
      return
    }

    const num1 = parseInt(clean1, 2)
    const num2 = parseInt(clean2, 2)
    let resultNum: number

    switch (operation) {
      case 'add':
        resultNum = num1 + num2
        break
      case 'subtract':
        resultNum = num1 - num2
        break
      case 'multiply':
        resultNum = num1 * num2
        break
      case 'divide':
        if (num2 === 0) {
          setError(t('tools.binaryCalculator.divisionByZero'))
          return
        }
        resultNum = Math.floor(num1 / num2)
        break
      case 'and':
        resultNum = num1 & num2
        break
      case 'or':
        resultNum = num1 | num2
        break
      case 'xor':
        resultNum = num1 ^ num2
        break
      case 'not':
        // NOT operation on 8-bit, 16-bit or 32-bit based on input length
        const bits = Math.max(8, Math.pow(2, Math.ceil(Math.log2(clean1.length))))
        const mask = (1 << bits) - 1
        resultNum = (~num1) & mask
        break
      case 'shift':
        resultNum = shiftDirection === 'left'
          ? num1 << shiftAmount
          : num1 >>> shiftAmount
        break
      default:
        resultNum = 0
    }

    // Handle negative results for display
    if (resultNum < 0) {
      // Show as two's complement for negative numbers
      resultNum = resultNum >>> 0 // Convert to unsigned 32-bit
    }

    setResult({
      binary: resultNum.toString(2),
      decimal: resultNum,
      hex: resultNum.toString(16).toUpperCase(),
    })
  }

  const formatBinary = (binary: string): string => {
    const padded = binary.padStart(Math.ceil(binary.length / 4) * 4, '0')
    return padded.match(/.{1,4}/g)?.join(' ') || binary
  }

  const arithmeticOps = [
    { id: 'add', label: '+', name: t('tools.binaryCalculator.add') },
    { id: 'subtract', label: '−', name: t('tools.binaryCalculator.subtract') },
    { id: 'multiply', label: '×', name: t('tools.binaryCalculator.multiply') },
    { id: 'divide', label: '÷', name: t('tools.binaryCalculator.divide') },
  ]

  const bitwiseOps = [
    { id: 'and', label: 'AND', name: t('tools.binaryCalculator.and') },
    { id: 'or', label: 'OR', name: t('tools.binaryCalculator.or') },
    { id: 'xor', label: 'XOR', name: t('tools.binaryCalculator.xor') },
    { id: 'not', label: 'NOT', name: t('tools.binaryCalculator.not') },
    { id: 'shift', label: 'SHIFT', name: t('tools.binaryCalculator.shift') },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            {t('tools.binaryCalculator.operand1')}
          </label>
          <input
            type="text"
            value={binary1}
            onChange={(e) => setBinary1(e.target.value.replace(/[^01\s]/g, ''))}
            className="w-full px-3 py-2 border border-slate-300 rounded font-mono text-lg"
            placeholder="1010"
          />
          {isValidBinary(binary1.replace(/\s/g, '')) && (
            <p className="text-sm text-slate-500 mt-1">
              = {parseInt(binary1.replace(/\s/g, ''), 2)} (decimal)
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <div className="w-full text-sm text-slate-600 mb-1">{t('tools.binaryCalculator.arithmetic')}</div>
          {arithmeticOps.map(op => (
            <button
              key={op.id}
              onClick={() => setOperation(op.id as Operation)}
              className={`px-3 py-1.5 rounded ${
                operation === op.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 hover:bg-slate-200'
              }`}
              title={op.name}
            >
              {op.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <div className="w-full text-sm text-slate-600 mb-1">{t('tools.binaryCalculator.bitwise')}</div>
          {bitwiseOps.map(op => (
            <button
              key={op.id}
              onClick={() => setOperation(op.id as Operation)}
              className={`px-3 py-1.5 rounded text-sm ${
                operation === op.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-100 hover:bg-slate-200'
              }`}
              title={op.name}
            >
              {op.label}
            </button>
          ))}
        </div>

        {operation !== 'not' && operation !== 'shift' && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              {t('tools.binaryCalculator.operand2')}
            </label>
            <input
              type="text"
              value={binary2}
              onChange={(e) => setBinary2(e.target.value.replace(/[^01\s]/g, ''))}
              className="w-full px-3 py-2 border border-slate-300 rounded font-mono text-lg"
              placeholder="0110"
            />
            {isValidBinary(binary2.replace(/\s/g, '')) && (
              <p className="text-sm text-slate-500 mt-1">
                = {parseInt(binary2.replace(/\s/g, ''), 2)} (decimal)
              </p>
            )}
          </div>
        )}

        {operation === 'shift' && (
          <div className="mb-4 flex gap-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">{t('tools.binaryCalculator.direction')}</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setShiftDirection('left')}
                  className={`px-3 py-1 rounded ${
                    shiftDirection === 'left' ? 'bg-green-600 text-white' : 'bg-slate-100'
                  }`}
                >
                  {'<<'} {t('tools.binaryCalculator.left')}
                </button>
                <button
                  onClick={() => setShiftDirection('right')}
                  className={`px-3 py-1 rounded ${
                    shiftDirection === 'right' ? 'bg-green-600 text-white' : 'bg-slate-100'
                  }`}
                >
                  {'>>'} {t('tools.binaryCalculator.right')}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">{t('tools.binaryCalculator.shiftBy')}</label>
              <input
                type="number"
                min="1"
                max="32"
                value={shiftAmount}
                onChange={(e) => setShiftAmount(parseInt(e.target.value) || 1)}
                className="w-20 px-2 py-1 border border-slate-300 rounded"
              />
            </div>
          </div>
        )}

        <button
          onClick={calculate}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {t('tools.binaryCalculator.calculate')}
        </button>

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}
      </div>

      {result && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.binaryCalculator.result')}</h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded">
              <div className="text-sm text-blue-600 mb-1">{t('tools.binaryCalculator.binary')}</div>
              <div className="font-mono text-xl break-all">{formatBinary(result.binary)}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-sm text-slate-600 mb-1">{t('tools.binaryCalculator.decimal')}</div>
                <div className="font-mono text-lg">{result.decimal}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-sm text-slate-600 mb-1">{t('tools.binaryCalculator.hex')}</div>
                <div className="font-mono text-lg">0x{result.hex}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.binaryCalculator.truthTable')}</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center">
            <thead>
              <tr className="bg-slate-200">
                <th className="p-2">A</th>
                <th className="p-2">B</th>
                <th className="p-2">AND</th>
                <th className="p-2">OR</th>
                <th className="p-2">XOR</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              <tr><td className="p-2">0</td><td className="p-2">0</td><td className="p-2">0</td><td className="p-2">0</td><td className="p-2">0</td></tr>
              <tr className="bg-white"><td className="p-2">0</td><td className="p-2">1</td><td className="p-2">0</td><td className="p-2">1</td><td className="p-2">1</td></tr>
              <tr><td className="p-2">1</td><td className="p-2">0</td><td className="p-2">0</td><td className="p-2">1</td><td className="p-2">1</td></tr>
              <tr className="bg-white"><td className="p-2">1</td><td className="p-2">1</td><td className="p-2">1</td><td className="p-2">1</td><td className="p-2">0</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
