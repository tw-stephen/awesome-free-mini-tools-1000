import { useState } from 'react'

const modes: Record<string, string> = {
  'Side-by-Side': 'Left and right images are displayed next to each other. Requires a stereoscope or wall-eyed/cross-eyed free viewing. Good for print output.',
  'Anaglyph':     'Left image rendered in red, right image in cyan. View with red-cyan 3D glasses. Most accessible stereo format — works on any display.',
  'Wiggle':       'Alternates between left and right frames at ~5 fps. Creates illusion of depth through motion parallax. No glasses required.',
}

export default function ImageStereoViewer() {
  const [leftUrl, setLeftUrl] = useState('')
  const [rightUrl, setRightUrl] = useState('')
  const [mode, setMode] = useState('Anaglyph')

  const ready = leftUrl.trim().length > 0 && rightUrl.trim().length > 0

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Image Stereo Viewer</h2>
      <div>
        <label className="text-sm font-medium block mb-1">Left Image URL</label>
        <input type="text" value={leftUrl} onChange={(e) => setLeftUrl(e.target.value)}
          className="w-full border rounded p-2" placeholder="https://example.com/left.jpg" />
      </div>
      <div>
        <label className="text-sm font-medium block mb-1">Right Image URL</label>
        <input type="text" value={rightUrl} onChange={(e) => setRightUrl(e.target.value)}
          className="w-full border rounded p-2" placeholder="https://example.com/right.jpg" />
      </div>
      <div>
        <label className="text-sm font-medium block mb-1">View Mode</label>
        <select value={mode} onChange={(e) => setMode(e.target.value)} className="w-full border rounded p-2">
          {Object.keys(modes).map((k) => <option key={k}>{k}</option>)}
        </select>
      </div>
      <div className="p-3 bg-gray-100 rounded space-y-1 text-sm">
        {!ready && <p className="text-gray-500">Enter both image URLs to see stereo info.</p>}
        {ready && <><p className="font-medium">{mode} mode</p><p className="text-gray-700">{modes[mode]}</p></>}
        {!ready && <p className="text-gray-600 mt-1">{modes[mode]}</p>}
      </div>
    </div>
  )
}
