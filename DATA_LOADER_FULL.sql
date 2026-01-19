-- Carga masiva complementaria de Tiendas (Curacao y Tropigas)

-- CURACAO (Lista extendida)
INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao Alerces' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao Alerces' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao Altos de Barcenas' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao Altos de Barcenas' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao Antigua' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao Antigua' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao Atanasio Tzul' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao Atanasio Tzul' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao Barberena' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao Barberena' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao Calle Marti' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao Calle Marti' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao Chimaltenango' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao Chimaltenango' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao Chiquimula' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao Chiquimula' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao Coatepeque' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao Coatepeque' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao Coban' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao Coban' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao Escuintla' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao Escuintla' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao Guastatoya' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao Guastatoya' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao Huehuetenango' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao Huehuetenango' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao Jalapa' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao Jalapa' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao Jutiapa' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao Jutiapa' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao Malacatan' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao Malacatan' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao Mazatenango' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao Mazatenango' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao Mixco' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao Mixco' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao Montserrat' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao Montserrat' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao Morales' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao Morales' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao Naranjo Mall' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao Naranjo Mall' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao Palin' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao Palin' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao Peten (Flores)' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao Peten (Flores)' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao Peten (Santa Elena)' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao Peten (Santa Elena)' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao Peten (San Benito)' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao Peten (San Benito)' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao Portales' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao Portales' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao Pradera Chiquimula' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao Pradera Chiquimula' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao Pradera Escuintla' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao Pradera Escuintla' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao Pradera Huehuetenango' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao Pradera Huehuetenango' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao Pradera Puerto Barrios' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao Pradera Puerto Barrios' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao Pradera Xela' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao Pradera Xela' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao Pradera Zacapa' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao Pradera Zacapa' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao Puerto Barrios' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao Puerto Barrios' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao Quetzaltenango (Centro)' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao Quetzaltenango (Centro)' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao Retalhuleu' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao Retalhuleu' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao San Cristobal' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao San Cristobal' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao San Francisco El Alto' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao San Francisco El Alto' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao San Jose Pinula' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao San Jose Pinula' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao San Lucas' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao San Lucas' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao San Marcos' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao San Marcos' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao San Pedro' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao San Pedro' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao Santa Cruz del Quiche' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao Santa Cruz del Quiche' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao Santa Lucia Cotz' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao Santa Lucia Cotz' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao Solola' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao Solola' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao Tiquisate' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao Tiquisate' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao Totonicapan' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao Totonicapan' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao Trebol' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao Trebol' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao Villa Canales' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao Villa Canales' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Curacao Zacapa' FROM clientes WHERE nombre = 'Curacao'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Curacao Zacapa' AND cliente_id = clientes.id);


-- ALMACENES TROPIGAS (Lista extendida)
INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas Antigua' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas Antigua' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas Atanasio' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas Atanasio' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas Barberena' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas Barberena' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas Bolivar' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas Bolivar' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas Chiquimula' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas Chiquimula' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas Coatepeque' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas Coatepeque' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas Coban' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas Coban' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas Escuintla' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas Escuintla' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas Florida' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas Florida' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas Guastatoya' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas Guastatoya' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas Huehuetenango' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas Huehuetenango' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas Jalapa' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas Jalapa' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas Jutiapa' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas Jutiapa' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas Malacatan' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas Malacatan' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas Mazatenango' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas Mazatenango' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas Metronorte' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas Metronorte' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas Mixco' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas Mixco' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas Montserrat' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas Montserrat' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas Morales' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas Morales' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas Peten (Flores)' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas Peten (Flores)' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas Peten (Santa Elena)' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas Peten (Santa Elena)' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas Peten (San Benito)' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas Peten (San Benito)' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas Portales' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas Portales' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas Puerto Barrios' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas Puerto Barrios' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas Quetzaltenango' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas Quetzaltenango' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas Retalhuleu' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas Retalhuleu' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas Roosevelt' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas Roosevelt' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas Salamá' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas Salamá' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas San Cristobal' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas San Cristobal' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas San Francisco El Alto' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas San Francisco El Alto' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas San Jose Pinula' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas San Jose Pinula' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas San Juan' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas San Juan' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas San Lucas' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas San Lucas' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas San Marcos' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas San Marcos' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas San Pedro' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas San Pedro' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas Santa Cruz del Quiche' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas Santa Cruz del Quiche' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas Santa Lucia Cotz' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas Santa Lucia Cotz' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas Solola' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas Solola' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas Tiquisate' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas Tiquisate' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas Totonicapan' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas Totonicapan' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas Villa Canales' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas Villa Canales' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas Villa Nueva' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas Villa Nueva' AND cliente_id = clientes.id);

INSERT INTO tiendas (cliente_id, nombre)
SELECT id, 'Almacenes Tropigas Zacapa' FROM clientes WHERE nombre = 'Almacenes Tropigas'
AND NOT EXISTS (SELECT 1 FROM tiendas WHERE nombre = 'Almacenes Tropigas Zacapa' AND cliente_id = clientes.id);
