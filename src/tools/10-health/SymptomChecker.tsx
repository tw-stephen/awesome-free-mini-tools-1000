import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Symptom {
  id: string
  name: string
  category: string
}

interface Condition {
  name: string
  symptoms: string[]
  urgency: 'low' | 'medium' | 'high'
  advice: string
}

export default function SymptomChecker() {
  const { t } = useTranslation()
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [mode, setMode] = useState<'select' | 'results'>('select')
  const [category, setCategory] = useState('all')

  const symptoms: Symptom[] = [
    { id: 'headache', name: 'Headache', category: 'head' },
    { id: 'fever', name: 'Fever', category: 'general' },
    { id: 'fatigue', name: 'Fatigue', category: 'general' },
    { id: 'cough', name: 'Cough', category: 'respiratory' },
    { id: 'soreThroat', name: 'Sore Throat', category: 'respiratory' },
    { id: 'runnyNose', name: 'Runny Nose', category: 'respiratory' },
    { id: 'congestion', name: 'Nasal Congestion', category: 'respiratory' },
    { id: 'bodyAche', name: 'Body Aches', category: 'general' },
    { id: 'nausea', name: 'Nausea', category: 'digestive' },
    { id: 'vomiting', name: 'Vomiting', category: 'digestive' },
    { id: 'diarrhea', name: 'Diarrhea', category: 'digestive' },
    { id: 'stomachPain', name: 'Stomach Pain', category: 'digestive' },
    { id: 'chestPain', name: 'Chest Pain', category: 'chest' },
    { id: 'shortBreath', name: 'Shortness of Breath', category: 'respiratory' },
    { id: 'dizziness', name: 'Dizziness', category: 'head' },
    { id: 'rash', name: 'Skin Rash', category: 'skin' },
    { id: 'itching', name: 'Itching', category: 'skin' },
    { id: 'jointPain', name: 'Joint Pain', category: 'musculoskeletal' },
    { id: 'backPain', name: 'Back Pain', category: 'musculoskeletal' },
    { id: 'insomnia', name: 'Insomnia', category: 'general' },
    { id: 'anxiety', name: 'Anxiety', category: 'mental' },
    { id: 'lossOfTaste', name: 'Loss of Taste/Smell', category: 'head' },
    { id: 'swelling', name: 'Swelling', category: 'general' },
    { id: 'chills', name: 'Chills', category: 'general' },
  ]

  const conditions: Condition[] = [
    {
      name: 'Common Cold',
      symptoms: ['runnyNose', 'congestion', 'soreThroat', 'cough', 'headache'],
      urgency: 'low',
      advice: 'Rest, stay hydrated, and use over-the-counter cold remedies. Usually resolves in 7-10 days.'
    },
    {
      name: 'Flu (Influenza)',
      symptoms: ['fever', 'bodyAche', 'fatigue', 'cough', 'headache', 'chills'],
      urgency: 'medium',
      advice: 'Rest, fluids, and antiviral medications may help if started early. See a doctor if symptoms worsen.'
    },
    {
      name: 'COVID-19',
      symptoms: ['fever', 'cough', 'fatigue', 'lossOfTaste', 'shortBreath', 'bodyAche'],
      urgency: 'medium',
      advice: 'Isolate, get tested, and monitor symptoms. Seek medical care if breathing becomes difficult.'
    },
    {
      name: 'Allergies',
      symptoms: ['runnyNose', 'congestion', 'itching', 'rash', 'headache'],
      urgency: 'low',
      advice: 'Avoid triggers, use antihistamines. See an allergist for persistent symptoms.'
    },
    {
      name: 'Food Poisoning',
      symptoms: ['nausea', 'vomiting', 'diarrhea', 'stomachPain', 'fever'],
      urgency: 'medium',
      advice: 'Stay hydrated, rest. Seek medical care if symptoms persist beyond 48 hours or if severe.'
    },
    {
      name: 'Migraine',
      symptoms: ['headache', 'nausea', 'dizziness', 'fatigue'],
      urgency: 'low',
      advice: 'Rest in a dark, quiet room. Over-the-counter pain relievers may help.'
    },
    {
      name: 'Anxiety Disorder',
      symptoms: ['anxiety', 'insomnia', 'fatigue', 'headache', 'shortBreath'],
      urgency: 'medium',
      advice: 'Consider speaking with a mental health professional. Relaxation techniques may help.'
    },
    {
      name: 'Muscle Strain',
      symptoms: ['backPain', 'jointPain', 'swelling', 'bodyAche'],
      urgency: 'low',
      advice: 'Rest, ice, compression, elevation (RICE). Over-the-counter pain relievers may help.'
    },
  ]

  const categories = ['all', 'head', 'respiratory', 'digestive', 'chest', 'skin', 'musculoskeletal', 'general', 'mental']

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const getMatchingConditions = () => {
    if (selectedSymptoms.length === 0) return []

    return conditions
      .map(condition => {
        const matchCount = condition.symptoms.filter(s => selectedSymptoms.includes(s)).length
        const matchPercent = (matchCount / condition.symptoms.length) * 100
        return { ...condition, matchCount, matchPercent }
      })
      .filter(c => c.matchCount >= 2)
      .sort((a, b) => b.matchPercent - a.matchPercent)
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'bg-green-100 text-green-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'high': return 'bg-red-100 text-red-700'
      default: return 'bg-slate-100'
    }
  }

  const filteredSymptoms = category === 'all'
    ? symptoms
    : symptoms.filter(s => s.category === category)

  return (
    <div className="space-y-4">
      <div className="card p-4 bg-red-50 border border-red-200">
        <p className="text-sm text-red-800">
          {t('tools.symptomChecker.disclaimer')}
        </p>
      </div>

      {mode === 'select' && (
        <>
          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-2">
              {t('tools.symptomChecker.filterByArea')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1 rounded text-sm ${
                    category === cat ? 'bg-blue-500 text-white' : 'bg-slate-100'
                  }`}
                >
                  {t(`tools.symptomChecker.category${cat.charAt(0).toUpperCase() + cat.slice(1)}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.symptomChecker.selectSymptoms')} ({selectedSymptoms.length} {t('tools.symptomChecker.selected')})
            </h3>
            <div className="flex flex-wrap gap-2">
              {filteredSymptoms.map(symptom => (
                <button
                  key={symptom.id}
                  onClick={() => toggleSymptom(symptom.id)}
                  className={`px-3 py-2 rounded text-sm ${
                    selectedSymptoms.includes(symptom.id)
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  {t(`tools.symptomChecker.symptom${symptom.id.charAt(0).toUpperCase() + symptom.id.slice(1)}`)}
                </button>
              ))}
            </div>
          </div>

          {selectedSymptoms.length > 0 && (
            <div className="card p-4 bg-blue-50">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">
                  {selectedSymptoms.length} {t('tools.symptomChecker.symptomsSelected')}
                </span>
                <button
                  onClick={() => setSelectedSymptoms([])}
                  className="text-sm text-red-500"
                >
                  {t('tools.symptomChecker.clearAll')}
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => setMode('results')}
            disabled={selectedSymptoms.length < 2}
            className="w-full py-3 bg-blue-500 text-white rounded font-medium disabled:opacity-50"
          >
            {t('tools.symptomChecker.checkSymptoms')}
          </button>
        </>
      )}

      {mode === 'results' && (
        <>
          <button
            onClick={() => setMode('select')}
            className="flex items-center gap-2 text-blue-500"
          >
            ← {t('tools.symptomChecker.backToSymptoms')}
          </button>

          <div className="card p-4 bg-blue-50">
            <h3 className="text-sm font-medium text-slate-700 mb-2">
              {t('tools.symptomChecker.yourSymptoms')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedSymptoms.map(id => {
                const symptom = symptoms.find(s => s.id === id)
                return (
                  <span key={id} className="px-2 py-1 bg-blue-200 text-blue-800 rounded text-sm">
                    {symptom && t(`tools.symptomChecker.symptom${symptom.id.charAt(0).toUpperCase() + symptom.id.slice(1)}`)}
                  </span>
                )
              })}
            </div>
          </div>

          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.symptomChecker.possibleConditions')}
          </h3>

          {getMatchingConditions().length === 0 ? (
            <div className="card p-6 text-center text-slate-500">
              {t('tools.symptomChecker.noMatches')}
            </div>
          ) : (
            <div className="space-y-2">
              {getMatchingConditions().map((condition, index) => (
                <div key={index} className="card p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium">{condition.name}</div>
                    <span className={`px-2 py-0.5 rounded text-xs ${getUrgencyColor(condition.urgency)}`}>
                      {t(`tools.symptomChecker.urgency${condition.urgency.charAt(0).toUpperCase() + condition.urgency.slice(1)}`)}
                    </span>
                  </div>
                  <div className="mb-2">
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${condition.matchPercent}%` }}
                      />
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {condition.matchCount}/{condition.symptoms.length} {t('tools.symptomChecker.symptomsMatch')}
                    </div>
                  </div>
                  <div className="text-sm text-slate-600 bg-slate-50 p-2 rounded">
                    {condition.advice}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="card p-4 bg-yellow-50 border border-yellow-200">
            <p className="text-sm text-yellow-800">
              {t('tools.symptomChecker.seeDoctor')}
            </p>
          </div>
        </>
      )}
    </div>
  )
}
