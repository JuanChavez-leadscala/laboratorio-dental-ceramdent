'use client'

import { useState } from 'react'
import { useOrdenes } from '@/features/ordenes/hooks/useOrdenes'
import {
    Search,
    Filter,
    ClipboardList,
    Clock,
    CheckCircle2,
    Truck,
    AlertCircle,
    User,
    Package
} from 'lucide-react'

const STATUS_COLORS: Record<string, string> = {
    'Ingresado': 'text-white/40 bg-white/5 border-white/10',
    'En Diseño': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    'En Proceso': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    'Listo para Entrega': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    'Entregado': 'text-ceramdent-blue bg-ceramdent-blue/10 border-ceramdent-blue/20'
}

export default function OrdenesPage() {
    const { ordenes, loading } = useOrdenes()
    const [query, setQuery] = useState('')

    const filtered = ordenes.filter(o =>
        o.codigo_rastreo.toLowerCase().includes(query.toLowerCase()) ||
        o.paciente.toLowerCase().includes(query.toLowerCase()) ||
        o.cliente?.nombre_doctor.toLowerCase().includes(query.toLowerCase())
    )

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
    )

    return (
        <div className="space-y-8 pb-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">Órdenes de Trabajo</h1>
                    <p className="text-white/50 mt-2 text-lg">Gestión y seguimiento de producción.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-ceramdent-blue transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar orden o paciente..."
                            className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-ceramdent-blue/30 w-full md:w-64 transition-all"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <div className="glass-panel rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
                <div className="overflow-x-auto overflow-y-auto max-h-[700px] scrollbar-hide">
                    <table className="table w-full border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="bg-transparent text-white/40 font-bold uppercase tracking-widest text-[10px] py-6 px-8">Orden / Paciente</th>
                                <th className="bg-transparent text-white/40 font-bold uppercase tracking-widest text-[10px] py-6 px-8">Cliente & Servicio</th>
                                <th className="bg-transparent text-white/40 font-bold uppercase tracking-widest text-[10px] py-6 px-8">Estado</th>
                                <th className="bg-transparent text-white/40 font-bold uppercase tracking-widest text-[10px] py-6 px-8 text-right">Finanzas</th>
                                <th className="bg-transparent text-white/40 font-bold uppercase tracking-widest text-[10px] py-6 px-8"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filtered.map(orden => (
                                <tr key={orden.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="py-6 px-8">
                                        <div>
                                            <div className="font-mono text-[10px] font-bold text-ceramdent-blue tracking-widest uppercase mb-1">{orden.codigo_rastreo}</div>
                                            <div className="font-bold text-white text-base">{orden.paciente}</div>
                                            <div className="text-[10px] text-white/30 font-bold uppercase mt-1">
                                                Entrega: {new Date(orden.fecha_entrega).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-8">
                                        <div className="space-y-1">
                                            <div className="text-sm text-white/70 flex items-center gap-2">
                                                <User className="w-3 h-3 text-ceramdent-fucsia" />
                                                {orden.cliente?.nombre_doctor || 'N/A'}
                                            </div>
                                            <div className="text-sm text-white/40 flex items-center gap-2">
                                                <Package className="w-3 h-3" />
                                                {orden.servicio?.nombre || 'Personalizado'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-8">
                                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${STATUS_COLORS[orden.estado] || STATUS_COLORS['Ingresado']}`}>
                                            {orden.estado}
                                        </span>
                                    </td>
                                    <td className="py-6 px-8 text-right">
                                        <div className="font-bold text-white text-lg">${orden.monto_total.toLocaleString()}</div>
                                        {orden.saldo_pendiente > 0 ? (
                                            <div className="text-[10px] font-bold text-ceramdent-fucsia uppercase">Debe: ${orden.saldo_pendiente.toLocaleString()}</div>
                                        ) : (
                                            <div className="text-[10px] font-bold text-emerald-400 uppercase">Pagado</div>
                                        )}
                                    </td>
                                    <td className="py-6 px-8 text-right">
                                        <button className="btn btn-sm btn-ghost hover:bg-white/10 rounded-xl text-white/20 hover:text-white transition-all">
                                            Ver Detalle
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filtered.length === 0 && (
                    <div className="p-20 text-center flex flex-col items-center justify-center">
                        <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                            <ClipboardList className="w-10 h-10 text-white/10" />
                        </div>
                        <h3 className="text-xl font-bold text-white/40">No se encontraron órdenes</h3>
                        <p className="text-white/20 mt-2">Intenta con otros términos de búsqueda.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
