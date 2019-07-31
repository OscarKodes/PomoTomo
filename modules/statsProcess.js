const express = require("express");

function statsProcess(days) {
  let statObj = {
    fiveAverage: 0,
    fiveTotal: 0,
    tenAverage: 0,
    tenTotal: 0,
    allAverage: 0,
    allTotal: 0
  }

  days.forEach(function(day, index){
    if (index < 5) {
      statObj.fiveTotal += day.pomos;
    }
    if (index < 10) {
      statObj.tenTotal += day.pomos;
    }
    statObj.allTotal += day.pomos;
  });

  statObj.fiveAverage = (statObj.fiveTotal / 5).toFixed(2);
  statObj.tenAverage = (statObj.tenTotal / 10).toFixed(2);
  statObj.allAverage = (statObj.allTotal / days.length).toFixed(2);

  return statObj;
}

module.exports = statsProcess;
