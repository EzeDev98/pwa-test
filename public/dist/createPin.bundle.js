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

/***/ "./public/src/config/config.js":
/*!*************************************!*\
  !*** ./public/src/config/config.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nconst config = {\n    baseURL: 'http://localhost:50000/api/v1',\n    baseURL: 'https://opy.thewealthmarket.com/api/v1'\n    // baseURL: 'https://cdd5-102-89-23-191.ngrok-free.app/api/v1',\n};\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (config);\n\n//# sourceURL=webpack://wm-offline-pay/./public/src/config/config.js?");

/***/ }),

/***/ "./public/src/createPin.js":
/*!*********************************!*\
  !*** ./public/src/createPin.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _config_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config/config */ \"./public/src/config/config.js\");\n\n\nconst pin = document.getElementById(\"pin\");\nconst checkPin = document.getElementById(\"checkPin\");\nconst submitButton = document.getElementById(\"submitButton\");\nconst phoneNumber = localStorage.getItem(\"phone_number\");\nconst token = localStorage.getItem(\"token\");\n\nfunction showLoadingSpinner() {\n  let loadingSpinner = document.getElementById(\"loadingSpinner\");\n  loadingSpinner.classList.remove(\"d-none\");\n}\n\nfunction hideLoadingSpinner() {\n  let loadingSpinner = document.getElementById(\"loadingSpinner\");\n  loadingSpinner.classList.add(\"d-none\");\n}\n\nfunction checkPinEquality() {\n  showLoadingSpinner();\n\n  const enteredPin = pin.value;\n  const enteredCheckPin = checkPin.value;\n\n  if (enteredPin === enteredCheckPin) {\n    console.log(\"Pins match!\");\n\n    const requestData = {\n      pin: parseInt(enteredPin),\n      phoneNumber: phoneNumber,\n    };\n    console.log(requestData);\n\n    if (navigator.onLine) {\n      fetch(`${_config_config__WEBPACK_IMPORTED_MODULE_0__[\"default\"].baseURL}/user/set-pin`, {\n        method: \"PUT\",\n        headers: {\n          \"Content-Type\": \"application/json\",\n          Authorization: `Bearer ${token}`,\n        },\n        body: JSON.stringify(requestData),\n      })\n        .then((response) => response.json())\n        .then((data) => {\n          console.log(\"PUT request successful:\", data);\n          localStorage.setItem(\"pin\", requestData.pin);\n          $(\"#successModal\").modal(\"show\");\n          window.location.href = \"homepage.html\";\n        })\n        .catch((error) => {\n          console.error(\"Error making PUT request:\", error);\n          alert(\"Error making PUT request:\", error);\n        })\n        .finally(() => {\n          hideLoadingSpinner();\n        });\n    } else {\n      alert(\"No internet connection. Please connect to the internet to proceed.\");\n      hideLoadingSpinner();\n    }\n  } else {\n    console.log(\"Pins do not match!\");\n    alert(\"Pins do not match!\");\n    hideLoadingSpinner();\n  }\n}\n\nsubmitButton.addEventListener(\"click\", () => {\n  checkPinEquality();\n});\n\n//# sourceURL=webpack://wm-offline-pay/./public/src/createPin.js?");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./public/src/createPin.js");
/******/ 	
/******/ })()
;