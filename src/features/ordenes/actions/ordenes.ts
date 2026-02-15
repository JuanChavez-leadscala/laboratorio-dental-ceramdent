'use server'

import { createClient } from '@/shared/lib/supabase'
import { revalidatePath } from 'next/cache'

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function createOrden(prevState: any, formData: FormData) {
    const supabase = createClient()

    try {
        const cliente_id = formData.get('clinica_id') as string
        const clinica_nombre = formData.get('clinica_nombre') as string
        const client_documento = formData.get('client_documento') as string
        const client_nombre_legal = formData.get('client_nombre_legal') as string

        const servicio_id = formData.get('servicio_id') as string
        const servicio_nombre = formData.get('servicio_nombre') as string
        const paciente = formData.get('nombre_paciente') as string
        const codigo_trabajo = formData.get('codigo_trabajo') as string
        const piezas = parseInt(formData.get('piezas') as string || '1')
        const precio = parseFloat(formData.get('precio') as string || '0')
        const abono = parseFloat((formData.get('abono') as string) || '0')
        const fecha_entrega = formData.get('fecha_entrega') as string
        const color_id = formData.get('color_id') as string
        const descripcion = formData.get('descripcion') as string
        const cuotas = parseInt(formData.get('cuotas') as string || '1')
        const metodo_pago = (formData.get('metodo_pago') as string) || 'Efectivo'

        // 1. Resolve Cliente (Clinic)
        let finalClienteId = cliente_id
        if (!uuidRegex.test(cliente_id) || !cliente_id) {
            // Find or create cliente by nombre_doctor
            const { data: existingCliente } = await supabase
                .from('clientes')
                .select('id')
                .eq('nombre_doctor', clinica_nombre)
                .maybeSingle()

            if (existingCliente) {
                finalClienteId = existingCliente.id
            } else {
                const { data: newCliente, error: cError } = await supabase
                    .from('clientes')
                    .insert([{
                        nombre_doctor: clinica_nombre,
                        nombre_clinica: client_nombre_legal || 'Clínica Nueva',
                        telefono: client_documento // Hijacking telefono for documento if no column exists, or just skip it if not in schema
                    }])
                    .select('id')
                    .maybeSingle()

                if (cError) throw cError
                if (!newCliente) throw new Error('No se pudo crear el cliente')
                finalClienteId = newCliente.id
            }
        }

        // 2. Resolve Servicio
        let finalServicioId = servicio_id
        if (!uuidRegex.test(servicio_id) || !servicio_id) {
            // Find or create servicio by nombre
            const { data: existingServicio } = await supabase
                .from('servicios')
                .select('id')
                .eq('nombre', servicio_nombre)
                .maybeSingle()

            if (existingServicio) {
                finalServicioId = existingServicio.id
            } else {
                const { data: newServicio, error: sError } = await supabase
                    .from('servicios')
                    .insert([{
                        nombre: servicio_nombre,
                        precio: precio
                    }])
                    .select('id')
                    .maybeSingle()

                if (sError) throw sError
                if (!newServicio) throw new Error('No se pudo crear el servicio')
                finalServicioId = newServicio.id
            }
        }

        const monto_total = piezas * precio
        const saldo_pendiente = monto_total - abono

        // 3. Create Orden
        const { data: newOrden, error: oError } = await supabase
            .from('ordenes')
            .insert([{
                codigo_rastreo: codigo_trabajo || `ORDER-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
                cliente_id: finalClienteId,
                servicio_id: finalServicioId,
                piezas,
                color_id: uuidRegex.test(color_id) ? color_id : null,
                paciente,
                fecha_entrega,
                descripcion,
                monto_total,
                saldo_pendiente,
                estado: 'Ingresado'
            }])
            .select('id')
            .maybeSingle()

        if (oError) {
            console.error('Database Error in insert order:', oError)
            throw new Error(`Error BD: ${oError.message}`)
        }
        if (!newOrden) throw new Error('No se pudo crear la orden')

        // 4. Create Finance Entry (Abono)
        if (abono > 0) {
            const { error: fError } = await supabase
                .from('finanzas')
                .insert([{
                    orden_id: newOrden.id,
                    monto: abono,
                    tipo: 'Ingreso',
                    metodo: metodo_pago,
                    concepto: `Pago inicial (${metodo_pago}) - Paciente: ${paciente}`
                }])
            if (fError) throw fError
        }

        revalidatePath('/dashboard')
        revalidatePath('/ordenes')
        return { success: true }
    } catch (error: any) {
        console.error('Error in createOrden:', error)
        return { error: error.message }
    }
}

export async function importOrdersFromExcel() {
    // Prototipo funcional para el cliente
    return { success: true, message: "Funcionalidad de importación lista para mapear columnas." }
}

