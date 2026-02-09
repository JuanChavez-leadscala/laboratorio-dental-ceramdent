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

    // Fetch service price for server-side calculation verification
    const { data: service } = await supabase
        .from('catalogo_servicios')
        .select('precio_unitario')
        .eq('id', servicio_id)
        .single()

    if (!service) {
        return { error: 'Servicio no válido' }
    }

    const precio_unitario = service.precio_unitario
    const monto_total = calculateTotal(piezas, precio_unitario)
    const saldo_pendiente = calculateSaldoPendiente(monto_total, abono)

    // Generate a simple code (in real production, use a robust generator)
    const codigo_rastreo = `ORD-${Date.now().toString().slice(-6)}`

    // Insert Order
    const { data: order, error: orderError } = await supabase
        .from('ordenes_trabajo')
        .insert({
            codigo_rastreo,
            clinica_id,
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
