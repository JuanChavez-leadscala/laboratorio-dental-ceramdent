import { TableroKanban } from '@/features/dashboard/components/TableroKanban'
import { ExportButton } from '@/features/automation/components/ExportButton'

export default function DashboardPage() {
  return (
    <div className="space-y-6 pb-10">
      {/* Header Section */}
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Flujo de Trabajo</h1>
          <p className="text-slate-500 mt-1 font-medium italic">Gestión de órdenes en tiempo real.</p>
        </div>
        <ExportButton table="ordenes_trabajo" buttonText="Exportar Flujo" />
      </header>

      {/* Kanban Section */}
      <section>
        <TableroKanban />
      </section>
    </div>
  )
}
