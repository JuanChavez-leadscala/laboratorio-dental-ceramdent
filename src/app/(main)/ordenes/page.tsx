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
    'Ingresado': 'text-slate-400 bg-slate-100 border-slate-200',
    'En Diseño': 'text-blue-600 bg-blue-50 border-blue-100',
    'En Proceso': 'text-amber-600 bg-amber-50 border-amber-100',
    'Listo para Entrega': 'text-emerald-600 bg-emerald-50 border-emerald-100',
    'Entregado': 'text-ceramdent-blue bg-ceramdent-blue/5 border-ceramdent-blue/10'
}

export default function OrdenesPage() {
    const { ordenes, loading } = useOrdenes()
    const [query, setQuery] = useState('')

    const filtered = ordenes.filter(o =>
        o.codigo_rastreo.toLowerCase().includes(query.toLowerCase()) ||
        o.paciente.toLowerCase().includes(query.toLowerCase()) ||
        o.cliente?.doctor_responsable.toLowerCase().includes(query.toLowerCase())
    )

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
    )

    return (
        <div className="space-y-8 pb-10 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-black text-slate-800 tracking-tight">Órdenes de Trabajo</h1>
                    <p className="text-slate-500 mt-2 text-lg font-medium italic">Gestión y seguimiento de producción.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300 group-focus-within:text-ceramdent-blue transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar orden o paciente..."
                            className="bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-ceramdent-blue/20 w-full transition-all shadow-sm"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/20 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table w-full border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="text-slate-400 font-bold uppercase tracking-widest text-[10px] py-6 px-8 border-none">Orden / Paciente</th>
                                <th className="text-slate-400 font-bold uppercase tracking-widest text-[10px] py-6 px-8 border-none">Cliente & Servicio</th>
                                <th className="text-slate-400 font-bold uppercase tracking-widest text-[10px] py-6 px-8 border-none">Estado</th>
                                <th className="text-slate-400 font-bold uppercase tracking-widest text-[10px] py-6 px-8 border-none text-right">Finanzas</th>
                                <th className="text-slate-400 font-bold uppercase tracking-widest text-[10px] py-6 px-8 border-none"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.map(orden => (
                                <tr key={orden.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="py-6 px-8">
                                        <div>
                                            <div className="font-mono text-[9px] font-black text-ceramdent-blue tracking-widest uppercase mb-1">{orden.codigo_rastreo}</div>
                                            <div className="font-extrabold text-slate-800 text-lg tracking-tight">{orden.paciente}</div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase mt-1 flex items-center gap-1.5">
                                                <Clock className="w-3 h-3" />
                                                Entrega: {new Date(orden.fecha_entrega).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-8">
                                        <div className="space-y-1.5">
                                            <div className="text-sm font-extrabold text-slate-700 flex items-center gap-2">
                                                <User className="w-3.5 h-3.5 text-ceramdent-fucsia" />
                                                {orden.cliente?.doctor_responsable || 'N/A'}
                                            </div>
                                            <div className="text-[11px] font-bold text-slate-400 flex items-center gap-2 uppercase tracking-wide">
                                                <Package className="w-3.5 h-3.5" />
                                                {orden.servicio?.nombre_servicio || 'Personalizado'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-8">
                                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${STATUS_COLORS[orden.estado] || STATUS_COLORS['Ingresado']}`}>
                                            {orden.estado}
                                        </span>
                                    </td>
                                    <td className="py-6 px-8 text-right">
                                        <div className="font-black text-slate-800 text-xl font-mono tracking-tighter">${orden.monto_total.toLocaleString()}</div>
                                        {orden.saldo_pendiente > 0 ? (
                                            <div className="text-[10px] font-bold text-ceramdent-fucsia uppercase tracking-widest mt-1">Saldo: ${orden.saldo_pendiente.toLocaleString()}</div>
                                        ) : (
                                            <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Pagado</div>
                                        )}
                                    </td>
                                    <td className="py-6 px-8 text-right">
                                        <button className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200 transition-all">
                                            Detalle
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filtered.length === 0 && (
                    <div className="p-24 text-center flex flex-col items-center justify-center bg-slate-50/20">
                        <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                            <ClipboardList className="w-10 h-10 text-slate-200" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-400">No se encontraron órdenes</h3>
                        <p className="text-slate-300 mt-2 font-medium">Intenta con otros términos de búsqueda.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
