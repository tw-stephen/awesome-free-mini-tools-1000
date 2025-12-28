import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Movie {
  id: number
  title: string
  year?: string
  genre: string
  status: 'watched' | 'watchlist'
  rating?: number
  review?: string
  watchedDate?: string
}

export default function MovieTracker() {
  const { t } = useTranslation()
  const [movies, setMovies] = useState<Movie[]>([])
  const [showAddMovie, setShowAddMovie] = useState(false)
  const [filter, setFilter] = useState<'all' | 'watched' | 'watchlist'>('all')
  const [newMovie, setNewMovie] = useState<{
    title: string
    year: string
    genre: string
    status: 'watched' | 'watchlist'
  }>({
    title: '',
    year: '',
    genre: 'Action',
    status: 'watchlist',
  })

  const genres = [
    'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance',
    'Thriller', 'Animation', 'Documentary', 'Fantasy', 'Adventure',
  ]

  useEffect(() => {
    const saved = localStorage.getItem('movie-tracker')
    if (saved) {
      try {
        setMovies(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load movies')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('movie-tracker', JSON.stringify(movies))
  }, [movies])

  const addMovie = () => {
    if (!newMovie.title) return
    const movie: Movie = {
      id: Date.now(),
      title: newMovie.title,
      year: newMovie.year || undefined,
      genre: newMovie.genre,
      status: newMovie.status,
      watchedDate: newMovie.status === 'watched' ? new Date().toISOString().split('T')[0] : undefined,
    }
    setMovies([movie, ...movies])
    setNewMovie({ title: '', year: '', genre: 'Action', status: 'watchlist' })
    setShowAddMovie(false)
  }

  const markAsWatched = (id: number) => {
    setMovies(movies.map(movie =>
      movie.id === id ? {
        ...movie,
        status: 'watched',
        watchedDate: new Date().toISOString().split('T')[0],
      } : movie
    ))
  }

  const updateRating = (id: number, rating: number) => {
    setMovies(movies.map(movie =>
      movie.id === id ? { ...movie, rating } : movie
    ))
  }

  const deleteMovie = (id: number) => {
    setMovies(movies.filter(movie => movie.id !== id))
  }

  const filteredMovies = useMemo(() => {
    if (filter === 'all') return movies
    return movies.filter(movie => movie.status === filter)
  }, [movies, filter])

  const stats = useMemo(() => {
    const watched = movies.filter(m => m.status === 'watched')
    const avgRating = watched.filter(m => m.rating).length > 0
      ? watched.reduce((sum, m) => sum + (m.rating || 0), 0) / watched.filter(m => m.rating).length
      : 0

    const genreCounts: Record<string, number> = {}
    watched.forEach(m => {
      genreCounts[m.genre] = (genreCounts[m.genre] || 0) + 1
    })
    const topGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '-'

    return {
      watched: watched.length,
      watchlist: movies.filter(m => m.status === 'watchlist').length,
      avgRating: avgRating.toFixed(1),
      topGenre,
    }
  }, [movies])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{stats.watched}</div>
            <div className="text-xs text-slate-500">{t('tools.movieTracker.watched')}</div>
          </div>
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{stats.watchlist}</div>
            <div className="text-xs text-slate-500">{t('tools.movieTracker.watchlist')}</div>
          </div>
          <div className="p-3 bg-yellow-50 rounded">
            <div className="text-2xl font-bold text-yellow-600">{stats.avgRating}</div>
            <div className="text-xs text-slate-500">{t('tools.movieTracker.avgRating')}</div>
          </div>
          <div className="p-3 bg-purple-50 rounded">
            <div className="text-lg font-bold text-purple-600">{stats.topGenre}</div>
            <div className="text-xs text-slate-500">{t('tools.movieTracker.topGenre')}</div>
          </div>
        </div>
      </div>

      {!showAddMovie ? (
        <button
          onClick={() => setShowAddMovie(true)}
          className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
        >
          + {t('tools.movieTracker.addMovie')}
        </button>
      ) : (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.movieTracker.addMovie')}
          </h3>
          <div className="space-y-3">
            <input
              type="text"
              value={newMovie.title}
              onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
              placeholder={t('tools.movieTracker.title')}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={newMovie.year}
                onChange={(e) => setNewMovie({ ...newMovie, year: e.target.value })}
                placeholder={t('tools.movieTracker.year')}
                className="px-3 py-2 border border-slate-300 rounded text-sm"
              />
              <select
                value={newMovie.genre}
                onChange={(e) => setNewMovie({ ...newMovie, genre: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded text-sm"
              >
                {genres.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <select
              value={newMovie.status}
              onChange={(e) => setNewMovie({ ...newMovie, status: e.target.value as Movie['status'] })}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            >
              <option value="watchlist">{t('tools.movieTracker.addToWatchlist')}</option>
              <option value="watched">{t('tools.movieTracker.markWatched')}</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={addMovie}
                className="flex-1 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
              >
                {t('tools.movieTracker.add')}
              </button>
              <button
                onClick={() => setShowAddMovie(false)}
                className="px-4 py-2 bg-slate-200 rounded font-medium hover:bg-slate-300"
              >
                {t('tools.movieTracker.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          {(['all', 'watched', 'watchlist'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 rounded text-sm ${
                filter === f ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {t(`tools.movieTracker.${f}`)}
            </button>
          ))}
        </div>

        {filteredMovies.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            {t('tools.movieTracker.noMovies')}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMovies.map(movie => (
              <div key={movie.id} className="p-3 bg-slate-50 rounded">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium">
                      {movie.title}
                      {movie.year && <span className="text-slate-500 ml-1">({movie.year})</span>}
                    </div>
                    <div className="text-sm text-slate-500">
                      {movie.genre}
                      {movie.watchedDate && ` • ${movie.watchedDate}`}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteMovie(movie.id)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>

                {movie.status === 'watched' && (
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => updateRating(movie.id, star)}
                        className={`text-xl ${
                          (movie.rating || 0) >= star ? 'text-yellow-500' : 'text-slate-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                )}

                {movie.status === 'watchlist' && (
                  <button
                    onClick={() => markAsWatched(movie.id)}
                    className="w-full py-1 bg-green-100 text-green-600 rounded text-sm hover:bg-green-200"
                  >
                    {t('tools.movieTracker.markWatched')}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.movieTracker.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.movieTracker.tip1')}</li>
          <li>{t('tools.movieTracker.tip2')}</li>
          <li>{t('tools.movieTracker.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
