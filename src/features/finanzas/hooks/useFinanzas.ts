'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/shared/lib/supabase'

export type Transaccion = {
    id: string
    orden_id: string | null
    monto: number
    tipo: 'Ingreso' | 'Egreso'
    metodo: 'Efectivo' | 'Transferencia' | 'Tarjeta'
    concepto: string
    descripcion: string | null
    created_at: string
}

export function useFinanzas() {
    const [transacciones, setTransacciones] = useState<Transaccion[]>([])
    const [loading, setLoading] = useState(true)

    const fetchFinanzas = async () => {
        const supabase = createClient()
        const { data } = await supabase
            .from('finanzas')
            .select('*')
            .order('created_at', { ascending: false })

        if (data) {
            setTransacciones(data as any)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchFinanzas()
    }, [])

    return { transacciones, loading, refetch: fetchFinanzas }
}
