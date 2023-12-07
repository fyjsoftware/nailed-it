import * as mysql from "mysql2/promise";
import * as fs from "fs/promises";
import * as logger from "./logger.js";

const config = JSON.parse(
  await fs.readFile(new URL("./config.json", import.meta.url))
);

export async function startConection() {
  logger.info("Conexión con la base de datos iniciada.");
  return await mysql.createConnection({
    host: config.testing ? config.hostSecundario : config.host,
    port: config.puertos.db,
    user: config.db.usuario,
    password: config.db.password,
    database: config.db.baseDatos,
    connectionLimit : 5000 // Medidas drasticas
  });
}

export async function endConection(db) {
  await logger.info("Conexión con la base de datos finalizada.");
  await db.end;
}

export async function calendario(emp) {
  let database = await startConection();
  let e = parseInt(emp);
  let citas = await database.execute(
    `SELECT getCitasCalendario(${e}) AS temp;`
  );
  await endConection(database);
  return citas;
}

export async function calendarioCl(emp) {
  let database = await startConection();
  let e = parseInt(emp);
  let citas = await database.execute(
    `SELECT getCitasCalendarioCl(${e}) AS temp;`
  );
  await endConection(database);
  return citas;
}

export async function getCliente(tel) {
  let database = await startConection();
  let res = await database.execute(`SELECT getCliente("${tel}") AS temp;`);
  await endConection(database);
  return res;
}

export async function getLogin(obj) {
  let database = await startConection();
  let res = await database.execute(
    `SELECT checkLogin("${obj.email}", "${obj.password}");`
  );
  await endConection(database);
  return res[0][0][`checkLogin("${obj.email}", "${obj.password}")`] > 0;
}

export async function getEmpleada(obj) {
  let database = await startConection();
  let res = await database.execute(
    `SELECT * FROM empleado WHERE correo = "${obj.email}";`
  );
  console.log(res);
  await endConection(database);
  return res[0][0];
}

export async function getTelefono(obj) {
  let database = await startConection();
  let res = await database.execute(
    `SELECT * FROM cliente WHERE PKIdCliente = "${obj.email}";`
  );
  console.log(res);
  await endConection(database);
  return res[0][0];
}

export async function getEmpleados() {
  let database = await startConection();
  let res = await database.execute(
    `SELECT * FROM empleado;`
  );
  console.log(res);
  await endConection(database);
  return res[0];
}

export async function getCita(tel, fecha, hora) {
  console.log(tel);
  console.log(fecha);
  console.log(hora);
  let database = await startConection();
  let res = await database.execute(
    `SELECT getCita("${tel}", "${fecha}", "${hora}") AS temp;`
  );
  await endConection(database);
  return res;
}

export async function getServicios() {
  let database = await startConection();
  let res = await database.execute(
    `SELECT * FROM servicio;`
  );
  console.log(res);
  await endConection(database);
  return res[0];
}

export async function getCitaSMS(telefono) {
  let database = await startConection();
  let res = await database.execute(
    `SELECT DATE_FORMAT(fechaCita, "%d/%m/%Y") as fecha, TIME_FORMAT(horaCita, "%H:%i") as hora FROM cita WHERE FKCliente IN (
      SELECT PKIdCliente FROM cliente WHERE telefono = "${telefono}");;`
  );
  console.log(res);
  await endConection(database);
  return res[0][0];
}

export async function getServEmp(id) {
  let database = await startConection();
  let res = await database.execute(
    `SELECT * FROM empleadoServicio WHERE FKIdEmpleado = ${id};`
  );
  console.log(res);
  await endConection(database);
  return res[0];
}

export async function reagendarCita(obj) {
  let database = await startConection();
  let res = await database.execute(
    `CALL reagendarCita(${obj.id}, "${obj.nuevaFecha}", "${obj.nuevaHora}");`
  );
  await endConection(database);
}

export async function modificarEmpleada(obj) {
  let database = await startConection();
  let elementos = [];
  if (obj.nombre !== null) elementos.push("nombre = \"" + obj.nombre + "\"")
  if (obj.paterno !== null) elementos.push("paterno = \"" + obj.paterno + "\"")
  if (obj.materno !== null) elementos.push("materno = \"" + obj.materno + "\"")
  if (obj.telefono !== null) elementos.push("telefono = \"" + obj.telefono + "\"")
  if (obj.correo !== null) elementos.push("correo = \"" + obj.correo + "\"")
  if (obj.contrasena !== null) elementos.push("contrasena = \"" + obj.contrasena + "\"")
  if (obj.horaEntrada !== null) elementos.push("horaEntrada = \"" + obj.horaEntrada + "\"")
  if (obj.horaSalida !== null) elementos.push("horaSalida = \"" + obj.horaSalida + "\"")
  if (obj.descanso !== null) elementos.push("descanso = " + obj.descanso)
  if (obj.disponible) elementos.push("disponible = 0")
  if (!obj.disponible) elementos.push("disponible = 1")
  await database.execute(
    `UPDATE empleado
    SET ${elementos.join(", ")}
    WHERE PKIdEmpleado = ${obj.id};`
  );
  await endConection(database);
}

export async function confirmarCita(id) {
  let database = await startConection();
  let res = await database.execute(
    `CALL confirmarCita(${id});`
  );
  await endConection(database);
}

export async function registrarAsistencia(id) {
  let database = await startConection();
  let res = await database.execute(
    `CALL registrarAsistencia(${id});`
  );
  await endConection(database);
}

export async function cancelarCita(id) {
  let database = await startConection();
  let res = await database.execute(
    `CALL cancelarCita(${id});`
  )
  await endConection(database);
}

export async function checkFechaCita(emp, fecha, horaI, serv) {
  let database = await startConection();
  let res = await database.execute(
    `SELECT checkFechaCita(${emp}, "${fecha}", "${horaI}", '{"serv":[${serv}]}') AS temp;`
  );
  await endConection(database);
  return res;
}

export async function checkCliente(tel) {
  let database = await startConection();
  let res = await database.execute(`SELECT checkCliente("${tel}") AS temp;`);
  await endConection(database);
  return res;
}

export async function addCita(cliente, emp, fecha, hora, serv) {
  let database = await startConection();
  await database.execute(
    `CALL addCita(${cliente}, ${emp}, "${fecha}", "${hora}", '{"serv":[${serv}]}');`
  );
  await endConection(database);
}

export async function addCliente(nom, ap, am, tel) {
  let database = await startConection();
  await database.execute(
    `CALL addCliente("${nom}", "${ap}", "${am}", "${tel}");`
  );
  await endConection(database);
}

export async function addServCita(cita, serv) {
  let database = await startConection();
  await database.execute(`CALL addServiciosCita(${cita}, ${serv});`);
  await endConection(database);
}
