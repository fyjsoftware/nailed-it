import * as logger from "./logger.js";
import * as database from "./database.js";
import express, { query } from "express";
import bodyParser from "body-parser";
import favicon from "serve-favicon";
import * as fs from "fs/promises";
import session from "express-session";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = JSON.parse(
  await fs.readFile(new URL("./config.json", import.meta.url))
);

const app = express();

app.use(session({
	secret: uuidv4(),
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/static"));
app.use(favicon(__dirname + "/static/sources/favicon.ico"));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

export async function iniciar() {
  app.get("/", async function (request, response) {
    if (request.session.loggedin) {
      console.log(request.session.email)
      let datos = await database.getEmpleada({email: request.session.email});
      await response.render('empleada', {
        id: datos.PKIdEmpleado,
        usuario: datos.nombre,
        nombre: datos.nombre + " " + datos.paterno + " " + datos.materno,
        servicios: ["PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE"],
        telefono: datos.telefono
    });
    } else {
      await response.sendFile(__dirname + "/static/inicio.html");
    }
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
    let login = await database.getLogin({email: request.body.email, password: request.body.password});
    if (login) {
      request.session.loggedin = true;
      request.session.email = request.body.email;
      await response.redirect('/');
    } else {
      await response.send(`<script>window.alert("Email o contraseña incorrecta. Por favor, verifique e intente de nuevo."); history.back();</script>`);
    }
  });

  app.get("/logout", async function (request, response) {
    await request.session.destroy();
    await response.redirect('/');
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
