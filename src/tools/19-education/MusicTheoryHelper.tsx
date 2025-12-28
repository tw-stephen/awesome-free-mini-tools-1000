import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Scale {
  name: string
  pattern: number[]
  description: string
}

interface Chord {
  name: string
  intervals: number[]
  symbol: string
}

export default function MusicTheoryHelper() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<'scales' | 'chords' | 'intervals' | 'circle'>('scales')
  const [rootNote, setRootNote] = useState('C')
  const [selectedScale, setSelectedScale] = useState('major')
  const [selectedChord, setSelectedChord] = useState('major')

  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  const noteNames = ['C', 'Db/C#', 'D', 'Eb/D#', 'E', 'F', 'Gb/F#', 'G', 'Ab/G#', 'A', 'Bb/A#', 'B']

  const scales: { [key: string]: Scale } = {
    major: { name: 'Major', pattern: [0, 2, 4, 5, 7, 9, 11], description: 'Happy, bright sound. W-W-H-W-W-W-H' },
    minor: { name: 'Natural Minor', pattern: [0, 2, 3, 5, 7, 8, 10], description: 'Sad, dark sound. W-H-W-W-H-W-W' },
    harmonicMinor: { name: 'Harmonic Minor', pattern: [0, 2, 3, 5, 7, 8, 11], description: 'Minor with raised 7th' },
    melodicMinor: { name: 'Melodic Minor', pattern: [0, 2, 3, 5, 7, 9, 11], description: 'Jazz minor scale' },
    pentatonicMajor: { name: 'Major Pentatonic', pattern: [0, 2, 4, 7, 9], description: '5-note scale, no half steps' },
    pentatonicMinor: { name: 'Minor Pentatonic', pattern: [0, 3, 5, 7, 10], description: 'Blues/rock foundation' },
    blues: { name: 'Blues Scale', pattern: [0, 3, 5, 6, 7, 10], description: 'Minor pentatonic + blue note' },
    chromatic: { name: 'Chromatic', pattern: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], description: 'All 12 notes' },
  }

  const chords: { [key: string]: Chord } = {
    major: { name: 'Major', intervals: [0, 4, 7], symbol: '' },
    minor: { name: 'Minor', intervals: [0, 3, 7], symbol: 'm' },
    diminished: { name: 'Diminished', intervals: [0, 3, 6], symbol: 'dim' },
    augmented: { name: 'Augmented', intervals: [0, 4, 8], symbol: 'aug' },
    major7: { name: 'Major 7th', intervals: [0, 4, 7, 11], symbol: 'maj7' },
    minor7: { name: 'Minor 7th', intervals: [0, 3, 7, 10], symbol: 'm7' },
    dominant7: { name: 'Dominant 7th', intervals: [0, 4, 7, 10], symbol: '7' },
    sus2: { name: 'Suspended 2nd', intervals: [0, 2, 7], symbol: 'sus2' },
    sus4: { name: 'Suspended 4th', intervals: [0, 5, 7], symbol: 'sus4' },
  }

  const intervals = [
    { semitones: 0, name: 'Unison', short: 'P1' },
    { semitones: 1, name: 'Minor 2nd', short: 'm2' },
    { semitones: 2, name: 'Major 2nd', short: 'M2' },
    { semitones: 3, name: 'Minor 3rd', short: 'm3' },
    { semitones: 4, name: 'Major 3rd', short: 'M3' },
    { semitones: 5, name: 'Perfect 4th', short: 'P4' },
    { semitones: 6, name: 'Tritone', short: 'TT' },
    { semitones: 7, name: 'Perfect 5th', short: 'P5' },
    { semitones: 8, name: 'Minor 6th', short: 'm6' },
    { semitones: 9, name: 'Major 6th', short: 'M6' },
    { semitones: 10, name: 'Minor 7th', short: 'm7' },
    { semitones: 11, name: 'Major 7th', short: 'M7' },
    { semitones: 12, name: 'Octave', short: 'P8' },
  ]

  const circleOfFifths = ['C', 'G', 'D', 'A', 'E', 'B', 'Gb/F#', 'Db', 'Ab', 'Eb', 'Bb', 'F']

  const getNoteFromInterval = (root: string, semitones: number): string => {
    const rootIndex = notes.indexOf(root)
    return notes[(rootIndex + semitones) % 12]
  }

  const getScaleNotes = (): string[] => {
    const scale = scales[selectedScale]
    return scale.pattern.map(interval => getNoteFromInterval(rootNote, interval))
  }

  const getChordNotes = (): string[] => {
    const chord = chords[selectedChord]
    return chord.intervals.map(interval => getNoteFromInterval(rootNote, interval))
  }

  const renderPiano = (highlightNotes: string[]) => {
    const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
    const blackKeys = ['C#', 'D#', '', 'F#', 'G#', 'A#', '']

    return (
      <div className="relative h-24 flex">
        {whiteKeys.map((note, i) => (
          <div
            key={note}
            className={`flex-1 h-full border border-slate-300 rounded-b flex items-end justify-center pb-1 text-xs ${
              highlightNotes.includes(note) ? 'bg-blue-400 text-white' : 'bg-white'
            }`}
          >
            {note}
          </div>
        ))}
        <div className="absolute top-0 left-0 right-0 flex">
          {blackKeys.map((note, i) => (
            <div key={i} className="flex-1 flex justify-end">
              {note && (
                <div
                  className={`w-2/3 h-14 rounded-b text-xs flex items-end justify-center pb-1 ${
                    highlightNotes.includes(note) ? 'bg-blue-600 text-white' : 'bg-slate-800 text-white'
                  }`}
                >
                  {note.replace('#', '')}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['scales', 'chords', 'intervals', 'circle'] as const).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-2 rounded capitalize ${
              mode === m ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            {m === 'circle' ? 'Circle of 5ths' : m}
          </button>
        ))}
      </div>

      {mode !== 'circle' && mode !== 'intervals' && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.musicTheoryHelper.rootNote')}</h3>
          <div className="grid grid-cols-6 gap-1">
            {notes.map(note => (
              <button
                key={note}
                onClick={() => setRootNote(note)}
                className={`py-2 rounded text-sm ${
                  rootNote === note ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
                }`}
              >
                {note}
              </button>
            ))}
          </div>
        </div>
      )}

      {mode === 'scales' && (
        <>
          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.musicTheoryHelper.scale')}</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(scales).map(([key, scale]) => (
                <button
                  key={key}
                  onClick={() => setSelectedScale(key)}
                  className={`p-2 rounded text-sm text-left ${
                    selectedScale === key ? 'bg-green-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  {scale.name}
                </button>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-medium mb-2">{rootNote} {scales[selectedScale].name}</h3>
            <p className="text-sm text-slate-500 mb-3">{scales[selectedScale].description}</p>
            <div className="flex gap-2 mb-4">
              {getScaleNotes().map((note, i) => (
                <div key={i} className="flex-1 p-2 bg-blue-100 rounded text-center font-medium">
                  {note}
                </div>
              ))}
            </div>
            {renderPiano(getScaleNotes())}
          </div>
        </>
      )}

      {mode === 'chords' && (
        <>
          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.musicTheoryHelper.chord')}</h3>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(chords).map(([key, chord]) => (
                <button
                  key={key}
                  onClick={() => setSelectedChord(key)}
                  className={`p-2 rounded text-sm ${
                    selectedChord === key ? 'bg-purple-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  {chord.name}
                </button>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-medium mb-2">
              {rootNote}{chords[selectedChord].symbol} ({chords[selectedChord].name})
            </h3>
            <div className="flex gap-2 mb-4">
              {getChordNotes().map((note, i) => (
                <div key={i} className="flex-1 p-3 bg-purple-100 rounded text-center font-medium text-lg">
                  {note}
                </div>
              ))}
            </div>
            {renderPiano(getChordNotes())}
          </div>
        </>
      )}

      {mode === 'intervals' && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.musicTheoryHelper.intervals')}</h3>
          <div className="space-y-2">
            {intervals.map(interval => (
              <div key={interval.semitones} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <div>
                  <span className="font-medium">{interval.name}</span>
                  <span className="text-sm text-slate-500 ml-2">({interval.short})</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-600">{interval.semitones} semitones</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {mode === 'circle' && (
        <div className="card p-4">
          <h3 className="font-medium mb-3 text-center">{t('tools.musicTheoryHelper.circleOfFifths')}</h3>
          <div className="relative w-64 h-64 mx-auto">
            {circleOfFifths.map((note, i) => {
              const angle = (i * 30 - 90) * (Math.PI / 180)
              const x = 50 + 40 * Math.cos(angle)
              const y = 50 + 40 * Math.sin(angle)
              return (
                <div
                  key={note}
                  className="absolute w-10 h-10 -ml-5 -mt-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  {note.includes('/') ? note.split('/')[0] : note}
                </div>
              )
            })}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-sm text-slate-500">Perfect 5th</div>
                <div className="text-xs text-slate-400">clockwise</div>
              </div>
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-500 text-center">
            Each note is a perfect 5th from its neighbors
          </div>
        </div>
      )}
    </div>
  )
}
