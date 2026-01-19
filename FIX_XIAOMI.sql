-- Corregir y completar tiendas de XIAOMI STORES
-- Agregando las sucursales que faltaban según la lista: Pradera Vistares, Pradera Escuintla, Interplaza Xela.

-- 1. Xiaomi Store Pradera Vistares
INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Xiaomi Store Pradera Vistares' FROM clientes WHERE nombre = 'XIAOMI STORES'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Xiaomi Store Pradera Vistares' AND cliente_id = clientes.id);

-- 2. Xiaomi Store Pradera Escuintla
INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Xiaomi Store Pradera Escuintla' FROM clientes WHERE nombre = 'XIAOMI STORES'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Xiaomi Store Pradera Escuintla' AND cliente_id = clientes.id);

-- 3. Xiaomi Store Interplaza Xela
INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Xiaomi Store Interplaza Xela' FROM clientes WHERE nombre = 'XIAOMI STORES'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Xiaomi Store Interplaza Xela' AND cliente_id = clientes.id);

-- Opcional: Si deseas que los nombres sean EXACTAMENTE 'Xiaomi Store_Miraflores' (con guion bajo), avísame.
-- Por ahora los estoy ingresando como 'Xiaomi Store Pradera Vistares' (con espacios) para mejor lectura.
