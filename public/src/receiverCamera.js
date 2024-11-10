// Import necessary modules
import { uid } from "./uid"; // Import a function to generate a unique ID
import { CurrentDateInfo } from "./time"; // Import a module for getting current date and time

// Get references to HTML elements
const openCamera = document.getElementById("openCamera");
const camera = document.getElementById("camera");
const encryptionKey = "open"; // Encryption key used for data security
const { AES, enc } = require("crypto-js"); // Import crypto-js library for encryption and decryption

const time = new CurrentDateInfo(); // Create an instance to get current date and time

// Function to decrypt a string using the encryption key
function decryptString(encryptedData) {
  const decryptedData = AES.decrypt(encryptedData, encryptionKey).toString(
    enc.Utf8
  );
  return decryptedData;
}

// Function to encrypt a numeric value
function encryptNumber(data) {
  try {
    const dataString = data.toString(); // Convert numeric value to a string
    const utf8Data = enc.Utf8.parse(dataString);
    const encryptedData = AES.encrypt(utf8Data, encryptionKey).toString();
    return encryptedData;
  } catch (error) {
    console.error("Encryption error:", error);
    return null;
  }
}

// Function to decrypt a numeric value
function decryptNumber(encryptedData) {
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

// Function to record a credit transaction and save it to IndexedDB
const credit = function (name, amount, descText, id, reference, sender_phoneNumber) {
  let transactions = null;
  let db = null;

  const DBOpen = indexedDB.open("transactionDb", 3);
  
  DBOpen.addEventListener("error", (err) => {
    console.warn(err);
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

  DBOpen.addEventListener("success", (ev) => {
    db = ev.target.result;

    if (db.objectStoreNames.contains("storeTransactions")) {
      transact();
      localStorage.setItem("sync status", false);
    } else {
      console.error("Object store 'storeTransactions' does not exist.");
    }
  });

  function transact() {
    const currentTime = Date.now();
    const isoTime = new Date(currentTime).toISOString();
    const offlineBalance = localStorage.getItem("offlineBalance");
    const decOfflineBalance = decryptNumber(offlineBalance);
    const value = parseFloat(decOfflineBalance);
    const amountInt = parseInt(amount);
    const userId = localStorage.getItem("wm_id");
    const username = localStorage.getItem("username");
    const newAmount = value + amountInt;
    const classifications = localStorage.getItem("classification");
    const userPhoneNumber = localStorage.getItem("phone_number");

    let transfer = {
      id: uid(), // Generate a unique ID for the transaction
      user_id: userId,
      username: username,
      name: name,
      receiver_phoneNumber: userPhoneNumber,
      user_wallet_phoneNumber: sender_phoneNumber,
      transaction_reference: reference,
      balance_before_transaction: value,
      amount: amount,
      balance_after_transaction: newAmount,
      receiver_wmId: id,
      type: "Credit",
      classification: classifications,
      description: descText,
      synced: 0, // Indicate that the transaction is not synced
      time: `${time.getDayName()}, ${time.getFormattedDateTime()}`,
    };

    const encOfflineBalance = encryptNumber(newAmount);
    localStorage.setItem("offlineBalance", encOfflineBalance);

    let tx = db.transaction("storeTransactions", "readwrite");

    tx.onComplete = (ev) => {
      console.log("Transaction completed", ev);
    };

    tx.onError = (err) => {
      console.log("Transaction error", err);
    };

    const store = tx.objectStore("storeTransactions");
    const addMoney = store.add(transfer);

    addMoney.onsuccess = (ev) => {
      console.log("MONEY ADDED", ev);
    };
    addMoney.onerror = (err) => {
      console.log("failed", err);
    };
  }
};

// Event listener to toggle the camera display
openCamera.addEventListener("click", () => {
  if (camera.style.display === "none") {
    camera.style.display = "block";
  } else {
    camera.style.display = "none";
  }
});

// Function to handle a successful QR code scan
function onScanSuccess(qrCodeMessage) {
  const scannedMessage = JSON.parse(qrCodeMessage);
  const firstValue = scannedMessage.firstValue;

  const dec = decryptString(firstValue);

  if (dec === "true") {

    localStorage.setItem("scanSuccess", "true");

    if (localStorage.getItem("scanSuccess") === "true") {
      const name = scannedMessage.sender_username;
      const amount = scannedMessage.amount;
      const description = scannedMessage.description;
      const id = scannedMessage.id;
      const reference = scannedMessage.reference;
      const sender_phoneNumber = scannedMessage.sender_phone_number;
      localStorage.setItem("newName", name);
      localStorage.setItem("newDescription", description);
      localStorage.setItem("receiver_wmId", id);
      localStorage.setItem("newAmount", amount);
      localStorage.setItem("sender_phone_number", sender_phoneNumber);
      console.log(qrCodeMessage);
      credit(name, amount, description, id, reference, sender_phoneNumber);
      window.location.href = "./sender-success-page.html";
      qrCodeScanner.clear();
    }
  } else {
    console.log("Bad QR code");
  }
}

// Function to handle QR code scan errors
function onScanError() {
  // Handle the scan error
}

// Create a QR code scanner instance and define callback functions
var qrCodeScanner = new Html5QrcodeScanner("reader", { fps: 60, qrbox: 200 });
qrCodeScanner.render(onScanSuccess, onScanError);
