'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

type FieldErrors = {
  email?: string[]
  password?: string[]
  confirmPassword?: string[]
}

export type AuthFormState = {
  errors?: FieldErrors
  message?: string | null
}

export async function login(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const supabase = await createClient()

  const data = {
    email: (formData.get('email') as string) || '',
    password: (formData.get('password') as string) || '',
  }

  const errors: FieldErrors = {}
  if (!data.email) errors.email = ['Email is required']
  if (!data.password) errors.password = ['Password is required']
  if (errors.email || errors.password) {
    return { errors, message: 'Please fix the errors below.' }
  }

  const { error } = await supabase.auth.signInWithPassword(data)
  if (error) {
    const message = error.message || 'Unable to sign in'
    if (/invalid login credentials/i.test(message)) {
      return {
        errors: { password: ['Incorrect email or password.'] },
        message: null,
      }
    }
    if (/email not confirmed|confirm your email/i.test(message)) {
      return {
        errors: { email: ['Please verify your email before logging in.'] },
        message: null,
      }
    }
    return { message }
  }

  try {
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser()

    if (currentUser) {
      const { data: profile } = await supabase
        .from('profiles' as const)
        .select('onboarding')
        .eq('user_id', currentUser.id)
        .single<{ onboarding: number | null }>()

      const isOnboarded = (profile?.onboarding ?? 0) === -1
      const destination = isOnboarded ? '/' : '/onboarding'
      revalidatePath('/', 'layout')
      redirect(destination)
    }
  } catch (_e) {
    revalidatePath('/', 'layout')
    redirect('/')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}


