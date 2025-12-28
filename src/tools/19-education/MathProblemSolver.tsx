import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Step {
  expression: string
  explanation: string
}

export default function MathProblemSolver() {
  const { t } = useTranslation()
  const [problem, setProblem] = useState('')
  const [problemType, setProblemType] = useState<'arithmetic' | 'algebra' | 'equation'>('arithmetic')

  const solveArithmetic = (expr: string): { result: number; steps: Step[] } | null => {
    const steps: Step[] = []
    let current = expr.trim()

    try {
      // Handle parentheses first
      while (current.includes('(')) {
        const match = current.match(/\([^()]+\)/)
        if (!match) break
        const inner = match[0].slice(1, -1)
        const innerResult = eval(inner)
        steps.push({
          expression: current,
          explanation: `Calculate ${match[0]} = ${innerResult}`,
        })
        current = current.replace(match[0], innerResult.toString())
      }

      // Handle multiplication and division
      while (/[*/]/.test(current)) {
        const match = current.match(/(-?\d+\.?\d*)\s*([*/])\s*(-?\d+\.?\d*)/)
        if (!match) break
        const [full, a, op, b] = match
        const result = op === '*' ? parseFloat(a) * parseFloat(b) : parseFloat(a) / parseFloat(b)
        steps.push({
          expression: current,
          explanation: `${a} ${op} ${b} = ${result}`,
        })
        current = current.replace(full, result.toString())
      }

      // Handle addition and subtraction
      const result = eval(current)
      if (steps.length > 0 || current !== expr) {
        steps.push({
          expression: current,
          explanation: `Final result = ${result}`,
        })
      } else {
        steps.push({
          expression: expr,
          explanation: `= ${result}`,
        })
      }

      return { result, steps }
    } catch {
      return null
    }
  }

  const solveLinearEquation = (eq: string): { result: string; steps: Step[] } | null => {
    const steps: Step[] = []

    try {
      // Parse equation like "2x + 5 = 15" or "3x - 7 = 8"
      const match = eq.match(/(-?\d*)x\s*([+-])\s*(\d+)\s*=\s*(-?\d+)/)
      if (!match) return null

      const [, coeffStr, sign, constStr, rightStr] = match
      const coeff = coeffStr === '' || coeffStr === '-' ? (coeffStr === '-' ? -1 : 1) : parseInt(coeffStr)
      const constant = sign === '-' ? -parseInt(constStr) : parseInt(constStr)
      const right = parseInt(rightStr)

      steps.push({
        expression: eq,
        explanation: 'Original equation',
      })

      // Move constant to right side
      const newRight = right - constant
      steps.push({
        expression: `${coeff}x = ${right} - (${constant})`,
        explanation: `Subtract ${constant} from both sides`,
      })

      steps.push({
        expression: `${coeff}x = ${newRight}`,
        explanation: 'Simplify right side',
      })

      // Divide by coefficient
      const x = newRight / coeff
      steps.push({
        expression: `x = ${newRight} / ${coeff}`,
        explanation: `Divide both sides by ${coeff}`,
      })

      steps.push({
        expression: `x = ${x}`,
        explanation: 'Solution',
      })

      return { result: `x = ${x}`, steps }
    } catch {
      return null
    }
  }

  const solve = () => {
    if (problemType === 'arithmetic') {
      return solveArithmetic(problem)
    } else if (problemType === 'equation') {
      return solveLinearEquation(problem)
    }
    return null
  }

  const solution = problem ? solve() : null

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.mathProblemSolver.type')}</h3>
        <div className="flex gap-2 mb-4">
          {(['arithmetic', 'algebra', 'equation'] as const).map(type => (
            <button
              key={type}
              onClick={() => setProblemType(type)}
              className={`flex-1 py-2 rounded text-sm capitalize
                ${problemType === type ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <input
            type="text"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder={
              problemType === 'arithmetic'
                ? 'e.g., (5 + 3) * 2 - 4'
                : problemType === 'equation'
                ? 'e.g., 2x + 5 = 15'
                : 'Enter expression'
            }
            className="w-full px-3 py-2 border border-slate-300 rounded font-mono"
          />
        </div>
      </div>

      {solution && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.mathProblemSolver.solution')}</h3>
          <div className="space-y-3">
            {solution.steps.map((step, index) => (
              <div key={index} className="p-3 bg-slate-50 rounded">
                <div className="font-mono text-lg mb-1">{step.expression}</div>
                <div className="text-sm text-slate-500">→ {step.explanation}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-green-50 rounded text-center">
            <div className="text-sm text-green-600">Answer</div>
            <div className="text-2xl font-bold text-green-700">{solution.result}</div>
          </div>
        </div>
      )}

      {problem && !solution && (
        <div className="card p-4 bg-red-50 text-center">
          <div className="text-red-600">Could not solve this problem</div>
          <div className="text-sm text-red-500 mt-1">Please check the format</div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.mathProblemSolver.examples')}</h3>
        <div className="space-y-2 text-sm">
          <div className="p-2 bg-slate-50 rounded">
            <div className="font-medium">Arithmetic:</div>
            <div className="text-slate-600 font-mono">15 + 3 * 4 - 2</div>
            <div className="text-slate-600 font-mono">(10 + 5) * 2</div>
          </div>
          <div className="p-2 bg-slate-50 rounded">
            <div className="font-medium">Linear Equations:</div>
            <div className="text-slate-600 font-mono">2x + 5 = 15</div>
            <div className="text-slate-600 font-mono">3x - 7 = 8</div>
          </div>
        </div>
      </div>

      <div className="card p-4 bg-blue-50">
        <h3 className="font-medium mb-2 text-blue-700">{t('tools.mathProblemSolver.orderOfOps')}</h3>
        <div className="text-sm text-blue-600">
          <p className="font-medium">PEMDAS / BODMAS:</p>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Parentheses / Brackets</li>
            <li>Exponents / Orders</li>
            <li>Multiplication & Division (left to right)</li>
            <li>Addition & Subtraction (left to right)</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
