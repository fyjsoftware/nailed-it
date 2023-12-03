import * as mysql from "mysql2/promise";
import * as fs from "fs/promises";
//import { fileURLToPath } from "url"; SIN INSTALAR
// import path from "path"; SIN INSTALAR

const config = JSON.parse(
  await fs.readFile(new URL("./config.json", import.meta.url))
);

//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);

export async function startConection() {
  console.log("DB Conection Started!");
  return await mysql.createConnection({
    host: config.testing ? config.hostSecundario : config.host,
    port: config.puertos.db,
    user: config.db.usuario,
    password: config.db.password,
    database: config.db.baseDatos,
  });
}

export async function endConection(db) {
  console.log("DB Conection Finished!");
  db.end;
}

export async function calendario(emp) {
  let database = await startConection();
  let e = parseInt(emp);
  let citas = await database.execute(
    `SELECT getCitasCalendario(${e}) AS temp;`
  );
  endConection(database);
  return citas;
}

export async function calendarioCl(emp) {
  let database = await startConection();
  let e = parseInt(emp);
  let citas = await database.execute(
    `SELECT getCitasCalendarioCl(${e}) AS temp;`
  );
  endConection(database);
  return citas;
}

export async function getCliente(tel) {
  let database = await startConection();
  let res = await database.execute(`SELECT getCliente("${tel}") AS temp;`);
  endConection(database);
  return res;
}

export async function getCita(tel, fecha, hora) {
  console.log(tel);
  console.log(fecha);
  console.log(hora);
  let database = await startConection();
  let res = await database.execute(
    `SELECT getCita("${tel}", "${fecha}", "${hora}") AS temp;`
  );
  endConection(database);
  return res;
}

export async function checkCliente(tel) {
  let database = await startConection();
  let res = await database.execute(`SELECT checkCliente("${tel}") AS temp;`);
  endConection(database);
  return res;
}

export async function addCita(cliente, emp, fecha, hora, serv) {
  let database = await startConection();
  await database.execute(
    `CALL addCita(${cliente}, ${emp}, "${fecha}", "${hora}", '{"serv":[${serv}]}');`
  );
  endConection(database);
}

export async function addCliente(nom, ap, am, tel) {
  let database = await startConection();
  await database.execute(
    `CALL addCliente("${nom}", "${ap}", "${am}", "${tel}");`
  );
  endConection(database);
}

export async function addServCita(cita, serv) {
  let database = await startConection();
  await database.execute(`CALL addServiciosCita(${cita}, ${serv});`);
  endConection(database);
}

//export const database = await conexion();
//let consulta = await calendario();
//consulta = JSON.parse(consulta);
//let fecha = new Date(consulta[0][2].fecha);
//console.log(consulta[0]);
//await endConection(database);
