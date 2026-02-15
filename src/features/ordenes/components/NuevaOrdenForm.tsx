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

    const [serviceQuery, setServiceQuery] = useState('')
    const [selectedServiceId, setSelectedServiceId] = useState('')
    const [showServiceResults, setShowServiceResults] = useState(false)

    const [piezas, setPiezas] = useState(1)
    const [total, setTotal] = useState(0)
    const [precioUnitario, setPrecioUnitario] = useState(0)
    const [abono, setAbono] = useState(0)
    const [clinicaId, setClinicaId] = useState('')
    const [clinicaNombre, setClinicaNombre] = useState('')
    const [servicioNombre, setServicioNombre] = useState('')

    const initialState = { error: null }
    const [state, formAction] = useFormState<any, any>(createOrden, initialState)

    useEffect(() => {
        const service = servicios.find((s: any) => s.id === selectedServiceId)
        if (service) {
            setPrecioUnitario(service.precio_unitario)
            setServiceQuery(service.nombre_servicio)
            setServicioNombre(service.nombre_servicio)
        } else if (!selectedServiceId && serviceQuery) {
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

    if (loadingServicios) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
    )

    const filteredServicios = servicios.filter((s: any) =>
        s.nombre_servicio.toLowerCase().includes(serviceQuery.toLowerCase())
    ).slice(0, 5)

    const COLORES = ['A1', 'A2', 'A3', 'A3.5', 'A4', 'B1', 'B2', 'B3', 'B4', 'C1', 'C2', 'C3', 'C4', 'D2', 'D3', 'D4', 'BL1', 'BL2', 'BL3', 'BL4']

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-8">
            <form action={formAction} className="bg-white rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-xl border border-slate-200 transition-all duration-500 hover:shadow-2xl">
                {/* Decorative background element */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-ceramdent-fucsia to-ceramdent-blue"></div>

                <div className="mb-8 text-center md:text-left">
                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Nueva Orden</h2>
                    <p className="text-slate-500 mt-2 text-sm font-medium">Complete los detalles del trabajo dental.</p>
                </div>

                {state?.error && (
                    <div role="alert" className="alert alert-error mb-6 rounded-xl shadow-lg border border-red-500/20 bg-red-50 text-red-600 font-bold">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{state.error}</span>
                    </div>
                )}

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Código de Trabajo */}
                        <div className="form-control space-y-2">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                                <Hash size={14} className="text-ceramdent-blue" />
                                CÓDIGO DE TRABAJO
                            </label>
                            <input
                                type="text"
                                name="codigo_trabajo"
                                className="input w-full bg-white border-slate-200 text-slate-900 rounded-xl focus:border-ceramdent-blue transition-all placeholder:text-slate-300"
                                placeholder="Ej. 2024-001"
                                required
                            />
                        </div>

                        {/* Nombre del Paciente */}
                        <div className="form-control space-y-2">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                                <Palette size={14} className="text-ceramdent-fucsia" />
                                NOMBRE DEL PACIENTE
                            </label>
                            <input
                                type="text"
                                name="nombre_paciente"
                                className="input w-full bg-white border-slate-200 text-slate-900 rounded-xl focus:border-ceramdent-fucsia transition-all placeholder:text-slate-300"
                                placeholder="Ej. Juan Pérez"
                                required
                            />
                        </div>
                    </div>

                    {/* Sección 1: Datos Clínicos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-control space-y-2">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                                <Stethoscope className="w-4 h-4 text-ceramdent-fucsia" />
                                CLÍNICA / DOCTOR
                            </label>
                            <input type="hidden" name="clinica_id" value={clinicaId} />
                            <div className="relative z-30">
                                <ClinicaSelect onSelect={(id, name) => { setClinicaId(id); setClinicaNombre(name); }} />
                            </div>

                            {/* Agnostic New Client Details */}
                            {!clinicaId.includes('-') && clinicaNombre.length > 2 && (
                                <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 animate-in fade-in slide-in-from-top-1">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">NUEVO CLIENTE / REGISTRO</p>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            name="client_documento"
                                            placeholder="RUC / DNI"
                                            className="input input-sm bg-white border-slate-200 w-full text-slate-900 font-medium"
                                        />
                                        <input
                                            type="text"
                                            name="client_nombre_legal"
                                            placeholder="Razón Social"
                                            className="input input-sm bg-white border-slate-200 w-full text-slate-900 font-medium"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Servicio Select */}
                        <div className="form-control space-y-2">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                                <Briefcase className="w-4 h-4 text-ceramdent-blue" />
                                SERVICIO
                            </label>
                            <input type="hidden" name="servicio_id" value={selectedServiceId || serviceQuery} />
                            <div className="relative">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Buscar o escribir nuevo..."
                                        className="input w-full bg-white border-slate-200 text-slate-900 rounded-xl pr-10 focus:border-ceramdent-blue transition-all placeholder:text-slate-300"
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
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                </div>

                                {showServiceResults && (serviceQuery.length > 0 || filteredServicios.length > 0) && (
                                    <ul className="absolute z-20 menu p-2 shadow-2xl bg-white border border-slate-200 rounded-xl w-full mt-2 max-h-60 overflow-y-auto overflow-x-hidden">
                                        {filteredServicios.map((s: any) => (
                                            <li key={s.id}>
                                                <button
                                                    type="button"
                                                    className="text-slate-700 hover:bg-slate-50 flex justify-between items-center py-3"
                                                    onClick={() => {
                                                        setServiceQuery(s.nombre_servicio)
                                                        setSelectedServiceId(s.id)
                                                        setServicioNombre(s.nombre_servicio)
                                                        setPrecioUnitario(s.precio_unitario)
                                                        setShowServiceResults(false)
                                                    }}
                                                >
                                                    <span className="font-bold">{s.nombre_servicio}</span>
                                                    <span className="text-xs font-bold text-ceramdent-blue">S/ {s.precio_unitario}</span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sección 2: Especificaciones */}
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-sm">
                        <div className="form-control space-y-2">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                                <Hash className="w-4 h-4 text-slate-500" />
                                CANTIDAD PIEZAS
                            </label>
                            <input
                                type="number"
                                name="piezas"
                                className="input w-full bg-white border-slate-200 text-slate-900 rounded-xl font-bold"
                                min="1"
                                value={piezas}
                                onChange={(e) => setPiezas(parseInt(e.target.value) || 1)}
                                required
                            />
                        </div>

                        <div className="form-control space-y-2">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                                <Palette className="w-4 h-4 text-slate-500" />
                                COLOR DE PIEZA
                            </label>
                            <select
                                name="color"
                                className="select w-full bg-white border-slate-200 text-slate-900 rounded-xl font-bold"
                            >
                                <option value="" className="bg-white text-slate-900">N/A</option>
                                {COLORES.map(c => <option key={c} value={c} className="bg-white text-slate-900 font-medium">{c}</option>)}
                            </select>
                        </div>

                        <div className="form-control space-y-2">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                                <Calendar className="w-4 h-4 text-slate-500" />
                                FECHA ENTREGA
                            </label>
                            <input
                                type="date"
                                name="fecha_entrega"
                                className="input w-full bg-white border-slate-200 text-slate-900 rounded-xl font-bold"
                                required
                            />
                        </div>
                    </div>

                    {/* Descripción */}
                    <div className="form-control space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                            <FileText className="w-4 h-4 text-slate-500" />
                            NOTAS / INSTRUCCIONES
                        </label>
                        <textarea
                            name="descripcion"
                            className="textarea w-full h-32 bg-white border-slate-200 text-slate-900 rounded-xl resize-none font-medium p-4 focus:border-slate-400 transition-all placeholder:text-slate-300"
                            placeholder="Especificaciones adicionales del doctor..."
                        ></textarea>
                    </div>

                    {/* Finanzas Panel */}
                    <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8 border-b border-slate-200 pb-4">Detalle Financiero</h3>

                        <input type="hidden" name="clinica_nombre" value={clinicaNombre} />
                        <input type="hidden" name="servicio_nombre" value={servicioNombre} />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                            <div className="space-y-6">
                                <div className="form-control space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <DollarSign className="w-3 h-3 text-ceramdent-blue" />
                                        PRECIO DEL SERVICIO (MANUAL)
                                    </label>
                                    <input
                                        type="number"
                                        name="precio"
                                        className="input w-full h-14 bg-white border-slate-200 text-slate-900 rounded-2xl focus:border-ceramdent-blue text-lg font-bold shadow-sm"
                                        value={precioUnitario}
                                        onChange={(e) => setPrecioUnitario(parseFloat(e.target.value) || 0)}
                                        step="0.01"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="form-control space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                            CUOTAS
                                        </label>
                                        <input
                                            type="number"
                                            name="cuotas"
                                            className="input w-full bg-white border-slate-200 text-slate-900 rounded-xl font-bold"
                                            placeholder="1"
                                            min="1"
                                            defaultValue="1"
                                        />
                                    </div>
                                    <div className="form-control space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                            TIPO PAGO
                                        </label>
                                        <select name="metodo_pago" className="select w-full bg-white border-slate-200 text-slate-900 rounded-xl font-bold">
                                            <option value="Efectivo">Efectivo</option>
                                            <option value="Transferencia">Transferencia</option>
                                            <option value="Tarjeta">Tarjeta</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-control space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <DollarSign className="w-3 h-3 text-ceramdent-blue" />
                                        ABONO INICIAL
                                    </label>
                                    <input
                                        type="number"
                                        name="abono"
                                        className="input w-full bg-white border-slate-200 text-slate-900 rounded-xl font-bold"
                                        placeholder="0.00"
                                        step="0.01"
                                        value={abono}
                                        onChange={(e) => setAbono(parseFloat(e.target.value) || 0)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex flex-col items-end justify-center p-8 bg-white rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-2 h-full bg-slate-100"></div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">TOTAL A COBRAR</span>
                                    <span className="text-4xl font-black text-slate-900 tracking-tighter mt-1">
                                        S/ {total.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex flex-col items-end justify-center p-8 bg-ceramdent-fucsia/5 rounded-3xl border border-ceramdent-fucsia/10 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-2 h-full bg-ceramdent-fucsia/20"></div>
                                    <span className="text-[10px] font-bold text-ceramdent-fucsia/60 uppercase tracking-widest">SALDO PENDIENTE</span>
                                    <span className="text-5xl font-black text-ceramdent-fucsia tracking-tighter mt-1">
                                        S/ {(total - abono).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Acción */}
                    <div className="pt-6">
                        <button
                            type="submit"
                            className="
                            w-full 
                            btn btn-lg 
                            h-20
                            bg-[#E30052] hover:bg-[#c90048] border-none 
                            text-white font-black text-xl 
                            rounded-[1.5rem] 
                            shadow-2xl shadow-[#E30052]/40 hover:shadow-[#E30052]/50 
                            hover:scale-[1.02] active:scale-[0.98] 
                            transition-all duration-300
                            flex items-center justify-center gap-3
                          "
                        >
                            <Save className="w-6 h-6" />
                            GUARDAR TRABAJO NUEVO
                        </button>
                    </div>
                </div>
            </form>

            {showServiceResults && (
                <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowServiceResults(false)}
                />
            )}
        </div>
    )
}
