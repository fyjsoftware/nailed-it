const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  dateInput = document.querySelector(".date-input"),
  eventDay = document.querySelector(".event-day"),
  eventDate = document.querySelector(".event-date"),
  eventsContainer = document.querySelector(".events");

var itemForm;
var checkBoxes;

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

let eventsArr = [];
let serv;
let eventsCal;
let actualEmp;

document.addEventListener("DOMContentLoaded", function () {
  var cards = document.querySelectorAll(".card");
  cards.forEach(function (card) {
    card.addEventListener("click", function () {
      focus(card);
    });
  });
});

function focus(card) {
  card.classList.add("focus");
  var otherCards = document.querySelectorAll(".card");
  otherCards.forEach(function (otherCard) {
    if (otherCard !== card) {
      otherCard.classList.remove("focus");
    }
  });
}

function initCalendar() {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  date.innerHTML = months[month] + " " + year;

  let days = "";

  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    let event = false;
    eventsArr.forEach((eventObj) => {
      if (
        eventObj.day === i &&
        eventObj.month === month + 1 &&
        eventObj.year === year
      ) {
        event = true;
      }
    });
    if (
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
    ) {
      activeDay = i;
      getActiveDay(i);
      updateEvents(i);
      if (event) {
        days += `<div class="day today active event">${i}</div>`;
      } else {
        days += `<div class="day today active">${i}</div>`;
      }
    } else {
      if (event) {
        days += `<div class="day event">${i}</div>`;
      } else {
        days += `<div class="day ">${i}</div>`;
      }
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }
  daysContainer.innerHTML = days;
  addListner();
}

function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
}

function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
}

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

initCalendar();

function addListner() {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      getActiveDay(e.target.innerHTML);
      updateEvents(Number(e.target.innerHTML));
      activeDay = Number(e.target.innerHTML);
      days.forEach((day) => {
        day.classList.remove("active");
      });
      if (e.target.classList.contains("prev-date")) {
        prevMonth();
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("prev-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else if (e.target.classList.contains("next-date")) {
        nextMonth();
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("next-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else {
        e.target.classList.add("active");
      }
    });
  });
}

function getActiveDay(date) {
  const day = new Date(year, month, date);
  const dayName = daysIndex(day.getDay());
  eventDay.innerHTML = dayName;
  eventDate.innerHTML = date + " " + months[month] + " " + year;
}

function daysIndex(day) {
  let res;
  switch (day) {
    case 0:
      res = "Dom";
      break;
    case 1:
      res = "Lun";
      break;
    case 2:
      res = "Mar";
      break;
    case 3:
      res = "Mie";
      break;
    case 4:
      res = "Jue";
      break;
    case 5:
      res = "Vie";
      break;
    case 6:
      res = "Sab";
      break;
    default:
      res = null;
      break;
  }
  return res;
}

function updateEvents(date) {
  let events = "";
  eventsArr.forEach((event) => {
    if (
      date === event.day &&
      month + 1 === event.month &&
      year === event.year
    ) {
      event.events.forEach((event) => {
        events += `<div class="event">
            <div class="title">
              <i class="fas fa-circle"></i>
              <h3 class="event-title">${event.title}</h3>
            </div>
            <div class="event-time">
              <span class="event-time">${event.time}</span>
            </div>
        </div>`;
      });
    }
  });
  if (events === "") {
    events = `<div class="no-event">
            <h3>Sin Citas</h3>
        </div>`;
  }
  eventsContainer.innerHTML = events;
}

function setEmpServ(emp) {
  switch (emp) {
    case 1:
      itemForm = document.getElementById("form1");
      checkBoxes = itemForm.querySelectorAll('input[type="checkbox"]');
      break;
    case 2:
      itemForm = document.getElementById("form2");
      checkBoxes = itemForm.querySelectorAll('input[type="checkbox"]');
      break;
    case 3:
      itemForm = document.getElementById("form3");
      checkBoxes = itemForm.querySelectorAll('input[type="checkbox"]');
      break;
    case 4:
      itemForm = document.getElementById("form4");
      checkBoxes = itemForm.querySelectorAll('input[type="checkbox"]');
      break;
    case 5:
      itemForm = document.getElementById("form5");
      checkBoxes = itemForm.querySelectorAll('input[type="checkbox"]');
      break;

    default:
      break;
  }
}

function setCleanServ(sCheckbox) {
  for (let i = 1; i < 6; i++) {
    setEmpServ(i);
    if (i !== sCheckbox) {
      checkBoxes.forEach((checkbox) => {
        checkbox.checked = false;
      });
    }
  }
}

function cleanEvents() {
  while (eventsArr.length > 0) {
    eventsArr.pop();
  }
}

