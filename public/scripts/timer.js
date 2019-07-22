/*jshint esversion: 6 */
/// DECLARE SELECTORS =======================
let startBtn = document.querySelector(".start-btn");
let pauseBtn = document.querySelector(".pause-btn");
let breakBtn = document.querySelector(".break-btn");
let skipBreakBtn = document.querySelector(".skip-break-btn");
let minDisplay = document.querySelector(".min");
let secDisplay = document.querySelector(".sec");
let pomosDisplay = document.querySelector(".pomos-done");
let allAlarmRadios = document.querySelectorAll(".alarmSounds input");
let allPomoUpRadios = document.querySelectorAll(".pomoUpSounds input");
let selectedAlarm, selectedPomoUp;

/// DECLARE VARIABLES ======================
let breakOn = false;
let pomoOn = false;
let pomosDone = 0;
let min, sec, countdown, skipMidBreak,
    chosenAlarm, alarm, chosenUpSound, pomoUpSound;

// DECLARE FUNCTIONS ===========================================

// This will set up the button event listeners & number displays
timerInit();

// INIT FUNCTION --------------------------------------
function timerInit() {
  pomoRoundSetup(); // sets up the min, sec, and start button
  pomosDisplay.innerText = pomosDone; // sets up the display for pomos done

  // set up all listeners for buttons
  setUpListeners();
  // set up all listeners for radio buttons
  setUpSoundPickListeners();

  // auto click on default sounds, so sounds are defined
  allAlarmRadios[0].click();
  allPomoUpRadios[0].click();
}

// SETUP Button Listeners --------------------------------
function setUpListeners(){

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
      pomoRoundSetup();
    }
  });
}

function setUpSoundPickListeners(){
  // add listeners to radio buttons for choosing an alarm sound
  allAlarmRadios.forEach(function(radioBtn){
    radioBtn.addEventListener("click", function(){
      selectedAlarm = document.querySelector(".alarmSounds input:checked");
      chosenAlarm = selectedAlarm.value;
      alarm = new Audio('/sounds/alarm' + chosenAlarm + '.ogg');
    });
  });

  // add listeners to radio buttons for choosing a pomoUp sound
  allPomoUpRadios.forEach(function(radioBtn){
    radioBtn.addEventListener("click", function(){
      selectedPomoUp = document.querySelector(".pomoUpSounds input:checked");
      chosenUpSound = selectedPomoUp.value;
      pomoUpSound = new Audio('/sounds/pomoUp' + chosenUpSound + '.ogg');
    });
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
        secDisplay.innerText = "00";
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
  } else {
    skipMidBreak = false;
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
