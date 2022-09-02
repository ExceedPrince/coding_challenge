const bakeryData = require('./bakery.json');
const allProfit = require("./tasks/task_01_allProfit.js");
const freeStuffs = require("./tasks/task_02_freeStuffs.js");
const actualProfit = require("./tasks/task_03_actualProfit.js");
const focusOnOne = require("./tasks/task_04_focusOnOne.js");
const maffia = require("./tasks/task_05_maffia.js");
const futureInventory = require("./tasks/task_06_futureInventory.js");

allProfit(bakeryData);
freeStuffs(bakeryData);
actualProfit(bakeryData);
focusOnOne(bakeryData);
maffia(bakeryData);
//futureInventory(bakeryData);