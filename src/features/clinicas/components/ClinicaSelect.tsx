'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/shared/lib/supabase'

type Clinica = {
    id: string
    nombre: string
}

interface ClinicaSelectProps {
    onSelect: (clinicaId: string) => void
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
                .select('id, nombre')
                .ilike('nombre', `%${query}%`)
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
            <label className="label">
                <span className="label-text">Clínica</span>
            </label>
            <input
                type="text"
                placeholder="Buscar clínica..."
                className="input input-bordered w-full"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query.length >= 2 && setIsOpen(true)}
            />

            {isOpen && results.length > 0 && (
                <ul className="absolute z-10 menu p-2 shadow bg-base-100 rounded-box w-full mt-1">
                    {results.map((clinica) => (
                        <li key={clinica.id}>
                            <button
                                onClick={() => {
                                    setQuery(clinica.nombre)
                                    onSelect(clinica.id)
                                    setIsOpen(false)
                                }}
                            >
                                {clinica.nombre}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
