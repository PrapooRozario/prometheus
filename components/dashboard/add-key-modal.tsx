'use client'

import { useState, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import { ApiKeyForm } from '@/components/api-key-form'

export function AddKeyModal() {
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
      <button onClick={() => setIsOpen(true)} className="btn-accent text-sm px-4 py-2">
        <Plus className="w-4 h-4" strokeWidth={2} />
        Add key
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="modal-backdrop" onClick={() => setIsOpen(false)} />

          <div
            className="relative w-full max-w-2xl surface-elevated overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start justify-between p-6 sm:p-8 border-b border-[var(--color-border)]">
              <div>
                <h2 className="heading-page text-xl mb-1">Add API key</h2>
                <p className="text-body text-sm">Securely store a new key for your applications.</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="btn-ghost -mr-1 -mt-1 rounded-full">
                <X className="w-5 h-5" strokeWidth={1.75} />
              </button>
            </div>

            <div className="p-6 sm:p-8 max-h-[calc(100vh-200px)] overflow-y-auto">
              <ApiKeyForm onSuccess={() => setIsOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
