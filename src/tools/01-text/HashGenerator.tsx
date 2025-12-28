import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '../../hooks/useClipboard'
import Button from '../../components/ui/Button'
import TextArea from '../../components/ui/TextArea'

// Hash algorithms available in Web Crypto API
type Algorithm = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'

// Generate hash using Web Crypto API
const generateHash = async (text: string, algorithm: Algorithm): Promise<string> => {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest(algorithm, data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

// Simple MD5 implementation (for demonstration - not cryptographically secure)
const md5 = (input: string): string => {
  const md5cycle = (x: number[], k: number[]) => {
    let a = x[0],
      b = x[1],
      c = x[2],
      d = x[3]

    a = ff(a, b, c, d, k[0], 7, -680876936)
    d = ff(d, a, b, c, k[1], 12, -389564586)
    c = ff(c, d, a, b, k[2], 17, 606105819)
    b = ff(b, c, d, a, k[3], 22, -1044525330)
    a = ff(a, b, c, d, k[4], 7, -176418897)
    d = ff(d, a, b, c, k[5], 12, 1200080426)
    c = ff(c, d, a, b, k[6], 17, -1473231341)
    b = ff(b, c, d, a, k[7], 22, -45705983)
    a = ff(a, b, c, d, k[8], 7, 1770035416)
    d = ff(d, a, b, c, k[9], 12, -1958414417)
    c = ff(c, d, a, b, k[10], 17, -42063)
    b = ff(b, c, d, a, k[11], 22, -1990404162)
    a = ff(a, b, c, d, k[12], 7, 1804603682)
    d = ff(d, a, b, c, k[13], 12, -40341101)
    c = ff(c, d, a, b, k[14], 17, -1502002290)
    b = ff(b, c, d, a, k[15], 22, 1236535329)

    a = gg(a, b, c, d, k[1], 5, -165796510)
    d = gg(d, a, b, c, k[6], 9, -1069501632)
    c = gg(c, d, a, b, k[11], 14, 643717713)
    b = gg(b, c, d, a, k[0], 20, -373897302)
    a = gg(a, b, c, d, k[5], 5, -701558691)
    d = gg(d, a, b, c, k[10], 9, 38016083)
    c = gg(c, d, a, b, k[15], 14, -660478335)
    b = gg(b, c, d, a, k[4], 20, -405537848)
    a = gg(a, b, c, d, k[9], 5, 568446438)
    d = gg(d, a, b, c, k[14], 9, -1019803690)
    c = gg(c, d, a, b, k[3], 14, -187363961)
    b = gg(b, c, d, a, k[8], 20, 1163531501)
    a = gg(a, b, c, d, k[13], 5, -1444681467)
    d = gg(d, a, b, c, k[2], 9, -51403784)
    c = gg(c, d, a, b, k[7], 14, 1735328473)
    b = gg(b, c, d, a, k[12], 20, -1926607734)

    a = hh(a, b, c, d, k[5], 4, -378558)
    d = hh(d, a, b, c, k[8], 11, -2022574463)
    c = hh(c, d, a, b, k[11], 16, 1839030562)
    b = hh(b, c, d, a, k[14], 23, -35309556)
    a = hh(a, b, c, d, k[1], 4, -1530992060)
    d = hh(d, a, b, c, k[4], 11, 1272893353)
    c = hh(c, d, a, b, k[7], 16, -155497632)
    b = hh(b, c, d, a, k[10], 23, -1094730640)
    a = hh(a, b, c, d, k[13], 4, 681279174)
    d = hh(d, a, b, c, k[0], 11, -358537222)
    c = hh(c, d, a, b, k[3], 16, -722521979)
    b = hh(b, c, d, a, k[6], 23, 76029189)
    a = hh(a, b, c, d, k[9], 4, -640364487)
    d = hh(d, a, b, c, k[12], 11, -421815835)
    c = hh(c, d, a, b, k[15], 16, 530742520)
    b = hh(b, c, d, a, k[2], 23, -995338651)

    a = ii(a, b, c, d, k[0], 6, -198630844)
    d = ii(d, a, b, c, k[7], 10, 1126891415)
    c = ii(c, d, a, b, k[14], 15, -1416354905)
    b = ii(b, c, d, a, k[5], 21, -57434055)
    a = ii(a, b, c, d, k[12], 6, 1700485571)
    d = ii(d, a, b, c, k[3], 10, -1894986606)
    c = ii(c, d, a, b, k[10], 15, -1051523)
    b = ii(b, c, d, a, k[1], 21, -2054922799)
    a = ii(a, b, c, d, k[8], 6, 1873313359)
    d = ii(d, a, b, c, k[15], 10, -30611744)
    c = ii(c, d, a, b, k[6], 15, -1560198380)
    b = ii(b, c, d, a, k[13], 21, 1309151649)
    a = ii(a, b, c, d, k[4], 6, -145523070)
    d = ii(d, a, b, c, k[11], 10, -1120210379)
    c = ii(c, d, a, b, k[2], 15, 718787259)
    b = ii(b, c, d, a, k[9], 21, -343485551)

    x[0] = add32(a, x[0])
    x[1] = add32(b, x[1])
    x[2] = add32(c, x[2])
    x[3] = add32(d, x[3])
  }

  const cmn = (q: number, a: number, b: number, x: number, s: number, t: number) => {
    a = add32(add32(a, q), add32(x, t))
    return add32((a << s) | (a >>> (32 - s)), b)
  }

  const ff = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) =>
    cmn((b & c) | (~b & d), a, b, x, s, t)

  const gg = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) =>
    cmn((b & d) | (c & ~d), a, b, x, s, t)

  const hh = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) =>
    cmn(b ^ c ^ d, a, b, x, s, t)

  const ii = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) =>
    cmn(c ^ (b | ~d), a, b, x, s, t)

  const add32 = (a: number, b: number) => (a + b) & 0xffffffff

  const md5blk = (s: string) => {
    const md5blks: number[] = []
    for (let i = 0; i < 64; i += 4) {
      md5blks[i >> 2] =
        s.charCodeAt(i) +
        (s.charCodeAt(i + 1) << 8) +
        (s.charCodeAt(i + 2) << 16) +
        (s.charCodeAt(i + 3) << 24)
    }
    return md5blks
  }

  const hex = (x: number) => {
    let s = ''
    for (let i = 0; i < 4; i++) {
      s += ((x >> (i * 8 + 4)) & 0x0f).toString(16) + ((x >> (i * 8)) & 0x0f).toString(16)
    }
    return s
  }

  let n = input.length
  let state = [1732584193, -271733879, -1732584194, 271733878]
  let i: number

  for (i = 64; i <= n; i += 64) {
    md5cycle(state, md5blk(input.substring(i - 64, i)))
  }

  input = input.substring(i - 64)
  const tail: number[] = new Array(16).fill(0)
  for (i = 0; i < input.length; i++) {
    tail[i >> 2] |= input.charCodeAt(i) << (i % 4 << 3)
  }
  tail[i >> 2] |= 0x80 << (i % 4 << 3)

  if (i > 55) {
    md5cycle(state, tail)
    for (i = 0; i < 16; i++) tail[i] = 0
  }
  tail[14] = n * 8
  md5cycle(state, tail)

  return hex(state[0]) + hex(state[1]) + hex(state[2]) + hex(state[3])
}

