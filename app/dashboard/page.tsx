import { getApiKeys } from '@/lib/actions/api-keys'
import { SearchBar } from '@/components/dashboard/search-bar'
import { TagFilter } from '@/components/dashboard/tag-filter'
import { AddKeyModal } from '@/components/dashboard/add-key-modal'
import { ApiKeyList } from '@/components/dashboard/api-key-list'
import { Settings } from 'lucide-react'
import Link from 'next/link'
import { BrandLogo } from '@/components/ui/brand-logo'

export const dynamic = 'force-dynamic'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams

  const search = typeof params.search === 'string' ? params.search : undefined
  const service = typeof params.service === 'string' ? params.service : undefined
  const tags = params.tags
    ? (Array.isArray(params.tags) ? params.tags : [params.tags])
    : undefined

  const { data: keys, error } = await getApiKeys({ search, service, tags })

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <header className="glass-nav">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <BrandLogo href="/dashboard" size="sm" />

          <div className="flex items-center gap-1">
            <Link
              href="/dashboard/settings"
              className="btn-ghost rounded-full"
              title="Settings"
            >
              <Settings className="w-[18px] h-[18px]" strokeWidth={1.75} />
            </Link>
            <div className="w-8 h-8 ml-1 bg-[var(--color-border-subtle)] border border-[var(--color-border)] rounded-full flex items-center justify-center text-[10px] font-medium text-[var(--color-text-muted)]">
              ME
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="heading-page mb-1">API Keys</h1>
              <p className="text-body text-sm">Manage your secret keys and access tokens.</p>
            </div>
            <AddKeyModal />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 sm:items-center">
            <SearchBar />
            <TagFilter />
          </div>

          <div>
            {error ? (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            ) : (
              <ApiKeyList keys={keys || []} />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
