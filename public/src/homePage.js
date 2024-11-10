// Import necessary modules and libraries
const { AES, enc } = require("crypto-js");
const syncButton = document.getElementById("syncButton"); // Get the sync button element for manual triggering

//checking for token validation
import { TokenVerifier } from "./tokenVerifiers"; // Module for token validation

import { autoSync } from "./automaticSyncing"; // Import the automatic syncing function again
import config from "./config/config.js";

// Set an encryption key for data decryption
const encryptionKey = "open";

let offlineBalance = localStorage.getItem("offlineBalance");
const wmId = localStorage.getItem("wm_id");
const userWalletId = localStorage.getItem("wallet_id");
const userAccountNumber = localStorage.getItem("accountNumber");
const token = localStorage.getItem("token");
const getName = localStorage.getItem("username");
console.log(token);

// Auto syncing
// In your homepage script file
document.addEventListener("DOMContentLoaded", () => {
  if (isOnline()) {
    autoSync() // Call the automatic syncing function
      .then(() => {
        console.log("Auto sync completed successfully.");
      })
      .catch((error) => {
        console.error("Error during auto sync:", error);
      });
  } else {
    console.log("No internet connection. Auto sync skipped.");
  }
});


const pin = localStorage.getItem("pin");
function checkAndRedirectToSetPin() {
  console.log("Retrieved pin from localStorage:", pin);

  // Check if pin is null, undefined, or an empty string
  if (pin === null || pin === "null" || pin === undefined || pin === "") {
    console.log("No PIN found, displaying the setPin button");
    const setPinButton = document.getElementById("setPin");
    if (setPinButton) {
      setPinButton.click();
      console.log("setPin button clicked.");
    } else {
      console.error("setPin button not found in the DOM.");
    }
  } else {
    console.log("PIN found:", pin);
  }
}

checkAndRedirectToSetPin();

// This function decrypts a number stored as encrypted data using the crypto-js library.
// It takes the encrypted data as input and returns the decrypted number as a float.
// In case of errors during decryption, it logs the error and returns null.

function decryptNumber(encryptedData) {
  if (!encryptedData) {
    console.error("Decryption error: Encrypted data is null or undefined.");
    return null;
  }
  try {
    const decryptedBytes = AES.decrypt(encryptedData, encryptionKey);
    const decryptedDataString = decryptedBytes.toString(enc.Utf8);
    const decryptedData = parseFloat(decryptedDataString);
    return decryptedData;
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
}


// This function encrypts a numeric value using the crypto-js library.
// It takes the number as input and returns the encrypted data as a string.
// In case of errors during encryption, it logs the error and returns null.
function encryptNumber(data) {
  try {
    const dataString = data.toString(); // Convert numeric value to string
    const utf8Data = enc.Utf8.parse(dataString);
    const encryptedData = AES.encrypt(utf8Data, encryptionKey).toString();
    return encryptedData;
  } catch (error) {
    console.error("Encryption error:", error);
    return null;
  }
}

// It uses the token stored in localStorage to check if it expired
const tokenVerifier = new TokenVerifier(token);

// Check if the token has expired using the TokenVerifier's isTokenExpired() function.
// If it's expired, redirect the user to the login page using window.location.href.
if (tokenVerifier.isTokenExpired()) {
  window.location.href = "./login-page.html";
} else {
  console.log("token is valid");
}

async function refundToMainAccount() {
  const decryptOfflineBalance = decryptNumber(offlineBalance);

  const apiUrl = "https://wmpay.thewealthmarket.com/api/v1/warrant-audit/inbound-transfer";

  const requestData = {
    warrant: parseInt(decryptOfflineBalance),
    customerWmId: wmId,
    walletId: userWalletId,
    transactionPin: pin,
    accountNumber: userAccountNumber,
  };

  console.log("warrant", decryptOfflineBalance);
  console.log("Pin", pin);

  const requestHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  if (decryptOfflineBalance !== null && decryptOfflineBalance > 0) {
    let success = false;

    while (!success) {
      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: requestHeaders,
          body: JSON.stringify(requestData),
        });

        if (response.ok) {
          console.log("Refund successful.");
          success = true;
        } else {
          console.error("Refund failed:", response.status, response.statusText);
          await new Promise((resolve) => setTimeout(resolve, 60000));
        }
      } catch (error) {
        console.error("Error making the refund request", error);
        await new Promise((resolve) => setTimeout(resolve, 60000));
      }
    }
    return success;
  } else {
    console.log("Offline balance is null.");
    return true;
  }
}

