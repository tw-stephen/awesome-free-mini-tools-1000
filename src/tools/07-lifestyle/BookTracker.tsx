import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Book {
  id: number
  title: string
  author: string
  totalPages: number
  currentPage: number
  status: 'reading' | 'completed' | 'wishlist'
  rating?: number
  notes?: string
  startDate?: string
  endDate?: string
}

export default function BookTracker() {
  const { t } = useTranslation()
  const [books, setBooks] = useState<Book[]>([])
  const [showAddBook, setShowAddBook] = useState(false)
  const [filter, setFilter] = useState<'all' | 'reading' | 'completed' | 'wishlist'>('all')
  const [newBook, setNewBook] = useState<{
    title: string
    author: string
    totalPages: string
    status: 'reading' | 'completed' | 'wishlist'
  }>({
    title: '',
    author: '',
    totalPages: '',
    status: 'wishlist',
  })

  useEffect(() => {
    const saved = localStorage.getItem('book-tracker')
    if (saved) {
      try {
        setBooks(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load books')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('book-tracker', JSON.stringify(books))
  }, [books])

  const addBook = () => {
    if (!newBook.title) return
    const book: Book = {
      id: Date.now(),
      title: newBook.title,
      author: newBook.author,
      totalPages: parseInt(newBook.totalPages) || 0,
      currentPage: 0,
      status: newBook.status,
      startDate: newBook.status === 'reading' ? new Date().toISOString().split('T')[0] : undefined,
    }
    setBooks([book, ...books])
    setNewBook({ title: '', author: '', totalPages: '', status: 'wishlist' })
    setShowAddBook(false)
  }

  const updateProgress = (id: number, currentPage: number) => {
    setBooks(books.map(book => {
      if (book.id !== id) return book
      const newPage = Math.min(Math.max(0, currentPage), book.totalPages)
      const isComplete = newPage >= book.totalPages
      return {
        ...book,
        currentPage: newPage,
        status: isComplete ? 'completed' : book.status === 'wishlist' ? 'reading' : book.status,
        startDate: book.startDate || (newPage > 0 ? new Date().toISOString().split('T')[0] : undefined),
        endDate: isComplete && !book.endDate ? new Date().toISOString().split('T')[0] : book.endDate,
      }
    }))
  }

  const updateRating = (id: number, rating: number) => {
    setBooks(books.map(book =>
      book.id === id ? { ...book, rating } : book
    ))
  }

  const startReading = (id: number) => {
    setBooks(books.map(book =>
      book.id === id ? {
        ...book,
        status: 'reading',
        startDate: new Date().toISOString().split('T')[0],
      } : book
    ))
  }

  const deleteBook = (id: number) => {
    setBooks(books.filter(book => book.id !== id))
  }

  const filteredBooks = useMemo(() => {
    if (filter === 'all') return books
    return books.filter(book => book.status === filter)
  }, [books, filter])

  const stats = useMemo(() => {
    const completed = books.filter(b => b.status === 'completed').length
    const reading = books.filter(b => b.status === 'reading').length
    const wishlist = books.filter(b => b.status === 'wishlist').length
    const pagesRead = books.reduce((sum, b) => sum + b.currentPage, 0)
    return { completed, reading, wishlist, pagesRead }
  }, [books])

  const getProgress = (book: Book) => {
    if (book.totalPages === 0) return 0
    return Math.round((book.currentPage / book.totalPages) * 100)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{stats.reading}</div>
            <div className="text-xs text-slate-500">{t('tools.bookTracker.reading')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-xs text-slate-500">{t('tools.bookTracker.completed')}</div>
          </div>
          <div className="p-3 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">{stats.wishlist}</div>
            <div className="text-xs text-slate-500">{t('tools.bookTracker.wishlist')}</div>
          </div>
          <div className="p-3 bg-orange-50 rounded">
            <div className="text-2xl font-bold text-orange-600">{stats.pagesRead}</div>
            <div className="text-xs text-slate-500">{t('tools.bookTracker.pages')}</div>
          </div>
        </div>
      </div>

      {!showAddBook ? (
        <button
          onClick={() => setShowAddBook(true)}
          className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
        >
          + {t('tools.bookTracker.addBook')}
        </button>
      ) : (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.bookTracker.addBook')}
          </h3>
          <div className="space-y-3">
            <input
              type="text"
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              placeholder={t('tools.bookTracker.title')}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <input
              type="text"
              value={newBook.author}
              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
              placeholder={t('tools.bookTracker.author')}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={newBook.totalPages}
                onChange={(e) => setNewBook({ ...newBook, totalPages: e.target.value })}
                placeholder={t('tools.bookTracker.totalPages')}
                className="px-3 py-2 border border-slate-300 rounded text-sm"
              />
              <select
                value={newBook.status}
                onChange={(e) => setNewBook({ ...newBook, status: e.target.value as Book['status'] })}
                className="px-3 py-2 border border-slate-300 rounded text-sm"
              >
                <option value="wishlist">{t('tools.bookTracker.wishlist')}</option>
                <option value="reading">{t('tools.bookTracker.reading')}</option>
                <option value="completed">{t('tools.bookTracker.completed')}</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={addBook}
                className="flex-1 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
              >
                {t('tools.bookTracker.add')}
              </button>
              <button
                onClick={() => setShowAddBook(false)}
                className="px-4 py-2 bg-slate-200 rounded font-medium hover:bg-slate-300"
              >
                {t('tools.bookTracker.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          {(['all', 'reading', 'completed', 'wishlist'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 rounded text-sm ${
                filter === f ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {t(`tools.bookTracker.${f}`)}
            </button>
          ))}
        </div>

        {filteredBooks.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            {t('tools.bookTracker.noBooks')}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBooks.map(book => (
              <div key={book.id} className="p-3 bg-slate-50 rounded">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium">{book.title}</div>
                    <div className="text-sm text-slate-500">{book.author}</div>
                  </div>
                  <button
                    onClick={() => deleteBook(book.id)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>

                {book.status === 'reading' && book.totalPages > 0 && (
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>{book.currentPage} / {book.totalPages} pages</span>
                      <span>{getProgress(book)}%</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${getProgress(book)}%` }}
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={book.totalPages}
                      value={book.currentPage}
                      onChange={(e) => updateProgress(book.id, parseInt(e.target.value))}
                      className="w-full mt-2"
                    />
                  </div>
                )}

                {book.status === 'completed' && (
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => updateRating(book.id, star)}
                        className={`text-xl ${
                          (book.rating || 0) >= star ? 'text-yellow-500' : 'text-slate-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                )}

                {book.status === 'wishlist' && (
                  <button
                    onClick={() => startReading(book.id)}
                    className="w-full py-1 bg-blue-100 text-blue-600 rounded text-sm hover:bg-blue-200"
                  >
                    {t('tools.bookTracker.startReading')}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.bookTracker.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.bookTracker.tip1')}</li>
          <li>{t('tools.bookTracker.tip2')}</li>
          <li>{t('tools.bookTracker.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
