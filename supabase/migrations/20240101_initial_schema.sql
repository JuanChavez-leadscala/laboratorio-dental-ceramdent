-- Enable necessary extensions
create extension if not exists "pgcrypto";

-- Table: clinicas
create table if not exists clinicas (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz default now(),
    nombre text not null,
    telefono text,
    doctor_responsable text,
    saldo_acumulado decimal(10, 2) default 0.00
);

-- Table: catalogo_servicios
create table if not exists catalogo_servicios (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz default now(),
    nombre_servicio text not null,
    precio_unitario decimal(10, 2) not null
);

-- Enum: estado_orden
create type estado_orden as enum ('Ingresado', 'En Diseño', 'En Proceso', 'Listo para Entrega', 'Entregado');

-- Enum: color_dental
-- Adding a basic set of dental colors, this can be expanded
create type color_dental as enum ('A1', 'A2', 'A3', 'A3.5', 'A4', 'B1', 'B2', 'B3', 'B4', 'C1', 'C2', 'C3', 'C4', 'D2', 'D3', 'D4', 'BL1', 'BL2', 'BL3', 'BL4');

-- Table: ordenes_trabajo
create table if not exists ordenes_trabajo (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz default now(),
    codigo_rastreo text not null unique, -- NanoID to be generated on client or via function
    clinica_id uuid references clinicas(id) on delete restrict,
    servicio_id uuid references catalogo_servicios(id) on delete restrict,
    descripcion text,
    piezas int not null default 1,
    color color_dental,
    fecha_entrega date,
    estado estado_orden default 'Ingresado',
    monto_total decimal(10, 2) not null,
    saldo_pendiente decimal(10, 2) not null
);

-- Enum: tipo_transaccion
create type tipo_transaccion as enum ('Ingreso', 'Egreso');

-- Enum: metodo_pago
create type metodo_pago as enum ('Efectivo', 'Transferencia');

-- Table: finanzas
create table if not exists finanzas (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz default now(),
    orden_id uuid references ordenes_trabajo(id) on delete set null,
    monto decimal(10, 2) not null,
    tipo tipo_transaccion not null,
    concepto text not null, -- 'Abono', 'Pago Total', 'Materiales', 'Gasto Fijo'
    metodo metodo_pago
);

-- Enable Row Level Security
alter table clinicas enable row level security;
alter table catalogo_servicios enable row level security;
alter table ordenes_trabajo enable row level security;
alter table finanzas enable row level security;

-- Policies (Simplified for 'staff' role - assuming authenticated users are staff for now)
-- In a real scenario, we'd check for a specific claim or role table. 
-- Here we allow authenticated users to do everything, as requested "Role 'staff' no puede eliminar registros de finanzas"

-- Clinicas: All access for auth
create policy "Enable all for auth users" on clinicas for all using (auth.role() = 'authenticated');

-- Catalogo: All access for auth
create policy "Enable all for auth users" on catalogo_servicios for all using (auth.role() = 'authenticated');

-- Ordenes: All access for auth
create policy "Enable all for auth users" on ordenes_trabajo for all using (auth.role() = 'authenticated');

-- Finanzas: 
-- create/read/update for auth
create policy "Enable read for auth users" on finanzas for select using (auth.role() = 'authenticated');
create policy "Enable insert for auth users" on finanzas for insert with check (auth.role() = 'authenticated');
create policy "Enable update for auth users" on finanzas for update using (auth.role() = 'authenticated');
-- delete ONLY for admin (assuming admin has a specific email or metadata, OR just block delete for everyone for now as per requirement)
-- Requirements say: "El rol 'staff' no puede eliminar registros de finanzas."
-- We will strictly NOT add a delete policy for normal auth users, effectively disabling delete for them.
-- If we need an admin, we would add a policy checking for admin email/claim.

-- Realtime publication
-- You need to enable replication for these tables in the Supabase Dashboard > Database > Replication
-- commands here don't enable it on the publication level usually, but we can try adding tables to publication if it exists
-- alter publication supabase_realtime add table ordenes_trabajo, finanzas;
