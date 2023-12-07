var idCita = 0;
var telCliente = 0;

function sacarElemento (el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
}

window.onclick = function (e) {
    if (e.target.className === "event" && e.target.querySelector('.idCita') !== null && e.target.querySelector('.telefonoCliente') !== null) {
        idCita = Number(e.target.querySelector('.idCita').innerHTML);
        telCliente = e.target.querySelector('.telefonoCliente').innerHTML;
    }
} 

window.onload = function() {
    document.getElementById("ajusteTrabajo").addEventListener("click", function() {
        document.getElementById("backgroundOverlay").style.display = "block";
        popupTrabajo.style.display = "block";
        guardarTrabajo.addEventListener("click", function() {
            let req = new XMLHttpRequest();
            let data = {
                accion: "perfil",
                nombre: document.getElementById("nombre").value,
                paterno: document.getElementById("paterno").value,
                materno: document.getElementById("materno").value,
                telefono: document.getElementById("telefono").value,
                correo: document.getElementById("correo").value,
                contrasena: document.getElementById("contrasena").value,
                horaEntrada: document.getElementById("horarioEntrada").value,
                horaSalida: document.getElementById("horarioSalida").value,
                descanso: document.getElementById("descanso").value,
                disponible: !(document.getElementById("inhabilitada").value)
            };
            req.onreadystatechange = function () {
                if (req.readyState == XMLHttpRequest.DONE) {
                    window.alert("Sus cambios están siendo guardados.");
                    window.location.reload();
                } 
              };
            req.onerror = function () {
                window.alert("Ocurrió un error al modificar su perfil.");
            }
            req.open("POST", "admin", true);
            req.setRequestHeader("Content-type", "application/json");
            req.send(JSON.stringify(data));
        });
        cerrarTrabajo.addEventListener("click", function() {
            document.getElementById("backgroundOverlay").style.display = "none";
            popupTrabajo.style.display = "none";
        });
    });

    document.getElementById("confirmarAsistencia").addEventListener("click", function() {
        if (window.confirm("Usted entiende que el cliente se comprometió en mutuo acuerdo a asistir a la cita. ¿Es correcto?")) {
            let req = new XMLHttpRequest();
            let data = { id: idCita, accion: "confirmar" };
            req.onreadystatechange = function () {
                if (req.readyState == XMLHttpRequest.DONE) {
                    window.alert("Se ha registrado la confirmación de la cita.");
                    window.location.reload();
                } 
              };
            req.onerror = function () {
                window.alert("Ocurrió un error al confirmar al cita.");
            }
            req.open("POST", "admin", true);
            req.setRequestHeader("Content-type", "application/json");
            req.send(JSON.stringify(data));
        }
    });

    document.getElementById("registrarAsistencia").addEventListener("click", function() {
        if (window.confirm("Usted está dando por hecho que el cliente asistió a la cita. Si es así, esta cita se archivará como \"atendida\". ¿Desea continuar?")) {
            let req = new XMLHttpRequest();
            let data = { id: idCita, accion: "registrar" };
            req.onreadystatechange = function () {
                if (req.readyState == XMLHttpRequest.DONE) {
                    window.alert("Se ha registrado la asistencia a la cita. Esta cita ya no puede ser modificada.");
                    window.location.reload();
                } 
              };
            req.onerror = function () {
                window.alert("Ocurrió un error al registrar la asistencia a la cita.");
            }
            req.open("POST", "admin", true);
            req.setRequestHeader("Content-type", "application/json");
            req.send(JSON.stringify(data));
        }
    });

    document.getElementById("enviarRecordatorio").addEventListener("click", function() {
        if (window.confirm("¿Desea enviar un recordatorio a la cliente sobre su cita?")) {
            let req = new XMLHttpRequest();
            let data = { id: idCita, accion: "recordatorio", telefono: telCliente };
            req.onreadystatechange = function () {
                if (req.readyState == XMLHttpRequest.DONE) {
                    window.alert("Se ha enviado un recordatorio por medio de SMS.");
                    window.location.reload();
                } 
              };
            req.onerror = function () {
                window.alert("Ocurrió un error al enviar el recordatorio de la cita.");
            }
            req.open("POST", "admin", true);
            req.setRequestHeader("Content-type", "application/json");
            req.send(JSON.stringify(data));
        }
    });

    document.getElementById("cancelarCita").addEventListener("click", function() {
        if (window.confirm("Usted está dando por hecho que la cliente canceló la cita. Si es así, esta cita se archivará como \"cancelada\". ¿Desea continuar?")) {
            let req = new XMLHttpRequest();
            let data = { id: idCita, accion: "cancelar" };
            req.onreadystatechange = function () {
                if (req.readyState == XMLHttpRequest.DONE) {
                    window.alert("Se ha cancelado la cita y se ha liberado el espacio en su agenda. Esta cita ya no puede ser modificada.");
                    window.location.reload();
                } 
              };
            req.onerror = function () {
                window.alert("Ocurrió un error al cancelar la cita.");
            }
            req.open("POST", "admin", true);
            req.setRequestHeader("Content-type", "application/json");
            req.send(JSON.stringify(data));
        }
    });

    document.getElementById("reagendarCita").addEventListener("click", function() {
        document.getElementById("backgroundOverlay").style.display = "block";
        popupCitas.style.display = "none";
        popupReagendar.style.display = "block";
        reagendarBoton.addEventListener("click", function() {
            let req = new XMLHttpRequest();
            let data = {
                id: idCita,
                accion: "reagendar",
                nuevaFecha: document.getElementById("nuevaFecha").value,
                nuevaHora: document.getElementById("nuevaHora").value
            };
            req.onreadystatechange = function () {
                if (req.readyState == XMLHttpRequest.DONE) {
                    window.alert("Se ha reagendado la cita.");
                    window.location.reload();
                } 
              };
            req.onerror = function () {
                window.alert("Ocurrió un error al reagendar la cita.");
            }
            req.open("POST", "admin", true);
            req.setRequestHeader("Content-type", "application/json");
            req.send(JSON.stringify(data));
            document.getElementById("backgroundOverlay").style.display = "none";
            popupReagendar.style.display = "none";
        });
        regresarCitas.addEventListener("click", function() {
            document.getElementById("backgroundOverlay").style.display = "block";
            popupReagendar.style.display = "none";
            popupCitas.style.display = "block";
        });
        cerrarReagendar.addEventListener("click", function() {
            document.getElementById("backgroundOverlay").style.display = "none";
            popupReagendar.style.display = "none";
            idCita = 0;
            telCliente = 0;
        });
    });

    document.getElementById("logout").addEventListener("click", function () {
        if (window.confirm("¿Desea cerrar su sesión?")) {
            window.location.href = "logout";
        }
    });
}