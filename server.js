import * as logger from "./logger.js";
import * as database from "./database.js";
import express, { query } from "express";
import bodyParser from "body-parser";
import * as fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = JSON.parse(
  await fs.readFile(new URL("./config.json", import.meta.url))
);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/static"));
//app.use(favicon(__dirname + "/static/favicon.ico"));

export async function iniciar() {
  /*app.use(async function (request, response) {
  response.setHeader('Content-Type', 'text/plain');
  console.log(request.body.data);
  response.end(request.body.data);
});*/

  app.get("/", async function (request, response) {
    await response.sendFile(__dirname + "/static/inicio.html");
  });

  //Agendar
  app.get("/agendar", async function (request, response) {
    await response.sendFile(__dirname + "/static/agendar.html");
  });

  app.post("/agendar", async function (request, response) {
    console.log(request.body.st);
    if (request.body.st === true) {
      if (database.getCliente(request.body.tel) === true) {
        //Obtener cliente
      } else {
        //Añadir cliente
      }
      let v1 = database.getCita({
        tel: request.body.tel,
        fecha: request.body.fecha,
        hora: request.body.hora,
      });
      database.addCita({
        cliente: null,
        emp: request.body.emp,
        fecha: request.body.fecha,
        hora: request.body.hora,
        serv: null,
      });
      for (let i = 0; i < serv.length; i++) {
        database.addServCita(v1, serv[i]);
      }
      response.end(); //Por Definir redirecionamiento al perfil
    } else {
      let json = await database.calendario(request.body.emp);
      console.log(json[0][0].temp);
      response.send(json[0][0].temp).end(); //Que haga algo
    }
  });

  // Login
  app.get("/login", async function (request, response) {
    await response.sendFile(__dirname + "/static/login.html");
  });

  app.post("/login", async function (request, response) {
    let st = false; //No da nada
    //Agregar procedimiento para login
    if (st === true) {
      //response.redirect("/login/user"); //Por Definir redirecionamiento al perfil
    } else {
      //response.send("ALGO"); //Que haga algo
    }
  });

  // Empleadas (POR DEFINIR)
  app.get("/login/user", async function (request, response) {
    //await response.sendFile(__dirname + "/static/login.html");
  });

  app.listen(config.puertos.http, config.host, async function () {
    await logger.info(
      "Servidor web iniciando en " + config.host + ":" + config.puertos.http
    );
  });
}

app.on("error", (err) => {
  throw err;
});
