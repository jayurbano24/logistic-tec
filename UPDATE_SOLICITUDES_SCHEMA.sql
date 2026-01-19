    -- Agregar columnas faltantes a la tabla SOLICITUDES para soportar los nuevos campos
    ALTER TABLE solicitudes ADD COLUMN IF NOT EXISTS marca text;
    ALTER TABLE solicitudes ADD COLUMN IF NOT EXISTS modelo text;
    ALTER TABLE solicitudes ADD COLUMN IF NOT EXISTS tienda text;
    ALTER TABLE solicitudes ADD COLUMN IF NOT EXISTS direccion_entrega text;
    ALTER TABLE solicitudes ADD COLUMN IF NOT EXISTS telefono_contacto text;
