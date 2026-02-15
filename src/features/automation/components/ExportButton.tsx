'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import * as XLSX from 'xlsx'
import { createClient } from '@/shared/lib/supabase'

interface Props {
    table: 'clientes' | 'servicios' | 'ordenes'
    filename?: string
    buttonText?: string
    className?: string
}

export function ExportButton({ table, filename, buttonText = 'Exportar Excel', className }: Props) {
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const handleExport = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from(table)
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            if (!data || data.length === 0) {
                alert('No hay datos para exportar')
                return
            }

            // Transform data for better excel readability
            const transformedData = data.map(item => {
                const newItem = { ...item }
                // Remove internal fields if necessary
                delete (newItem as any).id
                delete (newItem as any).user_id
                return newItem
            })

            const worksheet = XLSX.utils.json_to_sheet(transformedData)
            const workbook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos')

            const name = filename || `export_${table}_${new Date().toISOString().split('T')[0]}.xlsx`
            XLSX.writeFile(workbook, name)
        } catch (error: any) {
            console.error('Error exporting:', error)
            alert('Error al exportar: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleExport}
            disabled={loading}
            className={`btn bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 gap-2 rounded-xl transition-all ${className}`}
        >
            {loading ? (
                <span className="loading loading-spinner loading-xs"></span>
            ) : (
                <Download className="w-4 h-4" />
            )}
            {buttonText}
        </button>
    )
}
