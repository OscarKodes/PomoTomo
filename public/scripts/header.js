let registerBtn = document.querySelector("#register-btn");
let registerForm = document.querySelector("#register-form");

registerBtn.addEventListener("click", function(){
  registerForm.classList.remove("invisible");
});
