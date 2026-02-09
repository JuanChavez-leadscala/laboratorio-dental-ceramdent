-- Migration: Add nombre_paciente to ordenes_trabajo
alter table if exists ordenes_trabajo 
add column if not exists nombre_paciente text;
