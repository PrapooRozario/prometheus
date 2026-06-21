'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createApiKeySchema, updateApiKeySchema } from '@/lib/schemas/api-key'
import { createApiKey, updateApiKey } from '@/lib/actions/api-keys'
import { Loader2, Eye, EyeOff, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'
import { ApiKey } from '@/types/api-key'

interface ApiKeyFormProps {
  initialData?: ApiKey | null
  onSuccess?: () => void
}

const COMMON_SERVICES = [
  'OpenAI', 'Anthropic', 'Gemini', 'Stripe', 'AWS', 'Vercel', 'Supabase', 'GitHub'
]

// Determine if we are creating or updating based on initialData
export function ApiKeyForm({ initialData, onSuccess }: ApiKeyFormProps) {
  const isEditing = !!initialData
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  // Combobox state
  const [showServiceDropdown, setShowServiceDropdown] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const schema = isEditing ? updateApiKeySchema : createApiKeySchema
  type FormValues = {
    name: string
    service: string
    key?: string
  }

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      name: initialData?.name || '',
      service: initialData?.service || '',
      key: '', // Always empty initially (not decrypted for edit)
    }
  })

  // Watch for heuristic warning
  const watchName = watch('name')
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    const textToCheck = watchName
    const keyPatterns = /(sk-[a-zA-Z0-9]{20,}|AIza[a-zA-Z0-9_-]{30,}|ghp_[a-zA-Z0-9]{30,})/
    if (keyPatterns.test(textToCheck)) {
      setShowWarning(true)
    } else {
      setShowWarning(false)
    }
  }, [watchName])

  const onSubmit = (data: FormValues) => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('service', data.service)
      if (data.key) formData.append('key', data.key)

      const result = isEditing 
        ? await updateApiKey(initialData.id, formData)
        : await createApiKey(formData)

      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(isEditing ? 'API Key updated successfully' : 'API Key added successfully')
        if (onSuccess) {
          onSuccess()
        } else {
          router.push('/dashboard')
        }
        router.refresh()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-2xl">
      <div>
        <label className="label">Name <span className="text-red-500 normal-case tracking-normal">*</span></label>
        <input
          {...register('name')}
          type="text"
          placeholder="e.g. Production Read-Only"
          className="input-field"
        />
        {errors.name && <p className="text-red-600 text-xs mt-1.5">{errors.name.message as string}</p>}
      </div>

      {/* Service Combobox */}
      <div className="relative">
        <label className="label">Service <span className="text-red-500 normal-case tracking-normal">*</span></label>
        <Controller
          name="service"
          control={control}
          render={({ field }) => (
            <>
              <input
                {...field}
                type="text"
                placeholder="e.g. Stripe, OpenAI"
                onFocus={() => setShowServiceDropdown(true)}
                onBlur={() => setTimeout(() => setShowServiceDropdown(false), 200)} // Delay to allow click
                className="input-field"
              />
              {showServiceDropdown && (
                <div className="absolute z-10 w-full mt-1 surface-elevated max-h-48 overflow-y-auto">
                  {COMMON_SERVICES.filter(s => s.toLowerCase().includes(field.value.toLowerCase())).map(service => (
                    <button
                      key={service}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault()
                        field.onChange(service)
                        setShowServiceDropdown(false)
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[var(--color-background)] text-[var(--color-text-main)] transition-colors"
                    >
                      {service}
                    </button>
                  ))}
                  {field.value && !COMMON_SERVICES.some(s => s.toLowerCase() === field.value.toLowerCase()) && (
                    <div className="px-4 py-2 text-sm text-[var(--color-text-muted)] italic">
                      Custom service: "{field.value}"
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        />
        {errors.service && <p className="text-red-600 text-xs mt-1.5">{errors.service.message as string}</p>}
      </div>

      {/* API Key */}
      <div>
        <label className="label">
          {isEditing ? 'Update API Key (Optional)' : 'API Key'}{' '}
          {!isEditing && <span className="text-red-500 normal-case tracking-normal">*</span>}
        </label>
        <div className="relative">
          <input
            {...register('key')}
            type={showPassword ? 'text' : 'password'}
            placeholder={isEditing ? 'Leave blank to keep unchanged' : 'sk_...'}
            className="input-field pl-3.5 pr-10 font-mono"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 btn-ghost p-1"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.key && <p className="text-red-600 text-xs mt-1.5">{errors.key.message as string}</p>}
      </div>

      {/* Heuristic Warning */}
      {showWarning && (
        <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg flex items-start gap-3 text-amber-800">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm">
            <strong>Security Warning:</strong> It looks like you may have accidentally pasted an API key into the Name field. Please ensure secrets are only pasted into the dedicated API Key field.
          </p>
        </div>
      )}



      <div className="pt-4 divider">
        <button type="submit" disabled={isPending} className="btn-primary px-6 py-2.5">
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          {isEditing ? 'Save Changes' : 'Add Key'}
        </button>
      </div>
    </form>
  )
}
