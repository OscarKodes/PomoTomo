/// DECLARE SELECTORS AND VARIABLES =======================
let startBtn = document.querySelector(".start-btn");
let pauseBtn = document.querySelector(".pause-btn");
let breakBtn = document.querySelector(".break-btn");
let skipBreakBtn = document.querySelector(".skip-break-btn");
let minDisplay = document.querySelector(".min");
let secDisplay = document.querySelector(".sec");
let pomosDisplay = document.querySelector(".pomos-done");
let breakOn = false;
let pomoOn = false;
let alarm = new Audio('/sounds/alarmDefault.ogg');
let pomoUpSound = new Audio('/sounds/pomoUpDefault.ogg');
let pomosDone = 0;
let min, sec, countdown, skipMidBreak;

// DECLARE FUNCTIONS ===========================================

// This will set up the button event listeners & number displays
timerInit();

// INIT FUNCTION --------------------------------------
function timerInit() {
  pomoRoundSetup(); // sets up the min, sec, and start button
  pomosDisplay.innerText = pomosDone; // sets up the display for pomos done

  // Add event listeners - - - - - - - - -
  startBtn.addEventListener("click", function(){
    startBtn.classList.add("invisible");
    pauseBtn.classList.remove("invisible");
    pomoOn = true;
    countdownOn();
  });

  pauseBtn.addEventListener("click", function(){
    startBtn.classList.remove("invisible");
    pauseBtn.classList.add("invisible");
    pomoOn = false;
    clearTimeout(countdown);
  });

  breakBtn.addEventListener("click", function(){
    breakBtn.classList.add("invisible");
    breakOn = true;
    pomoUp();
    countdownOn();
  });

  skipBreakBtn.addEventListener("click", function(){
    if (breakOn) {
      skipMidBreak = true;
      clearTimeout(countdown);
      timesUp();
    } else {
      pomoUp();
      pomoRoundSetup()
    }
  });
}

// SETUP PomoROUND AND BREAK FUNCTIONS -------------------------------
function breakRoundSetup(){
  min = 5;
  sec = 0;
  minDisplay.innerText = min;
  secDisplay.innerText = "00";
  breakBtn.classList.remove("invisible");
  skipBreakBtn.classList.remove("invisible");
  pauseBtn.classList.add("invisible");
}

function pomoRoundSetup(){
  min = 25;
  sec = 0;
  minDisplay.innerText = min;
  secDisplay.innerText = "00";
  startBtn.classList.remove("invisible");
  breakBtn.classList.add("invisible");
  skipBreakBtn.classList.add("invisible");
}

// COUNTDOWN, TIMES UP, and PomoRounds done FUNCTIONS--------------------
function countdownOn() {
  countdown = // declaring it as a variable we can use clearTimeout()
    setTimeout(function () {
      sec--;
      if (sec + min === 0) {
        // timesUp will end the recursion by making pomoOn & breakOn false
        timesUp();
      } else if (sec === -1) {
        sec = 59;
        min--;
        secDisplay.innerText = sec;
        minDisplay.innerText = min;
      } else if (sec < 10) {
        secDisplay.innerText = "0" + String(sec);
      } else if (sec === 60) {
        secDisplay.innerText = 00;
      } else {
        secDisplay.innerText = sec;
      }
      // check pomoOn and breakOn are true to know we're still counting
      // use recursive case to call upon countdownOn again
      if (pomoOn || breakOn) {
        countdownOn();
      }
    }, 1000);
}

function timesUp() {
  clearTimeout(countdown);
  if (!skipMidBreak) {
    alarm.play();
  }
  if (pomoOn) {
    pomoOn = false;
    breakRoundSetup();
  } else if (breakOn) {
    breakOn = false;
    pomoRoundSetup();
  }
}

function pomoUp(){
  pomosDone++;
  pomosDisplay.innerText = pomosDone;
  pomoUpSound.play();
}
