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
    cliente?: { doctor_responsable: string } | null
    servicio?: { nombre_servicio: string } | null
}

export function useOrdenes() {
    const [ordenes, setOrdenes] = useState<Orden[]>([])
    const [loading, setLoading] = useState(true)

    const fetchOrdenes = async () => {
        const supabase = createClient()

        let query = supabase
            .from('ordenes_trabajo')
            .select(`
                *,
                cliente:clinicas(doctor_responsable),
                servicio:catalogo_servicios(nombre_servicio)
            `)
            .order('created_at', { ascending: false })

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
