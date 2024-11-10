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

/***/ "./public/src/receiverInfo.js":
/*!************************************!*\
  !*** ./public/src/receiverInfo.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _time__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./time */ \"./public/src/time.js\");\n/* harmony import */ var _tokenVerifiers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tokenVerifiers */ \"./public/src/tokenVerifiers.js\");\n\n\n//checking for token validation\n\n\nconst expirationInHour = 3;\nconst expirationTimeInSeconds = 3600 * expirationInHour;\nconst tokenVerifier = new _tokenVerifiers__WEBPACK_IMPORTED_MODULE_1__.TokenVerifier(\n  localStorage.getItem(\"token\"),\n  expirationTimeInSeconds\n);\n\nif (tokenVerifier.isTokenExpired()) {\n  console.log(\"Token expired\");\n  window.location.href = \"./login-page.html\";\n} else {\n  console.log(\"Token is valid\");\n}\nconst time = new _time__WEBPACK_IMPORTED_MODULE_0__.CurrentDateInfo();\n\nconst amount = localStorage.getItem(\"amount\");\nconst username = localStorage.getItem(\"username\");\nconst description = localStorage.getItem(\"description\");\nconst wmID = localStorage.getItem(\"wm_id\");\nconst walletPhoneNumber = localStorage.getItem(\"phone_number\");\n\nconst amountDisplay = document.getElementById(\"amount\");\nconst descriptionDisplay = document.getElementById(\"description\");\nconst nameDisplay = document.getElementById(\"name\");\nconst timeDisplay = document.getElementById(\"time\");\nconst idDisplay = document.getElementById(\"wm_Id\");\nconst wallet_phone_numberDisplay = document.getElementById(\n  \"wallet_phone_number\"\n);\n\namountDisplay.innerHTML = amount;\ndescriptionDisplay.innerHTML = description;\nnameDisplay.innerHTML = username;\ntimeDisplay.innerHTML = `${time.getDayName()}, ${time.getFormattedDateTime()}`;\nidDisplay.innerHTML = wmID;\nwallet_phone_numberDisplay.innerHTML = walletPhoneNumber;\n\nconst generate = document.getElementById(\"generate\");\ngenerate.addEventListener(\"click\", () => {\n  if (!amount || amount.trim() === \"\") {\n    alert(\"No amount\");\n  } else {\n    window.location.href = \"QR-code.html\";\n    localStorage.setItem(\"generateQRCode\", \"true\");\n  }\n});\n\n\n//# sourceURL=webpack://wm-offline-pay/./public/src/receiverInfo.js?");

/***/ }),

/***/ "./public/src/time.js":
/*!****************************!*\
  !*** ./public/src/time.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   CurrentDateInfo: () => (/* binding */ CurrentDateInfo)\n/* harmony export */ });\nclass CurrentDateInfo {\n  constructor() {\n    this.currentDate = new Date();\n  }\n\n  getFormattedDate() {\n    const day = this.currentDate.getDate();\n    const month = this.currentDate.getMonth() + 1;\n    const year = this.currentDate.getFullYear() % 100;\n    return `${day.toString().padStart(2, \"0\")}-${month\n      .toString()\n      .padStart(2, \"0\")}-${year.toString().padStart(2, \"0\")}`;\n  }\n  getFormattedTime() {\n    const hours = this.currentDate.getHours();\n    const minutes = this.currentDate.getMinutes();\n    const seconds = this.currentDate.getSeconds();\n    return `${hours.toString().padStart(2, \"0\")}:${minutes\n      .toString()\n      .padStart(2, \"0\")}:${seconds.toString().padStart(2, \"0\")}`;\n  }\n\n  getFormattedDateTime() {\n    return `${this.getFormattedDate()} ${this.getFormattedTime()}`;\n  }\n\n  getDayName() {\n    return this.currentDate.toLocaleString(\"en-US\", { weekday: \"long\" });\n  }\n}\n\n\n\n\n//# sourceURL=webpack://wm-offline-pay/./public/src/time.js?");

/***/ }),

