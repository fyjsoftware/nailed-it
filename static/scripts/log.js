const icono = document.getElementsByClassName("icono")[0];
const pass = document.getElementsByClassName("pass")[0];
let st = false;

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
});
