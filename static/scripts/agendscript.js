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
  eventsContainer = document.querySelector(".events"); /*,
  addEventBtn = document.querySelector(".add-event"),
  addEventWrapper = document.querySelector(".add-event-wrapper "),
  addEventCloseBtn = document.querySelector(".close "),
  addEventTitle = document.querySelector(".event-name "),
  addEventFrom = document.querySelector(".event-time-from "),
  addEventTo = document.querySelector(".event-time-to "),
  addEventSubmit = document.querySelector(".add-event-btn ")*/

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

//function to add days in days with class day and prev-date next-date on previous month and next month
//days and active on today
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
    //check if event is present on that day
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

//function to add month and year on prev and next button
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

//function to add active on day
function addListner() {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      getActiveDay(e.target.innerHTML);
      updateEvents(Number(e.target.innerHTML));
      activeDay = Number(e.target.innerHTML);
      //remove active
      days.forEach((day) => {
        day.classList.remove("active");
      });
      //if clicked prev-date or next-date switch to that month
      if (e.target.classList.contains("prev-date")) {
        prevMonth();
        //add active to clicked day afte month is change
        setTimeout(() => {
          //add active where no prev-date or next-date
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
        //add active to clicked day afte month is changed
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

//function get active day, day name and date, and update eventday eventdate
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

//function update events when a day is active
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
              <i class="fa fa-circle"></i>
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
            <h3>Sin citas</h3>
        </div>`;
  }
  eventsContainer.innerHTML = events;
}
/*
document.addEventListener("click", (e) => {
  if (e.target !== addEventBtn && !addEventWrapper.contains(e.target)) {
    addEventWrapper.classList.remove("active");
  }
});

//allow 50 chars in eventtitle
addEventTitle.addEventListener("input", (e) => {
  addEventTitle.value = addEventTitle.value.slice(0, 60);
});

//allow only time in eventtime from and to
addEventFrom.addEventListener("input", (e) => {
  addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g, "");
  if (addEventFrom.value.length === 2) {
    addEventFrom.value += ":";
  }
  if (addEventFrom.value.length > 5) {
    addEventFrom.value = addEventFrom.value.slice(0, 5);
  }
});

addEventTo.addEventListener("input", (e) => {
  addEventTo.value = addEventTo.value.replace(/[^0-9:]/g, "");
  if (addEventTo.value.length === 2) {
    addEventTo.value += ":";
  }
  if (addEventTo.value.length > 5) {
    addEventTo.value = addEventTo.value.slice(0, 5);
  }
});*/

//function to add event to eventsArr
/*addEventSubmit.addEventListener("click", () => {
  const eventTitle = addEventTitle.value;
  const eventTimeFrom = addEventFrom.value;
  const eventTimeTo = addEventTo.value;
  if (eventTitle === "" || eventTimeFrom === "" || eventTimeTo === "") {
    alert("Please fill all the fields");
    return;
  }

  //check correct time format 24 hour
  const timeFromArr = eventTimeFrom.split(":");
  const timeToArr = eventTimeTo.split(":");
  if (
    timeFromArr.length !== 2 ||
    timeToArr.length !== 2 ||
    timeFromArr[0] > 23 ||
    timeFromArr[1] > 59 ||
    timeToArr[0] > 23 ||
    timeToArr[1] > 59
  ) {
    alert("Invalid Time Format");
    return;
  }

  const timeFrom = convertTime(eventTimeFrom);
  const timeTo = convertTime(eventTimeTo);

  //check if event is already added
  let eventExist = false;
  eventsArr.forEach((event) => {
    if (
      event.day === activeDay &&
      event.month === month + 1 &&
      event.year === year
    ) {
      event.events.forEach((event) => {
        if (event.title === eventTitle) {
          eventExist = true;
        }
      });
    }
  });
  if (eventExist) {
    alert("Event already added");
    return;
  }
  const newEvent = {
    title: eventTitle,
    time: timeFrom + " - " + timeTo,
  };
  console.log(newEvent);
  console.log(activeDay);
  let eventAdded = false;
  if (eventsArr.length > 0) {
    eventsArr.forEach((item) => {
      if (
        item.day === activeDay &&
        item.month === month + 1 &&
        item.year === year
      ) {
        item.events.push(newEvent);
        eventAdded = true;
      }
    });
  }

  if (!eventAdded) {
    eventsArr.push({
      day: activeDay,
      month: month + 1,
      year: year,
      events: [newEvent],
    });
  }

  console.log(eventsArr);
  addEventWrapper.classList.remove("active");
  addEventTitle.value = "";
  addEventFrom.value = "";
  addEventTo.value = "";
  updateEvents(activeDay);
  //select active day and add event class if not added
  const activeDayEl = document.querySelector(".day.active");
  if (!activeDayEl.classList.contains("event")) {
    activeDayEl.classList.add("event");
  }
});*/

//function to delete event when clicked on event
eventsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("event")) {
      document.getElementById("backgroundOverlay").style.display = "block";
      popupCitas.style.display = "block";
      cerrarCitas.addEventListener("click", function() {
          document.getElementById("backgroundOverlay").style.display = "none";
          popupCitas.style.display = "none";
      });
    /*if (confirm("Are you sure you want to delete this event?") && !window.location.href.includes("agendar")) {
      const eventTitle = e.target.children[0].children[1].innerHTML;
      eventsArr.forEach((event) => {
        if (
          event.day === activeDay &&
          event.month === month + 1 &&
          event.year === year
        ) {
          event.events.forEach((item, index) => {
            if (item.title === eventTitle) {
              event.events.splice(index, 1);
            }
          });
          //if no events left in a day then remove that day from eventsArr
          if (event.events.length === 0) {
            eventsArr.splice(eventsArr.indexOf(event), 1);
            //remove event class from day
            const activeDayEl = document.querySelector(".day.active");
            if (activeDayEl.classList.contains("event")) {
              activeDayEl.classList.remove("event");
            }
          }
        }
      });
      updateEvents(activeDay);
    }*/
  }
});

function setEmpServ(emp) {
  itemForm = document.getElementById("form" + emp);
  checkBoxes = itemForm.querySelectorAll('input[type="checkbox"]');
}

function setCleanServ(sCheckbox) {
  if (window.location.href.includes("agendar")) {
    for (let i = 1; i < 6; i++) {
      setEmpServ(i);
      if (i !== sCheckbox) {
        checkBoxes.forEach((checkbox) => {
          checkbox.checked = false;
        });
      }
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
        title: window.location.href.includes("agendar") ? "Ocupado" : events[i].servicio + "<div class=\"idCita\" style=\"display: none;\">" + events[i].id + "</div><div class=\"telefonoCliente\" style=\"display: none;\">" + events[i].telefono + "</div>",
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
  //convert time to 24 hour format
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
    agendar: window.location.href.includes("agendar")
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
    window.location = "/";
  });
}