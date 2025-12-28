import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

interface StatusCode {
  code: number
  name: string
  description: string
  category: 'informational' | 'success' | 'redirection' | 'client-error' | 'server-error'
}

export default function HttpStatusCodes() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const { copy, copied } = useClipboard()

  const statusCodes: StatusCode[] = [
    // 1xx Informational
    { code: 100, name: 'Continue', description: 'The server has received the request headers and the client should proceed to send the request body.', category: 'informational' },
    { code: 101, name: 'Switching Protocols', description: 'The requester has asked the server to switch protocols and the server has agreed to do so.', category: 'informational' },
    { code: 102, name: 'Processing', description: 'The server has received and is processing the request, but no response is available yet.', category: 'informational' },
    { code: 103, name: 'Early Hints', description: 'Used to return some response headers before final HTTP message.', category: 'informational' },

    // 2xx Success
    { code: 200, name: 'OK', description: 'The request has succeeded. The meaning depends on the HTTP method.', category: 'success' },
    { code: 201, name: 'Created', description: 'The request has been fulfilled and a new resource has been created.', category: 'success' },
    { code: 202, name: 'Accepted', description: 'The request has been accepted for processing, but the processing has not been completed.', category: 'success' },
    { code: 203, name: 'Non-Authoritative Information', description: 'The returned meta-information is from a local or third-party copy.', category: 'success' },
    { code: 204, name: 'No Content', description: 'The server successfully processed the request and is not returning any content.', category: 'success' },
    { code: 205, name: 'Reset Content', description: 'The server successfully processed the request but is not returning any content. Requires the requester to reset the document view.', category: 'success' },
    { code: 206, name: 'Partial Content', description: 'The server is delivering only part of the resource due to a range header sent by the client.', category: 'success' },

    // 3xx Redirection
    { code: 300, name: 'Multiple Choices', description: 'The request has more than one possible response.', category: 'redirection' },
    { code: 301, name: 'Moved Permanently', description: 'The URL of the requested resource has been changed permanently.', category: 'redirection' },
    { code: 302, name: 'Found', description: 'The URI of requested resource has been changed temporarily.', category: 'redirection' },
    { code: 303, name: 'See Other', description: 'The response can be found under another URI using GET method.', category: 'redirection' },
    { code: 304, name: 'Not Modified', description: 'The resource has not been modified since the last request.', category: 'redirection' },
    { code: 307, name: 'Temporary Redirect', description: 'The request should be repeated with another URI, but future requests should still use the original URI.', category: 'redirection' },
    { code: 308, name: 'Permanent Redirect', description: 'The request and all future requests should be repeated using another URI.', category: 'redirection' },

    // 4xx Client Errors
    { code: 400, name: 'Bad Request', description: 'The server cannot process the request due to client error.', category: 'client-error' },
    { code: 401, name: 'Unauthorized', description: 'Authentication is required and has failed or has not been provided.', category: 'client-error' },
    { code: 402, name: 'Payment Required', description: 'Reserved for future use. Originally intended for digital payment systems.', category: 'client-error' },
    { code: 403, name: 'Forbidden', description: 'The server understands the request but refuses to authorize it.', category: 'client-error' },
    { code: 404, name: 'Not Found', description: 'The requested resource could not be found on the server.', category: 'client-error' },
    { code: 405, name: 'Method Not Allowed', description: 'The request method is not supported for the requested resource.', category: 'client-error' },
    { code: 406, name: 'Not Acceptable', description: 'The requested resource is capable of generating only unacceptable content.', category: 'client-error' },
    { code: 407, name: 'Proxy Authentication Required', description: 'The client must first authenticate itself with the proxy.', category: 'client-error' },
    { code: 408, name: 'Request Timeout', description: 'The server timed out waiting for the request.', category: 'client-error' },
    { code: 409, name: 'Conflict', description: 'The request could not be completed due to a conflict with the current state of the resource.', category: 'client-error' },
    { code: 410, name: 'Gone', description: 'The resource requested is no longer available and will not be available again.', category: 'client-error' },
    { code: 411, name: 'Length Required', description: 'The request did not specify the length of its content.', category: 'client-error' },
    { code: 412, name: 'Precondition Failed', description: 'The server does not meet one of the preconditions specified in the request.', category: 'client-error' },
    { code: 413, name: 'Payload Too Large', description: 'The request is larger than the server is willing or able to process.', category: 'client-error' },
    { code: 414, name: 'URI Too Long', description: 'The URI provided was too long for the server to process.', category: 'client-error' },
    { code: 415, name: 'Unsupported Media Type', description: 'The request entity has a media type which the server does not support.', category: 'client-error' },
    { code: 416, name: 'Range Not Satisfiable', description: 'The client has asked for a portion of the file the server cannot supply.', category: 'client-error' },
    { code: 417, name: 'Expectation Failed', description: 'The server cannot meet the requirements of the Expect request-header field.', category: 'client-error' },
    { code: 418, name: "I'm a Teapot", description: "Any attempt to brew coffee with a teapot should result in this error. (RFC 2324)", category: 'client-error' },
    { code: 422, name: 'Unprocessable Entity', description: 'The request was well-formed but was unable to be followed due to semantic errors.', category: 'client-error' },
    { code: 429, name: 'Too Many Requests', description: 'The user has sent too many requests in a given amount of time.', category: 'client-error' },
    { code: 451, name: 'Unavailable For Legal Reasons', description: 'The resource is unavailable for legal reasons.', category: 'client-error' },

    // 5xx Server Errors
    { code: 500, name: 'Internal Server Error', description: 'A generic error message when the server encounters an unexpected condition.', category: 'server-error' },
    { code: 501, name: 'Not Implemented', description: 'The server does not support the functionality required to fulfill the request.', category: 'server-error' },
    { code: 502, name: 'Bad Gateway', description: 'The server was acting as a gateway and received an invalid response.', category: 'server-error' },
    { code: 503, name: 'Service Unavailable', description: 'The server is currently unable to handle the request.', category: 'server-error' },
    { code: 504, name: 'Gateway Timeout', description: 'The server was acting as a gateway and did not receive a timely response.', category: 'server-error' },
    { code: 505, name: 'HTTP Version Not Supported', description: 'The server does not support the HTTP protocol version used in the request.', category: 'server-error' },
    { code: 507, name: 'Insufficient Storage', description: 'The server is unable to store the representation needed to complete the request.', category: 'server-error' },
    { code: 508, name: 'Loop Detected', description: 'The server detected an infinite loop while processing the request.', category: 'server-error' },
    { code: 511, name: 'Network Authentication Required', description: 'The client needs to authenticate to gain network access.', category: 'server-error' },
  ]

  const categories = [
    { id: 'all', name: t('tools.httpStatusCodes.all'), color: 'slate' },
    { id: 'informational', name: '1xx ' + t('tools.httpStatusCodes.informational'), color: 'blue' },
    { id: 'success', name: '2xx ' + t('tools.httpStatusCodes.success'), color: 'green' },
    { id: 'redirection', name: '3xx ' + t('tools.httpStatusCodes.redirection'), color: 'yellow' },
    { id: 'client-error', name: '4xx ' + t('tools.httpStatusCodes.clientError'), color: 'orange' },
    { id: 'server-error', name: '5xx ' + t('tools.httpStatusCodes.serverError'), color: 'red' },
  ]

  const filteredCodes = useMemo(() => {
    return statusCodes.filter(code => {
      const matchesSearch = search === '' ||
        code.code.toString().includes(search) ||
        code.name.toLowerCase().includes(search.toLowerCase()) ||
        code.description.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || code.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [search, selectedCategory])

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'informational': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'success': return 'bg-green-100 text-green-700 border-green-200'
      case 'redirection': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'client-error': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'server-error': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('tools.httpStatusCodes.searchPlaceholder')}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm"
        />

        <div className="flex flex-wrap gap-2 mt-3">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 text-sm rounded border ${
                selectedCategory === cat.id
                  ? 'bg-blue-100 border-blue-300 text-blue-700'
                  : 'bg-slate-50 border-slate-300 text-slate-600'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <p className="text-sm text-slate-500 mb-3">
          {t('tools.httpStatusCodes.showing')} {filteredCodes.length} {t('tools.httpStatusCodes.codes')}
        </p>

        <div className="space-y-2">
          {filteredCodes.map(code => (
            <div
              key={code.code}
              className={`p-3 rounded-lg border ${getCategoryColor(code.category)}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-lg">{code.code}</span>
                    <span className="font-medium">{code.name}</span>
                  </div>
                  <p className="text-sm mt-1 opacity-80">{code.description}</p>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => copy(`${code.code} ${code.name}`)}
                >
                  {copied ? t('common.copied') : t('common.copy')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.httpStatusCodes.quickReference')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
          {categories.slice(1).map(cat => (
            <div key={cat.id} className={`p-2 rounded ${getCategoryColor(cat.id)}`}>
              <p className="font-medium">{cat.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
