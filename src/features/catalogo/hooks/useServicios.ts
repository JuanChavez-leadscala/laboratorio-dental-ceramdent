'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/shared/lib/supabase'

type Servicio = {
    id: string
    nombre_servicio: string
    precio_unitario: number
}

// Datos Maestros (Seeding)
const SERVICIOS_SEED: Servicio[] = [
    { id: '11111111-1111-1111-1111-111111111111', nombre_servicio: 'Corona de Zirconio', precio_unitario: 150.00 },
    { id: '22222222-2222-2222-2222-222222222222', nombre_servicio: 'Carilla de Porcelana (E-max)', precio_unitario: 120.00 },
    { id: '33333333-3333-3333-3333-333333333333', nombre_servicio: 'Prótesis Total Acrílica', precio_unitario: 350.00 },
    { id: '44444444-4444-4444-4444-444444444444', nombre_servicio: 'Puente Fijo (3 unidades)', precio_unitario: 400.00 },
    { id: '55555555-5555-5555-5555-555555555555', nombre_servicio: 'Guarda Oclusal', precio_unitario: 80.00 },
    { id: '66666666-6666-6666-6666-666666666666', nombre_servicio: 'Incrustación (Inlay/Onlay)', precio_unitario: 95.00 },
]

export function useServicios() {
    const [servicios, setServicios] = useState<Servicio[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchServicios = async () => {
            const supabase = createClient()
            const { data } = await supabase
                .from('catalogo_servicios')
                .select('*')
                .order('nombre_servicio')

            // Si hay datos en BD, úsalos. Si no, usa el Seed.
            if (data && data.length > 0) {
                setServicios(data)
            } else {
                setServicios(SERVICIOS_SEED)
            }
            setLoading(false)
        }

        fetchServicios()
    }, [])

    return { servicios, loading }
}