async function checkSessionValidity() {
  try {
    const response = await fetch(`${config.baseURL}/validate/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ sessionId: localStorage.getItem("session_id") }),
    });

    console.log(`Response status: ${response.status}`);

    if (response.status === 401) {
      const refundSuccess = await refundToMainAccount();

      if (refundSuccess) {
        console.log("Logging out user");
        logUserOut();
      } else {
        console.error("Refund process failed, unable to log user out.");
      }
    } else {
      console.log("Session is still valid. No action required.");
    }
  } catch (error) {
    console.error("Error checking session validity", error);
  }
}

if (isOnline()) {
  checkSessionValidity();
} else {
  console.log("App is offline; skipping session validity check.");
}

window.addEventListener("online", checkSessionValidity);

setInterval(() => {
  if (isOnline()) {
    checkSessionValidity();
  }
}, 2 * 60 * 1000);


// Utility function to check if the app is online
function isOnline() {
  return navigator.onLine;
}

// Check if a value for "offlineBalance" exists in localStorage.
// If not, initialize it to 0 using the encryptNumber function for security.
// This ensures offline balance data is available even without network connectivity.
if (offlineBalance === null || offlineBalance === "null") {
    offlineBalance = encryptNumber(0);
    localStorage.setItem("offlineBalance", offlineBalance);
} 

 // Helper function to capitalize the first letter of a string
 function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Function to display the user's name on the home page
function displayName() {
  // If a name is found, it updates the text content of those elements.
  // If no name is found, it redirects the user to the login page for authentication.
  if (getName) {
    const capitalizedName = capitalizeFirstLetter(getName);
    document.getElementById("showName").textContent = `Welcome ${capitalizedName}`;
    document.getElementById("navName").textContent = capitalizedName;
  } else {
    window.location.href = "./login-page.html";
  }
}

// Function to display the user's balance
function displayMoney() {
  const getMoney = localStorage.getItem("online_mirror_balance");
  document.getElementById("online-mirror").innerHTML = `#${getMoney}`;

  const localBalance = localStorage.getItem("offlineBalance");
  const decryptedBalance = decryptNumber(localBalance);
  document.getElementById("balanceOffline2").innerHTML = `#${decryptedBalance}`;
  console.log(decryptedBalance);
}
// Call functions to display user data
displayMoney();
displayName();

//syncDialog
// This function creates and displays a modal dialog with a message and a close button.
function syncDialog(message, callback) {
  const overlay = document.getElementById("overlay");
  overlay.style.display = "block";

  const dialogContainer = document.createElement("div");
  dialogContainer.classList.add(
    "dialog-container",
    "show",
    "rounded-3",
    "col-11"
  );

  const content = document.createElement("div");
  content.classList.add("content", "py-4", "h3", "text-center");
  content.textContent = message;

  const button = document.createElement("button");
  button.classList.add("btn", "my-btn", "float-rt");
  button.textContent = "Close";

  button.addEventListener("click", () => {
    if (callback && typeof callback === "function") {
      callback();
    }
    dialogContainer.remove();
    overlay.style.display = "none";
    // close()x
  });

  dialogContainer.appendChild(content);
  dialogContainer.appendChild(button);
  document.body.appendChild(dialogContainer);
}

//Define a function to change the sync status of transactions
// Asynchronous function to handle changing sync status
async function changeSyncStatus() {
  try {
    // Open an IndexedDB database named "transactionDb" with version 3
    const DBOpen = indexedDB.open("transactionDb", 3);

    // Create a promise to handle database opening asynchronously
    const db = await new Promise((resolve, reject) => {
      // Event listener for database upgrade (if version mismatch)
      DBOpen.onupgradeneeded = (ev) => {
        const db = ev.target.result; // Get the opened database
        if (!db.objectStoreNames.contains("storeTransactions")) {
          // Create the object store "storeTransactions" if it doesn't exist
          // with "id" as the key path for storing transactions
          db.createObjectStore("storeTransactions", { keyPath: "id" });
        }
      };

      // Event listener for successful database opening
      DBOpen.onsuccess = (ev) => resolve(ev.target.result); // Resolve the promise with the opened database

      // Event listener for errors during database opening
      DBOpen.onerror = (err) => reject(err); // Reject the promise with the error
    });

    // Check if internet connection is available
    if (navigator.onLine) {
      // Call the changeSync function (assumed to handle sync logic) and wait for its completion
      await changeSync(db);
    } else {
      console.log("No internet connection. Sync status change skipped.");
    }
  } catch (err) {
    // Catch and log any errors that occur during the process
    console.error("Error during changeSyncStatus:", err);
  }
}

// function to change sync status
// Asynchronous function to update sync status of transactions
async function changeSync(db) {
  return new Promise((resolve, reject) => {
    // Create a transaction with readwrite access to "storeTransactions" object store
    let tx = db.transaction("storeTransactions", "readwrite");

    // Event listener for successful transaction completion
    tx.oncomplete = () => resolve(); // Resolve the promise when the transaction completes

    // Event listener for transaction errors
    tx.onerror = (err) => reject(err); // Reject the promise with the error

    // Get a reference to the "storeTransactions" object store
    let store = tx.objectStore("storeTransactions");

    // Initiate request to retrieve all transactions from the object store
    let getHistory = store.getAll();

    // Event listener for successful retrieval of transaction history
    getHistory.onsuccess = (ev) => {
      let history = ev.target.result; // Get the retrieved transaction history

      // Map and update the sync status of each transaction
      const mappedHistory = history.map((item) => ({
        ...item, // Spread operator to copy existing properties
        synced: 1, // Update "synced" property to 1 (likely indicating synced)
      }));

      // Loop through the updated history and put each item back in the object store
      mappedHistory.forEach((mappedHistory) => {
        store.put(mappedHistory);
      });
    };

    // Event listener for errors during history retrieval
    getHistory.onerror = (err) => reject(err); // Reject the promise with the error
  });
}

//syncing endpoint
async function sendData(data) {
  try {
    const requestDetails = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(
      `${config.baseURL}/sync/transactions`,
      requestDetails
    );

    const result = await response.json();
    if (result.mirror_balance !== undefined) {
      localStorage.setItem(
        "online_mirror_balance",
        JSON.stringify(result.mirror_balance)
      );
    }
    document.getElementById("syncButton").classList.remove("rotate-on-sync");
    syncDialog("Successfully Synced");
    mandatorySync();
    changeSyncStatus();
    const currentTime = new Date();
    localStorage.setItem("lastSyncTime", currentTime);
    localStorage.setItem("sync status", true);
  } catch (err) {
    console.log("error: did not sync. \n" + err);
    syncDialog("Unsuccessful synced");
  }
}

// Define a function for manual syncing
const sync = function () {
  let transactions = null;
  let db = null;
  const DBOpen = indexedDB.open("transactionDb", 3);
  DBOpen.addEventListener("error", (err) => {
    console.warn(err);
  });

  DBOpen.addEventListener("success", (ev) => {
    db = ev.target.result;

    if (navigator.onLine) {
      syncNow();
    } else {
      syncDialog("Error Syncing no network connection");
    }
  });

  DBOpen.addEventListener("upgradeneeded", (ev) => {
    db = ev.target.result;
    console.log("upgraded", db);
    if (!db.objectStoreNames.contains("storeTransactions")) {
      transactions = db.createObjectStore("storeTransactions", {
        keyPath: "id",
      });
    }
  });

  function syncNow() {
    let tx = db.transaction("storeTransactions", "readonly");
    tx.oncomplete = (ev) => {
      // console.log(ev)
    };
    tx.onerror = (err) => {
      console.log(err);
    };
    let store = tx.objectStore("storeTransactions");
    let getHistory = store.getAll();
    getHistory.onsuccess = (ev) => {
      let history = ev.target.result;

      const cursorRequest = store.openCursor();

      cursorRequest.onsuccess = (ev) => {
        const cursor = ev.target.result;
        if (!cursor) {
          console.log("no transaction history");
        }
        {
          const mappedHistory = history.map((item) => {
            return {
              username: item.username,
              receiver_name: item.name,
              recipient_phone_number: item.receiver_phoneNumber, //new
              user_wallet_phoneNumber: item.user_wallet_phoneNumber, //new
              user_wmId: item.user_id, //change
              balance_before_transfer: item.balance_before_transaction,
              amount: item.amount,
              balance_after_transfer: item.balance_after_transaction,
              transaction_reference: item.transaction_reference,
              description: item.description,
              receiver_wmId: item.receiver_wmId,
              classification: item.classification,
              type: item.type,
              date: item.time,
            };
          });
          let transactionArray = mappedHistory;
          console.log(transactionArray);
          sendData(transactionArray);
        }
      };
    };
    getHistory.onerror = (err) => {
      console.log(err);
    };
  }
};
// Function for mandatory syncing
function mandatorySync() {
  const currentSync = new Date();
  const nextSync = new Date(currentSync.getTime());

  nextSync.setHours(nextSync.getHours() + 30);
  localStorage.setItem("mandatorySync", nextSync);
}

syncButton.addEventListener("click", () => {
  document.getElementById("syncButton").classList.add("rotate-on-sync");
  sync();
});

const mandatorySyncTime = localStorage.getItem("mandatorySync");

function intervalFunc() {
  if (mandatorySyncTime) {
    if (Date() >= mandatorySyncTime) {
      console.log("true");
      syncDialog("Time to Sync", () => {
        sync();
        mandatorySync();
      });
    } else {
      console.log("false");
      // reminders();
    }
  }
}

function reminders() {
  const interval = 6 * 60 * 60 * 1000;
  setInterval(function () {
    intervalFunc();
  }, interval);
}

reminders();

// totalBalance();

//**This line of code handles the transaction history **
let totalIndexedDBSize = 0;
const dbName = "transactionDb";
const dbVersion = 3;
const objectStoreName = "storeTransactions";

indexedDB
  .databases()
  .then((databases) => {
    const dbExists = databases.some((dbInfo) => dbInfo.name === dbName);

    if (dbExists) {
      checkStore();
    } else {
      console.log(`Database '${dbName}' does not already exist.`);
    }
  })
  .catch((error) => {
    console.error("Error checking for database existence:", error);
  });

function checkStore() {
  const request = indexedDB.open(dbName, dbVersion);

  request.onerror = function (event) {
    console.error("Error opening the database:", event.target.errorCode);
  };

  request.onsuccess = function (event) {
    const db = event.target.result;

    if (!db.objectStoreNames.contains(objectStoreName)) {
      console.log(
        `Object store '${objectStoreName}' does not exist. Deleting the database...`
      );
      deleteDatabase(db);
    } else {
      const transaction = db.transaction([objectStoreName], "readonly");
      const objectStore = transaction.objectStore(objectStoreName);
      const getAllRequest = objectStore.getAll();

      getAllRequest.onsuccess = function (event) {
        const allData = event.target.result;

        if (allData.length > 0) {
          console.log("Transaction history data found.");
        } else {
          console.log("No transaction history data found.");
        }

        const localStorageTransactions = getTransactionsFromLocalStorage();
        const combinedTransactions = [...allData, ...localStorageTransactions];

        displayTransactionHistory(combinedTransactions);
      };

      getAllRequest.onerror = function (event) {
        console.error(
          "Error retrieving data from the database:",
          event.target.errorCode
        );
      };
    }
  };
}

function getTransactionsFromLocalStorage() {
  return JSON.parse(localStorage.getItem("transactions")) || [];
}

function displayTransactionHistory(allData) {
  const mappedHistory = allData.map((item) => {
    const itemSize = new Blob([JSON.stringify(item)]).size;
    totalIndexedDBSize += itemSize;
    return item;
  });

  console.log(`Total IndexedDB Size: ${totalIndexedDBSize} bytes`);

  const transferHistory = document.getElementById("transactionHistory");
  transferHistory.style.marginLeft = "10px";
  transferHistory.style.marginRight = "10px";
  transferHistory.style.border = "border-box";

  mappedHistory.forEach((item) => {
    const creditImage = document.createElement("img");
    const debitImage = document.createElement("img");

    creditImage.src = "../assets/img/paper-plane2.ico";
    debitImage.src = "../assets/img/paper-plane1.ico";

    const credit = document.createElement("p");
    const amount1 = document.createElement("p");
    credit.classList.add("receive", "mt-1");

    const debit = document.createElement("p");
    const amount2 = document.createElement("p");
    debit.classList.add("send", "mt-3");

    const dividingLine = document.createElement("hr");
    dividingLine.style.marginRight = "10%";
    dividingLine.style.marginLeft = "10%";

    const textTime = document.createElement("p");
    textTime.classList.add("small", "m-2", "tran-color");
    textTime.style.fontSize = "small";
    textTime.style.paddingBottom = "20px";

    if (item.type.toLowerCase() === "credit") {
      credit.textContent = item.name;
      amount1.textContent = item.amount;
      textTime.textContent = item.time;

      credit.style.display = "flex";
      credit.style.flexWrap = "wrap";
      credit.style.justifyContent = "space-between";
      credit.style.width = "90vw";
      credit.style.margin = "0 auto";
      amount1.style.marginRight = "20px";

      credit.appendChild(amount1);
      transferHistory.appendChild(creditImage);
      transferHistory.appendChild(credit);
      transferHistory.appendChild(textTime);
      transferHistory.appendChild(dividingLine);
    }

    if (item.type.toLowerCase() === "debit") {
      debit.textContent = item.name;
      amount2.textContent = item.amount;
      textTime.textContent = item.time;

      debit.style.display = "flex";
      debit.style.flexWrap = "wrap";
      debit.style.justifyContent = "space-between";
      debit.style.width = "90vw";
      debit.style.margin = "0 auto";
      amount2.style.marginRight = "20px";

      debit.appendChild(amount2);
      transferHistory.appendChild(debitImage);
      transferHistory.append(debit);
      transferHistory.appendChild(textTime);
      transferHistory.appendChild(dividingLine);
    }
  });
}

function deleteDatabase(db) {
  // Close the database before deleting
  db.close();

  const deleteRequest = indexedDB.deleteDatabase(dbName);

  deleteRequest.onsuccess = function () {
    console.log(`Database '${dbName}' deleted successfully.`);
  };

  deleteRequest.onerror = function (event) {
    console.error(`Error deleting database '${dbName}':`, event.target.error);
  };
}

function removeItemsFromLocalStorage(keysToRemove) {
  keysToRemove.forEach((key) => localStorage.removeItem(key));
}

const itemsToRemove = [
  "generateQRcode",
  "ScanSuccess",
  "receivedMoney",
  "scanSuccess",
  "newName",
  "classification",
  "receiver_phone_number",
];

removeItemsFromLocalStorage(itemsToRemove);

//syncDialog
function logOutDialog(message, callback) {
  const overlay = document.getElementById("overlay");
  overlay.style.display = "block";

  const dialogContainer = document.createElement("div");
  dialogContainer.classList.add(
    "dialog-container",
    "show",
    "rounded-3",
    "col-11"
  );

  const content = document.createElement("div");
  content.classList.add("content", "py-4", "h6", "text-center");
  content.textContent = message;

  const buttonSync = document.createElement("button");
  // sync button logic for the sync dialog
  buttonSync.classList.add("btn", "my-btn", "float-rt", "mr-2");
  buttonSync.style.marginRight = "10px";
  buttonSync.textContent = "Sync";
  buttonSync.addEventListener("click", () => {
    sync();
    dialogContainer.remove();
  });

  const button1 = document.createElement("button");

  button1.classList.add("btn", "my-btn", "float-rt");

  button1.textContent = "Close";

  button1.addEventListener("click", () => {
    if (callback && typeof callback === "function") {
      callback();
    }
    dialogContainer.remove();
    overlay.style.display = "none";
    // close()x
  });

  // sync.addEventListener("click", () => {});

  dialogContainer.appendChild(content);
  dialogContainer.appendChild(button1);
  dialogContainer.appendChild(buttonSync);
  document.body.appendChild(dialogContainer);
}

// send money back to online market account dialog box
function sendMoneyDialog(message, callback) {
  const overlay = document.getElementById("overlay");
  overlay.style.display = "block";

  const dialogContainer = document.createElement("div");
  dialogContainer.classList.add(
    "dialog-container",
    "show",
    "rounded-3",
    "col-11"
  );

  const content = document.createElement("div");
  content.classList.add("content", "py-4", "h6", "text-center");
  content.textContent = message;

  const buttonSync = document.createElement("button");
  // sync button logic for the sync dialog
  buttonSync.classList.add("btn", "my-btn", "float-rt", "mr-2");
  buttonSync.style.marginRight = "10px";
  buttonSync.textContent = "Okay";
  buttonSync.addEventListener("click", () => {
    window.location.href = "./fund-main-acct.html";
    dialogContainer.remove();
  });

  const button1 = document.createElement("button");

  button1.classList.add("btn", "my-btn", "float-rt");

  button1.textContent = "Close";

  button1.addEventListener("click", () => {
    if (callback && typeof callback === "function") {
      callback();
    }
    dialogContainer.remove();
    overlay.style.display = "none";
    // close()x
  });

  // sync.addEventListener("click", () => {});

  dialogContainer.appendChild(content);
  dialogContainer.appendChild(button1);
  dialogContainer.appendChild(buttonSync);
  document.body.appendChild(dialogContainer);
}

async function logoutUser() {
  const syncStatus = localStorage.getItem("sync status");

  // Check if internet connection is active before attempting logout
  if (!navigator.onLine) {
    logOutDialog("Please ensure you are connected to the internet to log out.");
    return;
  }

  // Refresh offlineBalance if it may be stale
  const decryptedOfflineBalance = decryptNumber(offlineBalance); // Ensure this is up-to-date

  if (syncStatus === "false") {
    logOutDialog("Syncing before logging out is mandatory!");
  } else if (decryptedOfflineBalance !== 0) {
    sendMoneyDialog(
      "Send balance back to your online account before logging out"
    );
  } else {
    await logUserOut();
  }
}

// Function to perform the backend logout request
async function logUserOut() {
  try {
    const response = await fetch(`${config.baseURL}/user/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ sessionId: localStorage.getItem("session_id") }),
    });
    if (response.ok) {
      clearLocalStorage();
      window.location.href = "./login-page.html";
    } else {
      console.error("Logout failed", response);
      logOutDialog("Logout failed. Please try again.");
    }
  } catch (error) {
    console.error("Error during logout", error);
    logOutDialog("An error occurred. Please check your connection and try again.");
  }
}

// Function to clear local storage
function clearLocalStorage() {

  Object.keys(localStorage).forEach((key) => {
    console.log(`Removing items: ${key}`);
    localStorage.removeItem(key);
  });


  localStorage.clear();

  if (localStorage.length === 0) {
    console.log("Local storage successfully cleared");
  } else {
    console.log("Local storage not fully cleared. Remaining items: ", localStorage);
  }

  const indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;

  const deleteRequest = indexedDB.deleteDatabase("transactionDb");

  deleteRequest.onsuccess = () => {
    console.log("Database 'transactionDb' deleted successfully.");
  };

  deleteRequest.onerror = (event) => {
    console.error("Error deleting database 'transactionDb':", event.target.error);
  };
}

// Event listener for the logout button
document.getElementById("logoutButton").addEventListener("click", logoutUser);
