'use client'

import { useState, useMemo } from 'react'
import { useFinanzas } from '@/features/finanzas/hooks/useFinanzas'
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Download,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    CreditCard,
    Banknote,
    Receipt
} from 'lucide-react'

export default function FinanzasPage() {
    const { transacciones, loading } = useFinanzas()
    const [query, setQuery] = useState('')

    const handleExportPDF = () => {
        const headers = [['Fecha', 'Concepto', 'Método', 'Tipo', 'Monto']];
        const data = transacciones.map(t => [
            new Date(t.created_at).toLocaleDateString(),
            t.concepto,
            t.metodo,
            t.tipo,
            `$${t.monto.toLocaleString()}`
        ]);
        import('@/shared/utils/export-utils').then(m => {
            m.exportToPDF('Reporte Financiero - Ceramdent', headers, data, 'reporte-financiero');
        });
    };

    const handleExportExcel = () => {
        const data = transacciones.map(t => ({
            Fecha: new Date(t.created_at).toLocaleDateString(),
            Concepto: t.concepto,
            Método: t.metodo,
            Tipo: t.tipo,
            Monto: t.monto
        }));
        import('@/shared/utils/export-utils').then(m => {
            m.exportToExcel(data, 'reporte-financiero');
        });
    };

    const stats = useMemo(() => {
        const ingresos = transacciones
            .filter(t => t.tipo === 'Ingreso')
            .reduce((sum, t) => sum + t.monto, 0)

        const egresos = transacciones
            .filter(t => t.tipo === 'Egreso')
            .reduce((sum, t) => sum + t.monto, 0)

        return {
            ingresos,
            egresos,
            utilidad: ingresos - egresos
        }
    }, [transacciones])

    const filtered = transacciones.filter(t =>
        t.concepto.toLowerCase().includes(query.toLowerCase()) ||
        t.descripcion?.toLowerCase().includes(query.toLowerCase())
    )

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
    )

    return (
        <div className="space-y-8 pb-10 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-black text-slate-800 tracking-tight">Caja y Finanzas</h1>
                    <p className="text-slate-500 mt-2 text-lg font-medium italic">Control operativo y reportes de rentabilidad.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExportExcel}
                        className="flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl hover:bg-emerald-100 transition-all font-bold shadow-sm"
                    >
                        <Download className="w-4 h-4" />
                        Excel
                    </button>
                    <button
                        onClick={handleExportPDF}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-2xl hover:bg-slate-900 transition-all font-bold shadow-lg shadow-slate-200"
                    >
                        <Download className="w-4 h-4" />
                        PDF
                    </button>
                </div>
            </header>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-200/20 flex items-center justify-between relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500 opacity-[0.03] rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-125"></div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Ingresos Totales</p>
                        <h3 className="text-3xl font-black text-slate-800 font-mono tracking-tighter">${stats.ingresos.toLocaleString()}</h3>
                        <div className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-bold mt-2">
                            <TrendingUp className="w-3.5 h-3.5" />
                            +12.5% vs mes anterior
                        </div>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-2xl">
                        <ArrowUpRight className="w-7 h-7 text-emerald-600" />
                    </div>
                </div>

                <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-200/20 flex items-center justify-between relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-500 opacity-[0.03] rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-125"></div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Egresos Operativos</p>
                        <h3 className="text-3xl font-black text-slate-800 font-mono tracking-tighter">${stats.egresos.toLocaleString()}</h3>
                        <div className="flex items-center gap-1.5 text-red-600 text-[10px] font-bold mt-2">
                            <TrendingDown className="w-3.5 h-3.5" />
                            -3.2% vs mes anterior
                        </div>
                    </div>
                    <div className="p-4 bg-red-50 rounded-2xl">
                        <ArrowDownRight className="w-7 h-7 text-red-600" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-ceramdent-fucsia to-[#ff2e7a] p-8 rounded-[2rem] flex items-center justify-between relative overflow-hidden group shadow-2xl shadow-ceramdent-fucsia/30">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-125"></div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">Utilidad Neta</p>
                        <h3 className="text-4xl font-black text-white font-mono tracking-tight">${stats.utilidad.toLocaleString()}</h3>
                        <div className="flex items-center gap-1 text-white/80 text-[10px] font-bold mt-2">
                            <DollarSign className="w-3 h-3" />
                            Beneficio real
                        </div>
                    </div>
                    <div className="p-5 bg-white/20 backdrop-blur-md rounded-2xl relative z-10">
                        <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                </div>
            </div>

            {/* Transactions Section */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/20 overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-3">
                        <Receipt className="w-6 h-6 text-ceramdent-blue" />
                        Historial de Movimientos
                    </h2>

                    <div className="relative group w-full max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-ceramdent-blue transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar por concepto o descripción..."
                            className="bg-slate-50 border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-ceramdent-blue/20 w-full transition-all"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="table w-full border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="text-slate-400 font-bold uppercase tracking-widest text-[10px] py-6 px-8 border-none">Concepto</th>
                                <th className="text-slate-400 font-bold uppercase tracking-widest text-[10px] py-6 px-8 border-none">Fecha</th>
                                <th className="text-slate-400 font-bold uppercase tracking-widest text-[10px] py-6 px-8 border-none">Método</th>
                                <th className="text-slate-400 font-bold uppercase tracking-widest text-[10px] py-6 px-8 border-none text-right">Monto</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.map(t => (
                                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="py-6 px-8">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${t.tipo === 'Ingreso'
                                                ? 'bg-emerald-50 border-emerald-100 text-emerald-600 group-hover:scale-110'
                                                : 'bg-red-50 border-red-100 text-red-600 group-hover:scale-110'
                                                }`}>
                                                {t.tipo === 'Ingreso' ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
                                            </div>
                                            <div>
                                                <div className="font-extrabold text-slate-800 text-base tracking-tight">{t.concepto}</div>
                                                <div className="text-[11px] text-slate-400 font-bold truncate max-w-[250px] uppercase tracking-wide mt-0.5">{t.descripcion || 'Operación Regular'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-8">
                                        <div className="text-sm text-slate-500 font-bold flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-slate-300" />
                                            {new Date(t.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="py-6 px-8">
                                        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 w-fit">
                                            {t.metodo === 'Efectivo' ? <Banknote className="w-4 h-4 text-emerald-500" /> : <CreditCard className="w-4 h-4 text-ceramdent-blue" />}
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.metodo}</span>
                                        </div>
                                    </td>
                                    <td className="py-6 px-8 text-right">
                                        <div className={`text-xl font-black font-mono tracking-tighter ${t.tipo === 'Ingreso' ? 'text-emerald-600' : 'text-red-600'}`}>
                                            {t.tipo === 'Ingreso' ? '+' : '-'}${t.monto.toLocaleString()}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filtered.length === 0 && (
                    <div className="p-24 text-center flex flex-col items-center justify-center bg-slate-50/20">
                        <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                            <Receipt className="w-10 h-10 text-slate-200" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-400">Sin movimientos registrados</h3>
                        <p className="text-slate-300 mt-2 font-medium">No se encontraron transacciones con los criterios de búsqueda.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

