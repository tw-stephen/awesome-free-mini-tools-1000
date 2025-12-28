import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

export default function BasicCalculator() {
  const { t } = useTranslation()
  const [display, setDisplay] = useState('0')
  const [firstOperand, setFirstOperand] = useState<number | null>(null)
  const [operator, setOperator] = useState<string | null>(null)
  const [waitingForSecond, setWaitingForSecond] = useState(false)
  const [history, setHistory] = useState<string[]>([])

  const inputDigit = useCallback((digit: string) => {
    if (waitingForSecond) {
      setDisplay(digit)
      setWaitingForSecond(false)
    } else {
      setDisplay(display === '0' ? digit : display + digit)
    }
  }, [display, waitingForSecond])

  const inputDecimal = useCallback(() => {
    if (waitingForSecond) {
      setDisplay('0.')
      setWaitingForSecond(false)
      return
    }
    if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }, [display, waitingForSecond])

  const clear = useCallback(() => {
    setDisplay('0')
    setFirstOperand(null)
    setOperator(null)
    setWaitingForSecond(false)
  }, [])

  const clearEntry = useCallback(() => {
    setDisplay('0')
  }, [])

  const performOperation = useCallback((nextOperator: string) => {
    const inputValue = parseFloat(display)

    if (firstOperand === null) {
      setFirstOperand(inputValue)
    } else if (operator) {
      const result = calculate(firstOperand, inputValue, operator)
      const expression = `${firstOperand} ${operator} ${inputValue} = ${result}`
      setHistory(prev => [expression, ...prev.slice(0, 9)])
      setDisplay(String(result))
      setFirstOperand(result)
    }

    setWaitingForSecond(true)
    setOperator(nextOperator)
  }, [display, firstOperand, operator])

  const calculate = (first: number, second: number, op: string): number => {
    switch (op) {
      case '+': return first + second
      case '-': return first - second
      case '×': return first * second
      case '÷': return second !== 0 ? first / second : 0
      default: return second
    }
  }

  const equals = useCallback(() => {
    if (operator && firstOperand !== null) {
      const inputValue = parseFloat(display)
      const result = calculate(firstOperand, inputValue, operator)
      const expression = `${firstOperand} ${operator} ${inputValue} = ${result}`
      setHistory(prev => [expression, ...prev.slice(0, 9)])
      setDisplay(String(result))
      setFirstOperand(null)
      setOperator(null)
      setWaitingForSecond(false)
    }
  }, [display, firstOperand, operator])

  const toggleSign = useCallback(() => {
    setDisplay(String(-parseFloat(display)))
  }, [display])

  const percentage = useCallback(() => {
    setDisplay(String(parseFloat(display) / 100))
  }, [display])

  const buttons = [
    { label: 'C', action: clear, className: 'bg-red-500 text-white' },
    { label: 'CE', action: clearEntry, className: 'bg-orange-500 text-white' },
    { label: '%', action: percentage, className: 'bg-slate-300' },
    { label: '÷', action: () => performOperation('÷'), className: 'bg-blue-500 text-white' },
    { label: '7', action: () => inputDigit('7') },
    { label: '8', action: () => inputDigit('8') },
    { label: '9', action: () => inputDigit('9') },
    { label: '×', action: () => performOperation('×'), className: 'bg-blue-500 text-white' },
    { label: '4', action: () => inputDigit('4') },
    { label: '5', action: () => inputDigit('5') },
    { label: '6', action: () => inputDigit('6') },
    { label: '-', action: () => performOperation('-'), className: 'bg-blue-500 text-white' },
    { label: '1', action: () => inputDigit('1') },
    { label: '2', action: () => inputDigit('2') },
    { label: '3', action: () => inputDigit('3') },
    { label: '+', action: () => performOperation('+'), className: 'bg-blue-500 text-white' },
    { label: '±', action: toggleSign },
    { label: '0', action: () => inputDigit('0') },
    { label: '.', action: inputDecimal },
    { label: '=', action: equals, className: 'bg-green-500 text-white' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4 max-w-xs mx-auto">
        <div className="mb-4">
          <div className="text-xs text-slate-500 text-right h-4">
            {operator && firstOperand !== null ? `${firstOperand} ${operator}` : ''}
          </div>
          <div className="text-right text-3xl font-mono bg-slate-100 p-3 rounded overflow-x-auto">
            {display}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {buttons.map((btn, i) => (
            <button
              key={i}
              onClick={btn.action}
              className={`p-4 text-lg font-medium rounded-lg transition-colors ${btn.className || 'bg-slate-200 hover:bg-slate-300'}`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {history.length > 0 && (
        <div className="card p-4 max-w-xs mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-700">
              {t('tools.basicCalculator.history')}
            </h3>
            <Button variant="secondary" onClick={() => setHistory([])}>
              {t('common.clear')}
            </Button>
          </div>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {history.map((h, i) => (
              <div key={i} className="text-sm font-mono text-slate-600 py-1 border-b border-slate-100">
                {h}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4 max-w-xs mx-auto">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.basicCalculator.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.basicCalculator.tip1')}</li>
          <li>{t('tools.basicCalculator.tip2')}</li>
          <li>{t('tools.basicCalculator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
