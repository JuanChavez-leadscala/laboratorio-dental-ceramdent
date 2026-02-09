import { KPICards } from '@/features/dashboard/components/KPICards'
import { TableroKanban } from '@/features/dashboard/components/TableroKanban'

export default function DashboardPage() {
  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <header className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">Panel de Control</h1>
        <p className="text-slate-500 mt-2 text-lg">Resumen de operaciones y finanzas.</p>
      </header>

      {/* KPI Section */}
      <section>
        <KPICards />
      </section>

      {/* Kanban Section with Sticky Header effect if needed, but keeping simple for now */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Flujo de Órdenes
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-xs font-semibold text-slate-600">En Tiempo Real</span>
          </h2>
        </div>
        <TableroKanban />
      </section>
    </div>
  )
}
