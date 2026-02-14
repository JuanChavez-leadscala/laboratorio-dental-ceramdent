'use client'

import { useState, useEffect } from 'react'
import { useFormState } from 'react-dom'
import { ClinicaSelect } from '@/features/clinicas/components/ClinicaSelect'
import { useServicios } from '@/features/catalogo/hooks/useServicios'
import { useColores } from '@/features/catalogo/hooks/useColores'
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
    Briefcase,
    ChevronDown
} from 'lucide-react'

export function NuevaOrdenForm() {
    const { servicios, loading: loadingServicios } = useServicios()
    const { colores, loading: loadingColores } = useColores()

    const [serviceQuery, setServiceQuery] = useState('')
    const [selectedServiceId, setSelectedServiceId] = useState('')
    const [showServiceResults, setShowServiceResults] = useState(false)

    const [piezas, setPiezas] = useState(1)
    const [total, setTotal] = useState(0)
    const [precioUnitario, setPrecioUnitario] = useState(0)
    const [abono, setAbono] = useState(0)
    const [clinicaId, setClinicaId] = useState('')
    const [clinicaNombre, setClinicaNombre] = useState('') // New state for clinica_nombre
    const [servicioNombre, setServicioNombre] = useState('') // New state for servicio_nombre

    const initialState = { error: null }
    const [state, formAction] = useFormState<any, any>(createOrden, initialState)

    useEffect(() => {
        const service = servicios.find((s: any) => s.id === selectedServiceId)
        if (service) {
            setPrecioUnitario(service.precio_unitario)
            setServiceQuery(service.nombre_servicio)
            setServicioNombre(service.nombre_servicio)
        } else if (!selectedServiceId && serviceQuery) {
            // Check if serviceQuery matches a name exactly
            const match = servicios.find((s: any) => s.nombre_servicio.toLowerCase() === serviceQuery.toLowerCase())
            if (match) {
                setSelectedServiceId(match.id)
                setPrecioUnitario(match.precio_unitario)
                setServicioNombre(match.nombre_servicio)
            }
        }
    }, [selectedServiceId, serviceQuery, servicios])

    useEffect(() => {
        setTotal(piezas * precioUnitario)
    }, [piezas, precioUnitario])

    if (loadingServicios || loadingColores) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
    )

    const filteredServicios = servicios.filter((s: any) =>
        s.nombre_servicio.toLowerCase().includes(serviceQuery.toLowerCase())
    ).slice(0, 5)

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
                        {/* Clínica Select (Searchable / Free Text) */}
                        <div className="form-control space-y-2">
                            <label className="text-sm font-semibold text-white/70 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                                <Stethoscope className="w-4 h-4 text-ceramdent-fucsia" />
                                Clínica / Doctor
                            </label>
                            <input type="hidden" name="clinica_id" value={clinicaId} />
                            <div className="relative z-30">
                                <ClinicaSelect onSelect={(id, name) => { setClinicaId(id); setClinicaNombre(name); }} />
                            </div>
                        </div>

                        {/* Servicio Select (Searchable / Free Text) */}
                        <div className="form-control space-y-2">
                            <label className="text-sm font-semibold text-white/70 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                                <Briefcase className="w-4 h-4 text-ceramdent-blue" />
                                Servicio
                            </label>
                            <input type="hidden" name="servicio_id" value={selectedServiceId || serviceQuery} />
                            <div className="relative">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Buscar o escribir nuevo..."
                                        className="input w-full glass-input rounded-xl border-white/5 bg-white/5 text-white placeholder:text-white/20 pr-10"
                                        value={serviceQuery}
                                        onChange={(e) => {
                                            const val = e.target.value
                                            setServiceQuery(val)
                                            setServicioNombre(val)
                                            setSelectedServiceId('')
                                            setShowServiceResults(true)
                                        }}
                                        onFocus={() => setShowServiceResults(true)}
                                    />
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                </div>

                                {showServiceResults && (serviceQuery.length > 0 || filteredServicios.length > 0) && (
                                    <ul className="absolute z-20 menu p-2 shadow-2xl bg-ceramdent-navy border border-white/10 rounded-xl w-full mt-2 max-h-60 overflow-y-auto overflow-x-hidden">
                                        {filteredServicios.map((s: any) => (
                                            <li key={s.id}>
                                                <button
                                                    type="button"
                                                    className="text-white hover:bg-white/10 flex justify-between items-center"
                                                    onClick={() => {
                                                        setServiceQuery(s.nombre_servicio)
                                                        setSelectedServiceId(s.id)
                                                        setServicioNombre(s.nombre_servicio)
                                                        setPrecioUnitario(s.precio_unitario)
                                                        setShowServiceResults(false)
                                                    }}
                                                >
                                                    <span>{s.nombre_servicio}</span>
                                                    <span className="text-xs text-white/40">${s.precio_unitario}</span>
                                                </button>
                                            </li>
                                        ))}
                                        {serviceQuery && !servicios.find((s: any) => s.nombre_servicio.toLowerCase() === serviceQuery.toLowerCase()) && (
                                            <li>
                                                <button
                                                    type="button"
                                                    className="text-ceramdent-fucsia hover:bg-ceramdent-fucsia/10 italic text-xs"
                                                    onClick={() => setShowServiceResults(false)}
                                                >
                                                    + Crear nuevo servicio: "{serviceQuery}"
                                                </button>
                                            </li>
                                        )}
                                    </ul>
                                )}
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
                                name="color_id"
                                className="select w-full glass-input rounded-xl border-white/5 bg-white/5 text-white"
                            >
                                <option value="" className="bg-ceramdent-navy">N/A</option>
                                {colores.map(c => <option key={c.id} value={c.id} className="bg-ceramdent-navy">{c.nombre}</option>)}
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

                        {/* Hidden Inputs for Direct Insertion */}
                        <input type="hidden" name="clinica_nombre" value={clinicaNombre} />
                        <input type="hidden" name="servicio_id" value={selectedServiceId} />
                        <input type="hidden" name="servicio_nombre" value={servicioNombre} />
                        <input type="hidden" name="precio_unitario" value={precioUnitario} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                            <div className="space-y-4">
                                <div className="form-control space-y-2">
                                    <label className="text-xs font-semibold text-white/40 uppercase tracking-widest flex items-center gap-2">
                                        <DollarSign className="w-3 h-3 text-ceramdent-blue" />
                                        Precio del Servicio
                                    </label>
                                    <input
                                        type="number"
                                        className="input w-full glass-input rounded-xl border-white/5 bg-white/5 text-white"
                                        value={precioUnitario}
                                        onChange={(e) => setPrecioUnitario(parseFloat(e.target.value) || 0)}
                                        step="0.01"
                                        required
                                    />
                                </div>
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
                                        value={abono}
                                        onChange={(e) => setAbono(parseFloat(e.target.value) || 0)}
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
                                        <option value="Tarjeta" className="bg-ceramdent-navy">Tarjeta</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex flex-col items-end justify-center p-6 bg-white/[0.03] rounded-2xl border border-white/5 shadow-inner">
                                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Total Estimado</span>
                                    <span className="text-3xl font-extrabold text-white tracking-tighter mt-1">
                                        ${total.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex flex-col items-end justify-center p-6 bg-ceramdent-fucsia/5 rounded-2xl border border-ceramdent-fucsia/10 shadow-inner">
                                    <span className="text-[10px] font-bold text-ceramdent-fucsia/60 uppercase tracking-widest">Saldo Pendiente</span>
                                    <span className="text-4xl font-extrabold text-ceramdent-fucsia tracking-tighter mt-1">
                                        ${(total - abono).toFixed(2)}
                                    </span>
                                </div>
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

            {/* Click outside to close results */}
            {showServiceResults && (
                <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowServiceResults(false)}
                />
            )}
        </div>
    )
}
