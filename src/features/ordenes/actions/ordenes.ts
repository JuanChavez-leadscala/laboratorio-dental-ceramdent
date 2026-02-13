'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/shared/lib/supabase'
import { calculateTotal, calculateSaldoPendiente } from '../utils/calculos'

export async function createOrden(prevState: any, formData: FormData) {
    const supabase = createClient()

    // Extract data
    const clinica_input = formData.get('clinica_id') as string // Can be UUID or Name
    const servicio_input = formData.get('servicio_id') as string // Can be UUID or Name
    const paciente = formData.get('nombre_paciente') as string
    const descripcion = formData.get('descripcion') as string
    const piezas = parseInt(formData.get('piezas') as string)
    const color_id = formData.get('color_id') as string
    const fecha_entrega = formData.get('fecha_entrega') as string
    const abono = parseFloat((formData.get('abono') as string) || '0')
    const metodo_pago = formData.get('metodo_pago') as string

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    // 1. Resolve Cliente
    let finalClienteId = clinica_input;
    if (!uuidRegex.test(clinica_input)) {
        // It's a name, search or create
        const { data: existing } = await supabase
            .from('clientes')
            .select('id')
            .ilike('nombre_doctor', clinica_input)
            .single();

        if (existing) {
            finalClienteId = existing.id;
        } else {
            const { data: newCliente, error: err } = await supabase
                .from('clientes')
                .insert({ nombre_doctor: clinica_input })
                .select('id')
                .single();
            if (err) return { error: 'Error al registrar el cliente' };
            finalClienteId = newCliente.id;
        }
    }

    // 2. Resolve Servicio
    let finalServicioId = servicio_input;
    let precio_unitario = 0;

    if (!uuidRegex.test(servicio_input)) {
        // It's a name, search or create
        const { data: existing } = await supabase
            .from('servicios')
            .select('id, precio')
            .ilike('nombre', servicio_input)
            .single();

        if (existing) {
            finalServicioId = existing.id;
            precio_unitario = existing.precio;
        } else {
            // Create new service (default price 0 or ask? prompt says "secretaria debe poder modificar un precio")
            // For "Entrada Libre", we'll create it with 0 and let them edit later, or assume they wrote "Service Name - Price"
            const { data: newServicio, error: err } = await supabase
                .from('servicios')
                .insert({ nombre: servicio_input, precio: 0 })
                .select('id, precio')
                .single();
            if (err) return { error: 'Error al registrar el servicio' };
            finalServicioId = newServicio.id;
            precio_unitario = newServicio.precio;
        }
    } else {
        const { data: service } = await supabase
            .from('servicios')
            .select('precio')
            .eq('id', servicio_input)
            .single();
        if (!service) return { error: 'Servicio no encontrado' };
        precio_unitario = service.precio;
    }

    const monto_total = calculateTotal(piezas, precio_unitario)
    const saldo_pendiente = calculateSaldoPendiente(monto_total, abono)
    const codigo_rastreo = `ORD-${Date.now().toString().slice(-6)}`

    // 3. Insert Order
    const { data: order, error: orderError } = await supabase
        .from('ordenes')
        .insert({
            codigo_rastreo,
            cliente_id: finalClienteId,
            servicio_id: finalServicioId,
            paciente,
            descripcion,
            piezas,
            color_id: uuidRegex.test(color_id) ? color_id : null,
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

    // 4. Finance Entry
    if (abono > 0) {
        await supabase
            .from('finanzas')
            .insert({
                orden_id: order.id,
                monto: abono,
                tipo: 'Ingreso',
                metodo: metodo_pago as any,
                concepto: 'Abono Inicial'
            })
    }

    revalidatePath('/dashboard')
    revalidatePath('/ordenes')
    redirect('/dashboard')
}
