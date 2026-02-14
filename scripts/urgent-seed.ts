import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function urgentSeed() {
    console.log('🚀 Starting URGENT seed...')

    // 1. 5 Specific Services
    const services = [
        { nombre_servicio: 'Corona Metal Porcelana', precio_unitario: 1200 },
        { nombre_servicio: 'Placa Total Acrílico', precio_unitario: 2800 },
        { nombre_servicio: 'Incrustación de Resina', precio_unitario: 600 },
        { nombre_servicio: 'Limpieza con Ultrasonido', precio_unitario: 450 },
        { nombre_servicio: 'Extracción Quirúrgica', precio_unitario: 1500 }
    ]

    const { error: sError } = await supabase.from('catalogo_servicios').upsert(services)
    if (sError) console.error('Error seeding services:', sError)
    else console.log('✅ 5 Services added')

    // 2. 5 Specific Clinics
    const clinics = [
        { doctor_responsable: 'Dr. Alejandro Méndez', nombre: 'Clínica Dental Alfa', telefono: '555-1122' },
        { doctor_responsable: 'Dra. Patricia Luna', nombre: 'Sonrisas Luminosas', telefono: '555-3344' },
        { doctor_responsable: 'Dr. Ricardo Vega', nombre: 'Centro Odontológico Vega', telefono: '555-5566' },
        { doctor_responsable: 'Dra. Claudia Ruiz', nombre: 'Dental Care Center', telefono: '555-7788' },
        { doctor_responsable: 'Dr. Fernando Soto', nombre: 'Vanguardia Dental', telefono: '555-9900' }
    ]

    const { error: cError } = await supabase.from('clinicas').upsert(clinics)
    if (cError) console.error('Error seeding clinics:', cError)
    else console.log('✅ 5 Clinics added')

    console.log('✨ Urgent seed completed!')
}

urgentSeed().catch(console.error)
