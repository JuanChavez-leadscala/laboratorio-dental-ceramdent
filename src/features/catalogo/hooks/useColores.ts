'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/shared/lib/supabase'

type Color = {
    id: string
    nombre: string
}

export function useColores() {
    const [colores, setColores] = useState<Color[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchColores = async () => {
            const supabase = createClient()
            const { data } = await supabase
                .from('colores')
                .select('*')
                .order('nombre')

            if (data) {
                setColores(data)
            }
            setLoading(false)
        }

        fetchColores()
    }, [])

    return { colores, loading }
}
