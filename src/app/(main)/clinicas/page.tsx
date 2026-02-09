export default function ClinicasPage() {
    return (
        <div className="space-y-8 pb-10">
            <header className="mb-10">
                <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">Clínicas y Doctores</h1>
                <p className="text-white/50 mt-2 text-lg">Administra tus clientes y sus saldos.</p>
            </header>

            <div className="glass-panel rounded-3xl p-8 border border-white/5 min-h-[400px] flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                    <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Directorio de Clientes</h3>
                <p className="text-white/40 mt-2 max-w-sm">
                    Mantén un registro de contacto y financiero de cada clínica que envía trabajos.
                </p>
            </div>
        </div>
    )
}
