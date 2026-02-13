'use client'

import { useState } from 'react'
import { useServicios } from '@/features/catalogo/hooks/useServicios'
import {
    Search,
    Tag,
    MoreHorizontal,
    Box,
    DollarSign,
    Layers
} from 'lucide-react'
import { ImportData } from '@/features/automation/components/ImportData'

export default function CatalogoPage() {
    const { servicios, loading, refetch } = useServicios()
    const [query, setQuery] = useState('')

    const filtered = servicios.filter(s =>
        s.nombre.toLowerCase().includes(query.toLowerCase()) ||
        s.categoria?.toLowerCase().includes(query.toLowerCase())
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
                    <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">Catálogo</h1>
                    <p className="text-white/50 mt-2 text-lg">Servicios y lista de precios oficial.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-ceramdent-blue transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar servicio..."
                            className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-ceramdent-blue/30 w-full md:w-64 transition-all"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3">
                    <div className="glass-panel rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
                        <div className="overflow-x-auto overflow-y-auto max-h-[700px] scrollbar-hide">
                            <table className="table w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/[0.02]">
                                        <th className="bg-transparent text-white/40 font-bold uppercase tracking-widest text-[10px] py-6 px-8">Servicio</th>
                                        <th className="bg-transparent text-white/40 font-bold uppercase tracking-widest text-[10px] py-6 px-8">Categoría</th>
                                        <th className="bg-transparent text-white/40 font-bold uppercase tracking-widest text-[10px] py-6 px-8 text-right">Precio Base</th>
                                        <th className="bg-transparent text-white/40 font-bold uppercase tracking-widest text-[10px] py-6 px-8"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filtered.map(servicio => (
                                        <tr key={servicio.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="py-6 px-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-ceramdent-fucsia/10 group-hover:border-ceramdent-fucsia/20 transition-all">
                                                        <Box className="w-6 h-6 text-white/30 group-hover:text-ceramdent-fucsia" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white text-base">{servicio.nombre}</div>
                                                        <div className="text-[10px] text-white/20 font-bold uppercase tracking-tighter mt-1">ID: {servicio.id.slice(0, 8)}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6 px-8">
                                                <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10 w-fit">
                                                    <Layers className="w-3 h-3 text-white/40" />
                                                    <span className="text-xs font-semibold text-white/60">{servicio.categoria || 'Sin categoría'}</span>
                                                </div>
                                            </td>
                                            <td className="py-6 px-8 text-right">
                                                <div className="text-lg font-mono font-bold text-white">
                                                    ${servicio.precio.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </div>
                                                <div className="text-[10px] uppercase font-bold text-white/20 mt-1">Sugerido</div>
                                            </td>
                                            <td className="py-6 px-8 text-right">
                                                <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/30 hover:text-white transition-all">
                                                    <MoreHorizontal className="w-5 h-5" />
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
                                    <Tag className="w-10 h-10 text-white/10" />
                                </div>
                                <h3 className="text-xl font-bold text-white/40">No se encontraron servicios</h3>
                                <p className="text-white/20 mt-2">Intenta con otros términos de búsqueda.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <ImportData table="servicios" onComplete={refetch} />
                </div>
            </div>
        </div>
    )
}
