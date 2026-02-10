'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/shared/lib/supabase'
import { calculateTotal, calculateSaldoPendiente } from '../utils/calculos'

export async function createOrden(prevState: any, formData: FormData) {
    const supabase = createClient()

    // Extract data
    const clinica_id = formData.get('clinica_id') as string
    const servicio_id = formData.get('servicio_id') as string
    const nombre_paciente = formData.get('nombre_paciente') as string
    const descripcion = formData.get('descripcion') as string
    const piezas = parseInt(formData.get('piezas') as string)
    const color = formData.get('color') as string
    const fecha_entrega = formData.get('fecha_entrega') as string
    const abono = parseFloat((formData.get('abono') as string) || '0')
    const metodo_pago = formData.get('metodo_pago') as string

    // Seed fallback IDs (ensure this matches useServicios.ts)
    const SEED_IDS = [
        '11111111-1111-1111-1111-111111111111',
        '22222222-2222-2222-2222-222222222222',
        '33333333-3333-3333-3333-333333333333',
        '44444444-4444-4444-4444-444444444444',
        '55555555-5555-5555-5555-555555555555',
        '66666666-6666-6666-6666-666666666666'
    ]

    let precio_unitario = 0

    if (SEED_IDS.includes(servicio_id)) {
        // Mock prices for seed services if they don't exist in DB yet
        const seedPrices: Record<string, number> = {
            '11111111-1111-1111-1111-111111111111': 150,
            '22222222-2222-2222-2222-222222222222': 120,
            '33333333-3333-3333-3333-333333333333': 350,
            '44444444-4444-4444-4444-444444444444': 400,
            '55555555-5555-5555-5555-555555555555': 80,
            '66666666-6666-6666-6666-666666666666': 95
        }
        precio_unitario = seedPrices[servicio_id]
    } else {
        // Fetch service price from DB
        const { data: service } = await supabase
            .from('catalogo_servicios')
            .select('precio_unitario')
            .eq('id', servicio_id)
            .single()

        if (!service) {
            return { error: 'Servicio no válido' }
        }
        precio_unitario = service.precio_unitario
    }
    const monto_total = calculateTotal(piezas, precio_unitario)
    const saldo_pendiente = calculateSaldoPendiente(monto_total, abono)

    // Generate a simple code (in real production, use a robust generator)
    const codigo_rastreo = `ORD-${Date.now().toString().slice(-6)}`

    // Clinic resolution: if clinica_id is not a UUID, it might be a new name or a selected name
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    let finalClinicaId = clinica_id;

    if (!uuidRegex.test(clinica_id)) {
        // It's a name, search for it or create it
        const { data: existingClinica } = await supabase
            .from('clinicas')
            .select('id')
            .ilike('nombre', clinica_id)
            .single();

        if (existingClinica) {
            finalClinicaId = existingClinica.id;
        } else {
            // Create new clinic
            const { data: newClinica, error: createError } = await supabase
                .from('clinicas')
                .insert({ nombre: clinica_id })
                .select('id')
                .single();

            if (createError) {
                console.error('Error creating clinic:', createError);
                return { error: 'Error al registrar la clínica' };
            }
            finalClinicaId = newClinica.id;
        }
    }

    // Insert Order
    const { data: order, error: orderError } = await supabase
        .from('ordenes_trabajo')
        .insert({
            codigo_rastreo,
            clinica_id: finalClinicaId,
            servicio_id,
            nombre_paciente,
            descripcion,
            piezas,
            color: color === '' ? null : color,
            fecha_entrega,
            monto_total,
            saldo_pendiente,
            estado: 'Ingresado'
        })
        .select()
        .single()

    if (orderError) {
        console.error('Error creating order:', orderError)
        return { error: 'Error al crear la orden' }
    }

    // Insert Payment if exists
    if (abono > 0) {
        const { error: financeError } = await supabase
            .from('finanzas')
            .insert({
                orden_id: order.id,
                monto: abono,
                tipo: 'Ingreso',
                concepto: abono >= monto_total ? 'Pago Total' : 'Abono',
                metodo: metodo_pago
            })

        if (financeError) {
            console.error('Error recording payment:', financeError)
            // Note: In a real transaction we would rollback, but Supabase HTTP API doesn't support transactions easily without RPC.
            // We'll proceed but log it.
        }
    }

    revalidatePath('/dashboard')
    revalidatePath('/ordenes')
    redirect('/dashboard')
}
