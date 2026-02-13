-- Redefinition of Ceramdent Database Schema
-- Date: 2026-02-13

-- Enable necessary extensions
create extension if not exists "pgcrypto";

-- Clean existing (Limpia y redefine)
drop table if exists finanzas cascade;
drop table if exists ordenes_trabajo cascade;
drop table if exists catalogo_servicios cascade;
drop table if exists clinicas cascade;
drop type if exists estado_orden cascade;
drop type if exists color_dental cascade;
drop type if exists tipo_transaccion cascade;
drop type if exists metodo_pago cascade;

-- 1. Roles and Users
create type user_role as enum ('ADMIN', 'STAFF', 'CLIENT');

create table if not exists usuarios (
    id uuid primary key references auth.users(id) on delete cascade,
    email text not null unique,
    nombre text not null,
    rol user_role not null default 'CLIENT',
    created_at timestamptz default now()
);

-- 2. Master Data
create table if not exists clientes (
    id uuid primary key default gen_random_uuid(),
    nombre_clinica text,
    nombre_doctor text not null,
    telefono text,
    email_doctor text,
    saldo_acumulado decimal(10, 2) default 0.00,
    created_at timestamptz default now()
);

create table if not exists servicios (
    id uuid primary key default gen_random_uuid(),
    nombre text not null,
    precio decimal(10, 2) not null,
    categoria text,
    created_at timestamptz default now()
);

create table if not exists colores (
    id uuid primary key default gen_random_uuid(),
    nombre text not null unique,
    created_at timestamptz default now()
);

-- 3. Core Logic (Ordenes)
create type estado_orden as enum ('Ingresado', 'En Diseño', 'En Proceso', 'Listo para Entrega', 'Entregado');

create table if not exists ordenes (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz default now(),
    codigo_rastreo text not null unique,
    cliente_id uuid references clientes(id) on delete restrict,
    servicio_id uuid references servicios(id) on delete restrict,
    piezas int not null default 1,
    color_id uuid references colores(id) on delete set null,
    paciente text not null,
    descripcion text,
    fecha_entrega date,
    estado estado_orden default 'Ingresado',
    monto_total decimal(10, 2) not null,
    saldo_pendiente decimal(10, 2) not null
);

-- 4. Finance
create type tipo_movimiento as enum ('Ingreso', 'Egreso');
create type metodo_pago as enum ('Efectivo', 'Transferencia', 'Tarjeta');

create table if not exists finanzas (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz default now(),
    orden_id uuid references ordenes(id) on delete set null,
    monto decimal(10, 2) not null,
    tipo tipo_movimiento not null,
    metodo metodo_pago not null,
    concepto text not null,
    descripcion text
);

-- Enable Row Level Security
alter table usuarios enable row level security;
alter table clientes enable row level security;
alter table servicios enable row level security;
alter table colores enable row level security;
alter table ordenes enable row level security;
alter table finanzas enable row level security;

-- Policies

-- Usuarios
create policy "Users can see themselves" on usuarios for select using (auth.uid() = id);
create policy "Admins see everything in usuarios" on usuarios for all using (
  exists (select 1 from usuarios where id = auth.uid() and rol = 'ADMIN')
);

-- Clientes (Directory)
create policy "Admin/Staff can manage directory" on clientes for all using (
  exists (select 1 from usuarios where id = auth.uid() and rol in ('ADMIN', 'STAFF'))
);
create policy "Clients can read directory" on clientes for select using (
  exists (select 1 from usuarios where id = auth.uid() and rol = 'CLIENT')
);

-- Servicios
create policy "Admin/Staff can manage servicios" on servicios for all using (
  exists (select 1 from usuarios where id = auth.uid() and rol in ('ADMIN', 'STAFF'))
);
create policy "Everyone can read servicios" on servicios for select using (true);

-- Colores
create policy "Admin/Staff can manage colores" on colores for all using (
  exists (select 1 from usuarios where id = auth.uid() and rol in ('ADMIN', 'STAFF'))
);
create policy "Everyone can read colores" on colores for select using (true);

-- Ordenes
create policy "Admin/Staff manage all orders" on ordenes for all using (
  exists (select 1 from usuarios where id = auth.uid() and rol in ('ADMIN', 'STAFF'))
);
create policy "Clients view own orders" on ordenes for select using (
  exists (
    select 1 from usuarios u
    join clientes c on c.email_doctor = u.email
    where u.id = auth.uid() and u.rol = 'CLIENT' and ordenes.cliente_id = c.id
  )
);

-- Finanzas
create policy "Admins see everything in finanzas" on finanzas for all using (
  exists (select 1 from usuarios where id = auth.uid() and rol = 'ADMIN')
);
create policy "Staff read finanzas" on finanzas for select using (
  exists (select 1 from usuarios where id = auth.uid() and rol = 'STAFF')
);
create policy "Staff insert finanzas" on finanzas for insert with check (
  exists (select 1 from usuarios where id = auth.uid() and rol = 'STAFF')
);
