import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function seed() {
    console.log('🌱 Starting seed...')

    // 1. Seed Services
    const { data: services } = await supabase.from('servicios').upsert([
        { nombre: 'Corona de Zirconio', precio: 1500, categoria: 'Fija' },
        { nombre: 'Prótesis Total', precio: 3500, categoria: 'Removible' },
        { nombre: 'Incrustación E-max', precio: 1200, categoria: 'Estética' },
        { nombre: 'Carilla de Porcelana', precio: 1800, categoria: 'Estética' },
        { nombre: 'Placa Miorelajante', precio: 800, categoria: 'Ortodoncia' }
    ]).select()

    console.log('✅ Services seeded')

    // 2. Seed Clients
    const { data: clients } = await supabase.from('clientes').upsert([
        { nombre_doctor: 'Juan Pérez', nombre_clinica: 'Dental Care', telefono: '555-0101' },
        { nombre_doctor: 'María García', nombre_clinica: 'Sonrisas Reales', telefono: '555-0202' },
        { nombre_doctor: 'Roberto Gómez', nombre_clinica: 'Clínica Central', telefono: '555-0303' }
    ]).select()

    console.log('✅ Clients seeded')

    // 3. Seed Orders
    if (clients && services) {
        const orders = []
        for (let i = 0; i < 15; i++) {
            const client = clients[i % clients.length]
            const service = services[i % services.length]
            orders.push({
                codigo_rastreo: `ORD-${1000 + i}`,
                cliente_id: client.id,
                servicio_id: service.id,
                paciente: `Paciente ${i + 1}`,
                estado: i % 4 === 0 ? 'Entregado' : i % 3 === 0 ? 'En Proceso' : 'Recibido',
                piezas: Math.floor(Math.random() * 4) + 1,
                total: service.precio * (Math.floor(Math.random() * 4) + 1),
                saldo_pendiente: i % 2 === 0 ? 0 : 500
            })
        }
        await supabase.from('ordenes').upsert(orders)
        console.log('✅ Orders seeded')
    }

    // 4. Seed Finance
    const transactions = []
    for (let i = 0; i < 10; i++) {
        const isIngreso = i % 2 === 0
        transactions.push({
            monto: Math.floor(Math.random() * 5000) + 1000,
            tipo: isIngreso ? 'Ingreso' : 'Egreso',
            metodo: i % 3 === 0 ? 'Efectivo' : 'Transferencia',
            concepto: isIngreso ? 'Pago de orden' : 'Compra de materiales',
            descripcion: 'Generado automáticamente por seed'
        })
    }
    await supabase.from('finanzas').insert(transactions)
    console.log('✅ Finance seeded')

    console.log('✨ Seed completed successfully!')
}

seed().catch(console.error)
