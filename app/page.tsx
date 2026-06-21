import Link from 'next/link'
import { Shield, Key, Lock, ArrowRight, Settings, User as UserIcon } from 'lucide-react'
import { BrandLogo } from '@/components/ui/brand-logo'
import { createClient as createServerClient } from '@/lib/supabase/server'

const features = [
  {
    icon: Shield,
    title: 'AES-256 Encryption',
    description:
      'Keys are encrypted with AES-256-GCM. Nothing is stored in plaintext.',
  },
  {
    icon: Lock,
    title: 'Auto-Masking',
    description:
      'Secrets stay hidden by default and re-mask automatically after 15 seconds.',
  },
  {
    icon: Key,
    title: 'Minimal Workflow',
    description:
      'Tag, search, and copy — without clutter or unnecessary steps.',
  },
]

export default async function LandingPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      <nav className="glass-nav">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <BrandLogo href="/" size="md" />
          <div className="flex items-center gap-5">
            {user ? (
              <div className="flex items-center gap-1">
                <Link
                  href="/dashboard/settings"
                  className="btn-ghost rounded-full"
                  title="Settings"
                >
                  <Settings className="w-[18px] h-[18px]" strokeWidth={1.75} />
                </Link>
                <Link href="/dashboard" title="Dashboard">
                  <div className="w-8 h-8 ml-1 bg-[var(--color-border-subtle)] border border-[var(--color-border)] rounded-full flex items-center justify-center text-[10px] font-medium text-[var(--color-text-muted)] hover:border-[var(--color-text-muted)]/30 transition-colors">
                    <UserIcon strokeWidth={1} width={15} height={15}/>
                  </div>
                </Link>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors"
                >
                  Sign in
                </Link>
                <Link href="/signup" className="btn-accent text-sm px-4 py-2">
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <section className="max-w-5xl mx-auto px-6 pt-24 pb-20 sm:pt-32 sm:pb-28">
          <div className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-6">
              Secure key management
            </p>
            <h1 className="heading-display text-4xl sm:text-5xl md:text-6xl leading-[1.08] mb-6">
              The vault for your most critical secrets.
            </h1>
            <p className="text-body text-base sm:text-lg max-w-lg mb-10">
              Prometheus is a quiet, secure key manager built on AES-256-GCM encryption.
              Store, organize, and retrieve API keys with confidence.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link href="/signup" className="btn-accent px-6 py-3">
                Start building
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#features" className="btn-secondary px-6 py-3">
                Learn more
              </a>
            </div>
          </div>
        </section>

        <section id="features" className="divider">
          <div className="max-w-5xl mx-auto px-6 py-20 sm:py-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10">
              {features.map(({ icon: Icon, title, description }) => (
                <div key={title} className="space-y-3">
                  <div className="w-9 h-9 rounded-lg bg-[var(--color-border-subtle)] flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[var(--color-primary)]" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-base font-medium text-[var(--color-text-main)]">{title}</h3>
                  <p className="text-body text-sm">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="divider">
          <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--color-text-muted)]">
            <BrandLogo size="sm" />
            <p>&copy; {new Date().getFullYear()} Prometheus</p>
          </div>
        </footer>
      </main>
    </div>
  )
}
