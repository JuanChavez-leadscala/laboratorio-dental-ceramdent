'use client'

import { useState } from 'react'
import { useServicios, Servicio } from '@/features/catalogo/hooks/useServicios'
import { ImportData } from '@/features/automation/components/ImportData'
import { ExportButton } from '@/features/automation/components/ExportButton'
import { AddEditServicioModal } from '@/features/catalogo/components/AddEditServicioModal'
import {
    Search,
    Briefcase,
    Tag,
    DollarSign,
    Plus,
    Edit2
} from 'lucide-react'

export default function CatalogoPage() {
    const { servicios, loading, refetch } = useServicios()
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedServicio, setSelectedServicio] = useState<Servicio | undefined>()
    const [showModal, setShowModal] = useState(false)

    const filtered = servicios.filter(s =>
        s.nombre_servicio.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
    )

    return (
        <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Catálogo de Servicios</h1>
                    <p className="text-slate-500 mt-1 font-medium italic">Lista maestra de trabajos y precios base.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            setSelectedServicio(undefined)
                            setShowModal(true)
                        }}
                        className="btn h-12 px-6 bg-ceramdent-blue hover:bg-ceramdent-blue/80 border-none text-white gap-2 rounded-2xl shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]"
                    >
                        <Plus className="w-5 h-5" />
                        <span className="font-bold">Añadir Nuevo</span>
                    </button>
                    <ImportData table="catalogo_servicios" onComplete={refetch} />
                    <ExportButton table="catalogo_servicios" buttonText="Exportar" />
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Search & Stats */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Buscar servicio..."
                                className="input w-full pl-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:border-slate-300 placeholder:text-slate-300 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                            <div className="flex justify-between items-center px-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Servicios</span>
                                <span className="text-slate-800 font-extrabold text-lg">{servicios.length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="table w-full border-separate border-spacing-0">
                                <thead>
                                    <tr className="bg-slate-50/50 text-slate-500 border-none">
                                        <th className="py-6 px-6 font-bold uppercase tracking-widest text-[10px] text-slate-400">Trabajo / Servicio</th>
                                        <th className="py-6 px-6 font-bold uppercase tracking-widest text-[10px] text-right text-slate-400">Precio Base</th>
                                        <th className="py-6 px-6 font-bold uppercase tracking-widest text-[10px] text-center text-slate-400">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((servicio) => (
                                        <tr key={servicio.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-none group">
                                            <td className="py-6 px-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-ceramdent-blue/10 to-purple-500/10 border border-slate-100 flex items-center justify-center text-ceramdent-blue group-hover:scale-110 transition-transform">
                                                        <Briefcase className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <div className="font-extrabold text-slate-800 text-lg tracking-tight">{servicio.nombre_servicio}</div>
                                                        <div className="text-sm font-bold text-slate-400 flex items-center gap-1.5 mt-0.5">
                                                            <Tag className="w-3.5 h-3.5" />
                                                            Catálogo Base
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6 px-6 text-right">
                                                <div className="flex flex-col items-end">
                                                    <span className="text-2xl font-black text-slate-900 tracking-tighter">
                                                        S/ {servicio.precio_unitario.toFixed(2)}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1 italic">PRECIO UNITARIO</span>
                                                </div>
                                            </td>
                                            <td className="py-6 px-6 text-center">
                                                <button
                                                    onClick={() => {
                                                        setSelectedServicio(servicio)
                                                        setShowModal(true)
                                                    }}
                                                    className="btn btn-ghost btn-circle text-slate-300 hover:text-ceramdent-blue hover:bg-ceramdent-blue/5 transition-all"
                                                >
                                                    <Edit2 className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {filtered.length === 0 && (
                            <div className="p-20 text-center flex flex-col items-center justify-center bg-slate-50/30">
                                <div className="w-24 h-24 rounded-3xl bg-white flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                                    <Tag className="w-10 h-10 text-slate-200" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-400">No se encontraron servicios</h3>
                                <p className="text-slate-300 mt-2 font-medium">Intenta con otros términos de búsqueda.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showModal && (
                <AddEditServicioModal
                    servicio={selectedServicio as any}
                    onClose={() => setShowModal(false)}
                    onSuccess={() => {
                        setShowModal(false)
                        refetch()
                    }}
                />
            )}
        </div>
    )
}
    )
}
