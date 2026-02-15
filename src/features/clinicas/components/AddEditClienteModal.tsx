'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/shared/lib/supabase'
import { Plus, Save, X, User, Phone, Mail, Building2 } from 'lucide-react'

interface Cliente {
    id?: string
    nombre_doctor: string
    nombre_clinica: string
    telefono?: string | null
}

interface Props {
    cliente?: Cliente
    onClose: () => void
    onSuccess: () => void
}

export function AddEditClienteModal({ cliente, onClose, onSuccess }: Props) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<Cliente>({
        nombre_doctor: '',
        nombre_clinica: '',
        telefono: ''
    })

    useEffect(() => {
        if (cliente) {
            setFormData(cliente)
        }
    }, [cliente])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const supabase = createClient()

        try {
            if (formData.id) {
                // Update
                const { error } = await supabase
                    .from('clientes')
                    .update({
                        nombre_doctor: formData.nombre_doctor,
                        nombre_clinica: formData.nombre_clinica,
                        telefono: formData.telefono
                    })
                    .eq('id', formData.id)
                if (error) throw error
            } else {
                // Create
                const { error } = await supabase
                    .from('clientes')
                    .insert([formData])
                if (error) throw error
            }
            onSuccess()
            onClose()
        } catch (error: any) {
            alert('Error al guardar: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-[2rem] p-8 border border-slate-200 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ceramdent-fucsia to-ceramdent-blue"></div>

                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
                        {formData.id ? 'Editar Cliente' : 'Nuevo Cliente'}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-slate-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="form-control space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <User className="w-3 h-3 text-ceramdent-fucsia" />
                            Nombre del Doctor *
                        </label>
                        <input
                            type="text"
                            required
                            className="input w-full bg-white border-slate-200 text-slate-900 rounded-xl focus:border-ceramdent-fucsia"
                            value={formData.nombre_doctor}
                            onChange={(e) => setFormData({ ...formData, nombre_doctor: e.target.value })}
                            placeholder="Ej. Dr. Armando Torres"
                        />
                    </div>

                    <div className="form-control space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Building2 className="w-3 h-3 text-slate-300" />
                            Nombre de Clínica
                        </label>
                        <input
                            type="text"
                            required
                            className="input w-full bg-white border-slate-200 text-slate-900 rounded-xl focus:border-ceramdent-blue"
                            value={formData.nombre_clinica}
                            onChange={(e) => setFormData({ ...formData, nombre_clinica: e.target.value })}
                            placeholder="Ej. Dental Perfect"
                        />
                    </div>

                    <div className="form-control space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Phone className="w-3 h-3 text-slate-300" />
                            Teléfono
                        </label>
                        <input
                            type="text"
                            className="input w-full bg-white border-slate-200 text-slate-900 rounded-xl focus:border-ceramdent-blue"
                            value={formData.telefono || ''}
                            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                            placeholder="555-0000"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn btn-lg bg-ceramdent-fucsia hover:bg-[#c90048] border-none text-white font-bold rounded-2xl shadow-lg shadow-ceramdent-fucsia/20 transition-all flex items-center gap-2"
                        >
                            {loading ? <span className="loading loading-spinner"></span> : <Save className="w-5 h-5" />}
                            {formData.id ? 'Guardar Cambios' : 'Registrar Cliente'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
