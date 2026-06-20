'use client'

import { useState, useTransition } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { deleteAccount } from '@/lib/actions/settings'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function DangerZone() {
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = () => {
    if (confirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm.')
      return
    }

    startTransition(async () => {
      const result = await deleteAccount()
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('Account deleted successfully.')
        router.push('/')
      }
    })
  }

  return (
    <section className="surface border-red-100 p-6 sm:p-8">
      <div className="flex items-center gap-2.5 mb-2">
        <AlertTriangle className="w-5 h-5 text-red-600" strokeWidth={1.75} />
        <h2 className="text-base font-medium text-red-600">Danger zone</h2>
      </div>
      <p className="text-body text-sm mb-6">
        Permanently delete your account and all associated API keys. This cannot be undone.
      </p>

      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="text-sm font-medium text-red-600 hover:opacity-70 transition-opacity"
        >
          Delete account
        </button>
      ) : (
        <div className="bg-[var(--color-background)] border border-red-100 p-4 rounded-lg max-w-md">
          <p className="text-sm text-[var(--color-text-main)] mb-3">
            Type <strong>DELETE</strong> to confirm.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="input-field flex-1 focus:border-red-200"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isPending}
                className="btn-secondary px-4 py-2.5 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending || confirmText !== 'DELETE'}
                className="btn px-4 py-2.5 text-sm bg-red-600 text-white rounded-full hover:bg-red-700 disabled:opacity-50"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
