import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function HexCalc() {
  const { t } = useTranslation()
  const [hex1, setHex1] = useState('FF')
  const [hex2, setHex2] = useState('10')
  const [operation, setOperation] = useState<'+' | '-' | 'x' | '/' | 'AND' | 'OR' | 'XOR'>( '+')

  const [convertInput, setConvertInput] = useState('255')
  const [convertFrom, setConvertFrom] = useState<'dec' | 'hex'>('dec')

  const isValidHex = (str: string): boolean => {
    return /^[0-9A-Fa-f]+$/.test(str)
  }

  const hexToDecimal = (hex: string): number => {
    return parseInt(hex, 16)
  }

  const decimalToHex = (dec: number): string => {
    return (dec >>> 0).toString(16).toUpperCase()
  }

  const calculate = () => {
    if (!isValidHex(hex1) || !isValidHex(hex2)) {
      return { hex: t('tools.hexCalc.invalid'), decimal: 0 }
    }

    const dec1 = hexToDecimal(hex1)
    const dec2 = hexToDecimal(hex2)
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
      hex: decimalToHex(Math.abs(result)),
      decimal: result,
      binary: (Math.abs(result) >>> 0).toString(2)
    }
  }

  const result = calculate()

  const dec1 = isValidHex(hex1) ? hexToDecimal(hex1) : 0
  const dec2 = isValidHex(hex2) ? hexToDecimal(hex2) : 0

  // Conversion
  const convertedValue = convertFrom === 'dec'
    ? decimalToHex(parseInt(convertInput) || 0)
    : hexToDecimal(convertInput).toString()

  return (
    <div className="space-y-4">
      {/* Calculator */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.hexCalc.calculator')}</h3>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>{t('tools.hexCalc.hex1')}</span>
              <span>{t('tools.hexCalc.decimal')}: {dec1}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">0x</span>
              <input
                type="text"
                value={hex1}
                onChange={(e) => setHex1(e.target.value.toUpperCase().replace(/[^0-9A-Fa-f]/g, ''))}
                className="flex-1 px-3 py-2 border border-slate-300 rounded font-mono text-lg"
                placeholder="FF"
              />
            </div>
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
              <span>{t('tools.hexCalc.hex2')}</span>
              <span>{t('tools.hexCalc.decimal')}: {dec2}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">0x</span>
              <input
                type="text"
                value={hex2}
                onChange={(e) => setHex2(e.target.value.toUpperCase().replace(/[^0-9A-Fa-f]/g, ''))}
                className="flex-1 px-3 py-2 border border-slate-300 rounded font-mono text-lg"
                placeholder="10"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-purple-50 rounded">
          <div className="text-sm text-slate-500 mb-1">{t('tools.hexCalc.result')}</div>
          <div className="text-3xl font-mono font-bold text-purple-600">0x{result.hex}</div>
          <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-slate-500">
            <div>{t('tools.hexCalc.decimal')}: {result.decimal}</div>
            <div>{t('tools.hexCalc.binary')}: {result.binary}</div>
          </div>
        </div>
      </div>

      {/* Quick Converter */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.hexCalc.quickConvert')}</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={convertInput}
            onChange={(e) => setConvertInput(e.target.value.toUpperCase())}
            className="flex-1 px-3 py-2 border border-slate-300 rounded font-mono"
          />
          <select
            value={convertFrom}
            onChange={(e) => setConvertFrom(e.target.value as 'dec' | 'hex')}
            className="px-3 py-2 border border-slate-300 rounded"
          >
            <option value="dec">{t('tools.hexCalc.decToHex')}</option>
            <option value="hex">{t('tools.hexCalc.hexToDec')}</option>
          </select>
        </div>
        <div className="mt-2 p-2 bg-slate-50 rounded text-center font-mono text-lg">
          {convertFrom === 'dec' ? '0x' : ''}{convertedValue}
        </div>
      </div>

      {/* Color Preview (for valid 6-digit hex) */}
      {hex1.length === 6 && isValidHex(hex1) && (
        <div className="card p-4">
          <h3 className="font-medium mb-2">{t('tools.hexCalc.colorPreview')}</h3>
          <div
            className="h-20 rounded"
            style={{ backgroundColor: `#${hex1}` }}
          />
          <div className="text-center mt-2 font-mono">#{hex1}</div>
        </div>
      )}

      {/* Reference Table */}
      <div className="card p-4 bg-slate-50">
        <h3 className="font-medium mb-2">{t('tools.hexCalc.reference')}</h3>
        <div className="grid grid-cols-4 gap-2 text-sm font-mono">
          {Array.from({ length: 16 }, (_, i) => (
            <div key={i} className="flex justify-between p-1 bg-white rounded">
              <span>{i}</span>
              <span className="text-purple-600">{i.toString(16).toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ASCII Reference */}
      <div className="card p-4">
        <h3 className="font-medium mb-2">{t('tools.hexCalc.asciiReference')}</h3>
        <div className="grid grid-cols-4 gap-1 text-xs font-mono max-h-48 overflow-y-auto">
          {Array.from({ length: 95 }, (_, i) => i + 32).map(code => (
            <div key={code} className="flex justify-between p-1 bg-slate-50 rounded">
              <span>{String.fromCharCode(code)}</span>
              <span className="text-purple-600">{code.toString(16).toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
