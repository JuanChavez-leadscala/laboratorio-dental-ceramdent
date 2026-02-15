"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ClipboardList,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    PlusCircle,
    FileText,
    DollarSign
} from "lucide-react";
import { logout } from "@/features/auth/actions/auth";
import { cn } from "@/shared/lib/utils";

const menuItems = [
    { icon: LayoutDashboard, label: "Flujo de Trabajo", href: "/dashboard", roles: ['ADMIN', 'STAFF'] },
    { icon: ClipboardList, label: "Órdenes", href: "/ordenes", roles: ['ADMIN', 'STAFF', 'CLIENT'] },
    { icon: Users, label: "Directorio", href: "/clinicas", roles: ['ADMIN', 'STAFF'] },
    { icon: FileText, label: "Servicios", href: "/catalogo", roles: ['ADMIN', 'STAFF'] },
    { icon: DollarSign, label: "Finanzas", href: "/finanzas", roles: ['ADMIN', 'STAFF'] },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Menu Button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 glass-panel rounded-lg text-white"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Overlay/Fixed */}
            <aside
                className={cn(
                    "fixed top-0 left-0 h-full w-64 glass-sidebar z-40 transition-transform duration-300 ease-in-out lg:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex flex-col h-full p-6">
                    {/* Brand/Logo */}
                    <div className="mb-10 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-ceramdent-fucsia flex items-center justify-center glow-fucsia">
                            <span className="text-white font-bold text-xl">C</span>
                        </div>
                        <div>
                            <h1 className="text-slate-900 font-bold text-lg leading-tight">Ceramdent</h1>
                            <span className="text-slate-500 text-xs uppercase tracking-widest font-medium">Digital Lab</span>
                        </div>
                    </div>

                    {/* Action Button */}
                    <Link href="/ordenes/nuevo" className="w-full">
                        <button className="mb-8 w-full py-3 px-4 glass-button-fucsia rounded-xl flex items-center justify-center gap-2 font-semibold">
                            <PlusCircle size={20} />
                            <span>Nueva Orden</span>
                        </button>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2">
                        {menuItems.map((item) => {
                            // Simple role check (assuming user variable will be available)
                            const userRole = 'ADMIN'; // TODO: Get from auth state
                            if (!item.roles.includes(userRole)) return null;

                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                                        isActive
                                            ? "bg-white/10 text-white border border-white/10"
                                            : "text-white/50 hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    <item.icon size={20} className={isActive ? "text-ceramdent-fucsia" : ""} />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Section (Footer of Sidebar) */}
                    <div className="mt-auto pt-6 border-t border-white/10">
                        <Link href="/perfil" className="block group">
                            <div className="flex items-center gap-3 mb-6 p-2 rounded-xl hover:bg-white/5 transition-all">
                                <div className="w-10 h-10 rounded-full bg-ceramdent-blue/10 border border-ceramdent-blue/20 flex items-center justify-center">
                                    <Users size={20} className="text-ceramdent-blue" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-white truncate">Juan Admin</p>
                                    <p className="text-xs text-white/40 truncate">Administrador</p>
                                </div>
                                <Settings size={16} className="text-white/20 group-hover:text-white/50 transition-colors" />
                            </div>
                        </Link>

                        <button
                            onClick={() => logout()}
                            className="flex items-center gap-3 px-4 py-3 w-full text-white/50 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                        >
                            <LogOut size={20} />
                            <span className="font-medium">Cerrar Sesión</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