function getServ() {
  setEmpServ(actualEmp);
  serv = [];
  try {
    checkBoxes.forEach((item) => {
      if (item.checked) {
        serv.push(item.value);
      }
    });
  } catch (TypeError) {}
}

function setEventsCal(events) {
  if (events != null) {
    for (let i = 0; i < events.length; i++) {
      const newEvent = {
        //title: events[i].servicio, Para el cal del Emp
        title: "Ocupado",
        time:
          convertTime(events[i].horaI) + " - " + convertTime(events[i].horaF),
      };
      eventsArr.push({
        day: new Date(events[i].fecha).getDate() + 1,
        month: new Date(events[i].fecha).getMonth() + 1,
        year: new Date(events[i].fecha).getFullYear(),
        events: [newEvent],
      });
    }
  }
  initCalendar();
}

function validarDatos(datos) {
  if (!(new Date() > datos.fecha)) {
    if (datos.serv.length > 0) {
      if (datos.tel.length === 10) {
        if (validarTiempo(datos.hora) === true) {
          return true;
        }
      }
    }
  }
  return false;
}

function validarTiempo(tiempo) {
  let arr = tiempo.split(":");
  let hor = arr[0];
  let min = arr[1];
  if (hor < 0 || hor > 23) {
    return false;
  } else if (min < 0 || min > 59) {
    return false;
  } else {
    return true;
  }
}

function convertTime(time) {
  let timeArr = time.split(":");
  let timeHour = timeArr[0];
  let timeMin = timeArr[1];
  let timeFormat = timeHour >= 12 ? "PM" : "AM";
  timeHour = timeHour % 12 || 12;
  time = timeHour + ":" + timeMin + " " + timeFormat;
  return time;
}

function sendCalData(emp) {
  actualEmp = emp;
  const req = new XMLHttpRequest();
  let calData = {
    emp: emp,
    st: false,
  };
  req.onreadystatechange = function () {
    if (req.readyState == XMLHttpRequest.DONE) {
      setCleanServ(actualEmp);
      cleanEvents();
      try {
        eventsCal = JSON.parse(req.responseText);
        setEventsCal(eventsCal);
      } catch (SyntaxError) {
        initCalendar();
      }
    }
  };
  req.open("POST", "agendar", true);
  req.setRequestHeader("Content-type", "application/json");
  req.send(JSON.stringify(calData));
}

function sendCita() {
  getServ();
  const req = new XMLHttpRequest();
  let acMonth = today.getMonth() + 1;
  let f = `${year}-${acMonth}-${activeDay}`;
  let cita = {
    fecha: f,
    hora: document.getElementById("hour").value,
    nom: document.getElementById("name").value,
    ap: document.getElementById("ap").value,
    am: document.getElementById("am").value,
    tel: document.getElementById("tel").value,
    emp: actualEmp,
    serv: serv,
    st: true,
  };
  let st = validarDatos(cita);
  if (st === true) {
    req.onreadystatechange = function () {
      if (req.readyState == XMLHttpRequest.DONE) {
        if (req.responseText === "true") {
          console.log(req.responseText);
          setNotif();
        } else {
          console.log(req.responseText);
          setError2();
        }
      }
    };
    req.open("POST", "agendar", true);
    req.setRequestHeader("Content-type", "application/json");
    req.send(JSON.stringify(cita));
  } else {
    setError1();
  }
}

function setError1() {
  const popupError1 = document.getElementById("popupError1");
  const cerrarError1 = document.getElementById("cerrarError1");
  document.getElementById("backgroundOverlay").style.display = "block";
  popupError1.style.display = "block";
  cerrarError1.addEventListener("click", function () {
    document.getElementById("backgroundOverlay").style.display = "none";
    popupError1.style.display = "none";
  });
}

function setError2() {
  const popupError2 = document.getElementById("popupError2");
  const cerrarError2 = document.getElementById("cerrarError2");
  document.getElementById("backgroundOverlay").style.display = "block";
  popupError2.style.display = "block";
  cerrarError2.addEventListener("click", function () {
    document.getElementById("backgroundOverlay").style.display = "none";
    popupError2.style.display = "none";
  });
}

function setNotif() {
  const popupNotif = document.getElementById("popupNotif");
  const cerrarNotif = document.getElementById("cerrarNotif");
  document.getElementById("backgroundOverlay").style.display = "block";
  popupNotif.style.display = "block";
  cerrarNotif.addEventListener("click", function () {
    document.getElementById("backgroundOverlay").style.display = "none";
    popupNotif.style.display = "none";
    window.location = "http://207.231.110.51/";
  });
}
