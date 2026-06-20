'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'

export function SearchBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [query, setQuery] = useState(searchParams.get('search') || '')

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const currentSearch = searchParams.get('search') || ''
      if (query === currentSearch) return

      const params = new URLSearchParams(searchParams.toString())
      if (query) {
        params.set('search', query)
      } else {
        params.delete('search')
      }
      router.push(`${pathname}?${params.toString()}`)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, pathname, router, searchParams])

  return (
    <div className="relative flex-1 max-w-md">
      <Search
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]"
        strokeWidth={1.75}
      />
      <input
        type="text"
        placeholder="Search by name or service…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="input-field pl-10"
      />
    </div>
  )
}
