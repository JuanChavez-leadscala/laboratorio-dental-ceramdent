import { createClient } from '@/shared/lib/supabase'

export const calculateTotal = (piezas: number, precioUnitario: number): number => {
    return piezas * precioUnitario
}

export const calculateSaldoPendiente = (total: number, pagos: number): number => {
    return total - pagos
}

// Ensure business rule: Cannot be 'Entregado' without 'Listo para Entrega'
// This validation should ideally happen on state transition or server action
export const isValidStatusTransition = (currentStatus: string, newStatus: string): boolean => {
    const flow = ['Ingresado', 'En Diseño', 'En Proceso', 'Listo para Entrega', 'Entregado']

    if (newStatus === 'Entregado' && currentStatus !== 'Listo para Entrega') {
        return false
    }
    return true
}
