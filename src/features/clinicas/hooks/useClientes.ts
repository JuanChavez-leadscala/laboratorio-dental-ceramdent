'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/shared/lib/supabase'

export type Cliente = {
    id: string
    nombre: string // Clínica
    doctor_responsable: string
    telefono: string | null
    saldo_acumulado: number
    created_at: string
}

export function useClientes() {
    const [clientes, setClientes] = useState<Cliente[]>([])
    const [loading, setLoading] = useState(true)

    const fetchClientes = async () => {
        setLoading(true)
        const supabase = createClient()
        const { data } = await supabase
            .from('clinicas')
            .select('*')
            .order('doctor_responsable')

        if (data) {
            setClientes(data)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchClientes()
    }, [])

    return { clientes, loading, refetch: fetchClientes }
}
