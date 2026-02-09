'use client'

import { logout } from '@/features/auth/actions/auth'
import Link from 'next/link'
import { LayoutDashboard, PlusCircle, LogOut } from 'lucide-react'

export function Navbar() {
    return (
        <nav className="
      sticky top-0 z-50 
      w-full 
      bg-white/70 
      backdrop-blur-xl 
      border-b border-white/50 
      shadow-sm
    ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    {/* Logo / Brand */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#E30052] flex items-center justify-center shadow-lg shadow-[#E30052]/20">
                            <span className="text-white font-bold text-lg">C</span>
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                            Ceramdent
                        </span>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-6">
                        <Link
                            href="/dashboard"
                            className="group flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#E30052] transition-colors"
                        >
                            <LayoutDashboard className="w-4 h-4 text-slate-400 group-hover:text-[#E30052] transition-colors" />
                            Panel
                        </Link>

                        <Link
                            href="/ordenes/nuevo"
                            className="
                flex items-center gap-2 
                px-4 py-2 
                bg-[#E30052] hover:bg-[#c90048] 
                text-white text-sm font-medium 
                rounded-full 
                shadow-lg shadow-[#E30052]/30 hover:shadow-[#E30052]/40 
                transition-all hover:-translate-y-0.5
              "
                        >
                            <PlusCircle className="w-4 h-4" />
                            Nueva Orden
                        </Link>

                        <button
                            onClick={() => logout()}
                            className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                            title="Cerrar Sesión"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>

                </div>
            </div>
        </nav>
    )
}
