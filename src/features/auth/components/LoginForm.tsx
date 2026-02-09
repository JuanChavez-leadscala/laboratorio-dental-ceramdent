'use client'

import { login } from '../actions/auth'

export function LoginForm() {
    return (
        <form className="space-y-4">
            <div>
                <label className="label">
                    <span className="label-text">Email</span>
                </label>
                <input
                    name="email"
                    type="email"
                    placeholder="email@example.com"
                    required
                    className="input input-bordered w-full"
                />
            </div>
            <div>
                <label className="label">
                    <span className="label-text">Password</span>
                </label>
                <input
                    name="password"
                    type="password"
                    required
                    className="input input-bordered w-full"
                />
            </div>
            <button formAction={login} className="btn btn-primary w-full">
                Login
            </button>
        </form>
    )
}
