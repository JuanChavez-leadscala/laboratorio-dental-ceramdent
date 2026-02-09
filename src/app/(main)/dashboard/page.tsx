import { KPICards } from '@/features/dashboard/components/KPICards'
import { TableroKanban } from '@/features/dashboard/components/TableroKanban'

export default function DashboardPage() {
  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <header className="mb-10">
        <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">Panel de Control</h1>
        <p className="text-white/50 mt-2 text-lg">Resumen de operaciones y finanzas.</p>
      </header>

      {/* KPI Section */}
      <section>
        <KPICards />
      </section>

      {/* Kanban Section */}
      <section className="mt-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Flujo de Órdenes
            <span className="px-2.5 py-0.5 rounded-full bg-ceramdent-fucsia/10 text-[10px] uppercase tracking-wider font-bold text-ceramdent-fucsia border border-ceramdent-fucsia/20">
              En Tiempo Real
            </span>
          </h2>
        </div>
        <TableroKanban />
      </section>
    </div>
  )
}
