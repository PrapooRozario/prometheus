import { ShieldCheck } from 'lucide-react'

export function SecurityInfo() {
  return (
    <section className="surface p-6 sm:p-8">
      <div className="flex items-center gap-2.5 mb-5">
        <ShieldCheck className="w-5 h-5 text-emerald-600" strokeWidth={1.75} />
        <h2 className="text-base font-medium text-[var(--color-text-main)]">Encryption</h2>
      </div>

      <div className="text-sm text-[var(--color-text-muted)] space-y-3 leading-relaxed">
        <p>
          All keys are encrypted at rest using <strong className="text-[var(--color-text-main)] font-medium">AES-256-GCM</strong>.
          They are never stored in plaintext.
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Each key uses a unique 12-byte initialization vector.</li>
          <li>Encrypted data, IV, and auth tag are stored separately.</li>
          <li>Keys decrypt only when you explicitly click Reveal.</li>
        </ul>
        <p className="text-xs text-[var(--color-text-muted)]/80 pt-2">
          Server-side master key model — not zero-knowledge encryption.
        </p>
      </div>
    </section>
  )
}
