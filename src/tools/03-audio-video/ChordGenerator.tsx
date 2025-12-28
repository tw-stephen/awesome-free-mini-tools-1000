import { useState, useRef, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

const CHORD_TYPES: Record<string, number[]> = {
  major: [0, 4, 7],
  minor: [0, 3, 7],
  dim: [0, 3, 6],
  aug: [0, 4, 8],
  sus2: [0, 2, 7],
  sus4: [0, 5, 7],
  '7': [0, 4, 7, 10],
  maj7: [0, 4, 7, 11],
  min7: [0, 3, 7, 10],
  dim7: [0, 3, 6, 9],
  '9': [0, 4, 7, 10, 14],
}

export default function ChordGenerator() {
  const { t } = useTranslation()
  const [rootNote, setRootNote] = useState('C')
  const [chordType, setChordType] = useState('major')
  const [octave, setOctave] = useState(4)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(1)
  const [volume, setVolume] = useState(0.5)

  const audioContextRef = useRef<AudioContext | null>(null)
  const oscillatorsRef = useRef<OscillatorNode[]>([])
  const gainNodesRef = useRef<GainNode[]>([])

  const noteToFrequency = (note: string, oct: number): number => {
    const noteIndex = NOTES.indexOf(note)
    const a4 = 440
    const a4Index = NOTES.indexOf('A')
    const a4Octave = 4
    const halfSteps = noteIndex - a4Index + (oct - a4Octave) * 12
    return a4 * Math.pow(2, halfSteps / 12)
  }

  const getChordNotes = (): { note: string; octave: number; frequency: number }[] => {
    const intervals = CHORD_TYPES[chordType] || CHORD_TYPES.major
    const rootIndex = NOTES.indexOf(rootNote)

    return intervals.map((interval) => {
      const totalSemitones = rootIndex + interval
      const noteIndex = totalSemitones % 12
      const oct = octave + Math.floor(totalSemitones / 12)
      const note = NOTES[noteIndex]
      const frequency = noteToFrequency(note, oct)

      return { note, octave: oct, frequency }
    })
  }

  const playChord = useCallback(() => {
    const audioContext = new AudioContext()
    audioContextRef.current = audioContext

    const chordNotes = getChordNotes()
    const masterGain = audioContext.createGain()
    masterGain.connect(audioContext.destination)
    masterGain.gain.value = volume / chordNotes.length

    const now = audioContext.currentTime

    chordNotes.forEach(({ frequency }) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.type = 'sine'
      oscillator.frequency.value = frequency

      gainNode.gain.setValueAtTime(0, now)
      gainNode.gain.linearRampToValueAtTime(1, now + 0.05)
      gainNode.gain.setValueAtTime(1, now + duration - 0.1)
      gainNode.gain.linearRampToValueAtTime(0, now + duration)

      oscillator.connect(gainNode)
      gainNode.connect(masterGain)

      oscillator.start(now)
      oscillator.stop(now + duration)

      oscillatorsRef.current.push(oscillator)
      gainNodesRef.current.push(gainNode)
    })

    setIsPlaying(true)

    setTimeout(() => {
      setIsPlaying(false)
      oscillatorsRef.current = []
      gainNodesRef.current = []
      if (audioContextRef.current) {
        audioContextRef.current.close()
        audioContextRef.current = null
      }
    }, duration * 1000)
  }, [chordType, duration, volume, octave, rootNote])

  const stopChord = useCallback(() => {
    oscillatorsRef.current.forEach((osc) => {
      try {
        osc.stop()
        osc.disconnect()
      } catch {
        // Already stopped
      }
    })

    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }

    oscillatorsRef.current = []
    gainNodesRef.current = []
    setIsPlaying(false)
  }, [])

  useEffect(() => {
    return () => {
      stopChord()
    }
  }, [stopChord])

  const chordNotes = getChordNotes()
  const chordName = `${rootNote}${chordType === 'major' ? '' : chordType}`

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex flex-col items-center space-y-6">
          <div className="text-5xl font-bold text-slate-700">
            {chordName}
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {chordNotes.map(({ note, octave: oct }, i) => (
              <div
                key={i}
                className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg font-medium"
              >
                {note}{oct}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              variant="primary"
              onClick={isPlaying ? stopChord : playChord}
            >
              {isPlaying ? t('tools.chordGenerator.stop') : t('tools.chordGenerator.play')}
            </Button>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.chordGenerator.rootNote')}
        </h3>

        <div className="flex flex-wrap gap-2">
          {NOTES.map((note) => (
            <button
              key={note}
              onClick={() => setRootNote(note)}
              className={`w-12 h-10 text-sm font-medium rounded ${
                rootNote === note
                  ? 'bg-blue-500 text-white'
                  : note.includes('#')
                  ? 'bg-slate-700 text-white hover:bg-slate-600'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {note}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.chordGenerator.chordType')}
        </h3>

        <div className="flex flex-wrap gap-2">
          {Object.keys(CHORD_TYPES).map((type) => (
            <button
              key={type}
              onClick={() => setChordType(type)}
              className={`px-3 py-2 text-sm rounded ${
                chordType === type
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.chordGenerator.settings')}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">
              {t('tools.chordGenerator.octave')}: {octave}
            </label>
            <input
              type="range"
              min="2"
              max="6"
              value={octave}
              onChange={(e) => setOctave(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">
              {t('tools.chordGenerator.duration')}: {duration}s
            </label>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.5"
              value={duration}
              onChange={(e) => setDuration(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">
              {t('tools.chordGenerator.volume')}: {Math.round(volume * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.chordGenerator.frequencies')}
        </h3>
        <div className="text-sm text-slate-500 space-y-1">
          {chordNotes.map(({ note, octave: oct, frequency }, i) => (
            <div key={i}>
              {note}{oct}: {frequency.toFixed(2)} Hz
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