export default function HashGenerator() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [hashes, setHashes] = useState<Record<string, string>>({})
  const { copied, copy } = useClipboard()
  const [copiedAlgo, setCopiedAlgo] = useState('')

  useEffect(() => {
    const computeHashes = async () => {
      if (!input) {
        setHashes({})
        return
      }

      const md5Hash = md5(input)
      const sha1 = await generateHash(input, 'SHA-1')
      const sha256 = await generateHash(input, 'SHA-256')
      const sha384 = await generateHash(input, 'SHA-384')
      const sha512 = await generateHash(input, 'SHA-512')

      setHashes({
        MD5: md5Hash,
        'SHA-1': sha1,
        'SHA-256': sha256,
        'SHA-384': sha384,
        'SHA-512': sha512,
      })
    }

    computeHashes()
  }, [input])

  const handleCopy = (algo: string, value: string) => {
    copy(value)
    setCopiedAlgo(algo)
    setTimeout(() => setCopiedAlgo(''), 1500)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.hashGenerator.input')}
        </label>
        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('tools.hashGenerator.inputPlaceholder')}
          rows={4}
        />
        <div className="mt-2 flex justify-end">
          <Button variant="secondary" onClick={() => setInput('')} disabled={!input}>
            {t('common.clear')}
          </Button>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-4">{t('tools.hashGenerator.output')}</h3>

        {Object.keys(hashes).length === 0 ? (
          <div className="text-center py-8 text-slate-500">{t('tools.hashGenerator.placeholder')}</div>
        ) : (
          <div className="space-y-3">
            {Object.entries(hashes).map(([algo, hash]) => (
              <div key={algo} className="flex items-start gap-3">
                <div className="w-20 text-sm font-medium text-slate-600 pt-2">{algo}</div>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={hash}
                    readOnly
                    className="w-full px-3 py-2 pr-16 font-mono text-sm bg-slate-50 border border-slate-200 rounded-lg"
                  />
                  <button
                    onClick={() => handleCopy(algo, hash)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-blue-500 hover:text-blue-600"
                  >
                    {copiedAlgo === algo ? t('common.copied') : t('common.copy')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card p-4">
        <p className="text-sm text-slate-500">{t('tools.hashGenerator.hint')}</p>
      </div>
    </div>
  )
}
