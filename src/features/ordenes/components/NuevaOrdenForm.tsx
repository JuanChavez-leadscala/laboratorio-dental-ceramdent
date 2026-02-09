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
                    <h2 className="text-3xl font-bold text-white tracking-tight">Nueva Orden</h2>
                    <p className="text-white/50 mt-2">Complete los detalles del trabajo dental.</p>
                </div>

                {state?.error && (
                    <div role="alert" className="alert alert-error mb-6 rounded-xl shadow-lg border border-red-500/20 bg-red-500/10 text-red-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{state.error}</span>
                    </div>
                )}

                <div className="space-y-6">
                    {/* Sección 0: Datos del Paciente */}
                    <div className="form-control space-y-2">
                        <label className="text-sm font-semibold text-white/70 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                            <Palette size={14} className="text-ceramdent-fucsia" />
                            Nombre del Paciente
                        </label>
                        <input
                            type="text"
                            name="nombre_paciente"
                            className="input w-full glass-input rounded-xl border-white/5 bg-white/5 text-white placeholder:text-white/20"
                            placeholder="Ej. Juan Pérez"
                            required
                        />
                    </div>

                    {/* Sección 1: Datos Clínicos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Clínica Select */}
                        <div className="form-control space-y-2">
                            <label className="text-sm font-semibold text-white/70 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                                <Stethoscope className="w-4 h-4 text-ceramdent-fucsia" />
                                Clínica / Doctor
                            </label>
                            <input type="hidden" name="clinica_id" value={clinicaId} required />
                            <div className="relative z-20">
                                <ClinicaSelect onSelect={setClinicaId} />
                            </div>
                        </div>

                        {/* Servicio Select */}
                        <div className="form-control space-y-2">
                            <label className="text-sm font-semibold text-white/70 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                                <Briefcase className="w-4 h-4 text-ceramdent-blue" />
                                Servicio
                            </label>
                            <div className="relative">
                                <select
                                    name="servicio_id"
                                    className="select w-full glass-input rounded-xl border-white/5 bg-white/5 text-white"
                                    value={selectedServiceId}
                                    onChange={(e) => setSelectedServiceId(e.target.value)}
                                    required
                                >
                                    <option value="" className="bg-ceramdent-navy">Seleccione un servicio...</option>
                                    {servicios.map(s => (
                                        <option key={s.id} value={s.id} className="bg-ceramdent-navy">
                                            {s.nombre_servicio} - ${s.precio_unitario}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Sección 2: Especificaciones */}
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Piezas */}
                        <div className="form-control space-y-2">
                            <label className="text-sm font-semibold text-white/70 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                                <Hash className="w-4 h-4 text-white/30" />
                                Piezas
                            </label>
                            <input
                                type="number"
                                name="piezas"
                                className="input w-full glass-input rounded-xl border-white/5 bg-white/5 text-white"
                                min="1"
                                value={piezas}
                                onChange={(e) => setPiezas(parseInt(e.target.value) || 1)}
                                required
                            />
                        </div>

                        {/* Color */}
                        <div className="form-control space-y-2">
                            <label className="text-sm font-semibold text-white/70 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                                <Palette className="w-4 h-4 text-white/30" />
                                Color
                            </label>
                            <select
                                name="color"
                                className="select w-full glass-input rounded-xl border-white/5 bg-white/5 text-white"
                            >
                                <option value="" className="bg-ceramdent-navy">N/A</option>
                                {COLORS.map(c => <option key={c} value={c} className="bg-ceramdent-navy">{c}</option>)}
                            </select>
                        </div>

                        {/* Fecha Entrega */}
                        <div className="form-control space-y-2">
                            <label className="text-sm font-semibold text-white/70 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                                <Calendar className="w-4 h-4 text-white/30" />
                                Entrega
                            </label>
                            <input
                                type="date"
                                name="fecha_entrega"
                                className="input w-full glass-input rounded-xl border-white/5 bg-white/5 text-white"
                                required
                            />
                        </div>
                    </div>

                    {/* Descripción */}
                    <div className="form-control space-y-2">
                        <label className="text-sm font-semibold text-white/70 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                            <FileText className="w-4 h-4 text-white/30" />
                            Notas / Instrucciones
                        </label>
                        <textarea
                            name="descripcion"
                            className="textarea w-full h-32 glass-input rounded-xl border-white/5 bg-white/5 text-white placeholder:text-white/20 resize-none"
                            placeholder="Especificaciones adicionales del doctor..."
                        ></textarea>
                    </div>

                    {/* Finanzas Panel */}
                    <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                        <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-6 border-b border-white/5 pb-3">Detalle Financiero</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                            <div className="space-y-4">
                                <div className="form-control space-y-2">
                                    <label className="text-xs font-semibold text-white/40 uppercase tracking-widest flex items-center gap-2">
                                        <DollarSign className="w-3 h-3 text-ceramdent-blue" />
                                        Abono Inicial
                                    </label>
                                    <input
                                        type="number"
                                        name="abono"
                                        className="input w-full glass-input rounded-xl border-white/5 bg-white/5 text-white"
                                        placeholder="0.00"
                                        step="0.01"
                                    />
                                </div>
                                <div className="form-control space-y-2">
                                    <label className="text-xs font-semibold text-white/40 uppercase tracking-widest flex items-center gap-2">
                                        <CreditCard className="w-3 h-3 text-ceramdent-blue" />
                                        Método de Pago
                                    </label>
                                    <select name="metodo_pago" className="select w-full glass-input rounded-xl border-white/5 bg-white/5 text-white" defaultValue="Efectivo">
                                        <option value="Efectivo" className="bg-ceramdent-navy">Efectivo</option>
                                        <option value="Transferencia" className="bg-ceramdent-navy">Transferencia</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col items-end justify-center h-full p-6 bg-white/[0.03] rounded-2xl border border-white/5 shadow-inner">
                                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Total Estimado</span>
                                <span className="text-4xl font-extrabold text-ceramdent-fucsia tracking-tighter mt-1">
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
