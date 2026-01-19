-- 1. Eliminar la restricción actual violentamente (si existe)
ALTER TABLE solicitudes DROP CONSTRAINT IF EXISTS solicitudes_cliente_id_fkey;

-- 2. Intentar agregar la nueva restricción apuntando a CLIENTES
-- Usamos 'NOT VALID' para que no falle si ya existen solicitudes viejas con IDs de usuarios
ALTER TABLE solicitudes 
  ADD CONSTRAINT solicitudes_cliente_id_fkey 
  FOREIGN KEY (cliente_id) 
  REFERENCES clientes(id)
  NOT VALID;

-- 3. (Opcional) Intentar validar, pero si falla no importa, ya está activa para nuevos inserts
-- ALTER TABLE solicitudes VALIDATE CONSTRAINT solicitudes_cliente_id_fkey;
