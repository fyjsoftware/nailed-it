window.onload = function () {
    document.getElementById("administrarCitas").addEventListener("click", function() {
        document.getElementById("backgroundOverlay").style.display = "block";
        popupCitas.style.display = "block";
        cerrarCitas.addEventListener("click", function() {
            document.getElementById("backgroundOverlay").style.display = "none";
            popupCitas.style.display = "none";
        });
    });

    document.getElementById("ajusteTrabajo").addEventListener("click", function() {
        document.getElementById("backgroundOverlay").style.display = "block";
        popupTrabajo.style.display = "block";
        cerrarTrabajo.addEventListener("click", function() {
            document.getElementById("backgroundOverlay").style.display = "none";
            popupTrabajo.style.display = "none";
        });
    });

    document.getElementById("notif").addEventListener("click", function() {
        document.getElementById("backgroundOverlay").style.display = "block";
        popupNotif.style.display = "block";
        cerrarNotif.addEventListener("click", function() {
            document.getElementById("backgroundOverlay").style.display = "none";
            popupNotif.style.display = "none";
        });
    });

    document.getElementById("logout").addEventListener("click", function() {
        if (window.confirm("¿Desea cerrar su sesión?")) {
            window.location.href = "logout";
        }
    });
}