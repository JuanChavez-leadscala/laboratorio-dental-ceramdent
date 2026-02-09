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
    { id: 'seed-1', nombre_servicio: 'Corona de Zirconio', precio_unitario: 150.00 },
    { id: 'seed-2', nombre_servicio: 'Carilla de Porcelana (E-max)', precio_unitario: 120.00 },
    { id: 'seed-3', nombre_servicio: 'Prótesis Total Acrílica', precio_unitario: 350.00 },
    { id: 'seed-4', nombre_servicio: 'Puente Fijo (3 unidades)', precio_unitario: 400.00 },
    { id: 'seed-5', nombre_servicio: 'Guarda Oclusal', precio_unitario: 80.00 },
    { id: 'seed-6', nombre_servicio: 'Incrustación (Inlay/Onlay)', precio_unitario: 95.00 },
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
