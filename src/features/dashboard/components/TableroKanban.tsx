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
    cliente: { doctor_responsable: string; nombre: string | null } | null
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
        cliente:clinicas ( doctor_responsable, nombre )
      `)
            .order('created_at', { ascending: false })

        if (data) {
            setOrdenes(data as any)
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
            bg-slate-100/50
            rounded-3xl 
            p-5 
            flex flex-col 
            border border-slate-200
            h-full
          ">

                        {/* Column Header */}
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
                            <h3 className={`font-bold text-[10px] uppercase tracking-widest ${column === 'Listo para Entrega' ? 'text-emerald-600' : 'text-slate-500'
                                }`}>{column}</h3>
                            <span className="
                px-2.5 py-1
                rounded-lg 
                bg-white 
                text-[10px] font-bold text-slate-400 
                border border-slate-200
              ">
                                {ordenes.filter(o => o.estado === column).length}
                            </span>
                        </div>

                        {/* Orders List */}
                        <div className="flex-1 space-y-4 overflow-y-auto pr-1 max-h-[600px] md:max-h-none scrollbar-hide">
                            {ordenes.filter(o => o.estado === column).map(orden => (
                                <div key={orden.id} className="
                  relative 
                  bg-white
                  border border-slate-200 
                  hover:border-ceramdent-fucsia/50
                  p-5 rounded-2xl 
                  transition-all duration-300 ease-out 
                  shadow-sm hover:shadow-md
                  group
                  cursor-default
                ">

                                    {/* Card Top: ID & Balance */}
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="font-mono text-[9px] font-bold text-slate-400 tracking-widest uppercase">
                                            {orden.codigo_rastreo}
                                        </span>
                                        {orden.saldo_pendiente > 0 ? (
                                            <span className="text-[10px] font-bold text-ceramdent-fucsia bg-ceramdent-fucsia/5 border border-ceramdent-fucsia/10 px-2 py-0.5 rounded-full">
                                                S/ {orden.saldo_pendiente}
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                                                Pagado
                                            </span>
                                        )}
                                    </div>

                                    {/* Clinic Info */}
                                    <div className="flex items-center gap-2 mb-3 text-slate-800">
                                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                                            <UserCircle className="w-4 h-4 text-slate-400" />
                                        </div>
                                        {/* @ts-ignore */}
                                        <span className="text-sm font-bold truncate tracking-tight">
                                            {orden.cliente?.doctor_responsable || 'Doctor desconocido'}
                                            {orden.cliente?.nombre ? ` (${orden.cliente.nombre})` : ''}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <p className="text-xs text-slate-500 mb-5 line-clamp-2 leading-relaxed">
                                        {orden.descripcion}
                                    </p>

                                    {/* Footer: Date & Actions */}
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                                            {new Date(orden.fecha_entrega).toLocaleDateString()}
                                        </span>

                                        <div className="flex gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            {/* Action: Cobrar */}
                                            {orden.saldo_pendiente > 0 && (
                                                <button
                                                    className="bg-ceramdent-fucsia/10 hover:bg-ceramdent-fucsia/20 text-ceramdent-fucsia p-1.5 rounded-lg border border-ceramdent-fucsia/20 transition-all glow-fucsia"
                                                    title="Registrar Pago"
                                                    onClick={() => setSelectedOrder(orden)}
                                                >
                                                    <Banknote className="w-3.5 h-3.5" />
                                                </button>
                                            )}

                                            {/* Action: Move Next */}
                                            {column !== 'Entregado' && (
                                                <button
                                                    className="bg-ceramdent-blue/10 hover:bg-ceramdent-blue/20 text-ceramdent-blue p-1.5 rounded-lg border border-ceramdent-blue/20 transition-all glow-blue"
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
