'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/shared/lib/supabase'
import { Plus, Save, X, Briefcase, DollarSign, Tag } from 'lucide-react'

interface Servicio {
    id?: string
    nombre: string
    precio: number
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
        nombre: '',
        precio: 0,
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
                    .from('servicios')
                    .update({
                        nombre: formData.nombre,
                        precio: formData.precio,
                        categoria: formData.categoria
                    })
                    .eq('id', formData.id)
                if (error) throw error
            } else {
                // Create
                const { error } = await supabase
                    .from('servicios')
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
            <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 border border-slate-200 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ceramdent-blue to-purple-500"></div>

                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
                        {formData.id ? 'Editar Servicio' : 'Nuevo Servicio'}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-slate-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="form-control space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Briefcase className="w-3 h-3 text-ceramdent-blue" />
                            Nombre del Servicio *
                        </label>
                        <input
                            type="text"
                            required
                            className="input w-full bg-white border-slate-200 text-slate-900 rounded-xl focus:border-ceramdent-blue transition-all"
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            placeholder="Ej. Corona de Zirconio"
                        />
                    </div>

                    <div className="form-control space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <DollarSign className="w-3 h-3 text-ceramdent-blue" />
                            Precio Base *
                        </label>
                        <input
                            type="number"
                            required
                            step="0.01"
                            className="input w-full bg-white border-slate-200 text-slate-900 rounded-xl focus:border-ceramdent-blue transition-all"
                            value={formData.precio}
                            onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) || 0 })}
                            placeholder="0.00"
                        />
                    </div>

                    <div className="form-control space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Tag className="w-3 h-3 text-slate-300" />
                            Categoría
                        </label>
                        <input
                            type="text"
                            className="input w-full bg-white border-slate-200 text-slate-900 rounded-xl focus:border-ceramdent-blue transition-all"
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
