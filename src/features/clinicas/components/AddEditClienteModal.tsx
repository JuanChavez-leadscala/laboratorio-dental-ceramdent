'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/shared/lib/supabase'
import { Plus, Save, X, User, Phone, Mail, Building2 } from 'lucide-react'

interface Cliente {
    id?: string
    doctor_responsable: string
    nombre: string // Clínica
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
        doctor_responsable: '',
        nombre: '',
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
                    .from('clinicas')
                    .update({
                        doctor_responsable: formData.doctor_responsable,
                        nombre: formData.nombre,
                        telefono: formData.telefono
                    })
                    .eq('id', formData.id)
                if (error) throw error
            } else {
                // Create
                const { error } = await supabase
                    .from('clinicas')
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="liquid-glass w-full max-w-md rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ceramdent-fucsia to-ceramdent-blue"></div>

                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold text-white tracking-tight">
                        {formData.id ? 'Editar Cliente' : 'Nuevo Cliente'}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all text-white/40 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="form-control space-y-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                            <User className="w-3 h-3 text-ceramdent-fucsia" />
                            Nombre del Doctor *
                        </label>
                        <input
                            type="text"
                            required
                            className="input w-full glass-input rounded-xl border-white/5 bg-white/5 text-white"
                            value={formData.doctor_responsable}
                            onChange={(e) => setFormData({ ...formData, doctor_responsable: e.target.value })}
                            placeholder="Ej. Dr. Armando Torres"
                        />
                    </div>

                    <div className="form-control space-y-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                            <Building2 className="w-3 h-3 text-white/20" />
                            Nombre de Clínica
                        </label>
                        <input
                            type="text"
                            required
                            className="input w-full glass-input rounded-xl border-white/5 bg-white/5 text-white"
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            placeholder="Ej. Dental Perfect"
                        />
                    </div>

                    <div className="form-control space-y-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                            <Phone className="w-3 h-3 text-white/20" />
                            Teléfono
                        </label>
                        <input
                            type="text"
                            className="input w-full glass-input rounded-xl border-white/5 bg-white/5 text-white"
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
