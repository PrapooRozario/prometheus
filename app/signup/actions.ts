'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { redirect } from 'next/navigation'

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export async function signupAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const validation = signupSchema.safeParse({ email, password })
  if (!validation.success) {
    return {
      errors: validation.error.flatten().fieldErrors,
      message: 'Invalid form data. Please check your inputs.',
    }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email: validation.data.email,
    password: validation.data.password,
  })

  if (error) {
    return {
      errors: { form: [error.message] },
      message: 'Failed to sign up.',
    }
  }

  // Upsert the profile table explicitly as requested for first logins via email/password
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({ 
        id: data.user.id, 
        email: data.user.email 
      }, {
        onConflict: 'id',
        ignoreDuplicates: true
      });

    if (profileError) {
      console.error('Failed to create profile during signup:', profileError);
    }
  }

  if (!data.session) {
    redirect('/verify-email')
  }

  redirect('/dashboard')
}
