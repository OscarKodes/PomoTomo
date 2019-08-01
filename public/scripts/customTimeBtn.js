let resetBtn = document.querySelector("#reset-btn");
let pomoMin = document.querySelector("#pomo-min");
let breakMin = document.querySelector("#break-min");
let longBreakMin = document.querySelector("#long-break-min");

resetBtn.addEventListener("click", function(){
  pomoMin.value = 25;
  breakMin.value = 5;
  longBreakMin.value = 15;
});
