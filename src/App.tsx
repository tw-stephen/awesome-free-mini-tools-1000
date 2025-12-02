import Layout from './components/layout/Layout'
import Home from './pages/Home'
import ToolPage from './pages/ToolPage'
import { useHashRouter } from './hooks/useHashRouter'
import { getToolByPath } from './tools/registry'

function App() {
  const { path, navigate } = useHashRouter()
  const tool = getToolByPath(path)

  return (
    <Layout>
      {tool ? (
        <ToolPage tool={tool} onBack={() => navigate('')} />
      ) : (
        <Home onNavigate={navigate} />
      )}
    </Layout>
  )
}

export default App
