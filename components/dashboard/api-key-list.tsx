import { ApiKey } from '@/types/api-key'
import { ApiKeyRow } from './api-key-row'
import { KeyRound } from 'lucide-react'

export function ApiKeyList({ keys }: { keys: ApiKey[] }) {
  if (keys.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="w-12 h-12 rounded-full bg-[var(--color-border-subtle)] flex items-center justify-center mb-4">
          <KeyRound className="w-5 h-5 text-[var(--color-text-muted)]" strokeWidth={1.75} />
        </div>
        <h3 className="text-base font-medium text-[var(--color-text-main)] mb-2">No API keys found</h3>
        <p className="text-body text-sm max-w-sm">
          You haven&apos;t created any keys yet, or none match your current filters.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="hidden sm:grid sm:grid-cols-[2fr_1.5fr_2fr_1.5fr_72px] gap-4 px-1 pb-3 text-[11px] uppercase tracking-[0.12em] font-medium text-[var(--color-text-muted)]">
        <div>Name & Service</div>
        <div>Key</div>
        <div>Tags</div>
        <div>Updated</div>
        <div />
      </div>

      <div className="flex flex-col sm:divide-y sm:divide-[var(--color-border)]">
        {keys.map((key) => (
          <ApiKeyRow key={key.id} apiKey={key} />
        ))}
      </div>
    </div>
  )
}
