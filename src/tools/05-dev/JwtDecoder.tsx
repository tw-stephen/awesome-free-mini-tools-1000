import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import TextArea from '../../components/ui/TextArea'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

interface DecodedJwt {
  header: Record<string, unknown>
  payload: Record<string, unknown>
  signature: string
}

export default function JwtDecoder() {
  const { t } = useTranslation()
  const [input, setInput] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c')
  const [error, setError] = useState('')
  const { copy, copied } = useClipboard()

  const decoded = useMemo((): DecodedJwt | null => {
    if (!input.trim()) {
      setError('')
      return null
    }

    try {
      const parts = input.trim().split('.')
      if (parts.length !== 3) {
        setError(t('tools.jwtDecoder.invalidFormat'))
        return null
      }

      const decodeBase64Url = (str: string): string => {
        // Convert base64url to base64
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
        // Add padding if needed
        while (base64.length % 4) {
          base64 += '='
        }
        return atob(base64)
      }

      const header = JSON.parse(decodeBase64Url(parts[0]))
      const payload = JSON.parse(decodeBase64Url(parts[1]))
      const signature = parts[2]

      setError('')
      return { header, payload, signature }
    } catch (e) {
      setError((e as Error).message)
      return null
    }
  }, [input, t])

  const formatDate = (timestamp: number): string => {
    try {
      return new Date(timestamp * 1000).toLocaleString()
    } catch {
      return String(timestamp)
    }
  }

  const isExpired = useMemo((): boolean | null => {
    if (!decoded?.payload.exp) return null
    const exp = decoded.payload.exp as number
    return Date.now() > exp * 1000
  }, [decoded])

  const getClaimDescription = (key: string): string => {
    const claims: Record<string, string> = {
      iss: t('tools.jwtDecoder.claimIss'),
      sub: t('tools.jwtDecoder.claimSub'),
      aud: t('tools.jwtDecoder.claimAud'),
      exp: t('tools.jwtDecoder.claimExp'),
      nbf: t('tools.jwtDecoder.claimNbf'),
      iat: t('tools.jwtDecoder.claimIat'),
      jti: t('tools.jwtDecoder.claimJti'),
    }
    return claims[key] || ''
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.jwtDecoder.input')}
          </h3>
          <Button variant="secondary" onClick={() => setInput('')}>
            {t('common.clear')}
          </Button>
        </div>

        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('tools.jwtDecoder.inputPlaceholder')}
          rows={4}
          className="font-mono text-sm break-all"
        />

        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>

      {decoded && (
        <>
          {isExpired !== null && (
            <div
              className={`card p-4 ${
                isExpired
                  ? 'bg-red-50 border border-red-200'
                  : 'bg-green-50 border border-green-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`text-2xl ${isExpired ? 'text-red-600' : 'text-green-600'}`}>
                  {isExpired ? '✗' : '✓'}
                </span>
                <span className={`font-medium ${isExpired ? 'text-red-700' : 'text-green-700'}`}>
                  {isExpired
                    ? t('tools.jwtDecoder.expired')
                    : t('tools.jwtDecoder.valid')}
                </span>
              </div>
              {decoded.payload.exp !== undefined && (
                <p className={`mt-1 text-sm ${isExpired ? 'text-red-600' : 'text-green-600'}`}>
                  {t('tools.jwtDecoder.expiresAt')}: {formatDate(decoded.payload.exp as number)}
                </p>
              )}
            </div>
          )}

          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-700">
                {t('tools.jwtDecoder.header')}
              </h3>
              <Button
                variant="secondary"
                onClick={() => copy(JSON.stringify(decoded.header, null, 2))}
              >
                {copied ? t('common.copied') : t('common.copy')}
              </Button>
            </div>
            <pre className="p-3 bg-red-50 rounded-lg overflow-x-auto">
              <code className="font-mono text-sm text-red-800">
                {JSON.stringify(decoded.header, null, 2)}
              </code>
            </pre>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-700">
                {t('tools.jwtDecoder.payload')}
              </h3>
              <Button
                variant="secondary"
                onClick={() => copy(JSON.stringify(decoded.payload, null, 2))}
              >
                {copied ? t('common.copied') : t('common.copy')}
              </Button>
            </div>
            <pre className="p-3 bg-purple-50 rounded-lg overflow-x-auto">
              <code className="font-mono text-sm text-purple-800">
                {JSON.stringify(decoded.payload, null, 2)}
              </code>
            </pre>

            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium text-slate-600">
                {t('tools.jwtDecoder.claimsDetails')}
              </h4>
              {Object.entries(decoded.payload).map(([key, value]) => (
                <div key={key} className="flex items-start gap-2 p-2 bg-slate-50 rounded">
                  <code className="text-sm font-mono text-blue-600 min-w-[60px]">{key}</code>
                  <div className="flex-1">
                    <p className="text-sm text-slate-700 break-all">
                      {key === 'exp' || key === 'iat' || key === 'nbf'
                        ? formatDate(value as number)
                        : typeof value === 'object'
                          ? JSON.stringify(value)
                          : String(value)}
                    </p>
                    {getClaimDescription(key) && (
                      <p className="text-xs text-slate-500 mt-0.5">{getClaimDescription(key)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-2">
              {t('tools.jwtDecoder.signature')}
            </h3>
            <div className="p-3 bg-cyan-50 rounded-lg">
              <code className="font-mono text-sm text-cyan-800 break-all">
                {decoded.signature}
              </code>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {t('tools.jwtDecoder.signatureNote')}
            </p>
          </div>
        </>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.jwtDecoder.about')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.jwtDecoder.tip1')}</li>
          <li>{t('tools.jwtDecoder.tip2')}</li>
          <li>{t('tools.jwtDecoder.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
