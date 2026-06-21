'use client'

import { useState, useEffect, useRef } from 'react'
import { ApiKey } from '@/types/api-key'
import { Eye, EyeOff, Copy, Trash2, Check, Loader2 } from 'lucide-react'
import { revealApiKey, deleteApiKey } from '@/lib/actions/api-keys'
import { useRouter } from 'next/navigation'
import { UpdateKeyModal } from '@/components/dashboard/update-key-modal'

export function ApiKeyRow({ apiKey }: { apiKey: ApiKey }) {
  const [revealedKey, setRevealedKey] = useState<string | null>(null)
  const [isRevealing, setIsRevealing] = useState(false)
  const [countdown, setCountdown] = useState<number>(0)
  const [copied, setCopied] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const hideKey = () => {
    setRevealedKey(null)
    setCountdown(0)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const startCountdown = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setCountdown(15)

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          hideKey()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleReveal = async () => {
    if (revealedKey) {
      hideKey()
      return
    }

    setIsRevealing(true)
    const { data, error } = await revealApiKey(apiKey.id)
    setIsRevealing(false)

    if (error || !data) {
      alert(error || 'Failed to reveal key')
      return
    }

    setRevealedKey(data)
    startCountdown()
  }

  const handleCopy = () => {
    const textToCopy = revealedKey || `••••${apiKey.key_hint}`
    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    await deleteApiKey(apiKey.id)
    setIsDeleting(false)
    setShowDeleteConfirm(false)
    router.refresh()
  }

  return (
    <div className="py-4 sm:py-5 px-1 group hover:bg-[var(--color-border-subtle)]/40 sm:hover:bg-transparent transition-colors rounded-lg sm:rounded-none">
      <div className="grid grid-cols-1 sm:grid-cols-[2.5fr_2.5fr_1.5fr_72px] gap-3 sm:gap-4 sm:items-center">
        <div className="flex flex-col min-w-0">
          <span className="label sm:hidden mb-1">Name</span>
          <span className="font-medium text-[var(--color-text-main)] truncate text-sm" title={apiKey.name}>
            {apiKey.name}
          </span>
          <span className="text-xs text-[var(--color-text-muted)] truncate" title={apiKey.service}>
            {apiKey.service}
          </span>
        </div>

        <div className="flex flex-col min-w-0" onMouseLeave={hideKey}>
          <span className="label sm:hidden mb-1">Key</span>
          <div className="flex items-center gap-1">
            <code className="font-mono text-sm text-[var(--color-text-main)] truncate max-w-[150px] sm:max-w-[120px]">
              {revealedKey ? revealedKey : `••••${apiKey.key_hint}`}
            </code>
            <button
              onClick={handleReveal}
              disabled={isRevealing}
              className="btn-ghost p-1.5"
              title={revealedKey ? 'Hide key' : 'Reveal key'}
            >
              {isRevealing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : revealedKey ? (
                <EyeOff className="w-3.5 h-3.5" strokeWidth={1.75} />
              ) : (
                <Eye className="w-3.5 h-3.5" strokeWidth={1.75} />
              )}
            </button>
            <button onClick={handleCopy} className="btn-ghost p-1.5" title="Copy key">
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2} />
              ) : (
                <Copy className="w-3.5 h-3.5" strokeWidth={1.75} />
              )}
            </button>
          </div>

          {revealedKey && (
            <div className="h-px bg-[var(--color-border)] mt-2 overflow-hidden">
              <div
                className="h-full bg-[var(--color-text-main)] transition-all ease-linear duration-1000"
                style={{ width: `${(countdown / 15) * 100}%` }}
              />
            </div>
          )}
        </div>


        <div className="flex flex-col min-w-0">
          <span className="label sm:hidden mb-1">Updated</span>
          <span className="text-xs text-[var(--color-text-muted)]">
            {new Date(apiKey.updated_at).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>

        <div className="flex items-center gap-0.5 pt-3 sm:pt-0 border-t border-[var(--color-border)] sm:border-0 justify-end">
          {showDeleteConfirm ? (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-red-600 font-medium">Delete?</span>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-[11px] font-medium text-red-600 hover:opacity-70 transition-opacity"
              >
                {isDeleting ? '…' : 'Yes'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-[11px] font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors"
              >
                No
              </button>
            </div>
          ) : (
            <div className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center focus-within:opacity-100">
              <UpdateKeyModal apiKey={apiKey} />
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="btn-ghost p-1.5 hover:text-red-600"
                title="Delete key"
              >
                <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
