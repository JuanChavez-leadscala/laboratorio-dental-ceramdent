'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/shared/lib/supabase'
import { Banknote, Clock, TrendingUp } from 'lucide-react'

export function KPICards() {
    const [ingresos, setIngresos] = useState(0)
    const [porCobrar, setPorCobrar] = useState(0)
    const [utilidad, setUtilidad] = useState(0)
    const supabase = createClient()

    const fetchData = async () => {
        // Ingresos del mes
        const { data: finanzas } = await supabase
            .from('finanzas')
            .select('monto, tipo')

        // Cuentas por cobrar (Saldo pendiente de ordenes activas)
        const { data: ordenes } = await supabase
            .from('ordenes_trabajo')
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
            .on('postgres_changes', { event: '*', schema: 'public', table: 'ordenes_trabajo' }, fetchData)
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* KPI 1: Ventas del Mes */}
            <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#E30052] opacity-[0.03] rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150"></div>
                <div className="flex items-center justify-between relative z-10">
                    <div>
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Ventas del Mes</p>
                        <h3 className="text-3xl font-bold text-slate-900 mt-2">${ingresos.toLocaleString()}</h3>
                        <p className="text-xs text-slate-400 mt-1 font-medium">Flujo Bruto</p>
                    </div>
                    <div className="p-3 bg-[#E30052]/10 rounded-xl group-hover:bg-[#E30052]/20 transition-colors">
                        <Banknote className="w-8 h-8 text-[#E30052]" />
                    </div>
                </div>
            </div>

            {/* KPI 2: Por Cobrar */}
            <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600 opacity-[0.03] rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150"></div>
                <div className="flex items-center justify-between relative z-10">
                    <div>
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Por Cobrar</p>
                        <h3 className="text-3xl font-bold text-slate-900 mt-2">${porCobrar.toLocaleString()}</h3>
                        <p className="text-xs text-slate-400 mt-1 font-medium">Pendiente de Pago</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                        <Clock className="w-8 h-8 text-blue-600" />
                    </div>
                </div>
            </div>

            {/* KPI 3: Utilidad Neta */}
            <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500 opacity-[0.03] rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150"></div>
                <div className="flex items-center justify-between relative z-10">
                    <div>
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Utilidad Neta</p>
                        <h3 className="text-3xl font-bold text-slate-900 mt-2">${utilidad.toLocaleString()}</h3>
                        <p className="text-xs text-slate-400 mt-1 font-medium">Real</p>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors">
                        <TrendingUp className="w-8 h-8 text-emerald-600" />
                    </div>
                </div>
            </div>
        </div>
    )
}
