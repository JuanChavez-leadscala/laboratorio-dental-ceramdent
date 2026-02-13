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
        <div className="space-y-8 pb-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">Finanzas</h1>
                    <p className="text-white/50 mt-2 text-lg">Control de caja y reportes operativos.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExportExcel}
                        className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 hover:bg-emerald-500/20 transition-all text-sm font-semibold"
                    >
                        <Download className="w-4 h-4" />
                        Excel
                    </button>
                    <button
                        onClick={handleExportPDF}
                        className="flex items-center gap-2 px-4 py-2.5 bg-ceramdent-fucsia/10 border border-ceramdent-fucsia/20 rounded-xl text-ceramdent-fucsia hover:bg-ceramdent-fucsia/20 transition-all text-sm font-semibold"
                    >
                        <Download className="w-4 h-4" />
                        PDF
                    </button>
                </div>
            </header>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-white/[0.02] flex items-center justify-between relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500 opacity-5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-125"></div>
                    <div>
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Ingresos Totales</p>
                        <h3 className="text-2xl font-bold text-white font-mono">${stats.ingresos.toLocaleString()}</h3>
                        <div className="flex items-center gap-1 text-emerald-400 text-[10px] font-bold mt-2">
                            <TrendingUp className="w-3 h-3" />
                            +12.5% vs mes anterior
                        </div>
                    </div>
                    <div className="p-3 bg-emerald-500/10 rounded-2xl">
                        <ArrowUpRight className="w-6 h-6 text-emerald-400" />
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-white/[0.02] flex items-center justify-between relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-red-500 opacity-5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-125"></div>
                    <div>
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Egresos Operativos</p>
                        <h3 className="text-2xl font-bold text-white font-mono">${stats.egresos.toLocaleString()}</h3>
                        <div className="flex items-center gap-1 text-red-500 text-[10px] font-bold mt-2">
                            <TrendingDown className="w-3 h-3" />
                            -3.2% vs mes anterior
                        </div>
                    </div>
                    <div className="p-3 bg-red-500/10 rounded-2xl">
                        <ArrowDownRight className="w-6 h-6 text-red-500" />
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-ceramdent-fucsia/[0.03] flex items-center justify-between relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-ceramdent-fucsia opacity-5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-125"></div>
                    <div>
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Utilidad Neta</p>
                        <h3 className="text-3xl font-extrabold text-ceramdent-fucsia font-mono">${stats.utilidad.toLocaleString()}</h3>
                        <div className="flex items-center gap-1 text-ceramdent-fucsia text-[10px] font-bold mt-2">
                            <DollarSign className="w-3 h-3" />
                            Beneficio real
                        </div>
                    </div>
                    <div className="p-4 bg-ceramdent-fucsia/10 rounded-2xl shadow-lg shadow-ceramdent-fucsia/20">
                        <TrendingUp className="w-7 h-7 text-ceramdent-fucsia" />
                    </div>
                </div>
            </div>

            {/* Transactions Header */}
            <div className="flex items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    <Receipt className="w-5 h-5 text-ceramdent-blue" />
                    Historial de Movimientos
                </h2>

                <div className="relative group flex-1 max-w-sm">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-ceramdent-blue transition-colors" />
                    <input
                        type="text"
                        placeholder="Filtrar por concepto..."
                        className="bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-11 pr-4 text-white text-sm placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-ceramdent-blue/30 w-full transition-all"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Transactions Table */}
            <div className="glass-panel rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
                <div className="overflow-x-auto overflow-y-auto max-h-[500px] scrollbar-hide">
                    <table className="table w-full border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="bg-transparent text-white/40 font-bold uppercase tracking-widest text-[10px] py-4 px-8">Concepto</th>
                                <th className="bg-transparent text-white/40 font-bold uppercase tracking-widest text-[10px] py-4 px-8">Fecha</th>
                                <th className="bg-transparent text-white/40 font-bold uppercase tracking-widest text-[10px] py-4 px-8">Método</th>
                                <th className="bg-transparent text-white/40 font-bold uppercase tracking-widest text-[10px] py-4 px-8 text-right">Monto</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filtered.map(t => (
                                <tr key={t.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="py-5 px-8">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${t.tipo === 'Ingreso'
                                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/20'
                                                : 'bg-red-500/10 border-red-500/20 text-red-500 group-hover:bg-red-500/20'
                                                }`}>
                                                {t.tipo === 'Ingreso' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-sm">{t.concepto}</div>
                                                <div className="text-[10px] text-white/40 font-medium truncate max-w-[200px]">{t.descripcion || 'Sin descripción'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5 px-8">
                                        <div className="text-xs text-white/60 font-medium flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(t.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="py-5 px-8">
                                        <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-white/5 border border-white/10 w-fit">
                                            {t.metodo === 'Efectivo' ? <Banknote className="w-3 h-3 text-emerald-400" /> : <CreditCard className="w-3 h-3 text-ceramdent-blue" />}
                                            <span className="text-[10px] font-bold text-white/50 uppercase">{t.metodo}</span>
                                        </div>
                                    </td>
                                    <td className="py-5 px-8 text-right">
                                        <div className={`text-base font-bold font-mono ${t.tipo === 'Ingreso' ? 'text-emerald-400' : 'text-red-500'}`}>
                                            {t.tipo === 'Ingreso' ? '+' : '-'}${t.monto.toLocaleString()}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
