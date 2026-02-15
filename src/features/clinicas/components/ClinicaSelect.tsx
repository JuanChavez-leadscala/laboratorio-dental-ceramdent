'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/shared/lib/supabase'

type Clinica = {
    id: string
    nombre: string // Clinica Name
    doctor_responsable: string | null
}

interface ClinicaSelectProps {
    onSelect: (clinicaId: string, clinicaNombre: string) => void
}

export function ClinicaSelect({ onSelect }: ClinicaSelectProps) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<Clinica[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        const searchClinicas = async () => {
            if (query.length < 2) {
                setResults([])
                return
            }

            const { data } = await supabase
                .from('clinicas')
                .select('id, doctor_responsable, nombre')
                .or(`doctor_responsable.ilike.%${query}%,nombre.ilike.%${query}%`)
                .limit(5)

            if (data) {
                setResults(data)
                setIsOpen(true)
            }
        }

        const timeoutId = setTimeout(searchClinicas, 300)
        return () => clearTimeout(timeoutId)
    }, [query])

    return (
        <div className="relative">
            <input
                type="text"
                placeholder="Buscar clínica o doctor..."
                className="input w-full bg-white border-slate-200 text-slate-900 rounded-xl focus:border-ceramdent-fucsia transition-all"
                value={query}
                onChange={(e) => {
                    const val = e.target.value;
                    setQuery(val);
                    onSelect(val, val); // Send text as both ID and Name for direct insertion
                }}
                onFocus={() => query.length >= 2 && setIsOpen(true)}
            />

            {isOpen && results.length > 0 && (
                <ul className="absolute z-30 menu p-2 shadow-2xl bg-white border border-slate-200 rounded-xl w-full mt-2">
                    {results.map((clinica) => (
                        <li key={clinica.id}>
                            <button
                                type="button"
                                className="text-slate-700 hover:bg-slate-50 flex flex-col items-start gap-0.5"
                                onClick={() => {
                                    setQuery(clinica.doctor_responsable || clinica.nombre)
                                    onSelect(clinica.id, clinica.doctor_responsable || clinica.nombre)
                                    setIsOpen(false)
                                }}
                            >
                                <span className="font-bold">{clinica.doctor_responsable}</span>
                                <span className="text-[10px] uppercase text-slate-500 font-medium">{clinica.nombre}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
