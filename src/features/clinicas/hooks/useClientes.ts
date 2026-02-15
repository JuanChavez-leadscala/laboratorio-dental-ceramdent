'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/shared/lib/supabase'

export type Cliente = {
    id: string
    nombre: string // Clinica
    doctor_responsable: string | null // Doctor
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
            .order('nombre')

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
