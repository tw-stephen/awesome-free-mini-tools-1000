import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Track {
  id: number
  name: string
  genre: string
  duration: number // in minutes
  mood: string
  bpm: string
}

interface Playlist {
  id: number
  name: string
  subject: string
  tracks: Track[]
  totalDuration: number
}

export default function StudyPlaylist() {
  const { t } = useTranslation()
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [selectedPlaylist, setSelectedPlaylist] = useState<number | null>(null)
  const [showPlaylistForm, setShowPlaylistForm] = useState(false)
  const [newPlaylist, setNewPlaylist] = useState({ name: '', subject: '' })
  const [newTrack, setNewTrack] = useState({
    name: '',
    genre: 'Lo-fi',
    duration: 3,
    mood: 'Focused',
    bpm: 'Slow (60-80)',
  })

  const genres = ['Lo-fi', 'Classical', 'Jazz', 'Ambient', 'Electronic', 'Nature Sounds', 'White Noise', 'Instrumental']
  const moods = ['Focused', 'Relaxed', 'Energized', 'Calm', 'Motivated', 'Creative']

  const suggestedTracks: { [key: string]: Track[] } = {
    'Focus & Concentration': [
      { id: 1, name: 'Deep Focus Alpha Waves', genre: 'Ambient', duration: 30, mood: 'Focused', bpm: 'Slow (60-80)' },
      { id: 2, name: 'Lo-fi Study Beats', genre: 'Lo-fi', duration: 45, mood: 'Relaxed', bpm: 'Medium (80-120)' },
      { id: 3, name: 'Classical Piano Collection', genre: 'Classical', duration: 60, mood: 'Calm', bpm: 'Slow (60-80)' },
    ],
    'Creative Writing': [
      { id: 4, name: 'Ambient Soundscapes', genre: 'Ambient', duration: 40, mood: 'Creative', bpm: 'Slow (60-80)' },
      { id: 5, name: 'Jazz Cafe Vibes', genre: 'Jazz', duration: 35, mood: 'Relaxed', bpm: 'Medium (80-120)' },
    ],
    'Math & Science': [
      { id: 6, name: 'Electronic Focus', genre: 'Electronic', duration: 25, mood: 'Energized', bpm: 'Medium (80-120)' },
      { id: 7, name: 'Minimal Techno Study', genre: 'Electronic', duration: 50, mood: 'Focused', bpm: 'Fast (120+)' },
    ],
    'Reading': [
      { id: 8, name: 'Rain & Thunder', genre: 'Nature Sounds', duration: 60, mood: 'Calm', bpm: 'Slow (60-80)' },
      { id: 9, name: 'Forest Ambience', genre: 'Nature Sounds', duration: 45, mood: 'Relaxed', bpm: 'Slow (60-80)' },
    ],
  }

  const addPlaylist = () => {
    if (!newPlaylist.name.trim()) return
    const playlist: Playlist = {
      id: Date.now(),
      name: newPlaylist.name,
      subject: newPlaylist.subject,
      tracks: [],
      totalDuration: 0,
    }
    setPlaylists([...playlists, playlist])
    setSelectedPlaylist(playlist.id)
    setNewPlaylist({ name: '', subject: '' })
    setShowPlaylistForm(false)
  }

  const removePlaylist = (id: number) => {
    setPlaylists(playlists.filter(p => p.id !== id))
    if (selectedPlaylist === id) setSelectedPlaylist(null)
  }

  const addTrack = () => {
    if (!selectedPlaylist || !newTrack.name.trim()) return
    setPlaylists(playlists.map(p => {
      if (p.id !== selectedPlaylist) return p
      const track = { ...newTrack, id: Date.now() }
      return {
        ...p,
        tracks: [...p.tracks, track],
        totalDuration: p.totalDuration + track.duration,
      }
    }))
    setNewTrack({
      name: '',
      genre: 'Lo-fi',
      duration: 3,
      mood: 'Focused',
      bpm: 'Slow (60-80)',
    })
  }

  const addSuggestedTrack = (track: Track) => {
    if (!selectedPlaylist) return
    setPlaylists(playlists.map(p => {
      if (p.id !== selectedPlaylist) return p
      return {
        ...p,
        tracks: [...p.tracks, { ...track, id: Date.now() }],
        totalDuration: p.totalDuration + track.duration,
      }
    }))
  }

  const removeTrack = (trackId: number) => {
    if (!selectedPlaylist) return
    setPlaylists(playlists.map(p => {
      if (p.id !== selectedPlaylist) return p
      const track = p.tracks.find(t => t.id === trackId)
      return {
        ...p,
        tracks: p.tracks.filter(t => t.id !== trackId),
        totalDuration: p.totalDuration - (track?.duration || 0),
      }
    }))
  }

  const currentPlaylist = playlists.find(p => p.id === selectedPlaylist)

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const getMoodIcon = (mood: string): string => {
    switch (mood) {
      case 'Focused': return '🎯'
      case 'Relaxed': return '😌'
      case 'Energized': return '⚡'
      case 'Calm': return '🌊'
      case 'Motivated': return '💪'
      case 'Creative': return '🎨'
      default: return '🎵'
    }
  }

  if (selectedPlaylist && currentPlaylist) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{currentPlaylist.name}</h2>
            {currentPlaylist.subject && (
              <div className="text-sm text-slate-500">{currentPlaylist.subject}</div>
            )}
          </div>
          <button onClick={() => setSelectedPlaylist(null)} className="text-blue-500">
            Back
          </button>
        </div>

        <div className="card p-4 bg-gradient-to-r from-purple-100 to-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-600">{currentPlaylist.tracks.length}</div>
              <div className="text-sm text-purple-500">Tracks</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{formatDuration(currentPlaylist.totalDuration)}</div>
              <div className="text-sm text-blue-500">Total Duration</div>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.studyPlaylist.addTrack')}</h3>
          <div className="space-y-2">
            <input
              type="text"
              value={newTrack.name}
              onChange={(e) => setNewTrack({ ...newTrack, name: e.target.value })}
              placeholder="Track or album name"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <div className="grid grid-cols-3 gap-2">
              <select
                value={newTrack.genre}
                onChange={(e) => setNewTrack({ ...newTrack, genre: e.target.value })}
                className="px-2 py-2 border border-slate-300 rounded text-sm"
              >
                {genres.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <select
                value={newTrack.mood}
                onChange={(e) => setNewTrack({ ...newTrack, mood: e.target.value })}
                className="px-2 py-2 border border-slate-300 rounded text-sm"
              >
                {moods.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={newTrack.duration}
                  onChange={(e) => setNewTrack({ ...newTrack, duration: parseInt(e.target.value) || 1 })}
                  min={1}
                  className="w-full px-2 py-2 border border-slate-300 rounded text-sm"
                />
                <span className="text-sm text-slate-500">min</span>
              </div>
            </div>
            <button
              onClick={addTrack}
              disabled={!newTrack.name.trim()}
              className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300"
            >
              Add Track
            </button>
          </div>
        </div>

        {currentPlaylist.tracks.length > 0 && (
          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.studyPlaylist.tracks')}</h3>
            <div className="space-y-2">
              {currentPlaylist.tracks.map((track, i) => (
                <div key={track.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">{i + 1}</span>
                    <span className="text-lg">{getMoodIcon(track.mood)}</span>
                    <div>
                      <div className="font-medium">{track.name}</div>
                      <div className="text-xs text-slate-500">
                        {track.genre} • {track.duration}m
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeTrack(track.id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.studyPlaylist.suggestions')}</h3>
          <div className="space-y-3">
            {Object.entries(suggestedTracks).map(([category, tracks]) => (
              <div key={category}>
                <div className="text-sm text-slate-500 mb-1">{category}</div>
                <div className="flex flex-wrap gap-2">
                  {tracks.map(track => (
                    <button
                      key={track.id}
                      onClick={() => addSuggestedTrack(track)}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200"
                    >
                      + {track.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {!showPlaylistForm && (
        <button
          onClick={() => setShowPlaylistForm(true)}
          className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
        >
          + {t('tools.studyPlaylist.createPlaylist')}
        </button>
      )}

      {showPlaylistForm && (
        <div className="card p-4 border-2 border-blue-300">
          <h3 className="font-medium mb-3">{t('tools.studyPlaylist.createPlaylist')}</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={newPlaylist.name}
              onChange={(e) => setNewPlaylist({ ...newPlaylist, name: e.target.value })}
              placeholder="Playlist name (e.g., Deep Focus Mix)"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="text"
              value={newPlaylist.subject}
              onChange={(e) => setNewPlaylist({ ...newPlaylist, subject: e.target.value })}
              placeholder="For studying... (optional)"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <div className="flex gap-2">
              <button
                onClick={addPlaylist}
                disabled={!newPlaylist.name.trim()}
                className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300"
              >
                Create
              </button>
              <button
                onClick={() => setShowPlaylistForm(false)}
                className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {playlists.map(playlist => (
          <div
            key={playlist.id}
            className="card p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedPlaylist(playlist.id)}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium">🎵 {playlist.name}</div>
                {playlist.subject && (
                  <div className="text-sm text-slate-500">{playlist.subject}</div>
                )}
                <div className="text-xs text-slate-400 mt-1">
                  {playlist.tracks.length} tracks • {formatDuration(playlist.totalDuration)}
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); removePlaylist(playlist.id) }}
                className="text-red-400 hover:text-red-600"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      {playlists.length === 0 && !showPlaylistForm && (
        <div className="card p-8 text-center text-slate-500">
          Create a study playlist to get started
        </div>
      )}

      <div className="card p-4 bg-purple-50">
        <h3 className="font-medium text-purple-700 mb-2">{t('tools.studyPlaylist.tips')}</h3>
        <ul className="text-sm text-purple-600 space-y-1">
          <li>• Choose music without lyrics for better focus</li>
          <li>• Match the tempo to your study task</li>
          <li>• Lo-fi and classical are great for reading</li>
          <li>• Faster music works for problem-solving</li>
        </ul>
      </div>
    </div>
  )
}
