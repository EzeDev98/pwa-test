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

/***/ "./public/src/automaticSyncing.js":
/*!****************************************!*\
  !*** ./public/src/automaticSyncing.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   autoSync: () => (/* binding */ autoSync)\n/* harmony export */ });\n/* harmony import */ var _config_config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config/config.js */ \"./public/src/config/config.js\");\n\n\n\n// Function for displaying a modal dialog\nfunction syncDialog(message, callback) {\n  const overlay = document.getElementById(\"overlay\");\n  overlay.style.display = \"block\";\n\n  const dialogContainer = document.createElement(\"div\");\n  dialogContainer.classList.add(\n    \"dialog-container\",\n    \"show\",\n    \"rounded-3\",\n    \"col-11\"\n  );\n\n  const content = document.createElement(\"div\");\n  content.classList.add(\"content\", \"py-4\", \"h3\", \"text-center\");\n  content.textContent = message;\n\n  const button = document.createElement(\"button\");\n  button.classList.add(\"btn\", \"my-btn\", \"float-rt\");\n  button.textContent = \"Close\";\n\n  button.addEventListener(\"click\", () => {\n    if (callback && typeof callback === \"function\") {\n      callback();\n    }\n    dialogContainer.remove();\n    overlay.style.display = \"none\";\n    // close()x\n  });\n\n  dialogContainer.appendChild(content);\n  dialogContainer.appendChild(button);\n  document.body.appendChild(dialogContainer);\n}\nfunction mandatorySync() {\n  const currentSync = new Date();\n  const nextSync = new Date(currentSync.getTime());\n\n  nextSync.setHours(nextSync.getHours() + 30);\n  localStorage.setItem(\"mandatorySync\", nextSync);\n}\n\nasync function changeSyncStatus() {\n  try {\n    const DBOpen = indexedDB.open(\"transactionDb\", 3);\n    const db = await new Promise((resolve, reject) => {\n      DBOpen.onupgradeneeded = (ev) => {\n        const db = ev.target.result;\n        if (!db.objectStoreNames.contains(\"storeTransactions\")) {\n          db.createObjectStore(\"storeTransactions\", { keyPath: \"id\" });\n        }\n      };\n      DBOpen.onsuccess = (ev) => resolve(ev.target.result);\n      DBOpen.onerror = (err) => reject(err);\n    });\n\n    if (navigator.onLine) {\n      await changeSync(db);\n    } else {\n      console.log(\"No internet connection. Sync status change skipped.\");\n    }\n  } catch (err) {\n    console.error(\"Error during changeSyncStatus:\", err);\n  }\n}\n\n// function to change sync status\nasync function changeSync(db) {\n  return new Promise((resolve, reject) => {\n    let tx = db.transaction(\"storeTransactions\", \"readwrite\");\n    tx.oncomplete = () => resolve();\n    tx.onerror = (err) => reject(err);\n\n    let store = tx.objectStore(\"storeTransactions\");\n    let getHistory = store.getAll();\n    getHistory.onsuccess = (ev) => {\n      let history = ev.target.result;\n\n      // Map and update the sync status of each transaction\n      const mappedHistory = history.map((item) => ({\n        ...item,\n        synced: 1,\n      }));\n      mappedHistory.forEach((mappedHistory) => {\n        store.put(mappedHistory);\n      });\n    };\n    getHistory.onerror = (err) => reject(err);\n  });\n}\nconst token = localStorage.getItem(\"token\");\n\n// Function to send data to a remote server\nasync function sendData(data) {\n  try {\n    const response = await fetch(`${_config_config_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].baseURL}/sync/transactions`,\n      {\n        method: \"POST\",\n        headers: {\n          \"Content-Type\": \"application/json\",\n          Authorization: `Bearer ${token}`,\n        },\n        body: JSON.stringify(data),\n      }\n    );\n    const result = await response.json();\n    console.log(result);\n    console.log(result.mirror_balance);\n    if (result.mirror_balance != null) {\n      localStorage.setItem(\n        \"online_mirror_balance\",\n        JSON.stringify(result.mirror_balance)\n      );\n    }\n    document.getElementById(\"syncButton\").classList.remove(\"rotate-on-sync\");\n    // syncDialog(\"Successfully Synced\");\n    mandatorySync();\n    changeSyncStatus();\n    const currentTime = new Date();\n    localStorage.setItem(\"lastSyncTime\", currentTime);\n    localStorage.setItem(\"sync status\", true);\n  } catch (err) {\n    console.log(\"error: did not sync. \\n\" + err);\n    // syncDialog(\"Unsuccessful synced\");\n  }\n}\n\nconsole.log(\"Updated the recipient's phone number for deployment\");\n\n// Function to synchronize data\nasync function syncNow(db) {\n  try {\n    let tx = db.transaction(\"storeTransactions\", \"readonly\");\n    let store = tx.objectStore(\"storeTransactions\");\n    let getHistory = store.getAll();\n\n    const history = await new Promise((resolve, reject) => {\n      getHistory.onsuccess = () => resolve(getHistory.result);\n      getHistory.onerror = (err) => reject(err);\n    });\n\n    const mappedHistory = history.map((item) => ({\n      username: item.username,\n      receiver_name: item.name,\n      recipient_phone_number: item.receiver_phoneNumber,\n      user_wallet_phoneNumber: item.user_wallet_phoneNumber,\n      user_wmId: item.user_id,\n      balance_before_transfer: item.balance_before_transaction,\n      amount: item.amount,\n      balance_after_transfer: item.balance_after_transaction,\n      transaction_reference: item.transaction_reference,\n      description: item.description,\n      receiver_wmId: item.receiver_wmId,\n      classification: item.classification,\n      type: item.type,\n      date: item.time,\n    }));\n\n    console.log(mappedHistory); // Log the transaction data\n    await sendData(mappedHistory); // Send the data for synchronization\n  } catch (err) {\n    console.log(err); // Log an error in case of a history retrieval error\n    syncDialog(\"Error Syncing: \" + err.message);\n  }\n}\n\n// Exported function for automatic synchronization\nasync function autoSync() {\n  try {\n    const DBOpen = indexedDB.open(\"transactionDb\", 3);\n    const db = await new Promise((resolve, reject) => {\n      DBOpen.onupgradeneeded = (ev) => {\n        const db = ev.target.result;\n        if (!db.objectStoreNames.contains(\"storeTransactions\")) {\n          db.createObjectStore(\"storeTransactions\", { keyPath: \"id\" });\n        }\n      };\n      DBOpen.onsuccess = (ev) => resolve(ev.target.result);\n      DBOpen.onerror = (err) => reject(err);\n    });\n\n    if (navigator.onLine) {\n      await syncNow(db);\n    } else {\n      syncDialog(\"Error Syncing: No network connection\");\n    }\n  } catch (err) {\n    console.warn(err); // Log a warning in case of an error\n    syncDialog(\"Error Syncing: \" + err.message);\n  }\n}\n\n//# sourceURL=webpack://wm-offline-pay/./public/src/automaticSyncing.js?");

/***/ }),

/***/ "./public/src/config/config.js":
/*!*************************************!*\
  !*** ./public/src/config/config.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nconst config = {\n    baseURL: 'http://localhost:50000/api/v1',\n    baseURL: 'https://opy.thewealthmarket.com/api/v1'\n    // baseURL: 'https://cdd5-102-89-23-191.ngrok-free.app/api/v1',\n};\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (config);\n\n//# sourceURL=webpack://wm-offline-pay/./public/src/config/config.js?");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./public/src/automaticSyncing.js");
/******/ 	
/******/ })()
;