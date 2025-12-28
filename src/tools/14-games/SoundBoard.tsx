import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Sound {
  id: string
  name: string
  emoji: string
  frequency: number
  type: OscillatorType
  duration: number
}

export default function SoundBoard() {
  const { t } = useTranslation()
  const [activeSound, setActiveSound] = useState<string | null>(null)
  const [volume, setVolume] = useState(50)
  const [favorites, setFavorites] = useState<string[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)

  const sounds: Sound[] = [
    { id: 'beep', name: 'Beep', emoji: '🔔', frequency: 800, type: 'sine', duration: 0.2 },
    { id: 'buzz', name: 'Buzz', emoji: '📳', frequency: 150, type: 'sawtooth', duration: 0.3 },
    { id: 'ding', name: 'Ding', emoji: '🛎️', frequency: 1200, type: 'sine', duration: 0.4 },
    { id: 'boop', name: 'Boop', emoji: '👆', frequency: 300, type: 'sine', duration: 0.15 },
    { id: 'whoosh', name: 'Whoosh', emoji: '💨', frequency: 400, type: 'triangle', duration: 0.5 },
    { id: 'pop', name: 'Pop', emoji: '🎈', frequency: 600, type: 'square', duration: 0.1 },
    { id: 'horn', name: 'Horn', emoji: '📯', frequency: 250, type: 'sawtooth', duration: 0.6 },
    { id: 'laser', name: 'Laser', emoji: '🔫', frequency: 1500, type: 'sawtooth', duration: 0.2 },
    { id: 'coin', name: 'Coin', emoji: '🪙', frequency: 900, type: 'square', duration: 0.15 },
    { id: 'alert', name: 'Alert', emoji: '🚨', frequency: 700, type: 'square', duration: 0.3 },
    { id: 'chime', name: 'Chime', emoji: '🎐', frequency: 1000, type: 'sine', duration: 0.5 },
    { id: 'blip', name: 'Blip', emoji: '📡', frequency: 500, type: 'triangle', duration: 0.1 },
  ]

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  const playSound = (sound: Sound) => {
    if (!audioContextRef.current) return

    const ctx = audioContextRef.current
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.type = sound.type
    oscillator.frequency.setValueAtTime(sound.frequency, ctx.currentTime)

    // Apply volume
    const volumeValue = volume / 100
    gainNode.gain.setValueAtTime(volumeValue, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + sound.duration)

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + sound.duration)

    setActiveSound(sound.id)
    setTimeout(() => setActiveSound(null), sound.duration * 1000)
  }

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id)
        ? prev.filter(f => f !== id)
        : [...prev, id]
    )
  }

  const favoriteSounds = sounds.filter(s => favorites.includes(s.id))

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500">{t('tools.soundBoard.volume')}:</span>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(parseInt(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm font-medium w-12 text-right">{volume}%</span>
        </div>
      </div>

      {favorites.length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            ⭐ {t('tools.soundBoard.favorites')}
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {favoriteSounds.map((sound) => (
              <button
                key={sound.id}
                onClick={() => playSound(sound)}
                className={`p-3 rounded-lg transition-all ${
                  activeSound === sound.id
                    ? 'bg-blue-500 text-white scale-95'
                    : 'bg-blue-100 hover:bg-blue-200'
                }`}
              >
                <div className="text-2xl">{sound.emoji}</div>
                <div className="text-xs mt-1">{sound.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.soundBoard.allSounds')}</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {sounds.map((sound) => (
            <div key={sound.id} className="relative">
              <button
                onClick={() => playSound(sound)}
                className={`w-full p-4 rounded-lg transition-all ${
                  activeSound === sound.id
                    ? 'bg-blue-500 text-white scale-95'
                    : 'bg-slate-100 hover:bg-slate-200'
                }`}
              >
                <div className="text-3xl">{sound.emoji}</div>
                <div className="text-sm mt-2 font-medium">{sound.name}</div>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleFavorite(sound.id)
                }}
                className="absolute top-1 right-1 p-1 text-lg"
              >
                {favorites.includes(sound.id) ? '⭐' : '☆'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.soundBoard.customTone')}</h3>
        <div className="grid grid-cols-3 gap-2">
          {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((freq) => (
            <button
              key={freq}
              onClick={() => playSound({
                id: `freq-${freq}`,
                name: `${freq}Hz`,
                emoji: '🎵',
                frequency: freq,
                type: 'sine',
                duration: 0.3
              })}
              className="py-2 px-3 bg-purple-100 hover:bg-purple-200 rounded text-sm font-mono"
            >
              {freq}Hz
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.soundBoard.about')}</h4>
        <p className="text-sm text-slate-600">
          {t('tools.soundBoard.aboutText')}
        </p>
      </div>
    </div>
  )
}
