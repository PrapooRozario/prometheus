import Link from 'next/link'

interface BrandLogoProps {
  href?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: { icon: 'w-5 h-5', text: 'text-lg' },
  md: { icon: 'w-6 h-6', text: 'text-xl' },
  lg: { icon: 'w-7 h-7', text: 'text-2xl' },
}

function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 3L2 21h20L12 3z" />
      <path d="M12 10L7 19h10L12 10z" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function BrandLogo({ href, size = 'md', className = '' }: BrandLogoProps) {
  const { icon, text } = sizes[size]

  const content = (
    <span className={`inline-flex items-center gap-2 text-[var(--color-text-main)] font-serif font-medium tracking-tight ${text} ${className}`}>
      <LogoMark className={`${icon} text-[var(--color-primary)]`} />
      Prometheus
    </span>
  )

  if (href) {
    return (
      <Link href={href} className="transition-opacity hover:opacity-70">
        {content}
      </Link>
    )
  }

  return content
}
