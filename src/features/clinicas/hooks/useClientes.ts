'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/shared/lib/supabase'

export type Cliente = {
    id: string
    nombre_clinica: string | null
    nombre_doctor: string
    telefono: string | null
    email_doctor: string | null
    saldo_acumulado: number
    created_at: string
}

export function useClientes() {
    const [clientes, setClientes] = useState<Cliente[]>([])
    const [loading, setLoading] = useState(true)

    const fetchClientes = async () => {
        const supabase = createClient()
        const { data } = await supabase
            .from('clientes')
            .select('*')
            .order('nombre_doctor')

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
