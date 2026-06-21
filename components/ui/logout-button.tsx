import { LogOut } from 'lucide-react'
import { logoutAction } from '@/lib/actions/auth'

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="btn-primary px-5 py-2.5"
      >
        <LogOut className="w-4 h-4" strokeWidth={1.75} />
        Log out
      </button>
    </form>
  )
}
