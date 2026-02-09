'use client'

import { useState, useEffect } from 'react'
import { useFormState } from 'react-dom'
import { ClinicaSelect } from '@/features/clinicas/components/ClinicaSelect'
import { useServicios } from '@/features/catalogo/hooks/useServicios'
import { createOrden } from '../actions/ordenes'
import { calculateTotal } from '../utils/calculos'
import {
    Calendar,
    FileText,
    Hash,
    Palette,
    DollarSign,
    CreditCard,
    Save,
    Stethoscope,
    Briefcase
} from 'lucide-react'

const COLORS = ['A1', 'A2', 'A3', 'A3.5', 'A4', 'B1', 'B2', 'B3', 'B4', 'C1', 'C2', 'C3', 'C4', 'D2', 'D3', 'D4', 'BL1', 'BL2', 'BL3', 'BL4']

export function NuevaOrdenForm() {
    const { servicios, loading } = useServicios()
    const [selectedServiceId, setSelectedServiceId] = useState('')
    const [piezas, setPiezas] = useState(1)
    const [total, setTotal] = useState(0)
    const [clinicaId, setClinicaId] = useState('')

    const initialState = { error: null }
    const [state, formAction] = useFormState<any, any>(createOrden, initialState)

    useEffect(() => {
        const service = servicios.find(s => s.id === selectedServiceId)
        if (service) {
            setTotal(calculateTotal(piezas, service.precio_unitario))
        } else {
            setTotal(0)
        }
    }, [selectedServiceId, piezas, servicios])

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
    )

    return (
        <div className="w-full max-w-3xl mx-auto px-4 py-8">
            <form action={formAction} className="liquid-glass rounded-[2rem] p-8 md:p-12 relative overflow-hidden transition-all duration-500 hover:shadow-2xl">
                {/* Decorative background element */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#E30052] to-blue-600"></div>

                <div className="mb-8 text-center md:text-left">
                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Nueva Orden</h2>
                    <p className="text-slate-500 mt-2">Complete los detalles del trabajo dental.</p>
                </div>

                {state?.error && (
                    <div role="alert" className="alert alert-error mb-6 rounded-xl shadow-sm border border-red-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{state.error}</span>
                    </div>
                )}

                <div className="space-y-6">

                    {/* Sección 1: Datos Clínicos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Clínica Select */}
                        <div className="form-control space-y-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <Stethoscope className="w-4 h-4 text-[#E30052]" />
                                Clínica / Doctor
                            </label>
                            <input type="hidden" name="clinica_id" value={clinicaId} required />
                            <div className="relative z-20">
                                <ClinicaSelect onSelect={setClinicaId} />
                            </div>
                        </div>

                        {/* Servicio Select */}
                        <div className="form-control space-y-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-blue-600" />
                                Servicio
                            </label>
                            <div className="relative">
                                <select
                                    name="servicio_id"
                                    className="select w-full bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all rounded-xl"
                                    value={selectedServiceId}
                                    onChange={(e) => setSelectedServiceId(e.target.value)}
                                    required
                                >
                                    <option value="">Seleccione un servicio...</option>
                                    {servicios.map(s => (
                                        <option key={s.id} value={s.id}>
                                            {s.nombre_servicio} - ${s.precio_unitario}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Sección 2: Especificaciones */}
                    <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Piezas */}
                        <div className="form-control space-y-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <Hash className="w-4 h-4 text-slate-400" />
                                Piezas
                            </label>
                            <input
                                type="number"
                                name="piezas"
                                name="piezas"
                                className="input w-full glass-input rounded-xl"
                                min="1"
                                value={piezas}
                                onChange={(e) => setPiezas(parseInt(e.target.value) || 1)}
                                required
                            />
                        </div>

                        {/* Color */}
                        <div className="form-control space-y-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <Palette className="w-4 h-4 text-slate-400" />
                                Color
                            </label>
                            <select
                                name="color"
                                className="select w-full bg-white border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl"
                            >
                                <option value="">N/A</option>
                                {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        {/* Fecha Entrega */}
                        <div className="form-control space-y-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                Entrega
                            </label>
                            <input
                                type="date"
                                name="fecha_entrega"
                                className="input w-full glass-input rounded-xl"
                                required
                            />
                        </div>
                    </div>

                    {/* Descripción */}
                    <div className="form-control space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-slate-400" />
                            Notas / Instrucciones
                        </label>
                        <textarea
                            name="descripcion"
                            className="textarea w-full h-32 bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl resize-none"
                            placeholder="Especificaciones adicionales del doctor..."
                        ></textarea>
                    </div>

                    {/* Finanzas Panel */}
                    <div className="glass-panel p-6 rounded-2xl border border-blue-100/50 bg-gradient-to-br from-blue-50/30 to-white">
                        <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wide mb-4">Detalle Financiero</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                            <div className="space-y-4">
                                <div className="form-control space-y-2">
                                    <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-2">
                                        <DollarSign className="w-3 h-3" />
                                        Abono Inicial
                                    </label>
                                    <input
                                        type="number"
                                        name="abono"
                                        className="input w-full bg-white border-slate-200 focus:border-[#E30052] focus:ring-2 focus:ring-[#E30052]/20 rounded-xl"
                                        placeholder="0.00"
                                        step="0.01"
                                    />
                                </div>
                                <div className="form-control space-y-2">
                                    <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-2">
                                        <CreditCard className="w-3 h-3" />
                                        Método
                                    </label>
                                    <select name="metodo_pago" className="select w-full bg-white border-slate-200 rounded-xl" defaultValue="Efectivo">
                                        <option value="Efectivo">Efectivo</option>
                                        <option value="Transferencia">Transferencia</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col items-end justify-center h-full p-4 bg-white/60 rounded-xl border border-white/50 shadow-sm">
                                <span className="text-sm font-medium text-slate-500">Total Estimado</span>
                                <span className="text-4xl font-extrabold text-[#E30052] tracking-tighter">
                                    ${total.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Acción */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="
                            w-full 
                            btn btn-lg 
                            bg-[#E30052] hover:bg-[#c90048] border-none 
                            text-white font-bold text-lg 
                            rounded-2xl 
                            shadow-lg shadow-[#E30052]/30 hover:shadow-[#E30052]/40 
                            hover:scale-[1.01] active:scale-[0.98] 
                            transition-all
                            flex items-center gap-2
                          "
                        >
                            <Save className="w-5 h-5" />
                            Crear Orden de Trabajo
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
