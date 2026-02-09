'use client'

import { useState } from 'react'
import { registrarPago } from '@/features/finanzas/actions/pagos'
import { X, DollarSign, CreditCard, Banknote } from 'lucide-react'

interface CobrarModalProps {
    ordenId: string
    saldoPendiente: number
    onClose: () => void
}

export function CobrarModal({ ordenId, saldoPendiente, onClose }: CobrarModalProps) {
    const [monto, setMonto] = useState(saldoPendiente)
    const [metodo, setMetodo] = useState('Efectivo')
    const [loading, setLoading] = useState(false)

    const handlePago = async () => {
        setLoading(true)
        await registrarPago(ordenId, monto, metodo)
        setLoading(false)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 transition-all">
            <div className="glass-card w-full max-w-md rounded-3xl p-0 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-50 to-white px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-xl text-slate-800">Registrar Pago</h3>
                        <p className="text-slate-500 text-sm mt-1">Ingresa los detalles del cobro.</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 space-y-6 bg-white/40">

                    {/* Saldo Display */}
                    <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                        <span className="text-sm font-medium text-blue-800">Saldo Pendiente</span>
                        <span className="text-2xl font-bold text-blue-900">${saldoPendiente.toFixed(2)}</span>
                    </div>

                    {/* Monto Input */}
                    <div className="form-control space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-emerald-500" />
                            Monto a cobrar
                        </label>
                        <input
                            type="number"
                            className="input w-full bg-white border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 rounded-xl text-lg font-medium"
                            value={monto}
                            max={saldoPendiente}
                            autoFocus
                            onChange={(e) => setMonto(parseFloat(e.target.value))}
                        />
                    </div>

                    {/* Metodo Select */}
                    <div className="form-control space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-slate-400" />
                            Método de Pago
                        </label>
                        <select
                            className="select w-full bg-white border-slate-200 rounded-xl"
                            value={metodo}
                            onChange={(e) => setMetodo(e.target.value)}
                        >
                            <option value="Efectivo">Efectivo</option>
                            <option value="Transferencia">Transferencia</option>
                        </select>
                    </div>

                </div>

                {/* Footer / Actions */}
                <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex gap-4">
                    <button
                        className="flex-1 btn bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 rounded-xl"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        className="
                             flex-1 btn 
                             bg-emerald-600 hover:bg-emerald-700 border-none 
                             text-white font-bold 
                             rounded-xl 
                             shadow-lg shadow-emerald-500/20 
                             flex items-center gap-2
                        "
                        onClick={handlePago}
                        disabled={loading}
                    >
                        <Banknote className="w-4 h-4" />
                        {loading ? 'Procesando...' : 'Cobrar Ahora'}
                    </button>
                </div>
            </div>
        </div>
    )
}
