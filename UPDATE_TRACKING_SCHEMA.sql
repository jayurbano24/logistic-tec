-- Agregar columnas para control de rastreo
ALTER TABLE requests 
ADD COLUMN IF NOT EXISTS ultima_sincronizacion TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS ultimo_estado_externo TEXT,
ADD COLUMN IF NOT EXISTS fecha_evento_externo TIMESTAMPTZ;

-- Fallback por si la tabla se llama 'solicitudes' (ya que el codebase usa 'solicitudes')
ALTER TABLE solicitudes
ADD COLUMN IF NOT EXISTS ultima_sincronizacion TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS ultimo_estado_externo TEXT,
ADD COLUMN IF NOT EXISTS fecha_evento_externo TIMESTAMPTZ;
