import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Testimonial {
  id: number
  name: string
  title: string
  company: string
  quote: string
  rating: number
  date: string
  source: string
  featured: boolean
  approved: boolean
}

export default function TestimonialCollector() {
  const { t } = useTranslation()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')

  const sources = ['Website', 'Email', 'Social Media', 'Google', 'Yelp', 'G2', 'Capterra', 'Trustpilot', 'LinkedIn', 'Other']

  const addTestimonial = (testimonial: Omit<Testimonial, 'id'>) => {
    setTestimonials([...testimonials, { ...testimonial, id: Date.now() }])
    setShowForm(false)
  }

  const updateTestimonial = (id: number, field: keyof Testimonial, value: string | number | boolean) => {
    setTestimonials(testimonials.map(t => t.id === id ? { ...t, [field]: value } : t))
  }

  const removeTestimonial = (id: number) => {
    setTestimonials(testimonials.filter(t => t.id !== id))
  }

  const filteredTestimonials = testimonials
    .filter(t => {
      if (filter === 'all') return true
      if (filter === 'featured') return t.featured
      if (filter === 'pending') return !t.approved
      return t.source.toLowerCase() === filter.toLowerCase()
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const avgRating = testimonials.length > 0
    ? testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length
    : 0

  const generateReport = (): string => {
    let doc = `TESTIMONIALS COLLECTION\n${'═'.repeat(50)}\n\n`
    doc += `Total Testimonials: ${testimonials.length}\n`
    doc += `Average Rating: ${avgRating.toFixed(1)}/5\n`
    doc += `Featured: ${testimonials.filter(t => t.featured).length}\n\n`

    doc += `FEATURED TESTIMONIALS\n${'─'.repeat(40)}\n`
    testimonials.filter(t => t.featured).forEach(t => {
      doc += `\n"${t.quote}"\n`
      doc += `— ${t.name}`
      if (t.title) doc += `, ${t.title}`
      if (t.company) doc += ` at ${t.company}`
      doc += `\n${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}\n`
    })

    doc += `\nALL TESTIMONIALS\n${'─'.repeat(40)}\n`
    testimonials.forEach((t, i) => {
      doc += `\n${i + 1}. "${t.quote}"\n`
      doc += `   — ${t.name}`
      if (t.title) doc += `, ${t.title}`
      if (t.company) doc += ` at ${t.company}`
      doc += ` | ${t.source} | ${t.date}\n`
    })

    return doc
  }

  const copyReport = () => {
    navigator.clipboard.writeText(generateReport())
  }

  const TestimonialForm = () => {
    const [form, setForm] = useState({
      name: '',
      title: '',
      company: '',
      quote: '',
      rating: 5,
      date: new Date().toISOString().split('T')[0],
      source: 'Website',
      featured: false,
      approved: true,
    })

    return (
      <div className="card p-4 border-2 border-blue-300">
        <h3 className="font-medium mb-3">{t('tools.testimonialCollector.add')}</h3>
        <div className="space-y-3">
          <textarea
            value={form.quote}
            onChange={(e) => setForm({ ...form, quote: e.target.value })}
            placeholder="Testimonial quote..."
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
          <div className="grid grid-cols-3 gap-3">
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Customer Name"
              className="px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Job Title"
              className="px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="text"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              placeholder="Company"
              className="px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm text-slate-500 block mb-1">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setForm({ ...form, rating: star })}
                    className={`text-2xl ${star <= form.rating ? 'text-yellow-400' : 'text-slate-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-500 block mb-1">Source</label>
              <select
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              >
                {sources.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-500 block mb-1">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm">Featured</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.approved}
                onChange={(e) => setForm({ ...form, approved: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm">Approved</span>
            </label>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => addTestimonial(form)}
              disabled={!form.quote || !form.name}
              className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300"
            >
              Add Testimonial
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300">
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.testimonialCollector.overview')}</h3>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-slate-50 rounded">
            <div className="text-2xl font-bold">{testimonials.length}</div>
            <div className="text-xs text-slate-500">Total</div>
          </div>
          <div className="p-3 bg-yellow-50 rounded">
            <div className="text-2xl font-bold text-yellow-600">{avgRating.toFixed(1)}</div>
            <div className="text-xs text-slate-500">Avg Rating</div>
          </div>
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{testimonials.filter(t => t.featured).length}</div>
            <div className="text-xs text-slate-500">Featured</div>
          </div>
          <div className="p-3 bg-orange-50 rounded">
            <div className="text-2xl font-bold text-orange-600">{testimonials.filter(t => !t.approved).length}</div>
            <div className="text-xs text-slate-500">Pending</div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded text-sm whitespace-nowrap ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>All</button>
        <button onClick={() => setFilter('featured')} className={`px-3 py-1 rounded text-sm whitespace-nowrap ${filter === 'featured' ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>Featured</button>
        <button onClick={() => setFilter('pending')} className={`px-3 py-1 rounded text-sm whitespace-nowrap ${filter === 'pending' ? 'bg-orange-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>Pending</button>
      </div>

      {!showForm && (
        <button onClick={() => setShowForm(true)} className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium">
          + {t('tools.testimonialCollector.add')}
        </button>
      )}

      {showForm && <TestimonialForm />}

      <div className="space-y-3">
        {filteredTestimonials.map(testimonial => (
          <div key={testimonial.id} className={`card p-4 ${testimonial.featured ? 'border-2 border-yellow-400' : ''} ${!testimonial.approved ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="text-yellow-400">{'★'.repeat(testimonial.rating)}{'☆'.repeat(5 - testimonial.rating)}</div>
                {testimonial.featured && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-600 rounded text-xs">Featured</span>}
                {!testimonial.approved && <span className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded text-xs">Pending</span>}
              </div>
              <button onClick={() => removeTestimonial(testimonial.id)} className="text-red-400 hover:text-red-600">×</button>
            </div>
            <p className="text-slate-700 mb-3 italic">"{testimonial.quote}"</p>
            <div className="flex items-center justify-between text-sm">
              <div>
                <span className="font-medium">{testimonial.name}</span>
                {testimonial.title && <span className="text-slate-500">, {testimonial.title}</span>}
                {testimonial.company && <span className="text-slate-500"> at {testimonial.company}</span>}
              </div>
              <span className="text-slate-400">{testimonial.source} • {testimonial.date}</span>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => updateTestimonial(testimonial.id, 'featured', !testimonial.featured)}
                className={`px-2 py-1 rounded text-xs ${testimonial.featured ? 'bg-yellow-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
              >
                {testimonial.featured ? 'Unfeature' : 'Feature'}
              </button>
              <button
                onClick={() => updateTestimonial(testimonial.id, 'approved', !testimonial.approved)}
                className={`px-2 py-1 rounded text-xs ${testimonial.approved ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'}`}
              >
                {testimonial.approved ? 'Approved' : 'Approve'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {testimonials.length === 0 && !showForm && (
        <div className="card p-8 text-center text-slate-500">
          Add testimonials to build your collection
        </div>
      )}

      {testimonials.length > 0 && (
        <button onClick={copyReport} className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600 font-medium">
          {t('tools.testimonialCollector.export')}
        </button>
      )}
    </div>
  )
}
