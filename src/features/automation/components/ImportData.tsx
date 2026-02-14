'use client'

import { useState } from 'react'
import { createClient } from '@/shared/lib/supabase'
import * as XLSX from 'xlsx'
import { Upload, FileUp, CheckCircle, AlertCircle } from 'lucide-react'

interface Props {
    table: 'clinicas' | 'catalogo_servicios'
    onComplete?: () => void
}

export function ImportData({ table, onComplete }: Props) {
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setLoading(true)
        setStatus('idle')
        setMessage('Procesando archivo...')

        const reader = new FileReader()
        reader.onload = async (evt) => {
            try {
                const bstr = evt.target?.result
                const wb = XLSX.read(bstr, { type: 'binary' })
                const wsname = wb.SheetNames[0]
                const ws = wb.Sheets[wsname]
                const data = XLSX.utils.sheet_to_json(ws)

                if (data.length === 0) {
                    throw new Error('El archivo está vacío')
                }

                setMessage(`Subiendo ${data.length} registros...`)
                const supabase = createClient()
                const { error } = await supabase.from(table).insert(data)

                if (error) throw error

                setStatus('success')
                setMessage(`${data.length} registros importados con éxito.`)
                if (onComplete) onComplete()
            } catch (err: any) {
                console.error(err)
                setStatus('error')
                setMessage(err.message || 'Error al importar datos')
            } finally {
                setLoading(false)
            }
        }
        reader.readAsBinaryString(file)
    }

    return (
        <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-white/[0.02]">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <FileUp className="w-5 h-5 text-ceramdent-blue" />
                    Importar {table === 'clinicas' ? 'Directorio' : 'Catálogo'}
                </h3>
                {status === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                {status === 'error' && <AlertCircle className="w-5 h-5 text-ceramdent-fucsia" />}
            </div>

            <p className="text-xs text-white/40 mb-6 leading-relaxed">
                Sube un archivo Excel (.xlsx) o CSV con las columnas correspondientes
                ({table === 'clinicas' ? 'doctor_responsable, nombre' : 'nombre_servicio, precio_unitario'}).
            </p>

            <label className={`
                relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer
                ${loading ? 'opacity-50 cursor-not-allowed' : 'h-32 hover:bg-white/[0.03] border-white/10 hover:border-ceramdent-blue/40'}
            `}>
                {loading ? (
                    <span className="loading loading-spinner text-ceramdent-blue"></span>
                ) : (
                    <>
                        <Upload className="w-8 h-8 text-white/20 mb-2" />
                        <span className="text-sm font-semibold text-white/30 tracking-tight">Elegir archivo</span>
                    </>
                )}
                <input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileUpload}
                    disabled={loading}
                />
            </label>

            {message && (
                <div className={`mt-4 text-[11px] font-bold uppercase tracking-wider text-center ${status === 'success' ? 'text-emerald-400' : status === 'error' ? 'text-ceramdent-fucsia' : 'text-white/40'
                    }`}>
                    {message}
                </div>
            )}
        </div>
    )
}
