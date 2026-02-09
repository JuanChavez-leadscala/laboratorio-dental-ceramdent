-- Seed Data for Services
-- Run this in Supabase SQL Editor to populate the catalog

INSERT INTO public.catalogo_servicios (nombre_servicio, precio_unitario)
VALUES
    ('Corona de Zirconio', 150.00),
    ('Carilla de Porcelana (E-max)', 120.00),
    ('Prótesis Total Acrílica', 350.00),
    ('Puente Fijo (3 unidades)', 400.00),
    ('Guarda Oclusal', 80.00),
    ('Incrustación (Inlay/Onlay)', 95.00),
    ('Corona Metal-Porcelana', 90.00),
    ('Encerado Diagnóstico (por pieza)', 15.00),
    ('Provisional de Acrílico', 35.00),
    ('Placa Base de Altura', 25.00)
ON CONFLICT DO NOTHING;

-- Optional: Create a test clinic if none exists
INSERT INTO public.clinicas (nombre, doctor_responsable, telefono)
VALUES
    ('Clínica Dental Sonrisas', 'Dr. Juan Pérez', '555-0123')
ON CONFLICT DO NOTHING;
