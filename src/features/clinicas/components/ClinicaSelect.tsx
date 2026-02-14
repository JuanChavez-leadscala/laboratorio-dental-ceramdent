'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/shared/lib/supabase'

type Clinica = {
    id: string
    nombre: string
    doctor_responsable: string
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
                .select('id, nombre, doctor_responsable')
                .or(`nombre.ilike.%${query}%,doctor_responsable.ilike.%${query}%`)
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
                className="input w-full glass-input rounded-xl border-white/5 bg-white/5 text-white placeholder:text-white/20"
                value={query}
                onChange={(e) => {
                    const val = e.target.value;
                    setQuery(val);
                    onSelect(val, val); // Send text as both ID and Name for direct insertion
                }}
                onFocus={() => query.length >= 2 && setIsOpen(true)}
            />

            {isOpen && results.length > 0 && (
                <ul className="absolute z-30 menu p-2 shadow-2xl bg-ceramdent-navy border border-white/10 rounded-xl w-full mt-2">
                    {results.map((clinica) => (
                        <li key={clinica.id}>
                            <button
                                type="button"
                                className="text-white hover:bg-white/10 flex flex-col items-start gap-0.5"
                                onClick={() => {
                                    setQuery(clinica.doctor_responsable)
                                    onSelect(clinica.id, clinica.doctor_responsable)
                                    setIsOpen(false)
                                }}
                            >
                                <span className="font-bold">{clinica.doctor_responsable}</span>
                                <span className="text-[10px] uppercase opacity-40">{clinica.nombre}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
