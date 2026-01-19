-- Insertar TIENDAS para UNICOMER
insert into tiendas (cliente_id, nombre, direccion)
select id, 'Unicomer Video', '11 Avenida 32-51, Zona 5'
from clientes where nombre = 'UNICOMER'
and not exists (select 1 from tiendas where nombre = 'Unicomer Video');

insert into tiendas (cliente_id, nombre, direccion)
select id, 'Unicomer Central', 'Avenida Bolivar 32-22, Zona 8'
from clientes where nombre = 'UNICOMER'
and not exists (select 1 from tiendas where nombre = 'Unicomer Central');

-- Insertar TIENDAS para XIAOMI
insert into tiendas (cliente_id, nombre, direccion)
select id, 'Xiaomi Miraflores', 'CC Miraflores, Local 201'
from clientes where nombre = 'XIAOMI STORES'
and not exists (select 1 from tiendas where nombre = 'Xiaomi Miraflores');

insert into tiendas (cliente_id, nombre, direccion)
select id, 'Xiaomi Oakland', 'Oakland Mall, PB'
from clientes where nombre = 'XIAOMI STORES'
and not exists (select 1 from tiendas where nombre = 'Xiaomi Oakland');

-- Insertar TIENDAS para SIMAN
insert into tiendas (cliente_id, nombre, direccion)
select id, 'Siman Próceres', 'CC Los Próceres'
from clientes where nombre = 'SIMAN'
and not exists (select 1 from tiendas where nombre = 'Siman Próceres');

insert into tiendas (cliente_id, nombre, direccion)
select id, 'Siman Miraflores', 'CC Miraflores'
from clientes where nombre = 'SIMAN'
and not exists (select 1 from tiendas where nombre = 'Siman Miraflores');
