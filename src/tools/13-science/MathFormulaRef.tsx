import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Formula {
  id: string
  name: string
  formula: string
  description: string
  category: string
}

export default function MathFormulaRef() {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = ['all', 'algebra', 'geometry', 'trigonometry', 'calculus', 'statistics']

  const formulas: Formula[] = [
    // Algebra
    { id: '1', name: 'Quadratic Formula', formula: 'x = (-b +/- sqrt(b^2-4ac)) / 2a', description: 'Solution to ax^2 + bx + c = 0', category: 'algebra' },
    { id: '2', name: 'Slope', formula: 'm = (y2-y1)/(x2-x1)', description: 'Slope of a line through two points', category: 'algebra' },
    { id: '3', name: 'Point-Slope Form', formula: 'y - y1 = m(x - x1)', description: 'Line equation given point and slope', category: 'algebra' },
    { id: '4', name: 'Slope-Intercept', formula: 'y = mx + b', description: 'm=slope, b=y-intercept', category: 'algebra' },
    { id: '5', name: 'Distance Formula', formula: 'd = sqrt((x2-x1)^2 + (y2-y1)^2)', description: 'Distance between two points', category: 'algebra' },
    { id: '6', name: 'Midpoint', formula: 'M = ((x1+x2)/2, (y1+y2)/2)', description: 'Midpoint of a line segment', category: 'algebra' },
    { id: '7', name: 'Difference of Squares', formula: 'a^2 - b^2 = (a+b)(a-b)', description: 'Factoring pattern', category: 'algebra' },
    { id: '8', name: 'Perfect Square', formula: '(a+b)^2 = a^2 + 2ab + b^2', description: 'Expansion formula', category: 'algebra' },
    // Geometry
    { id: '9', name: 'Circle Area', formula: 'A = pi*r^2', description: 'r=radius', category: 'geometry' },
    { id: '10', name: 'Circle Circumference', formula: 'C = 2*pi*r', description: 'r=radius', category: 'geometry' },
    { id: '11', name: 'Triangle Area', formula: 'A = (1/2)*b*h', description: 'b=base, h=height', category: 'geometry' },
    { id: '12', name: 'Herons Formula', formula: 'A = sqrt(s(s-a)(s-b)(s-c))', description: 's=(a+b+c)/2, semi-perimeter', category: 'geometry' },
    { id: '13', name: 'Rectangle Area', formula: 'A = l*w', description: 'l=length, w=width', category: 'geometry' },
    { id: '14', name: 'Trapezoid Area', formula: 'A = (1/2)(a+b)*h', description: 'a,b=parallel sides, h=height', category: 'geometry' },
    { id: '15', name: 'Sphere Volume', formula: 'V = (4/3)*pi*r^3', description: 'r=radius', category: 'geometry' },
    { id: '16', name: 'Sphere Surface', formula: 'S = 4*pi*r^2', description: 'r=radius', category: 'geometry' },
    { id: '17', name: 'Cylinder Volume', formula: 'V = pi*r^2*h', description: 'r=radius, h=height', category: 'geometry' },
    { id: '18', name: 'Cone Volume', formula: 'V = (1/3)*pi*r^2*h', description: 'r=radius, h=height', category: 'geometry' },
    { id: '19', name: 'Pythagorean Theorem', formula: 'a^2 + b^2 = c^2', description: 'Right triangle sides', category: 'geometry' },
    // Trigonometry
    { id: '20', name: 'Sine', formula: 'sin(theta) = opposite/hypotenuse', description: 'SOH', category: 'trigonometry' },
    { id: '21', name: 'Cosine', formula: 'cos(theta) = adjacent/hypotenuse', description: 'CAH', category: 'trigonometry' },
    { id: '22', name: 'Tangent', formula: 'tan(theta) = opposite/adjacent', description: 'TOA', category: 'trigonometry' },
    { id: '23', name: 'Pythagorean Identity', formula: 'sin^2(x) + cos^2(x) = 1', description: 'Fundamental trig identity', category: 'trigonometry' },
    { id: '24', name: 'Law of Sines', formula: 'a/sin(A) = b/sin(B) = c/sin(C)', description: 'For any triangle', category: 'trigonometry' },
    { id: '25', name: 'Law of Cosines', formula: 'c^2 = a^2 + b^2 - 2ab*cos(C)', description: 'For any triangle', category: 'trigonometry' },
    // Calculus
    { id: '26', name: 'Power Rule (derivative)', formula: 'd/dx[x^n] = n*x^(n-1)', description: 'Derivative of power function', category: 'calculus' },
    { id: '27', name: 'Product Rule', formula: 'd/dx[fg] = fg\' + f\'g', description: 'Derivative of product', category: 'calculus' },
    { id: '28', name: 'Quotient Rule', formula: 'd/dx[f/g] = (gf\'-fg\')/g^2', description: 'Derivative of quotient', category: 'calculus' },
    { id: '29', name: 'Chain Rule', formula: 'd/dx[f(g(x))] = f\'(g(x))*g\'(x)', description: 'Derivative of composition', category: 'calculus' },
    { id: '30', name: 'Power Rule (integral)', formula: 'integral x^n dx = x^(n+1)/(n+1) + C', description: 'n != -1', category: 'calculus' },
    // Statistics
    { id: '31', name: 'Mean', formula: 'x_bar = sum(x)/n', description: 'Average of values', category: 'statistics' },
    { id: '32', name: 'Variance', formula: 's^2 = sum((x-x_bar)^2)/(n-1)', description: 'Sample variance', category: 'statistics' },
    { id: '33', name: 'Standard Deviation', formula: 's = sqrt(variance)', description: 'Spread of data', category: 'statistics' },
    { id: '34', name: 'z-score', formula: 'z = (x - mu)/sigma', description: 'Standard score', category: 'statistics' },
    { id: '35', name: 'Combinations', formula: 'nCr = n!/(r!(n-r)!)', description: 'Number of combinations', category: 'statistics' },
    { id: '36', name: 'Permutations', formula: 'nPr = n!/(n-r)!', description: 'Number of permutations', category: 'statistics' },
  ]

  const filteredFormulas = formulas.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.formula.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || f.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const copyFormula = async (formula: string) => {
    await navigator.clipboard.writeText(formula)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('tools.mathFormulaRef.search')}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded text-sm capitalize ${
              selectedCategory === cat ? 'bg-purple-500 text-white' : 'bg-slate-100'
            }`}
          >
            {t(`tools.mathFormulaRef.categories.${cat}`)}
          </button>
        ))}
      </div>

      <div className="text-sm text-slate-500">
        {filteredFormulas.length} {t('tools.mathFormulaRef.formulas')}
      </div>

      <div className="space-y-2">
        {filteredFormulas.map(formula => (
          <div key={formula.id} className="card p-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">{formula.name}</div>
                <div className="text-xl font-mono text-purple-600 my-1">{formula.formula}</div>
                <div className="text-xs text-slate-500">{formula.description}</div>
              </div>
              <button
                onClick={() => copyFormula(formula.formula)}
                className="text-xs text-purple-500 px-2 py-1 bg-purple-50 rounded"
              >
                {t('tools.mathFormulaRef.copy')}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-4 bg-purple-50">
        <h3 className="font-medium mb-2">{t('tools.mathFormulaRef.constants')}</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>pi = 3.14159...</div>
          <div>e = 2.71828...</div>
          <div>sqrt(2) = 1.41421...</div>
          <div>phi = 1.61803...</div>
        </div>
      </div>
    </div>
  )
}
