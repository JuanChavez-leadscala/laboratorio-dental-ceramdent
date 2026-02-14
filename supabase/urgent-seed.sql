-- EMERGENCY SEED DATA FOR CERAMDENT
-- Run this in the Supabase Dashboard SQL Editor

-- 1. Insert 5 Specific Services
INSERT INTO catalogo_servicios (nombre_servicio, precio_unitario)
VALUES 
    ('Corona Metal Porcelana', 1200.00),
    ('Placa Total Acrílico', 2800.00),
    ('Incrustación de Resina', 600.00),
    ('Limpieza con Ultrasonido', 450.00),
    ('Extracción Quirúrgica', 1500.00)
ON CONFLICT DO NOTHING;

-- 2. Insert 5 Specific Clinics
INSERT INTO clinicas (doctor_responsable, nombre, telefono)
VALUES 
    ('Dr. Alejandro Méndez', 'Clínica Dental Alfa', '555-1122'),
    ('Dra. Patricia Luna', 'Sonrisas Luminosas', '555-3344'),
    ('Dr. Ricardo Vega', 'Centro Odontológico Vega', '555-5566'),
    ('Dra. Claudia Ruiz', 'Dental Care Center', '555-7788'),
    ('Dr. Fernando Soto', 'Vanguardia Dental', '555-9900')
ON CONFLICT DO NOTHING;
