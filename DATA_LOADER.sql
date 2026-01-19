-- Script Masivo de Carga de Tiendas (Basado en la imagen)

-- 1. Asegurar Clientes (Incluyendo los nuevos)
insert into clientes (nombre, direccion)
select 'RadioShack', 'Oficinas Centrales'
where not exists (select 1 from clientes where nombre = 'RadioShack');

insert into clientes (nombre, direccion)
select 'Curacao', 'Oficinas Centrales'
where not exists (select 1 from clientes where nombre = 'Curacao');

insert into clientes (nombre, direccion)
select 'Almacenes Tropigas', 'Oficinas Centrales'
where not exists (select 1 from clientes where nombre = 'Almacenes Tropigas');


-- 2. Insertar Tiendas (Usando DO block para variables o subqueries directos)

-- SIMAN
INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Siman Los Proceres' FROM clientes WHERE nombre = 'SIMAN'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Siman Los Proceres' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Siman Miraflores' FROM clientes WHERE nombre = 'SIMAN'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Siman Miraflores' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Siman Oakland Mall' FROM clientes WHERE nombre = 'SIMAN'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Siman Oakland Mall' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Siman Pradera Concepcion' FROM clientes WHERE nombre = 'SIMAN'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Siman Pradera Concepcion' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Siman Pradera Chimaltenango' FROM clientes WHERE nombre = 'SIMAN'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Siman Pradera Chimaltenango' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Siman Pradera Xela' FROM clientes WHERE nombre = 'SIMAN'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Siman Pradera Xela' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Siman Pradera Escuintla' FROM clientes WHERE nombre = 'SIMAN'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Siman Pradera Escuintla' AND cliente_id = clientes.id);


-- XIAOMI (Mapeado a 'XIAOMI STORES' o 'Xiaomi Store' si existe, usaremos XIAOMI STORES por consistencia previa)
INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Xiaomi Store Miraflores' FROM clientes WHERE nombre = 'XIAOMI STORES'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Xiaomi Store Miraflores' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Xiaomi Store Oakland' FROM clientes WHERE nombre = 'XIAOMI STORES'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Xiaomi Store Oakland' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Xiaomi Store Pradera Xela' FROM clientes WHERE nombre = 'XIAOMI STORES'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Xiaomi Store Pradera Xela' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Xiaomi Store Portales' FROM clientes WHERE nombre = 'XIAOMI STORES'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Xiaomi Store Portales' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Xiaomi Store Pradera Concepcion' FROM clientes WHERE nombre = 'XIAOMI STORES'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Xiaomi Store Pradera Concepcion' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Xiaomi Store Naranjo Mall' FROM clientes WHERE nombre = 'XIAOMI STORES'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Xiaomi Store Naranjo Mall' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Xiaomi Store Eskala' FROM clientes WHERE nombre = 'XIAOMI STORES'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Xiaomi Store Eskala' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Xiaomi Store Kayala' FROM clientes WHERE nombre = 'XIAOMI STORES'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Xiaomi Store Kayala' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Xiaomi Store Pradera Chimaltenango' FROM clientes WHERE nombre = 'XIAOMI STORES'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Xiaomi Store Pradera Chimaltenango' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Xiaomi Store Pradera Huehuetenango' FROM clientes WHERE nombre = 'XIAOMI STORES'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Xiaomi Store Pradera Huehuetenango' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Xiaomi Store Pradera Chiquimula' FROM clientes WHERE nombre = 'XIAOMI STORES'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Xiaomi Store Pradera Chiquimula' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Xiaomi Store Pradera Zacapa' FROM clientes WHERE nombre = 'XIAOMI STORES'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Xiaomi Store Pradera Zacapa' AND cliente_id = clientes.id);


-- RADIOSHACK
INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'RadioShack LAS AMERICAS' FROM clientes WHERE nombre = 'RadioShack'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'RadioShack LAS AMERICAS' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'RadioShack ROOSEVELT' FROM clientes WHERE nombre = 'RadioShack'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'RadioShack ROOSEVELT' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'RadioShack BERRY' FROM clientes WHERE nombre = 'RadioShack'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'RadioShack BERRY' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'RadioShack PLAZA JAPON' FROM clientes WHERE nombre = 'RadioShack'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'RadioShack PLAZA JAPON' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'RadioShack EL MUÑECON' FROM clientes WHERE nombre = 'RadioShack'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'RadioShack EL MUÑECON' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'RadioShack PLAZA MADERO' FROM clientes WHERE nombre = 'RadioShack'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'RadioShack PLAZA MADERO' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'RadioShack METRONORTE' FROM clientes WHERE nombre = 'RadioShack'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'RadioShack METRONORTE' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'RadioShack ALAMOS' FROM clientes WHERE nombre = 'RadioShack'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'RadioShack ALAMOS' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'RadioShack SAN CRISTOBAL' FROM clientes WHERE nombre = 'RadioShack'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'RadioShack SAN CRISTOBAL' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'RadioShack OAKLAND MALL' FROM clientes WHERE nombre = 'RadioShack'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'RadioShack OAKLAND MALL' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'RadioShack PRADERA CONCEPCION' FROM clientes WHERE nombre = 'RadioShack'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'RadioShack PRADERA CONCEPCION' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'RadioShack ANTIGUA' FROM clientes WHERE nombre = 'RadioShack'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'RadioShack ANTIGUA' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'RadioShack ESKALA' FROM clientes WHERE nombre = 'RadioShack'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'RadioShack ESKALA' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'RadioShack MAJADAS' FROM clientes WHERE nombre = 'RadioShack'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'RadioShack MAJADAS' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'RadioShack ZELA' FROM clientes WHERE nombre = 'RadioShack'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'RadioShack ZELA' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'RadioShack EL FRUTAL' FROM clientes WHERE nombre = 'RadioShack'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'RadioShack EL FRUTAL' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'RadioShack PASEO SAN RAFAEL' FROM clientes WHERE nombre = 'RadioShack'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'RadioShack PASEO SAN RAFAEL' AND cliente_id = clientes.id);


-- CURACAO
INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao ROOSEVELT' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao ROOSEVELT' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao PLAZA FLORIDA' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao PLAZA FLORIDA' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao METRONORTE' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao METRONORTE' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao CENMA' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao CENMA' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao VILLA NUEVA' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao VILLA NUEVA' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao SAN JUAN' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao SAN JUAN' AND cliente_id = clientes.id);


-- ALMACENES TROPIGAS
INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas Amatitlan' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas Amatitlan' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas Boca del Monte' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas Boca del Monte' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas Centra Sur' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas Centra Sur' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas Chimaltenango' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas Chimaltenango' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas Coatepeque' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas Coatepeque' AND cliente_id = clientes.id);

