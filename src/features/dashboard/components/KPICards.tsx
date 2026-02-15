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

        // Ventas del Mes (Suma de monto_total de ordenes del mes actual)
        const now = new Date()
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

        const { data: ordersThisMonth } = await supabase
            .from('ordenes_trabajo')
            .select('monto_total')
            .gte('created_at', firstDayOfMonth)

        // Cuentas por cobrar (Saldo pendiente de todas las ordenes)
        const { data: pendingOrders } = await supabase
            .from('ordenes_trabajo')
            .select('saldo_pendiente')
            .gt('saldo_pendiente', 0)

        // Utilidad calculation (Optional enhancement: using finance entries for actual cash flow)
        const { data: finanzas } = await supabase
            .from('finanzas')
            .select('monto, tipo')

        if (ordersThisMonth) {
            const totalVentas = ordersThisMonth.reduce((sum, o) => sum + Number(o.monto_total), 0)
            setIngresos(totalVentas)
        }

        if (pendingOrders) {
            const totalPorCobrar = pendingOrders.reduce((sum, o) => sum + Number(o.saldo_pendiente), 0)
            setPorCobrar(totalPorCobrar)
        }

        if (finanzas) {
            const totalIngresos = finanzas
                .filter(f => f.tipo === 'Ingreso')
                .reduce((sum, f) => sum + Number(f.monto), 0)

            const totalEgresos = finanzas
                .filter(f => f.tipo === 'Egreso')
                .reduce((sum, f) => sum + Number(f.monto), 0)

            setUtilidad(totalIngresos - totalEgresos)
        }
    }

    useEffect(() => {
        fetchData()

        const channel = supabase
            .channel('dashboard_realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'ordenes_trabajo' }, fetchData)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'finanzas' }, fetchData)
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    if (role === 'CLIENT') return null

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* KPI 1: Ventas del Mes */}
            <div className="bg-white rounded-2xl p-6 transition-all duration-300 hover:shadow-md border border-slate-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-ceramdent-fucsia opacity-[0.03] rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150"></div>
                <div className="flex items-center justify-between relative z-10">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ventas del Mes</p>
                        <h3 className="text-3xl font-bold text-slate-800 mt-2 font-mono tracking-tight">S/ {ingresos.toLocaleString()}</h3>
                        <p className="text-[10px] text-ceramdent-fucsia mt-1 font-bold uppercase tracking-wider bg-ceramdent-fucsia/5 inline-block px-2 py-0.5 rounded-full">Flujo Bruto</p>
                    </div>
                    <div className="p-4 bg-ceramdent-fucsia/5 rounded-2xl">
                        <Banknote className="w-8 h-8 text-ceramdent-fucsia" />
                    </div>
                </div>
            </div>

            {/* KPI 2: Por Cobrar */}
            <div className="bg-white rounded-2xl p-6 transition-all duration-300 hover:shadow-md border border-slate-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-ceramdent-blue opacity-[0.03] rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150"></div>
                <div className="flex items-center justify-between relative z-10">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Por Cobrar</p>
                        <h3 className="text-3xl font-bold text-slate-800 mt-2 font-mono tracking-tight">S/ {porCobrar.toLocaleString()}</h3>
                        <p className="text-[10px] text-ceramdent-blue mt-1 font-bold uppercase tracking-wider bg-ceramdent-blue/5 inline-block px-2 py-0.5 rounded-full">Pendiente de Pago</p>
                    </div>
                    <div className="p-4 bg-ceramdent-blue/5 rounded-2xl">
                        <Clock className="w-8 h-8 text-ceramdent-blue" />
                    </div>
                </div>
            </div>

            {/* KPI 3: Utilidad Neta (Solo para ADMIN) */}
            {role === 'ADMIN' && (
                <div className="bg-white rounded-2xl p-6 transition-all duration-300 hover:shadow-md border border-slate-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500 opacity-[0.03] rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150"></div>
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Utilidad Neta</p>
                            <h3 className="text-3xl font-bold text-slate-800 mt-2 font-mono tracking-tight">S/ {utilidad.toLocaleString()}</h3>
                            <p className="text-[10px] text-emerald-600 mt-1 font-bold uppercase tracking-wider bg-emerald-50/50 inline-block px-2 py-0.5 rounded-full">Resultado Real</p>
                        </div>
                        <div className="p-4 bg-emerald-50 rounded-2xl">
                            <TrendingUp className="w-8 h-8 text-emerald-500" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
