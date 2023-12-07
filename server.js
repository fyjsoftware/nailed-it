import * as logger from "./logger.js";
import * as database from "./database.js";
import * as sms from "./sms.js";
import * as correo from "./email.js";
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

app.use(
  session({
    secret: uuidv4(),
    resave: true,
    saveUninitialized: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/static"));
app.use(favicon(__dirname + "/static/sources/favicon.ico"));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

export async function iniciar() {
  app.get("/", async function (request, response) {
    if (request.session.loggedin) {
      console.log(request.session.email);
      let datos = await database.getEmpleada({ email: request.session.email });
      let servicios = await database.getServicios();
      let servEmp = await database.getServEmp(datos.PKIdEmpleado);
      let listaEmpleado = [];
      let listaServicios = [];
      for (var i = 0; i < servicios.length; i++) {
        listaServicios.push(servicios[i].tipoServicio);
      }
      for (var i = 0; i < servEmp.length; i++) {
        listaEmpleado.push(listaServicios[servEmp[i].FKIdServicio - 1]);
      }
      await response.render("empleada", {
        id: datos.PKIdEmpleado,
        usuario: datos.nombre,
        nombre: datos.nombre + " " + datos.paterno + " " + datos.materno,
        servicios: listaEmpleado,
        listaServicios: servicios,
        telefono: datos.telefono,
        correo: request.session.email
      });
    } else {
      await response.sendFile(__dirname + "/static/inicio.html");
    }
  });

  //Agendar
  app.get("/agendar", async function (request, response) {
    if (!request.session.loggedin) {
      let datos = await database.getEmpleados();
      let servicios = await database.getServicios();
      let listaServicios = [];
      for (var h = 0; h < servicios.length; h++) {
        listaServicios.push({id: servicios[h].PKIdServicio , nombre: servicios[h].tipoServicio});
      }
      let empl = [];
      for (var i = 0; i < datos.length; i++) {
        let servEmp = await database.getServEmp(datos[i].PKIdEmpleado);
        empl.push({ id: datos[i].PKIdEmpleado, nombre: datos[i].nombre,
                    servicios: servEmp, telefono: datos[i].telefono });
        let listaEmpleado = [];
        for (var j = 0; j < empl[i].servicios.length; j++) {
          listaEmpleado.push(listaServicios[empl[i].servicios[j].FKIdServicio - 1]);
        }
        empl[i].servicios = listaEmpleado;
      }
      console.log(datos.length)
      await response.render("agendar", {
        empleados: empl
      });
    } else {
      await response.redirect("/");
    }
  });

  app.post("/agendar", async function (request, response) {
    console.log(request.body.st);
    if (request.body.st === true) {
      console.log(request.body);
      let serv = [];
      let val = await database.checkFechaCita(
        request.body.emp,
        request.body.fecha,
        request.body.hora,
        request.body.serv
      );
      console.log(val);
      if (val[0][0].temp === 1) {
        response.send("false").end();
      } else {
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
        response.send("true").end();
      }
    } else {
      let json;
      if (request.body.agendar) {
        json = await database.calendarioCl(request.body.emp);
      } else {
        json = await database.calendario(request.body.emp);
      }
      console.log(json[0][0].temp);
      await response.send(json[0][0].temp).end();
    }
  });
  // Login
  app.get("/login", async function (request, response) {
    await response.sendFile(__dirname + "/static/login.html");
  });

  app.get("/confirmar/:id", async function (request, response) {
    try {
      await database.confirmarCita(request.params.id);
      await response.status(200).send(
        `<script>window.alert("Su asistencia ha sido confirmada. Muchas gracias. Ya puede cerrar esta página.");</script>`
      );
    } catch {
      await response.status(400).send(
        `<script>window.alert("Ocurrió un error. Intente de nuevo más tarde.");</script>`
      );
    }
  });

  app.post("/admin", async function (request, response) {
    try {
      if (request.body.accion === "confirmar") {
          await database.confirmarCita(request.body.id);
          await correo.enviar(request.session.email, "NOTIFICACIÓN: Confirmación de una cita", "Se le notifica que por medio de la plataforma web se ha confirmado la asistencia a una cita que se tiene programada. Revise su interfaz de empleado para más información.");
          await response.status(200).send(true).end();
      }

      if (request.body.accion === "registrar") {
          await database.registrarAsistencia(request.body.id);
          await correo.enviar(request.session.email, "NOTIFICACIÓN: Cita atendida", "Se le notifica que por medio de la plataforma web se ha registrado la asistencia a una cita y esta ya no aparecerá en su interfaz.");
          await response.status(200).send(true).end();
      }

      if (request.body.accion === "cancelar") {
          await database.cancelarCita(request.body.id);
          await correo.enviar(request.session.email, "NOTIFICACIÓN: Cancelación de una cita", "Se le notifica que por medio de la plataforma web se ha cancelado una cita que se tenía programada y esta ya no aparecerá en su interfaz.");
          await response.status(200).send(true).end();
      }

      if (request.body.accion === "recordatorio") {
        let datos = await database.getCitaSMS(request.body.telefono);
        await sms.enviar("+52" + request.body.telefono, "LOVE FOR NAILS le recuerda su cita: " + datos.fecha + ", " + datos.hora + " hrs. Por favor, confirme su asistencia.");
        await sms.enviar("+52" + request.body.telefono, "http://" + config.host + "/confirmar/" + request.body.id);
        await response.status(200).send(true).end();
      }

      if (request.body.accion === "reagendar") {
        await database.reagendarCita({
          id: request.body.id,
          nuevaFecha: request.body.nuevaFecha,
          nuevaHora: request.body.nuevaHora
        });
        await correo.enviar(request.session.email, "NOTIFICACIÓN: Confirmación de una cita", "Se le notifica que por medio de la plataforma web se ha reagendado una cita. Por favor, notifique al cliente y asegúrese de haberlo contactado antes.");
        await response.status(200).send(true).end();
      }

      if (request.body.accion === "perfil") {
        try {
          await database.modificarEmpleada({
            id: request.body.id,
            nombre: (request.body.nombre.trim() !== "" ? request.body.nombre : null),
            paterno: (request.body.paterno.trim() !== "" ? request.body.paterno : null),
            materno: (request.body.materno.trim() !== "" ? request.body.materno : null),
            telefono: ((request.body.telefono.trim() !== "" || isNaN(request.body.telefono)) ? request.body.telefono : null),
            correo: (request.body.correo.trim() !== "" ? request.body.correo : null),
            contrasena: (request.body.contrasena.trim() !== "" ? request.body.contrasena : null),
            horaEntrada: (request.body.horaEntrada.includes(":") ? request.body.horaEntrada : null),
            horaSalida: (request.body.horaSalida.includes(":") !== "" ? request.body.horaSalida : null),
            descanso: (isNaN(request.body.descanso) ? request.body.descanso : null),
            disponible: request.body.disponible,
            servicios: request.body.servicios });
          await response.status(200).send(true).end();
        } catch {
          await response.status(400).send(
            `<script>window.alert("Formato de datos incorrecto. Por favor, vuelva a revisar su información e intente de nuevo.");</script>`
          ).end();
        }
      }
      
    } catch (error) {
      await response.status(400).send(
        `<script>window.alert("Ocurrió un error inesperado. Por favor, intente más tarde.");</script>`
      ).end();
    }
  });

  app.post("/login", async function (request, response) {
    let login = await database.getLogin({
      email: request.body.email,
      password: request.body.password,
    });
    if (login) {
      request.session.loggedin = true;
      request.session.email = request.body.email;
      await response.redirect("/");
    } else {
      await response.send(
        `<script>window.alert("Email o contraseña incorrecta. Por favor, verifique e intente de nuevo."); history.back();</script>`
      );
    }
  });

  app.get("/logout", async function (request, response) {
    await request.session.destroy();
    await response.redirect("/");
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
