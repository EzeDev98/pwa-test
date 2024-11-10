/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./public/src/senderSuccessPage.js":
/*!*****************************************!*\
  !*** ./public/src/senderSuccessPage.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _time__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./time */ \"./public/src/time.js\");\n\nconst time = new _time__WEBPACK_IMPORTED_MODULE_0__.CurrentDateInfo();\n\nconst doneTransfer = document.getElementById(\"done\");\nconst timeDisplay = document.getElementById(\"date\");\nconst amountDispplay = document.getElementById(\"amount\");\nconst descriptionDisplay = document.getElementById(\"description\");\nconst successDisplay = document.getElementById(\"success\");\nconst idDisplay = document.getElementById(\"wm-id\");\nconst name = document.getElementById(\"name\");\n\nconst newName = localStorage.getItem(\"newName\");\nconst newAmount = localStorage.getItem(\"newAmount\");\nconst newDescription = localStorage.getItem(\"newDescription\");\nconst newReceivedId = localStorage.getItem(\"receiver_wmId\");\nconst receiver_phoneNumber = localStorage.getItem(\"sender_phone_number\");\n\nfunction showReceipt() {\n  name.innerHTML = `${newName}, ${receiver_phoneNumber}`;\n  successDisplay.innerHTML = newAmount;\n  timeDisplay.innerHTML = `${time.getFormattedDate()}, ${time.getDayName()}`;\n  amountDispplay.innerHTML = newAmount;\n  descriptionDisplay.innerHTML = newDescription;\n  idDisplay.innerHTML = newReceivedId;\n}\n\ndoneTransfer.addEventListener(\"click\", () => {\n  localStorage.removeItem(\"newAmount\");\n  localStorage.removeItem(\"newDescription\");\n});\n\nshowReceipt();\n\nconsole.log(showReceipt()); \n\n\n//# sourceURL=webpack://wm-offline-pay/./public/src/senderSuccessPage.js?");

/***/ }),

/***/ "./public/src/time.js":
/*!****************************!*\
  !*** ./public/src/time.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   CurrentDateInfo: () => (/* binding */ CurrentDateInfo)\n/* harmony export */ });\nclass CurrentDateInfo {\n  constructor() {\n    this.currentDate = new Date();\n  }\n\n  getFormattedDate() {\n    const day = this.currentDate.getDate();\n    const month = this.currentDate.getMonth() + 1;\n    const year = this.currentDate.getFullYear() % 100;\n    return `${day.toString().padStart(2, \"0\")}-${month\n      .toString()\n      .padStart(2, \"0\")}-${year.toString().padStart(2, \"0\")}`;\n  }\n  getFormattedTime() {\n    const hours = this.currentDate.getHours();\n    const minutes = this.currentDate.getMinutes();\n    const seconds = this.currentDate.getSeconds();\n    return `${hours.toString().padStart(2, \"0\")}:${minutes\n      .toString()\n      .padStart(2, \"0\")}:${seconds.toString().padStart(2, \"0\")}`;\n  }\n\n  getFormattedDateTime() {\n    return `${this.getFormattedDate()} ${this.getFormattedTime()}`;\n  }\n\n  getDayName() {\n    return this.currentDate.toLocaleString(\"en-US\", { weekday: \"long\" });\n  }\n}\n\n\n\n\n//# sourceURL=webpack://wm-offline-pay/./public/src/time.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./public/src/senderSuccessPage.js");
/******/ 	
/******/ })()
;