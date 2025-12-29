import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface StyleGuide {
  brandName: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  headingFont: string
  bodyFont: string
  spacing: number
  borderRadius: number
}

export default function StyleGuideGenerator() {
  const { t } = useTranslation()
  const [guide, setGuide] = useState<StyleGuide>({
    brandName: 'My Brand',
    primaryColor: '#3b82f6',
    secondaryColor: '#1e40af',
    accentColor: '#f59e0b',
    headingFont: 'Inter',
    bodyFont: 'Inter',
    spacing: 16,
    borderRadius: 8,
  })

  const fonts = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat',
    'Poppins', 'Nunito', 'Source Sans Pro', 'Raleway', 'Playfair Display',
  ]

  const updateGuide = (field: keyof StyleGuide, value: string | number) => {
    setGuide({ ...guide, [field]: value })
  }

  const generateCSS = (): string => {
    return `:root {
  /* Colors */
  --color-primary: ${guide.primaryColor};
  --color-secondary: ${guide.secondaryColor};
  --color-accent: ${guide.accentColor};

  /* Typography */
  --font-heading: '${guide.headingFont}', sans-serif;
  --font-body: '${guide.bodyFont}', sans-serif;

  /* Spacing */
  --spacing-unit: ${guide.spacing}px;
  --spacing-xs: calc(var(--spacing-unit) * 0.25);
  --spacing-sm: calc(var(--spacing-unit) * 0.5);
  --spacing-md: var(--spacing-unit);
  --spacing-lg: calc(var(--spacing-unit) * 1.5);
  --spacing-xl: calc(var(--spacing-unit) * 2);

  /* Border Radius */
  --radius-sm: ${Math.round(guide.borderRadius * 0.5)}px;
  --radius-md: ${guide.borderRadius}px;
  --radius-lg: ${Math.round(guide.borderRadius * 1.5)}px;
  --radius-full: 9999px;
}

/* Typography Styles */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  color: var(--color-primary);
}

body {
  font-family: var(--font-body);
  line-height: 1.6;
}

/* Button Styles */
.btn-primary {
  background-color: var(--color-primary);
  color: white;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
}

.btn-secondary {
  background-color: var(--color-secondary);
  color: white;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
}

.btn-accent {
  background-color: var(--color-accent);
  color: white;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
}`
  }

  const downloadStyleGuide = () => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${guide.brandName} - Style Guide</title>
  <link href="https://fonts.googleapis.com/css2?family=${guide.headingFont.replace(/ /g, '+')}:wght@400;600;700&family=${guide.bodyFont.replace(/ /g, '+')}:wght@400;500&display=swap" rel="stylesheet">
  <style>
    ${generateCSS()}

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { padding: 40px; max-width: 1200px; margin: 0 auto; }
    section { margin-bottom: 60px; }
    .section-title { font-size: 24px; margin-bottom: 20px; border-bottom: 2px solid var(--color-primary); padding-bottom: 10px; }
    .color-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    .color-card { padding: 20px; border-radius: var(--radius-md); color: white; }
    .typography-sample { margin-bottom: 20px; }
    .button-grid { display: flex; gap: 20px; }
    .spacing-demo { display: flex; gap: 10px; align-items: flex-end; }
    .spacing-box { background: var(--color-primary); }
  </style>
</head>
<body>
  <h1 style="font-size: 48px; margin-bottom: 40px;">${guide.brandName} Style Guide</h1>

  <section>
    <h2 class="section-title">Colors</h2>
    <div class="color-grid">
      <div class="color-card" style="background: ${guide.primaryColor}">
        <strong>Primary</strong><br>${guide.primaryColor}
      </div>
      <div class="color-card" style="background: ${guide.secondaryColor}">
        <strong>Secondary</strong><br>${guide.secondaryColor}
      </div>
      <div class="color-card" style="background: ${guide.accentColor}">
        <strong>Accent</strong><br>${guide.accentColor}
      </div>
    </div>
  </section>

  <section>
    <h2 class="section-title">Typography</h2>
    <div class="typography-sample">
      <h1>Heading 1 - ${guide.headingFont}</h1>
      <h2>Heading 2</h2>
      <h3>Heading 3</h3>
      <p style="margin-top: 20px;">Body text using ${guide.bodyFont}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    </div>
  </section>

  <section>
    <h2 class="section-title">Buttons</h2>
    <div class="button-grid">
      <button class="btn-primary">Primary Button</button>
      <button class="btn-secondary">Secondary Button</button>
      <button class="btn-accent">Accent Button</button>
    </div>
  </section>

  <section>
    <h2 class="section-title">Spacing</h2>
    <div class="spacing-demo">
      <div><div class="spacing-box" style="width: ${guide.spacing * 0.25}px; height: ${guide.spacing * 0.25}px;"></div><small>XS</small></div>
      <div><div class="spacing-box" style="width: ${guide.spacing * 0.5}px; height: ${guide.spacing * 0.5}px;"></div><small>SM</small></div>
      <div><div class="spacing-box" style="width: ${guide.spacing}px; height: ${guide.spacing}px;"></div><small>MD</small></div>
      <div><div class="spacing-box" style="width: ${guide.spacing * 1.5}px; height: ${guide.spacing * 1.5}px;"></div><small>LG</small></div>
      <div><div class="spacing-box" style="width: ${guide.spacing * 2}px; height: ${guide.spacing * 2}px;"></div><small>XL</small></div>
    </div>
  </section>

  <section>
    <h2 class="section-title">Border Radius</h2>
    <div style="display: flex; gap: 20px;">
      <div style="width: 80px; height: 80px; background: var(--color-primary); border-radius: var(--radius-sm);"></div>
      <div style="width: 80px; height: 80px; background: var(--color-primary); border-radius: var(--radius-md);"></div>
      <div style="width: 80px; height: 80px; background: var(--color-primary); border-radius: var(--radius-lg);"></div>
      <div style="width: 80px; height: 80px; background: var(--color-primary); border-radius: var(--radius-full);"></div>
    </div>
  </section>
