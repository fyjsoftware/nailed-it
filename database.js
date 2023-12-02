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

export async function getCliente(obj) {
  let database = await startConection();
  let res = await database.execute(`SELECT checkCliente("${obj.tel}");`);
  endConection(database);
  return res;
}

export async function getCita(obj) {
  let database = await startConection();
  await database.execute(
    `SELECT getCita("${obj.tel}", "${obj.fecha}", "${obj.hora}");`
  );
  endConection(database);
}

export async function addCita(cita) {
  let database = await startConection();
  await database.execute(
    `CALL addCita(${cita.cliente}, ${cita.emp}, "${cita.fecha}", "${cita.hora}", '"serv":{${cita.serv}}');`
  );
  endConection(database);
}

export async function addCliente(cliente) {
  let database = await startConection();
  await database.execute(
    `CALL addCliente("${cliente.nom}", "${cliente.ap}", "${cliente.am}", "${cliente.tel}");`
  );
  endConection(database);
}

export async function addServCita(obj) {
  let database = await startConection();
  await database.execute(`CALL addServiciosCita(${obj.serv}, ${obj.serv});`);
  endConection(database);
}

//export const database = await conexion();
//let consulta = await calendario();
//consulta = JSON.parse(consulta);
//let fecha = new Date(consulta[0][2].fecha);
//console.log(consulta[0]);
//await endConection(database);
