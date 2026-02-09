export default function CatalogoPage() {
    return (
        <div className="space-y-8 pb-10">
            <header className="mb-10">
                <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">Catálogo de Servicios</h1>
                <p className="text-white/50 mt-2 text-lg">Define tus productos y precios.</p>
            </header>

            <div className="glass-panel rounded-3xl p-8 border border-white/5 min-h-[400px] flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                    <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Catálogo Digital</h3>
                <p className="text-white/40 mt-2 max-w-sm">
                    Aquí podrás gestionar los precios de coronas, prótesis y demás servicios que ofreces.
                </p>
            </div>
        </div>
    )
}
