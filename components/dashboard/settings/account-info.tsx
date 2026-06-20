import { User } from '@supabase/supabase-js'

export function AccountInfo({ user, profileCreatedAt }: { user: User; profileCreatedAt: string }) {
  const memberSince = new Date(profileCreatedAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <section className="surface p-6 sm:p-8">
      <h2 className="text-base font-medium text-[var(--color-text-main)] mb-6">Account</h2>

      <div className="space-y-5">
        <div>
          <label className="label">Email</label>
          <div className="input-field opacity-60 cursor-not-allowed">{user.email}</div>
        </div>

        <div>
          <label className="label">Member since</label>
          <div className="input-field opacity-60 cursor-not-allowed">{memberSince}</div>
        </div>
      </div>
    </section>
  )
}
