import { createClient as createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AccountInfo } from '@/components/dashboard/settings/account-info'
import { ChangePasswordForm } from '@/components/dashboard/settings/change-password-form'
import { SecurityInfo } from '@/components/dashboard/settings/security-info'
import { DangerZone } from '@/components/dashboard/settings/danger-zone'

export default async function SettingsPage() {
  const supabase = await createServerClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('created_at')
    .eq('id', user.id)
    .single()

  const profileCreatedAt = profile?.created_at || user.created_at

  return (
    <div className="min-h-screen bg-[var(--color-background)] pb-20">
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
          <h1 className="heading-page mb-1">Settings</h1>
          <p className="text-body text-sm mb-10">Manage your account and security preferences.</p>

          <div className="flex flex-col gap-6">
            <AccountInfo user={user} profileCreatedAt={profileCreatedAt} />
            <ChangePasswordForm />
            <SecurityInfo />
            <DangerZone />
          </div>
        </div>
      </main>
    </div>
  )
}
