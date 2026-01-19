-- 1. Crear tabla de CLIENTES (Debe ir primero)
create table if not exists clientes (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  direccion text,
  telefono text,
  contacto text,
  creado_el timestamptz default now()
);

-- Habilitar RLS para clientes
alter table clientes enable row level security;
drop policy if exists "Lectura publica clientes" on clientes;
create policy "Lectura publica clientes" on clientes for select using (true);
drop policy if exists "Escritura autenticada clientes" on clientes;
create policy "Escritura autenticada clientes" on clientes for insert with check (true);

-- 2. Insertar CLIENTES predeterminados (si no existen)
insert into clientes (nombre, direccion)
select 'UNICOMER', 'Dirección Central'
where not exists (select 1 from clientes where nombre = 'UNICOMER');

insert into clientes (nombre, direccion)
select 'XIAOMI STORES', 'Dirección Central'
where not exists (select 1 from clientes where nombre = 'XIAOMI STORES');

insert into clientes (nombre, direccion)
select 'SIMAN', 'Dirección Central'
where not exists (select 1 from clientes where nombre = 'SIMAN');


-- 3. Crear tabla de TIENDAS (Depende de clientes)
create table if not exists tiendas (
  id uuid default gen_random_uuid() primary key,
  cliente_id uuid references clientes(id) not null,
  nombre text not null,
  direccion text,
  telefono text,
  creado_el timestamptz default now()
);

alter table tiendas enable row level security;
drop policy if exists "Lectura publica tiendas" on tiendas;
create policy "Lectura publica tiendas" on tiendas for select using (true);
drop policy if exists "Escritura autenticada tiendas" on tiendas;
create policy "Escritura autenticada tiendas" on tiendas for insert with check (true);


-- 4. Modificar SOLICITUDES (si es necesario)
alter table solicitudes add column if not exists referencia1 text;
alter table solicitudes add column if not exists referencia2 text;
-- Asegurarnos que solicitud pueda guardar nombre de tienda si lo guardamos en info_entrega (JSON) o una columna nueva?
-- Por ahora lo guardamos en el JSONB info_entrega, así que no se requiere columna nueva.


-- 5. Crear tabla de COMENTARIOS
create table if not exists comentarios (
  id uuid default gen_random_uuid() primary key,
  solicitud_id uuid references solicitudes(id) not null,
  usuario_id uuid,
  mensaje text not null,
  autor text not null,
  creado_el timestamptz default now()
);

alter table comentarios enable row level security;
drop policy if exists "Permitir lectura a todos" on comentarios;
create policy "Permitir lectura a todos" on comentarios for select using (true);
drop policy if exists "Permitir inserción a todos" on comentarios;
create policy "Permitir inserción a todos" on comentarios for insert with check (true);
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime for table comentarios;
commit;


-- 6. Crear tabla BITACORA
create table if not exists bitacora_movimientos (
  id uuid default gen_random_uuid() primary key,
  solicitud_id uuid references solicitudes(id) not null,
  usuario text,
  estatus text,
  fecha_hora timestamptz default now()
);

alter table bitacora_movimientos enable row level security;
drop policy if exists "Publica bitacora" on bitacora_movimientos;
create policy "Publica bitacora" on bitacora_movimientos for select using (true);
drop policy if exists "Insertar bitacora" on bitacora_movimientos;
create policy "Insertar bitacora" on bitacora_movimientos for insert with check (true);