</body>
</html>`

    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${guide.brandName.toLowerCase().replace(/\s+/g, '-')}-style-guide.html`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('tools.styleGuideGenerator.brandName')}</label>
            <input
              type="text"
              value={guide.brandName}
              onChange={(e) => updateGuide('brandName', e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">{t('tools.styleGuideGenerator.primary')}</label>
              <input
                type="color"
                value={guide.primaryColor}
                onChange={(e) => updateGuide('primaryColor', e.target.value)}
                className="w-full h-10 rounded cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('tools.styleGuideGenerator.secondary')}</label>
              <input
                type="color"
                value={guide.secondaryColor}
                onChange={(e) => updateGuide('secondaryColor', e.target.value)}
                className="w-full h-10 rounded cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('tools.styleGuideGenerator.accent')}</label>
              <input
                type="color"
                value={guide.accentColor}
                onChange={(e) => updateGuide('accentColor', e.target.value)}
                className="w-full h-10 rounded cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">{t('tools.styleGuideGenerator.headingFont')}</label>
              <select
                value={guide.headingFont}
                onChange={(e) => updateGuide('headingFont', e.target.value)}
                className="w-full px-3 py-2 border rounded"
              >
                {fonts.map((font) => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('tools.styleGuideGenerator.bodyFont')}</label>
              <select
                value={guide.bodyFont}
                onChange={(e) => updateGuide('bodyFont', e.target.value)}
                className="w-full px-3 py-2 border rounded"
              >
                {fonts.map((font) => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t('tools.styleGuideGenerator.spacing')}: {guide.spacing}px
            </label>
            <input
              type="range"
              min="8"
              max="32"
              value={guide.spacing}
              onChange={(e) => updateGuide('spacing', parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t('tools.styleGuideGenerator.borderRadius')}: {guide.borderRadius}px
            </label>
            <input
              type="range"
              min="0"
              max="24"
              value={guide.borderRadius}
              onChange={(e) => updateGuide('borderRadius', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.styleGuideGenerator.preview')}</h3>

          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 h-16 rounded" style={{ backgroundColor: guide.primaryColor, borderRadius: guide.borderRadius }} />
              <div className="flex-1 h-16 rounded" style={{ backgroundColor: guide.secondaryColor, borderRadius: guide.borderRadius }} />
              <div className="flex-1 h-16 rounded" style={{ backgroundColor: guide.accentColor, borderRadius: guide.borderRadius }} />
            </div>

            <div>
              <h1 style={{ fontFamily: guide.headingFont, color: guide.primaryColor, fontSize: '24px' }}>
                {guide.brandName}
              </h1>
              <p style={{ fontFamily: guide.bodyFont, marginTop: guide.spacing / 2 }}>
                This is sample body text using {guide.bodyFont}.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                style={{
                  backgroundColor: guide.primaryColor,
                  color: 'white',
                  padding: `${guide.spacing / 2}px ${guide.spacing}px`,
                  borderRadius: guide.borderRadius,
                  border: 'none',
                }}
              >
                Primary
              </button>
              <button
                style={{
                  backgroundColor: guide.secondaryColor,
                  color: 'white',
                  padding: `${guide.spacing / 2}px ${guide.spacing}px`,
                  borderRadius: guide.borderRadius,
                  border: 'none',
                }}
              >
                Secondary
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-2">{t('tools.styleGuideGenerator.cssVariables')}</h3>
        <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto max-h-64">
          {generateCSS()}
        </pre>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => navigator.clipboard.writeText(generateCSS())}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('common.copy')} CSS
        </button>
        <button
          onClick={downloadStyleGuide}
          className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {t('common.download')} HTML
        </button>
      </div>
    </div>
  )
}
