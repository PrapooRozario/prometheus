'use client'

import { useState, useEffect } from 'react'
import { Edit, X } from 'lucide-react'
import { ApiKeyForm } from '@/components/api-key-form'
import { ApiKey } from '@/types/api-key'

export function UpdateKeyModal({ apiKey }: { apiKey: ApiKey }) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn-ghost p-1.5"
        title="Edit key"
      >
        <Edit className="w-4 h-4" strokeWidth={1.75} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 text-left">
          <div className="modal-backdrop" onClick={() => setIsOpen(false)} />

          <div
            className="relative w-full max-w-2xl surface-elevated overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start justify-between p-6 sm:p-8 border-b border-[var(--color-border)]">
              <div>
                <h2 className="heading-page text-xl mb-1">Edit API key</h2>
                <p className="text-body text-sm">Update details or change the secret value.</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="btn-ghost -mr-1 -mt-1 rounded-full">
                <X className="w-5 h-5" strokeWidth={1.75} />
              </button>
            </div>

            <div className="p-6 sm:p-8 max-h-[calc(100vh-200px)] overflow-y-auto">
              <ApiKeyForm initialData={apiKey} onSuccess={() => setIsOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
