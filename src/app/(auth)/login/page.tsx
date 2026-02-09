import { LoginForm } from '@/features/auth/components/LoginForm'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-base-200">
      <div className="card w-full max-w-sm shrink-0 bg-base-100 shadow-2xl">
        <div className="card-body">
          <h2 className="card-title justify-center mb-4">Dental Lab Login</h2>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
