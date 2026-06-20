'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export function TagFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const availableTags = ['prod', 'dev', 'billing', 'analytics', 'external']
  const currentTags = searchParams.getAll('tags')

  const toggleTag = (tag: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('tags')

    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag]

    newTags.forEach((t) => params.append('tags', t))
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
      {availableTags.map((tag) => {
        const isSelected = currentTags.includes(tag)
        return (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`tag shrink-0 ${isSelected ? 'tag-active' : 'hover:border-[var(--color-text-muted)]/30'}`}
          >
            {tag}
          </button>
        )
      })}
    </div>
  )
}
