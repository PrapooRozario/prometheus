import { ApiKeyForm } from '@/components/api-key-form'
import { getApiKeys } from '@/lib/actions/api-keys'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function EditKeyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params

  const { data: keys, error } = await getApiKeys()

  if (error || !keys) {
    return notFound()
  }

  const apiKey = keys.find((k) => k.id === resolvedParams.id)

  if (!apiKey) {
    return notFound()
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <header className="glass-nav">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
            Back
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="max-w-2xl">
          <h1 className="heading-page mb-1">Edit API key</h1>
          <p className="text-body text-sm mb-8">
            Update your key details. Leave the key field blank to keep the existing value.
          </p>

          <div className="surface p-6 sm:p-8">
            <ApiKeyForm initialData={apiKey} />
          </div>
        </div>
      </main>
    </div>
  )
}
