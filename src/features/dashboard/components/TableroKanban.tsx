'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/shared/lib/supabase'
import { isValidStatusTransition } from '@/features/ordenes/utils/calculos'
import { CobrarModal } from '@/features/finanzas/components/CobrarModal'
import { UserCircle, Banknote, ArrowRightCircle } from 'lucide-react'

type Orden = {
    id: string
    codigo_rastreo: string
    descripcion: string
    estado: string
    fecha_entrega: string
    monto_total: number
    saldo_pendiente: number
    clinica: { nombre: string } | null
}

const COLUMNS = ['Ingresado', 'En Diseño', 'En Proceso', 'Listo para Entrega', 'Entregado']

export function TableroKanban() {
    const [ordenes, setOrdenes] = useState<Orden[]>([])
    const [selectedOrder, setSelectedOrder] = useState<Orden | null>(null)
    const supabase = createClient()

    const fetchOrdenes = async () => {
        const { data } = await supabase
            .from('ordenes_trabajo')
            .select(`
        id, codigo_rastreo, descripcion, estado, fecha_entrega, monto_total, saldo_pendiente,
        clinicas ( nombre )
      `)
            .order('created_at', { ascending: false })

        if (data) {
            const mapped = data.map((o: any) => ({
                ...o,
                clinica: o.clinicas
            }))
            setOrdenes(mapped)
        }
    }

    useEffect(() => {
        fetchOrdenes()

        const channel = supabase
            .channel('kanban_updates')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'ordenes_trabajo' }, fetchOrdenes)
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const moveOrder = async (id: string, currentStatus: string, newStatus: string) => {
        if (!isValidStatusTransition(currentStatus, newStatus)) {
            alert('No se puede entregar una orden sin estar lista.')
            return
        }

        const { error } = await supabase
            .from('ordenes_trabajo')
            .update({ estado: newStatus })
            .eq('id', id)

        if (error) {
            console.error('Error updating status:', error)
            alert('Error al actualizar estado')
        }
    }

    return (
        <>
            {/* 
        Responsive Container 
        Mobile: Snap horizontal scroll (App-like feel)
        Desktop: Grid layout
      */}
            <div className="
        flex flex-row 
        gap-6 
        overflow-x-auto 
        snap-x snap-mandatory 
        pb-8 
        min-h-[600px]
        md:grid md:grid-cols-5 md:overflow-visible
      ">
                {COLUMNS.map(column => (
                    <div key={column} className="
            flex-none 
            w-[85vw] md:w-auto 
            snap-center 
            glass-panel
            rounded-2xl 
            p-4 
            flex flex-col 
            shadow-sm
            h-full
          ">

                        {/* Column Header */}
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200/50">
                            <h3 className={`font-bold text-sm tracking-wide ${column === 'Listo para Entrega' ? 'text-emerald-600' : 'text-slate-600'
                                }`}>{column}</h3>
                            <span className="
                px-2.5 py-0.5 
                rounded-full 
                bg-white/60 
                text-xs font-bold text-slate-500 
                shadow-sm border border-white/50
              ">
                                {ordenes.filter(o => o.estado === column).length}
                            </span>
                        </div>

                        {/* Orders List */}
                        <div className="flex-1 space-y-3 overflow-y-auto pr-1 max-h-[600px] md:max-h-none scrollbar-hide">
                            {ordenes.filter(o => o.estado === column).map(orden => (
                                <div key={orden.id} className="
                  relative 
                  bg-white/80 hover:bg-white 
                  backdrop-blur-sm 
                  border border-white/60 
                  hover:border-[#E30052]/30
                  p-4 rounded-xl 
                  shadow-sm hover:shadow-md hover:shadow-[#E30052]/5
                  transition-all duration-300 ease-out 
                  group
                  cursor-default
                ">

                                    {/* Card Top: ID & Balance */}
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="font-mono text-[10px] font-bold text-slate-400 tracking-wider">
                                            {orden.codigo_rastreo}
                                        </span>
                                        {orden.saldo_pendiente > 0 ? (
                                            <span className="text-[10px] font-bold text-[#E30052] bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">
                                                -${orden.saldo_pendiente}
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                                                Pagado
                                            </span>
                                        )}
                                    </div>

                                    {/* Clinic Info */}
                                    <div className="flex items-center gap-2 mb-2 text-slate-700">
                                        <UserCircle className="w-4 h-4 text-slate-400" />
                                        {/* @ts-ignore */}
                                        <span className="text-sm font-semibold truncate">{orden.clinica?.nombre || 'Clínica desconocida'}</span>
                                    </div>

                                    {/* Description */}
                                    <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                                        {orden.descripcion}
                                    </p>

                                    {/* Footer: Date & Actions */}
                                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                        <span className="text-[10px] text-slate-400 font-medium bg-slate-50/50 px-2 py-1 rounded-md">
                                            {new Date(orden.fecha_entrega).toLocaleDateString()}
                                        </span>

                                        <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            {/* Action: Cobrar */}
                                            {orden.saldo_pendiente > 0 && (
                                                <button
                                                    className="bg-[#E30052]/5 hover:bg-[#E30052]/10 text-[#E30052] p-1.5 rounded-full transition-colors"
                                                    title="Registrar Pago"
                                                    onClick={() => setSelectedOrder(orden)}
                                                >
                                                    <Banknote className="w-3.5 h-3.5" />
                                                </button>
                                            )}

                                            {/* Action: Move Next */}
                                            {column !== 'Entregado' && (
                                                <button
                                                    className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-1.5 rounded-full transition-colors"
                                                    title="Avanzar Estado"
                                                    onClick={() => {
                                                        const nextIdx = COLUMNS.indexOf(column) + 1
                                                        if (nextIdx < COLUMNS.length) moveOrder(orden.id, column, COLUMNS[nextIdx])
                                                    }}
                                                >
                                                    <ArrowRightCircle className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {selectedOrder && (
                <CobrarModal
                    ordenId={selectedOrder.id}
                    saldoPendiente={selectedOrder.saldo_pendiente}
                    onClose={() => setSelectedOrder(null)}
                />
            )}
        </>
    )
}
