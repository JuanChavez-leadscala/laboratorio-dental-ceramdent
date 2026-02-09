export default function FinanzasPage() {
    return (
        <div className="space-y-8 pb-10">
            <header className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full text-[10px] font-bold uppercase tracking-widest">Acceso Restringido</span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">Finanzas y Reportes</h1>
                <p className="text-white/50 mt-2 text-lg">Control total de ingresos, egresos y utilidad.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 opacity-50">
                <div className="glass-panel p-6 rounded-2xl border border-white/5 h-32"></div>
                <div className="glass-panel p-6 rounded-2xl border border-white/5 h-32"></div>
            </div>

            <div className="glass-panel rounded-3xl p-8 border border-white/5 min-h-[300px] flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-ceramdent-blue/10 flex items-center justify-center mb-4 border border-ceramdent-blue/20">
                    <svg className="w-8 h-8 text-ceramdent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Módulo Financiero Seguro</h3>
                <p className="text-white/40 mt-2 max-w-sm">
                    Este módulo solo es visible para el Administrador. Aquí verás el flujo de caja y rentabilidad del laboratorio.
                </p>
            </div>
        </div>
    )
}
