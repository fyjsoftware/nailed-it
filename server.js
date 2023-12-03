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
      console.log(request.body);
      let serv = [];
      for (let i = 0; i < request.body.serv.length; i++) {
        serv[i] = `"${request.body.serv[i]}"`;
      }
      let st = await database.checkCliente(request.body.tel);
      console.log(st);
      if (st[0][0].temp === 0) {
        await database.addCliente(
          request.body.nom,
          request.body.ap,
          request.body.am,
          request.body.tel
        );
      }
      let v1 = await database.getCliente(request.body.tel);
      console.log(v1);
      await database.addCita(
        v1[0][0].temp,
        request.body.emp,
        request.body.fecha,
        request.body.hora,
        serv
      );
      let v2 = await database.getCita(
        request.body.tel,
        request.body.fecha,
        request.body.hora
      );
      console.log(v2);
      for (let i = 0; i < serv.length; i++) {
        await database.addServCita(v2[0][0].temp, request.body.serv[i]);
      }
      response.end(); //Por Definir redirecionamiento al perfil
    } else {
      let json = await database.calendarioCl(request.body.emp);
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
