import { useTranslation } from 'react-i18next'
import Layout from './components/layout/Layout'
import CaseConverter from './tools/01-text/CaseConverter'

function App() {
  const { t } = useTranslation()

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            {t('tools.caseConverter.name')}
          </h1>
          <p className="text-slate-600">
            {t('tools.caseConverter.description')}
          </p>
        </div>
        <CaseConverter />
      </div>
    </Layout>
  )
}

export default App
