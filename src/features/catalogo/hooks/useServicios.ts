'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/shared/lib/supabase'

export type Servicio = {
    id: string
    nombre: string
    precio: number
    categoria?: string | null
}

export function useServicios() {
    const [servicios, setServicios] = useState<Servicio[]>([])
    const [loading, setLoading] = useState(true)

    const fetchServicios = async () => {
        setLoading(true)
        const supabase = createClient()
        const { data } = await supabase
            .from('servicios')
            .select('*')
            .order('nombre')

        if (data) {
            setServicios(data)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchServicios()
    }, [])

    return { servicios, loading, refetch: fetchServicios }
}
