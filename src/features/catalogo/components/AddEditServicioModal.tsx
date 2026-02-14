'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/shared/lib/supabase'
import { Plus, Save, X, Briefcase, DollarSign, Tag } from 'lucide-react'

interface Servicio {
    id?: string
    nombre_servicio: string
    precio_unitario: number
    categoria?: string | null
}

interface Props {
    servicio?: Servicio
    onClose: () => void
    onSuccess: () => void
}

export function AddEditServicioModal({ servicio, onClose, onSuccess }: Props) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<Servicio>({
        nombre_servicio: '',
        precio_unitario: 0,
        categoria: ''
    })

    useEffect(() => {
        if (servicio) {
            setFormData(servicio)
        }
    }, [servicio])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const supabase = createClient()

        try {
            if (formData.id) {
                // Update
                const { error } = await supabase
                    .from('catalogo_servicios')
                    .update({
                        nombre_servicio: formData.nombre_servicio,
                        precio_unitario: formData.precio_unitario,
                        categoria: formData.categoria
                    })
                    .eq('id', formData.id)
                if (error) throw error
            } else {
                // Create
                const { error } = await supabase
                    .from('catalogo_servicios')
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
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ceramdent-blue to-purple-500"></div>

                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold text-white tracking-tight">
                        {formData.id ? 'Editar Servicio' : 'Nuevo Servicio'}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all text-white/40 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="form-control space-y-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                            <Briefcase className="w-3 h-3 text-ceramdent-blue" />
                            Nombre del Servicio *
                        </label>
                        <input
                            type="text"
                            required
                            className="input w-full glass-input rounded-xl border-white/5 bg-white/5 text-white"
                            value={formData.nombre_servicio}
                            onChange={(e) => setFormData({ ...formData, nombre_servicio: e.target.value })}
                            placeholder="Ej. Corona de Zirconio"
                        />
                    </div>

                    <div className="form-control space-y-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                            <DollarSign className="w-3 h-3 text-ceramdent-blue" />
                            Precio Base *
                        </label>
                        <input
                            type="number"
                            required
                            step="0.01"
                            className="input w-full glass-input rounded-xl border-white/5 bg-white/5 text-white"
                            value={formData.precio_unitario}
                            onChange={(e) => setFormData({ ...formData, precio_unitario: parseFloat(e.target.value) || 0 })}
                            placeholder="0.00"
                        />
                    </div>

                    <div className="form-control space-y-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                            <Tag className="w-3 h-3 text-white/20" />
                            Categoría
                        </label>
                        <input
                            type="text"
                            className="input w-full glass-input rounded-xl border-white/5 bg-white/5 text-white"
                            value={formData.categoria || ''}
                            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                            placeholder="Ej. Fija, Removible..."
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn btn-lg bg-ceramdent-blue hover:bg-ceramdent-blue/80 border-none text-white font-bold rounded-2xl shadow-lg shadow-ceramdent-blue/20 transition-all flex items-center gap-2"
                        >
                            {loading ? <span className="loading loading-spinner"></span> : <Save className="w-5 h-5" />}
                            {formData.id ? 'Guardar Cambios' : 'Añadir al Catálogo'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
