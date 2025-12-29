import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function BinaryCalc() {
  const { t } = useTranslation()
  const [binary1, setBinary1] = useState('1010')
  const [binary2, setBinary2] = useState('0110')
  const [operation, setOperation] = useState<'+' | '-' | 'x' | '/' | 'AND' | 'OR' | 'XOR'>( '+')

  const [convertInput, setConvertInput] = useState('42')
  const [convertFrom, setConvertFrom] = useState<'dec' | 'bin'>('dec')

  const isValidBinary = (str: string): boolean => {
    return /^[01]+$/.test(str)
  }

  const binaryToDecimal = (bin: string): number => {
    return parseInt(bin, 2)
  }

  const decimalToBinary = (dec: number): string => {
    return (dec >>> 0).toString(2)
  }

  const calculate = () => {
    if (!isValidBinary(binary1) || !isValidBinary(binary2)) {
      return { binary: t('tools.binaryCalc.invalid'), decimal: 0 }
    }

    const dec1 = binaryToDecimal(binary1)
    const dec2 = binaryToDecimal(binary2)
    let result: number

    switch (operation) {
      case '+':
        result = dec1 + dec2
        break
      case '-':
        result = dec1 - dec2
        break
      case 'x':
        result = dec1 * dec2
        break
      case '/':
        result = Math.floor(dec1 / dec2)
        break
      case 'AND':
        result = dec1 & dec2
        break
      case 'OR':
        result = dec1 | dec2
        break
      case 'XOR':
        result = dec1 ^ dec2
        break
      default:
        result = 0
    }

    return {
      binary: decimalToBinary(Math.abs(result)),
      decimal: result
    }
  }

  const result = calculate()

  const dec1 = isValidBinary(binary1) ? binaryToDecimal(binary1) : 0
  const dec2 = isValidBinary(binary2) ? binaryToDecimal(binary2) : 0

  // Conversion
  const convertedValue = convertFrom === 'dec'
    ? decimalToBinary(parseInt(convertInput) || 0)
    : binaryToDecimal(convertInput).toString()

  // Bit operations visualization
  const padBinary = (bin: string, len: number): string => {
    return bin.padStart(len, '0')
  }

  const maxLen = Math.max(binary1.length, binary2.length, 8)
  const padded1 = isValidBinary(binary1) ? padBinary(binary1, maxLen) : ''
  const padded2 = isValidBinary(binary2) ? padBinary(binary2, maxLen) : ''

  return (
    <div className="space-y-4">
      {/* Calculator */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.binaryCalc.calculator')}</h3>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>{t('tools.binaryCalc.binary1')}</span>
              <span>{t('tools.binaryCalc.decimal')}: {dec1}</span>
            </div>
            <input
              type="text"
              value={binary1}
              onChange={(e) => setBinary1(e.target.value.replace(/[^01]/g, ''))}
              className="w-full px-3 py-2 border border-slate-300 rounded font-mono text-lg"
              placeholder="1010"
            />
          </div>

          <div className="flex justify-center gap-2 flex-wrap">
            {(['+', '-', 'x', '/', 'AND', 'OR', 'XOR'] as const).map(op => (
              <button
                key={op}
                onClick={() => setOperation(op)}
                className={`px-3 py-1 rounded ${
                  operation === op ? 'bg-blue-500 text-white' : 'bg-slate-100'
                }`}
              >
                {op}
              </button>
            ))}
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>{t('tools.binaryCalc.binary2')}</span>
              <span>{t('tools.binaryCalc.decimal')}: {dec2}</span>
            </div>
            <input
              type="text"
              value={binary2}
              onChange={(e) => setBinary2(e.target.value.replace(/[^01]/g, ''))}
              className="w-full px-3 py-2 border border-slate-300 rounded font-mono text-lg"
              placeholder="0110"
            />
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded">
          <div className="text-sm text-slate-500 mb-1">{t('tools.binaryCalc.result')}</div>
          <div className="text-2xl font-mono font-bold text-blue-600">{result.binary}</div>
          <div className="text-sm text-slate-500 mt-1">
            {t('tools.binaryCalc.decimal')}: {result.decimal}
          </div>
        </div>
      </div>

      {/* Bit operation visualization */}
      {['AND', 'OR', 'XOR'].includes(operation) && padded1 && padded2 && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.binaryCalc.bitwise')}</h3>
          <div className="font-mono text-center space-y-1">
            <div className="flex justify-center gap-1">
              {padded1.split('').map((bit, i) => (
                <span key={i} className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded">
                  {bit}
                </span>
              ))}
            </div>
            <div className="text-slate-500">{operation}</div>
            <div className="flex justify-center gap-1">
              {padded2.split('').map((bit, i) => (
                <span key={i} className="w-8 h-8 flex items-center justify-center bg-green-100 rounded">
                  {bit}
                </span>
              ))}
            </div>
            <div className="border-t border-slate-300 my-2"></div>
            <div className="flex justify-center gap-1">
              {padBinary(result.binary, maxLen).split('').map((bit, i) => (
                <span key={i} className="w-8 h-8 flex items-center justify-center bg-purple-100 rounded font-bold">
                  {bit}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Converter */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.binaryCalc.quickConvert')}</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={convertInput}
            onChange={(e) => setConvertInput(e.target.value)}
            className="flex-1 px-3 py-2 border border-slate-300 rounded font-mono"
          />
          <select
            value={convertFrom}
            onChange={(e) => setConvertFrom(e.target.value as 'dec' | 'bin')}
            className="px-3 py-2 border border-slate-300 rounded"
          >
            <option value="dec">{t('tools.binaryCalc.decToBin')}</option>
            <option value="bin">{t('tools.binaryCalc.binToDec')}</option>
          </select>
        </div>
        <div className="mt-2 p-2 bg-slate-50 rounded text-center font-mono text-lg">
          {convertedValue}
        </div>
      </div>

      {/* Reference */}
      <div className="card p-4 bg-slate-50">
        <h3 className="font-medium mb-2">{t('tools.binaryCalc.reference')}</h3>
        <div className="grid grid-cols-4 gap-2 text-sm font-mono">
          {Array.from({ length: 16 }, (_, i) => (
            <div key={i} className="flex justify-between p-1 bg-white rounded">
              <span>{i}</span>
              <span className="text-blue-600">{decimalToBinary(i).padStart(4, '0')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
