'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/shared/lib/supabase'

export type Orden = {
    id: string
    codigo_rastreo: string
    paciente: string
    estado: string
    monto_total: number
    saldo_pendiente: number
    fecha_entrega: string
    created_at: string
    cliente: { nombre_doctor: string } | null
    servicio: { nombre: string } | null
}

export function useOrdenes() {
    const [ordenes, setOrdenes] = useState<Orden[]>([])
    const [loading, setLoading] = useState(true)

    const fetchOrdenes = async () => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        let query = supabase
            .from('ordenes')
            .select(`
                *,
                cliente:clientes(nombre_doctor),
                servicio:servicios(nombre)
            `)
            .order('created_at', { ascending: false })

        // If client, filter by their ID (handled by RLS too, but good for explicit)
        const { data } = await query

        if (data) {
            setOrdenes(data as any)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchOrdenes()
    }, [])

    return { ordenes, loading, refetch: fetchOrdenes }
}
