'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/shared/lib/supabase'

export async function registrarPago(ordenId: string, monto: number, metodo: string) {
    const supabase = createClient()

    // 1. Get current order status
    const { data: order, error: fetchError } = await supabase
        .from('ordenes')
        .select('monto_total, saldo_pendiente')
        .eq('id', ordenId)
        .single()

    if (fetchError || !order) {
        return { error: 'Orden no encontrada' }
    }

    // 2. Insert Finance Record
    const { error: financeError } = await supabase
        .from('finanzas')
        .insert({
            orden_id: ordenId,
            monto: monto,
            tipo: 'Ingreso',
            concepto: 'Abono / Pago',
            metodo: metodo
        })

    if (financeError) {
        return { error: 'Error al registrar finanza' }
    }

    // 3. Update Order Balance
    const nuevoSaldo = order.saldo_pendiente - monto

    const { error: updateError } = await supabase
        .from('ordenes')
        .update({ saldo_pendiente: nuevoSaldo })
        .eq('id', ordenId)

    if (updateError) {
        return { error: 'Error al actualizar saldo' }
    }

    revalidatePath('/dashboard')
    return { success: true }
}
