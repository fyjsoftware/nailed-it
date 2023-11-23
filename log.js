const icono = document.getElementsByClassName("icono")[0];
const pass = document.getElementsByClassName("pass")[0];
let st = false;

function login() {
  var m = document.getElementsByClassName("mail")[0].value;
  var p = document.getElementsByClassName("pass")[0].value;
  console.log("Email: " + m);
  console.log("Password: " + p);
}

icono.addEventListener("click", () => {
  let i = "";
  let type = "";
  if (st === false) {
    st = true;
    i = '<i class="fa fa-unlock" style="color:#F861AA; margin-left:100%" ></i>';
    type = "text";
  } else {
    st = false;
    i = '<i class="fa fa-lock" style="color:#F861AA; margin-left:100%" ></i>';
    type = "password";
  }
  icono.innerHTML = i;
  pass.setAttribute("type", type);
  console.log(1);
});
