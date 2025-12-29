import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type TextEffect = 'shadow' | 'outline' | 'gradient' | 'glow' | 'neon' | '3d' | 'emboss' | 'retro'

export default function TextEffectGenerator() {
  const { t } = useTranslation()
  const [text, setText] = useState('Hello World')
  const [effect, setEffect] = useState<TextEffect>('shadow')
  const [fontSize, setFontSize] = useState(48)
  const [fontWeight, setFontWeight] = useState<'normal' | 'bold'>('bold')
  const [primaryColor, setPrimaryColor] = useState('#3b82f6')
  const [secondaryColor, setSecondaryColor] = useState('#1e40af')
  const [bgColor, setBgColor] = useState('#1f2937')

  const effects: TextEffect[] = ['shadow', 'outline', 'gradient', 'glow', 'neon', '3d', 'emboss', 'retro']

  const getEffectStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      fontSize,
      fontWeight,
      fontFamily: "'Inter', sans-serif",
    }

    switch (effect) {
      case 'shadow':
        return {
          ...base,
          color: primaryColor,
          textShadow: `2px 2px 4px rgba(0,0,0,0.3), 4px 4px 8px rgba(0,0,0,0.2)`,
        }

      case 'outline':
        return {
          ...base,
          color: 'transparent',
          WebkitTextStroke: `2px ${primaryColor}`,
        }

      case 'gradient':
        return {
          ...base,
          background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }

      case 'glow':
        return {
          ...base,
          color: primaryColor,
          textShadow: `0 0 10px ${primaryColor}, 0 0 20px ${primaryColor}, 0 0 30px ${primaryColor}, 0 0 40px ${primaryColor}`,
        }

      case 'neon':
        return {
          ...base,
          color: '#fff',
          textShadow: `0 0 5px #fff, 0 0 10px #fff, 0 0 20px ${primaryColor}, 0 0 30px ${primaryColor}, 0 0 40px ${primaryColor}, 0 0 55px ${primaryColor}`,
        }

      case '3d':
        return {
          ...base,
          color: primaryColor,
          textShadow: `
            1px 1px 0 ${secondaryColor},
            2px 2px 0 ${secondaryColor},
            3px 3px 0 ${secondaryColor},
            4px 4px 0 ${secondaryColor},
            5px 5px 0 ${secondaryColor},
            6px 6px 10px rgba(0,0,0,0.5)
          `,
        }

      case 'emboss':
        return {
          ...base,
          color: '#888',
          textShadow: `-1px -1px 1px rgba(255,255,255,0.8), 1px 1px 1px rgba(0,0,0,0.5)`,
        }

      case 'retro':
        return {
          ...base,
          color: primaryColor,
          textShadow: `
            3px 3px 0 ${secondaryColor},
            6px 6px 0 rgba(0,0,0,0.2)
          `,
          letterSpacing: '0.05em',
        }

      default:
        return base
    }
  }

  const generateCSS = (): string => {
    const styles = getEffectStyles()
    let css = `.text-effect {\n`
    css += `  font-size: ${styles.fontSize}px;\n`
    css += `  font-weight: ${styles.fontWeight};\n`
    css += `  font-family: 'Inter', sans-serif;\n`

    if (styles.color) css += `  color: ${styles.color};\n`
    if (styles.textShadow) css += `  text-shadow: ${styles.textShadow};\n`
    if (styles.WebkitTextStroke) css += `  -webkit-text-stroke: ${styles.WebkitTextStroke};\n`
    if (styles.background) {
      css += `  background: ${styles.background};\n`
      css += `  -webkit-background-clip: text;\n`
      css += `  -webkit-text-fill-color: transparent;\n`
      css += `  background-clip: text;\n`
    }
    if (styles.letterSpacing) css += `  letter-spacing: ${styles.letterSpacing};\n`

    css += `}`
    return css
  }

  return (
    <div className="space-y-6">
      <div className="card p-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text..."
          className="w-full px-3 py-2 border rounded text-lg"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {effects.map((e) => (
          <button
            key={e}
            onClick={() => setEffect(e)}
            className={`px-4 py-2 rounded capitalize ${
              effect === e ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {e}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            {t('tools.textEffectGenerator.fontSize')}: {fontSize}px
          </label>
          <input
            type="range"
            min="24"
            max="120"
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('tools.textEffectGenerator.fontWeight')}</label>
          <select
            value={fontWeight}
            onChange={(e) => setFontWeight(e.target.value as 'normal' | 'bold')}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="normal">Normal</option>
            <option value="bold">Bold</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('tools.textEffectGenerator.primaryColor')}</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-10 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="flex-1 px-2 py-1 border rounded font-mono text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('tools.textEffectGenerator.secondaryColor')}</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={secondaryColor}
              onChange={(e) => setSecondaryColor(e.target.value)}
              className="w-10 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={secondaryColor}
              onChange={(e) => setSecondaryColor(e.target.value)}
              className="flex-1 px-2 py-1 border rounded font-mono text-sm"
            />
          </div>
        </div>
      </div>

      <div
        className="p-12 rounded-lg flex items-center justify-center min-h-[200px]"
        style={{ backgroundColor: bgColor }}
      >
        <span style={getEffectStyles()}>{text || 'Preview'}</span>
      </div>

      <div className="flex gap-4 items-center">
        <label className="text-sm font-medium">{t('tools.textEffectGenerator.background')}:</label>
        <input
          type="color"
          value={bgColor}
          onChange={(e) => setBgColor(e.target.value)}
          className="w-10 h-10 rounded cursor-pointer"
        />
        <div className="flex gap-1">
          {['#1f2937', '#ffffff', '#000000', '#f1f5f9', '#0f172a'].map((color) => (
            <button
              key={color}
              onClick={() => setBgColor(color)}
              className={`w-8 h-8 rounded border ${bgColor === color ? 'ring-2 ring-blue-500' : ''}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.textEffectGenerator.previewAll')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {effects.map((e) => {
            const styles = (() => {
              const base: React.CSSProperties = { fontSize: 24, fontWeight: 'bold' }
              switch (e) {
                case 'shadow':
                  return { ...base, color: primaryColor, textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }
                case 'outline':
                  return { ...base, color: 'transparent', WebkitTextStroke: `1px ${primaryColor}` }
                case 'gradient':
                  return { ...base, background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }
                case 'glow':
                  return { ...base, color: primaryColor, textShadow: `0 0 10px ${primaryColor}, 0 0 20px ${primaryColor}` }
                case 'neon':
                  return { ...base, color: '#fff', textShadow: `0 0 5px #fff, 0 0 10px ${primaryColor}, 0 0 20px ${primaryColor}` }
                case '3d':
                  return { ...base, color: primaryColor, textShadow: `1px 1px 0 ${secondaryColor}, 2px 2px 0 ${secondaryColor}, 3px 3px 5px rgba(0,0,0,0.3)` }
                case 'emboss':
                  return { ...base, color: '#888', textShadow: '-1px -1px 1px rgba(255,255,255,0.8), 1px 1px 1px rgba(0,0,0,0.5)' }
                case 'retro':
                  return { ...base, color: primaryColor, textShadow: `2px 2px 0 ${secondaryColor}` }
                default:
                  return base
              }
            })()

            return (
              <button
                key={e}
                onClick={() => setEffect(e)}
                className={`p-4 rounded-lg text-center ${
                  effect === e ? 'ring-2 ring-blue-500' : ''
                }`}
                style={{ backgroundColor: bgColor }}
              >
                <span style={styles}>Aa</span>
                <div className="text-xs mt-2 capitalize" style={{ color: bgColor === '#ffffff' || bgColor === '#f1f5f9' ? '#374151' : '#d1d5db' }}>
                  {e}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="card p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">CSS Code</h3>
          <button
            onClick={() => navigator.clipboard.writeText(generateCSS())}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t('common.copy')}
          </button>
        </div>
        <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto whitespace-pre-wrap">
          {generateCSS()}
        </pre>
      </div>
    </div>
  )
}
