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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nconst config = {\n    baseURL: 'http://localhost:50000/api/v1',\n    // baseURL: 'https://opy.thewealthmarket.com/api/v1'\n    // baseURL: 'https://cdd5-102-89-23-191.ngrok-free.app/api/v1',\n};\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (config);\n\n//# sourceURL=webpack://wm-offline-pay/./public/src/config/config.js?");

/***/ }),

/***/ "./public/src/loginPage.js":
/*!*********************************!*\
  !*** ./public/src/loginPage.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _config_config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config/config.js */ \"./public/src/config/config.js\");\n/* harmony import */ var _tokenVerifiers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tokenVerifiers */ \"./public/src/tokenVerifiers.js\");\n\n\n\n// Get references to HTML elements\nconst email = document.getElementById(\"emailText\");\nconst password = document.getElementById(\"passwordText\");\nconst login = document.getElementById(\"login\");\nconst errorMessage = document.getElementById(\"error-message\");\nconst errorText = document.getElementById('error-text');\n\n// Function to display error messages\nfunction displayError(message) {\n  errorText.textContent = message;\n  errorMessage.classList.remove(\"d-none\");\n}\n\n// Token validation on page load\nconst token = localStorage.getItem(\"token\");\nif (token) {\n  const tokenVerifier = new _tokenVerifiers__WEBPACK_IMPORTED_MODULE_1__.TokenVerifier(token);\n  if (tokenVerifier.isTokenExpired()) {\n    console.log(\"Token expired\");\n  } else {\n    console.log(\"Token is valid\");\n    window.location.href = \"./homepage.html\";\n  }\n}\n\nfunction showLoadingSpinner() {\n  const loadingSpinner = document.getElementById(\"loadingSpinner\");\n  loadingSpinner.classList.remove(\"d-none\");\n}\n\nfunction hideLoadingSpinner() {\n  const loadingSpinner = document.getElementById(\"loadingSpinner\");\n  loadingSpinner.classList.add(\"d-none\");\n}\n\nfunction loginUser(data) {\n  showLoadingSpinner();\n\n  setTimeout(() => {\n      fetch(`${_config_config_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].baseURL}/user/login`, {\n          method: \"POST\",\n          headers: { \"Content-Type\": \"application/json\" },\n          body: JSON.stringify(data),\n      })\n      .then((res) => {\n          if (!res.ok) {\n              throw new Error(`Server error: ${res.status}`);\n          }\n          return res.json();\n      })\n      .then((res) => {\n          hideLoadingSpinner();\n          if (res.error) {\n              displayError(res.error);\n          } else {\n\n              // Handle successful login, save token, and redirect\n              errorMessage.classList.add(\"d-none\");\n\n              localStorage.setItem(\"token\", res.token);\n              localStorage.setItem(\"user_id\", res.payload.userId);\n              localStorage.setItem(\"session_id\", res.payload.sessionId);\n              localStorage.setItem(\"phone_number\", res.payload.phoneNumber);\n              localStorage.setItem(\"username\", res.payload.username);\n              localStorage.setItem(\"wm_id\", res.payload.wmId);\n              localStorage.setItem(\"wallet_id\", res.payload.walletId);\n              localStorage.setItem(\"online_mirror_balance\", res.payload.mirrorBalance);\n              localStorage.setItem(\"email\", res.payload.email);\n              localStorage.setItem(\"pin\", res.payload.pin);\n\n\n              // ... other localStorage items\n              window.location.href = \"./homepage.html\";\n          }\n      })\n      .catch((err) => {\n          hideLoadingSpinner();\n          displayError(\"Invalid phone number or password!\")\n      });\n  }, 500);  // Ensure at least 500ms delay\n}\n\n\n// Event listener for the login button\nlogin.addEventListener(\"click\", (event) => {\n\n  event.preventDefault();\n\n  const userPhoneNumber = email.value;\n  const userPassword = password.value;\n\n  if (!userPhoneNumber || !userPassword) {\n    displayError(\"All fields are mandatory.Please input your phone number and password.\");\n  } else if (!navigator.onLine){\n    displayError(\"You are offline. You need an internet connection to login successfully.\");\n  } else {\n    errorMessage.classList.add(\"d-none\");\n\n    // Create user data object and attempt login\n    const userData = { phoneNumber: userPhoneNumber, password: userPassword };\n    loginUser(userData);\n  }\n});\n\n//# sourceURL=webpack://wm-offline-pay/./public/src/loginPage.js?");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./public/src/loginPage.js");
/******/ 	
/******/ })()
;