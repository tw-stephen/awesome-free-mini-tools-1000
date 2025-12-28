import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type Operation = 'add' | 'subtract' | 'multiply' | 'divide' | 'and' | 'or' | 'xor'

export default function HexCalculator() {
  const { t } = useTranslation()
  const [hex1, setHex1] = useState('FF')
  const [hex2, setHex2] = useState('1A')
  const [operation, setOperation] = useState<Operation>('add')
  const [result, setResult] = useState<{
    hex: string
    decimal: number
    binary: string
    octal: string
  } | null>(null)
  const [error, setError] = useState('')

  const isValidHex = (str: string): boolean => {
    return /^[0-9A-Fa-f]+$/.test(str)
  }

  const calculate = () => {
    setError('')
    setResult(null)

    const clean1 = hex1.replace(/^0x/i, '').replace(/\s/g, '')
    const clean2 = hex2.replace(/^0x/i, '').replace(/\s/g, '')

    if (!isValidHex(clean1)) {
      setError(t('tools.hexCalculator.invalidHex1'))
      return
    }

    if (!isValidHex(clean2)) {
      setError(t('tools.hexCalculator.invalidHex2'))
      return
    }

    const num1 = parseInt(clean1, 16)
    const num2 = parseInt(clean2, 16)
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
          setError(t('tools.hexCalculator.divisionByZero'))
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
      default:
        resultNum = 0
    }

    if (resultNum < 0) {
      resultNum = resultNum >>> 0
    }

    setResult({
      hex: resultNum.toString(16).toUpperCase(),
      decimal: resultNum,
      binary: resultNum.toString(2),
      octal: resultNum.toString(8),
    })
  }

  const formatHex = (hex: string): string => {
    const padded = hex.padStart(Math.ceil(hex.length / 2) * 2, '0')
    return padded.match(/.{1,2}/g)?.join(' ') || hex
  }

  const formatBinary = (binary: string): string => {
    const padded = binary.padStart(Math.ceil(binary.length / 4) * 4, '0')
    return padded.match(/.{1,4}/g)?.join(' ') || binary
  }

  const operations = [
    { id: 'add', label: '+' },
    { id: 'subtract', label: '−' },
    { id: 'multiply', label: '×' },
    { id: 'divide', label: '÷' },
    { id: 'and', label: 'AND' },
    { id: 'or', label: 'OR' },
    { id: 'xor', label: 'XOR' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            {t('tools.hexCalculator.operand1')}
          </label>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono">0x</span>
            <input
              type="text"
              value={hex1}
              onChange={(e) => setHex1(e.target.value.replace(/[^0-9A-Fa-f\s]/g, '').toUpperCase())}
              className="flex-1 px-3 py-2 border border-slate-300 rounded font-mono text-lg"
              placeholder="FF"
            />
          </div>
          {isValidHex(hex1.replace(/\s/g, '')) && (
            <p className="text-sm text-slate-500 mt-1">
              = {parseInt(hex1.replace(/\s/g, ''), 16)} (decimal)
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {operations.map(op => (
            <button
              key={op.id}
              onClick={() => setOperation(op.id as Operation)}
              className={`px-3 py-1.5 rounded ${
                operation === op.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {op.label}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            {t('tools.hexCalculator.operand2')}
          </label>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono">0x</span>
            <input
              type="text"
              value={hex2}
              onChange={(e) => setHex2(e.target.value.replace(/[^0-9A-Fa-f\s]/g, '').toUpperCase())}
              className="flex-1 px-3 py-2 border border-slate-300 rounded font-mono text-lg"
              placeholder="1A"
            />
          </div>
          {isValidHex(hex2.replace(/\s/g, '')) && (
            <p className="text-sm text-slate-500 mt-1">
              = {parseInt(hex2.replace(/\s/g, ''), 16)} (decimal)
            </p>
          )}
        </div>

        <button
          onClick={calculate}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {t('tools.hexCalculator.calculate')}
        </button>

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}
      </div>

      {result && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.hexCalculator.result')}</h3>
          <div className="space-y-3">
            <div className="p-3 bg-purple-50 rounded">
              <div className="text-sm text-purple-600 mb-1">{t('tools.hexCalculator.hexadecimal')}</div>
              <div className="font-mono text-xl">0x{formatHex(result.hex)}</div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-sm text-slate-600 mb-1">{t('tools.hexCalculator.decimal')}</div>
                <div className="font-mono text-lg">{result.decimal}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-sm text-slate-600 mb-1">{t('tools.hexCalculator.binary')}</div>
                <div className="font-mono text-sm break-all">{formatBinary(result.binary)}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-sm text-slate-600 mb-1">{t('tools.hexCalculator.octal')}</div>
                <div className="font-mono text-lg">0o{result.octal}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.hexCalculator.hexTable')}</h4>
        <div className="grid grid-cols-8 gap-1 text-center text-sm font-mono">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="p-2 bg-white rounded">
              <div className="text-purple-600 font-bold">{i.toString(16).toUpperCase()}</div>
              <div className="text-slate-400 text-xs">{i}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.hexCalculator.commonValues')}</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          {[
            { hex: 'FF', dec: '255', desc: '8-bit max' },
            { hex: 'FFFF', dec: '65535', desc: '16-bit max' },
            { hex: '100', dec: '256', desc: '2^8' },
            { hex: '1000', dec: '4096', desc: '2^12' },
            { hex: 'A', dec: '10', desc: '' },
            { hex: 'B', dec: '11', desc: '' },
            { hex: 'C', dec: '12', desc: '' },
            { hex: 'F', dec: '15', desc: '' },
          ].map((item, i) => (
            <div key={i} className="p-2 bg-white rounded flex justify-between items-center">
              <span className="font-mono text-purple-600">0x{item.hex}</span>
              <span className="text-slate-500">{item.dec}</span>
              {item.desc && <span className="text-xs text-slate-400">{item.desc}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
