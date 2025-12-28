import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ScientificCalculator() {
  const { t } = useTranslation()
  const [display, setDisplay] = useState('0')
  const [memory, setMemory] = useState(0)
  const [history, setHistory] = useState<string[]>([])
  const [isRadians, setIsRadians] = useState(true)
  const [lastOperation, setLastOperation] = useState('')

  const toRadians = (degrees: number) => degrees * (Math.PI / 180)
  const toDegrees = (radians: number) => radians * (180 / Math.PI)

  const calculate = (expression: string): number => {
    try {
      // Replace scientific functions
      let expr = expression
        .replace(/sin\(/g, isRadians ? 'Math.sin(' : '(x=>Math.sin(x*Math.PI/180))(')
        .replace(/cos\(/g, isRadians ? 'Math.cos(' : '(x=>Math.cos(x*Math.PI/180))(')
        .replace(/tan\(/g, isRadians ? 'Math.tan(' : '(x=>Math.tan(x*Math.PI/180))(')
        .replace(/asin\(/g, isRadians ? 'Math.asin(' : '(x=>Math.asin(x)*180/Math.PI)(')
        .replace(/acos\(/g, isRadians ? 'Math.acos(' : '(x=>Math.acos(x)*180/Math.PI)(')
        .replace(/atan\(/g, isRadians ? 'Math.atan(' : '(x=>Math.atan(x)*180/Math.PI)(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/sqrt\(/g, 'Math.sqrt(')
        .replace(/abs\(/g, 'Math.abs(')
        .replace(/exp\(/g, 'Math.exp(')
        .replace(/π/g, 'Math.PI')
        .replace(/e(?![x])/g, 'Math.E')
        .replace(/\^/g, '**')
        .replace(/×/g, '*')
        .replace(/÷/g, '/')

      const result = new Function('return ' + expr)()
      return typeof result === 'number' && !isNaN(result) ? result : 0
    } catch {
      return NaN
    }
  }

  const handleNumber = (num: string) => {
    if (display === '0' || display === 'Error') {
      setDisplay(num)
    } else {
      setDisplay(display + num)
    }
  }

  const handleOperator = (op: string) => {
    setDisplay(display + op)
  }

  const handleFunction = (fn: string) => {
    if (display === '0' || display === 'Error') {
      setDisplay(fn + '(')
    } else {
      setDisplay(display + fn + '(')
    }
  }

  const handleEquals = () => {
    const result = calculate(display)
    if (isNaN(result)) {
      setDisplay('Error')
    } else {
      setHistory([...history, `${display} = ${result}`])
      setLastOperation(display)
      setDisplay(result.toString())
    }
  }

  const handleClear = () => {
    setDisplay('0')
  }

  const handleClearAll = () => {
    setDisplay('0')
    setHistory([])
  }

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1))
    } else {
      setDisplay('0')
    }
  }

  const handleMemory = (action: string) => {
    const current = parseFloat(display) || 0
    switch (action) {
      case 'MC': setMemory(0); break
      case 'MR': setDisplay(memory.toString()); break
      case 'M+': setMemory(memory + current); break
      case 'M-': setMemory(memory - current); break
      case 'MS': setMemory(current); break
    }
  }

  const scientificButtons = [
    ['sin', 'cos', 'tan', 'π'],
    ['asin', 'acos', 'atan', 'e'],
    ['log', 'ln', 'sqrt', '^'],
    ['(', ')', 'abs', 'exp'],
  ]

  const numberButtons = [
    ['7', '8', '9', '÷'],
    ['4', '5', '6', '×'],
    ['1', '2', '3', '-'],
    ['0', '.', '=', '+'],
  ]

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div className="card p-4">
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setIsRadians(true)}
            className={`px-3 py-1 text-sm rounded ${isRadians ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}
          >
            RAD
          </button>
          <button
            onClick={() => setIsRadians(false)}
            className={`px-3 py-1 text-sm rounded ${!isRadians ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}
          >
            DEG
          </button>
          {memory !== 0 && (
            <span className="ml-auto text-sm text-slate-500">M: {memory}</span>
          )}
        </div>

        <div className="bg-slate-900 text-white p-4 rounded-lg mb-4">
          <div className="text-xs text-slate-400 h-4 overflow-hidden text-right">
            {lastOperation}
          </div>
          <div className="text-2xl font-mono text-right overflow-x-auto">
            {display}
          </div>
        </div>

        <div className="flex gap-1 mb-2">
          {['MC', 'MR', 'M+', 'M-', 'MS'].map(btn => (
            <button
              key={btn}
              onClick={() => handleMemory(btn)}
              className="flex-1 py-1 bg-slate-200 text-sm rounded hover:bg-slate-300"
            >
              {btn}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-1 mb-2">
          {scientificButtons.flat().map(btn => (
            <button
              key={btn}
              onClick={() => {
                if (['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'log', 'ln', 'sqrt', 'abs', 'exp'].includes(btn)) {
                  handleFunction(btn)
                } else {
                  handleOperator(btn)
                }
              }}
              className="py-2 bg-purple-100 text-purple-800 rounded hover:bg-purple-200 text-sm font-medium"
            >
              {btn}
            </button>
          ))}
        </div>

        <div className="flex gap-1 mb-2">
          <button
            onClick={handleClearAll}
            className="flex-1 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 font-medium"
          >
            AC
          </button>
          <button
            onClick={handleClear}
            className="flex-1 py-2 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 font-medium"
          >
            C
          </button>
          <button
            onClick={handleBackspace}
            className="flex-1 py-2 bg-slate-200 rounded hover:bg-slate-300 font-medium"
          >
            ⌫
          </button>
        </div>

        <div className="grid grid-cols-4 gap-1">
          {numberButtons.flat().map(btn => (
            <button
              key={btn}
              onClick={() => {
                if (btn === '=') {
                  handleEquals()
                } else if (['+', '-', '×', '÷'].includes(btn)) {
                  handleOperator(btn)
                } else {
                  handleNumber(btn)
                }
              }}
              className={`py-3 rounded font-medium ${
                btn === '='
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : ['+', '-', '×', '÷'].includes(btn)
                  ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                  : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>

      {history.length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium mb-2">{t('tools.scientificCalculator.history')}</h3>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {history.slice(-10).reverse().map((entry, i) => (
              <div key={i} className="text-sm font-mono text-slate-600 p-1 bg-slate-50 rounded">
                {entry}
              </div>
            ))}
          </div>
          <button
            onClick={() => setHistory([])}
            className="mt-2 text-sm text-red-600 hover:underline"
          >
            {t('tools.scientificCalculator.clearHistory')}
          </button>
        </div>
      )}
    </div>
  )
}
