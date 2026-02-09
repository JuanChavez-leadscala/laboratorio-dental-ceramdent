export default function OrdenesPage() {
    return (
        <div className="space-y-8 pb-10">
            <header className="mb-10">
                <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">Órdenes de Trabajo</h1>
                <p className="text-white/50 mt-2 text-lg">Historial y gestión de todas las órdenes.</p>
            </header>

            <div className="glass-panel rounded-3xl p-8 border border-white/5 min-h-[400px] flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                    <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Próximamente: Historial Completo</h3>
                <p className="text-white/40 mt-2 max-w-sm">
                    Estamos preparando la vista detallada de todas las órdenes para que puedas filtrar y exportar tus reportes.
                </p>
            </div>
        </div>
    )
}
