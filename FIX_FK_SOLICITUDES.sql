-- Arreglar restricción de llave foránea en solicitudes
-- El problema es que solicitudes.cliente_id está apuntando a 'perfiles' (tabla de usuarios del sistema)
-- pero nosotros estamos guardando IDs de la tabla 'clientes' (empresas).
-- Necesitamos eliminar esa restricción y crear la correcta hacia la tabla 'clientes'.

ALTER TABLE solicitudes DROP CONSTRAINT IF EXISTS solicitudes_cliente_id_fkey;

-- Opción A: Apuntar a la nueva tabla 'clientes' (Recomendado si 'clientes' es donde guardas Unicomer, etc.)
ALTER TABLE solicitudes 
  ADD CONSTRAINT solicitudes_cliente_id_fkey 
  FOREIGN KEY (cliente_id) 
  REFERENCES clientes(id);

-- Opción B: Si prefieres no tener FK estricta para permitir flexibilidad (aunque A es mejor)
-- ALTER TABLE solicitudes DROP CONSTRAINT solicitudes_cliente_id_fkey;
