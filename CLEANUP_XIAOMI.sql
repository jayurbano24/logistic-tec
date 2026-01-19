-- Limpieza y Regeneración de Tiendas Xiaomi
-- Este script ELIMINA todas las tiendas actuales de 'XIAOMI STORES' y las vuelve a crear
-- para asegurar que solo existan las de la lista oficial.

DO $$
DECLARE
    v_cliente_id uuid;
BEGIN
    -- 1. Buscar el ID del cliente 'XIAOMI STORES'
    SELECT id INTO v_cliente_id FROM clientes WHERE nombre = 'XIAOMI STORES' LIMIT 1;

    -- Si no existe 'XIAOMI STORES', intentar buscar variaciones o crearlo (opcional, aquí asumimos que existe)
    
    IF v_cliente_id IS NOT NULL THEN
        -- 2. Eliminar TODAS las tiendas asociadas actualmente a este cliente
        DELETE FROM tiendas WHERE cliente_id = v_cliente_id;

        -- 3. Insertar la lista exacta y limpia (con los nombres tal cual la imagen)
        INSERT INTO tiendas (cliente_id, nombre, direccion) VALUES
        (v_cliente_id, 'Xiaomi Store_Miraflores', 'CC Miraflores'),
        (v_cliente_id, 'Xiaomi Store_Oakland', 'Oakland Mall'),
        (v_cliente_id, 'Xiaomi Store_Pradera Vistares', 'Pradera Vistares'),
        (v_cliente_id, 'Xiaomi Store_Portales', 'CC Portales'),
        (v_cliente_id, 'Xiaomi Store_Pradera Concepcion', 'Pradera Concepción'),
        (v_cliente_id, 'Xiaomi Store_Naranjo Mall', 'Naranjo Mall'),
        (v_cliente_id, 'Xiaomi Store_Pradera Escuintla', 'Pradera Escuintla'),
        (v_cliente_id, 'Xiaomi Store_Pradera Xela', 'Pradera Xela'),
        (v_cliente_id, 'Xiaomi Store_Pradera Chimaltenango', 'Pradera Chimaltenango'),
        (v_cliente_id, 'Xiaomi Store_Interplaza Xela', 'Interplaza Xela'),
        (v_cliente_id, 'Xiaomi Store_Pradera Chiquimula', 'Pradera Chiquimula'),
        (v_cliente_id, 'Xiaomi Store_Pradera Huehuetenango', 'Pradera Huehuetenango');
        
    END IF;
END $$;
