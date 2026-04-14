import { useState, useEffect, useCallback } from 'react'

export function useHashRouter() {
  const readPath = useCallback(() => {
    const url = new URL(window.location.href)
    const tool = url.searchParams.get('tool')
    if (tool) return tool
    return window.location.hash.replace(/^#\/?/, '') || ''
  }, [])

  const migrateLegacyHash = useCallback(() => {
    const hashPath = window.location.hash.replace(/^#\/?/, '')
    if (!hashPath) return

    const url = new URL(window.location.href)
    if (!url.searchParams.get('tool')) {
      url.searchParams.set('tool', hashPath)
      url.hash = ''
      window.history.replaceState({}, '', `${url.pathname}${url.search}`)
    }
  }, [])

  const [hash, setHash] = useState(() => readPath())

  useEffect(() => {
    migrateLegacyHash()

    const sync = () => {
      migrateLegacyHash()
      setHash(readPath())
    }

    window.addEventListener('hashchange', sync)
    window.addEventListener('popstate', sync)
    return () => {
      window.removeEventListener('hashchange', sync)
      window.removeEventListener('popstate', sync)
    }
  }, [migrateLegacyHash, readPath])

  const navigate = useCallback((path: string) => {
    const url = new URL(window.location.href)
    if (path) {
      url.searchParams.set('tool', path)
    } else {
      url.searchParams.delete('tool')
    }
    url.hash = ''

    const nextUrl = `${url.pathname}${url.search}`
    window.history.pushState({}, '', nextUrl)
    setHash(path)
  }, [])

  return { path: hash, navigate }
}
