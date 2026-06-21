import { BrandLogo } from '@/components/ui/brand-logo'
import { MailCheck } from 'lucide-react'
import Link from 'next/link'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function VerifyEmailPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-background)] p-6">
      <div className="mb-10">
        <BrandLogo href="/" size="md" />
      </div>

      <div className="w-full max-w-sm surface p-8 text-center flex flex-col items-center">
        <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
          <MailCheck className="w-5 h-5" strokeWidth={2} />
        </div>
        
        <h1 className="heading-page text-2xl mb-3">Check your email</h1>
        <p className="text-body text-sm mb-8">
          We've sent you a verification link. Please click the link to activate your account.
        </p>

        <Link href="/login" className="btn-primary w-full py-3 inline-flex">
          Return to sign in
        </Link>
      </div>
    </div>
  )
}
