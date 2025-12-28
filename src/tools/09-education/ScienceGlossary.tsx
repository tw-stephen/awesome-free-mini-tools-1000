import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Term {
  term: string
  definition: string
  category: string
}

export default function ScienceGlossary() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const terms: Term[] = [
    // Biology
    { term: 'Cell', definition: 'The basic structural and functional unit of all living organisms', category: 'biology' },
    { term: 'DNA', definition: 'Deoxyribonucleic acid; the molecule that carries genetic information', category: 'biology' },
    { term: 'Photosynthesis', definition: 'Process by which plants convert light energy into chemical energy', category: 'biology' },
    { term: 'Mitosis', definition: 'Cell division resulting in two identical daughter cells', category: 'biology' },
    { term: 'Evolution', definition: 'Change in heritable characteristics of populations over generations', category: 'biology' },
    { term: 'Ecosystem', definition: 'A community of living organisms interacting with their environment', category: 'biology' },
    { term: 'Chromosome', definition: 'Thread-like structures of DNA that carry genetic information', category: 'biology' },
    { term: 'Protein', definition: 'Large molecules made of amino acids essential for cell function', category: 'biology' },

    // Chemistry
    { term: 'Atom', definition: 'The smallest unit of matter that retains element properties', category: 'chemistry' },
    { term: 'Molecule', definition: 'Two or more atoms bonded together chemically', category: 'chemistry' },
    { term: 'Electron', definition: 'Negatively charged subatomic particle orbiting the nucleus', category: 'chemistry' },
    { term: 'Ion', definition: 'An atom or molecule with a net electric charge', category: 'chemistry' },
    { term: 'Catalyst', definition: 'Substance that speeds up a reaction without being consumed', category: 'chemistry' },
    { term: 'Oxidation', definition: 'Loss of electrons or increase in oxidation state', category: 'chemistry' },
    { term: 'pH', definition: 'Measure of acidity or basicity of a solution (0-14 scale)', category: 'chemistry' },
    { term: 'Isotope', definition: 'Atoms of same element with different numbers of neutrons', category: 'chemistry' },

    // Physics
    { term: 'Force', definition: 'A push or pull that can change an object\'s motion', category: 'physics' },
    { term: 'Energy', definition: 'The capacity to do work or cause change', category: 'physics' },
    { term: 'Velocity', definition: 'Speed of an object in a given direction', category: 'physics' },
    { term: 'Acceleration', definition: 'Rate of change of velocity over time', category: 'physics' },
    { term: 'Gravity', definition: 'Force of attraction between objects with mass', category: 'physics' },
    { term: 'Momentum', definition: 'Product of an object\'s mass and velocity', category: 'physics' },
    { term: 'Frequency', definition: 'Number of wave cycles per unit time (Hz)', category: 'physics' },
    { term: 'Wavelength', definition: 'Distance between consecutive wave peaks', category: 'physics' },

    // Earth Science
    { term: 'Plate Tectonics', definition: 'Theory explaining movement of Earth\'s crustal plates', category: 'earth' },
    { term: 'Erosion', definition: 'Process of wearing away rock and soil by natural forces', category: 'earth' },
    { term: 'Atmosphere', definition: 'Layer of gases surrounding Earth', category: 'earth' },
    { term: 'Climate', definition: 'Long-term weather patterns in an area', category: 'earth' },
    { term: 'Volcano', definition: 'Opening in Earth\'s crust where magma erupts', category: 'earth' },
    { term: 'Mineral', definition: 'Naturally occurring inorganic solid with crystal structure', category: 'earth' },
    { term: 'Fossil', definition: 'Preserved remains or traces of ancient organisms', category: 'earth' },
    { term: 'Water Cycle', definition: 'Continuous movement of water through Earth\'s systems', category: 'earth' },
  ]

  const categories = [
    { id: 'all', name: t('tools.scienceGlossary.all') },
    { id: 'biology', name: t('tools.scienceGlossary.biology') },
    { id: 'chemistry', name: t('tools.scienceGlossary.chemistry') },
    { id: 'physics', name: t('tools.scienceGlossary.physics') },
    { id: 'earth', name: t('tools.scienceGlossary.earth') },
  ]

  const filteredTerms = useMemo(() => {
    return terms.filter(term => {
      const matchesSearch = term.term.toLowerCase().includes(search.toLowerCase()) ||
                           term.definition.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [search, selectedCategory])

  const groupedTerms = useMemo(() => {
    const groups: Record<string, Term[]> = {}
    filteredTerms.forEach(term => {
      const letter = term.term[0].toUpperCase()
      if (!groups[letter]) groups[letter] = []
      groups[letter].push(term)
    })
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
  }, [filteredTerms])

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'biology': return 'bg-green-100 text-green-700'
      case 'chemistry': return 'bg-blue-100 text-blue-700'
      case 'physics': return 'bg-purple-100 text-purple-700'
      case 'earth': return 'bg-amber-100 text-amber-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('tools.scienceGlossary.searchPlaceholder')}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded text-sm whitespace-nowrap ${
              selectedCategory === cat.id ? 'bg-blue-500 text-white' : 'bg-slate-100'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="text-sm text-slate-500">
        {filteredTerms.length} {t('tools.scienceGlossary.termsFound')}
      </div>

      {groupedTerms.length === 0 ? (
        <div className="card p-6 text-center text-slate-500">
          {t('tools.scienceGlossary.noResults')}
        </div>
      ) : (
        <div className="space-y-4">
          {groupedTerms.map(([letter, terms]) => (
            <div key={letter}>
              <div className="text-lg font-bold text-blue-600 mb-2">{letter}</div>
              <div className="space-y-2">
                {terms.map(term => (
                  <div key={term.term} className="card p-3">
                    <div className="flex items-start justify-between">
                      <div className="font-medium">{term.term}</div>
                      <span className={`text-xs px-2 py-0.5 rounded ${getCategoryColor(term.category)}`}>
                        {categories.find(c => c.id === term.category)?.name}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{term.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card p-4 bg-blue-50">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.scienceGlossary.about')}
        </h3>
        <p className="text-xs text-slate-500">
          {t('tools.scienceGlossary.description')}
        </p>
      </div>
    </div>
  )
}
