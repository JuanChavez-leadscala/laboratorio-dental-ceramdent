'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/shared/lib/supabase'
import { Banknote, Clock, TrendingUp } from 'lucide-react'

export function KPICards() {
    const [ingresos, setIngresos] = useState(0)
    const [porCobrar, setPorCobrar] = useState(0)
    const [utilidad, setUtilidad] = useState(0)
    const [role, setRole] = useState<string | null>(null)
    const supabase = createClient()

    const fetchData = async () => {
        // Get current user role
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const { data: profile } = await supabase
                .from('usuarios')
                .select('rol')
                .eq('id', user.id)
                .single()
            if (profile) setRole(profile.rol)
        }

        // Ingresos del mes
        const { data: finanzas } = await supabase
            .from('finanzas')
            .select('monto, tipo')

        // Cuentas por cobrar (Saldo pendiente de ordenes activas)
        const { data: ordenes } = await supabase
            .from('ordenes')
            .select('saldo_pendiente')
            .gt('saldo_pendiente', 0)

        if (finanzas) {
            const totalIngresos = finanzas
                .filter(f => f.tipo === 'Ingreso')
                .reduce((sum, f) => sum + f.monto, 0)

            const totalEgresos = finanzas
                .filter(f => f.tipo === 'Egreso')
                .reduce((sum, f) => sum + f.monto, 0)

            setIngresos(totalIngresos)
            setUtilidad(totalIngresos - totalEgresos)
        }

        if (ordenes) {
            const totalPorCobrar = ordenes.reduce((sum, o) => sum + o.saldo_pendiente, 0)
            setPorCobrar(totalPorCobrar)
        }
    }

    useEffect(() => {
        fetchData()

        const channel = supabase
            .channel('kpi_updates')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'finanzas' }, fetchData)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'ordenes' }, fetchData)
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    if (role === 'CLIENT') return null

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* KPI 1: Ventas del Mes */}
            <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden border border-white/5">
                <div className="absolute top-0 right-0 w-24 h-24 bg-ceramdent-fucsia opacity-[0.05] rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150"></div>
                <div className="flex items-center justify-between relative z-10">
                    <div>
                        <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Ventas del Mes</p>
                        <h3 className="text-3xl font-bold text-white mt-2 font-mono tracking-tight">${ingresos.toLocaleString()}</h3>
                        <p className="text-[10px] text-ceramdent-fucsia mt-1 font-semibold uppercase tracking-wider bg-ceramdent-fucsia/10 inline-block px-2 py-0.5 rounded-full">Flujo Bruto</p>
                    </div>
                    <div className="p-4 bg-ceramdent-fucsia/10 rounded-2xl group-hover:bg-ceramdent-fucsia/20 transition-colors glow-fucsia">
                        <Banknote className="w-8 h-8 text-ceramdent-fucsia" />
                    </div>
                </div>
            </div>

            {/* KPI 2: Por Cobrar */}
            <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden border border-white/5">
                <div className="absolute top-0 right-0 w-24 h-24 bg-ceramdent-blue opacity-[0.05] rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150"></div>
                <div className="flex items-center justify-between relative z-10">
                    <div>
                        <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Por Cobrar</p>
                        <h3 className="text-3xl font-bold text-white mt-2 font-mono tracking-tight">${porCobrar.toLocaleString()}</h3>
                        <p className="text-[10px] text-ceramdent-blue mt-1 font-semibold uppercase tracking-wider bg-ceramdent-blue/10 inline-block px-2 py-0.5 rounded-full">Pendiente de Pago</p>
                    </div>
                    <div className="p-4 bg-ceramdent-blue/10 rounded-2xl group-hover:bg-ceramdent-blue/20 transition-colors glow-blue">
                        <Clock className="w-8 h-8 text-ceramdent-blue" />
                    </div>
                </div>
            </div>

            {/* KPI 3: Utilidad Neta (Solo para ADMIN) */}
            {role === 'ADMIN' && (
                <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden border border-white/5">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500 opacity-[0.05] rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150"></div>
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Utilidad Neta</p>
                            <h3 className="text-3xl font-bold text-white mt-2 font-mono tracking-tight">${utilidad.toLocaleString()}</h3>
                            <p className="text-[10px] text-emerald-500 mt-1 font-semibold uppercase tracking-wider bg-emerald-500/10 inline-block px-2 py-0.5 rounded-full">Resultado Real</p>
                        </div>
                        <div className="p-4 bg-emerald-500/10 rounded-2xl group-hover:bg-emerald-500/20 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                            <TrendingUp className="w-8 h-8 text-emerald-500" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
