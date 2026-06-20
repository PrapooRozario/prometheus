'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updatePasswordSchema } from '@/lib/schemas/settings'
import { updatePassword } from '@/lib/actions/settings'
import { z } from 'zod'
import { useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

type FormValues = z.infer<typeof updatePasswordSchema>

export function ChangePasswordForm() {
  const [isPending, startTransition] = useTransition()

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(updatePasswordSchema),
  })

  const onSubmit = (data: FormValues) => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append('currentPassword', data.currentPassword)
      formData.append('newPassword', data.newPassword)
      formData.append('confirmPassword', data.confirmPassword)

      const result = await updatePassword(formData)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('Password updated successfully')
        reset()
      }
    })
  }

  return (
    <section className="surface p-6 sm:p-8">
      <h2 className="text-base font-medium text-[var(--color-text-main)] mb-1">Password</h2>
      <p className="text-body text-sm mb-6">Use a long, random password to stay secure.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <div>
          <label className="label">Current password</label>
          <input {...register('currentPassword')} type="password" className="input-field" />
          {errors.currentPassword && (
            <p className="text-red-600 text-xs mt-1.5">{errors.currentPassword.message as string}</p>
          )}
        </div>

        <div>
          <label className="label">New password</label>
          <input {...register('newPassword')} type="password" className="input-field" />
          {errors.newPassword && (
            <p className="text-red-600 text-xs mt-1.5">{errors.newPassword.message as string}</p>
          )}
        </div>

        <div>
          <label className="label">Confirm password</label>
          <input {...register('confirmPassword')} type="password" className="input-field" />
          {errors.confirmPassword && (
            <p className="text-red-600 text-xs mt-1.5">{errors.confirmPassword.message as string}</p>
          )}
        </div>

        <div className="pt-2">
          <button type="submit" disabled={isPending} className="btn-primary px-5 py-2.5">
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isPending ? 'Updating…' : 'Update password'}
          </button>
        </div>
      </form>
    </section>
  )
}
