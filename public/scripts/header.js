let registerBtn = document.querySelector("#register-btn");
let registerForm = document.querySelector("#register-form");
let closeBtn = document.querySelector(".fa-window-close");
let outsideForm = document.querySelector(":not(#register-card)");

registerBtn.addEventListener("click", function(){
  registerForm.classList.remove("invisible");
});

closeBtn.addEventListener("click", function(){
  registerForm.classList.add("invisible");
});