/***/ "./public/src/tokenVerifiers.js":
/*!**************************************!*\
  !*** ./public/src/tokenVerifiers.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   TokenVerifier: () => (/* binding */ TokenVerifier),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var jwt_decode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jwt-decode */ \"./node_modules/jwt-decode/build/esm/index.js\");\n\n\nclass TokenVerifier {\n  constructor(token) {\n    this.token = token;\n  }\n\n  isTokenExpired() {\n    const tokenExpirationTimestamp = this.getTokenExpirationTimestamp();\n    if (!tokenExpirationTimestamp) {\n      return true; // Token has no valid expiration timestamp\n    }\n\n    const currentTimestamp = Math.floor(Date.now() / 1000); // Current time in seconds\n    return currentTimestamp > tokenExpirationTimestamp;\n  }\n\n  getTokenExpirationTimestamp() {\n    try {\n      const payload = this.decodeTokenPayload();\n      if (payload && payload.exp) {\n        return parseInt(payload.exp, 10);\n      }\n    } catch (error) {\n      console.error(\"Error decoding token payload: \" + error);\n    }\n    return null;\n  }\n\n  decodeTokenPayload() {\n    if (!this.token) {\n      return null; // No token to decode\n    }\n\n    try {\n      const payload = (0,jwt_decode__WEBPACK_IMPORTED_MODULE_0__.jwtDecode)(this.token);\n      return payload;\n    } catch (error) {\n      console.error(\"Error decoding token payload: \" + error);\n    }\n    return null;\n  }\n\n  async refreshToken() {\n    try {\n      const response = await fetch('localhost:5050/api/v1/refresh-token', {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json' },\n        body: JSON.stringify({ token: this.token }),\n      });\n\n      if (!response.ok) {\n        throw new Error('Failed to refresh token');\n      }\n\n      const data = await response.json();\n      this.token = data.token; // Update the token\n      localStorage.setItem('token', this.token); // Update token in local storage\n      return this.token;\n    } catch (error) {\n      console.error(\"Error refreshing token: \", error);\n      return null;\n    }\n  }\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TokenVerifier);\n\n\n//# sourceURL=webpack://wm-offline-pay/./public/src/tokenVerifiers.js?");

/***/ }),

/***/ "./node_modules/jwt-decode/build/esm/index.js":
/*!****************************************************!*\
  !*** ./node_modules/jwt-decode/build/esm/index.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   InvalidTokenError: () => (/* binding */ InvalidTokenError),\n/* harmony export */   jwtDecode: () => (/* binding */ jwtDecode)\n/* harmony export */ });\nclass InvalidTokenError extends Error {\n}\nInvalidTokenError.prototype.name = \"InvalidTokenError\";\nfunction b64DecodeUnicode(str) {\n    return decodeURIComponent(atob(str).replace(/(.)/g, (m, p) => {\n        let code = p.charCodeAt(0).toString(16).toUpperCase();\n        if (code.length < 2) {\n            code = \"0\" + code;\n        }\n        return \"%\" + code;\n    }));\n}\nfunction base64UrlDecode(str) {\n    let output = str.replace(/-/g, \"+\").replace(/_/g, \"/\");\n    switch (output.length % 4) {\n        case 0:\n            break;\n        case 2:\n            output += \"==\";\n            break;\n        case 3:\n            output += \"=\";\n            break;\n        default:\n            throw new Error(\"base64 string is not of the correct length\");\n    }\n    try {\n        return b64DecodeUnicode(output);\n    }\n    catch (err) {\n        return atob(output);\n    }\n}\nfunction jwtDecode(token, options) {\n    if (typeof token !== \"string\") {\n        throw new InvalidTokenError(\"Invalid token specified: must be a string\");\n    }\n    options || (options = {});\n    const pos = options.header === true ? 0 : 1;\n    const part = token.split(\".\")[pos];\n    if (typeof part !== \"string\") {\n        throw new InvalidTokenError(`Invalid token specified: missing part #${pos + 1}`);\n    }\n    let decoded;\n    try {\n        decoded = base64UrlDecode(part);\n    }\n    catch (e) {\n        throw new InvalidTokenError(`Invalid token specified: invalid base64 for part #${pos + 1} (${e.message})`);\n    }\n    try {\n        return JSON.parse(decoded);\n    }\n    catch (e) {\n        throw new InvalidTokenError(`Invalid token specified: invalid json for part #${pos + 1} (${e.message})`);\n    }\n}\n\n\n//# sourceURL=webpack://wm-offline-pay/./node_modules/jwt-decode/build/esm/index.js?");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./public/src/receiverInfo.js");
/******/ 	
/******/ })()
;