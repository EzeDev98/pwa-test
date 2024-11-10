// Import required libraries and modules
const qrCode = require("qrcode"); // Import the QR code generation library
const { AES, enc } = require("crypto-js"); // Import the crypto-js library for encryption
import { uid, generateReferenceNumber } from "./uid"; // Import functions for generating unique IDs and reference numbers
import { CurrentDateInfo } from "./time"; // Import a module for handling current date and time
const senderQR = document.getElementById("senderQR"); // Reference to the HTML element where the sender's QR code will be displayed
const encryptionKey = "open"; // Encryption key used for data security

const time = new CurrentDateInfo(); // Initialize an instance for handling date and time information

// Function to decrypt a numeric value using the encryption key
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

// Function to encrypt a numeric value using the encryption key
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

// Function to generate a QR code from text and display it
const generateQR = (text) => {
  qrCode.toCanvas(senderQR, text, {
    width: 250,
    height: 250,
  });
};

// Function to encrypt a string using the encryption key
function encryptString(data) {
  const encryptedData = AES.encrypt(data, encryptionKey).toString();
  return encryptedData;
}

const userId = localStorage.getItem("wm_id");
const userPhoneNumber = localStorage.getItem("phone_number");

// Function to process a debit transaction
const debit = function (name, amount, descText, reference, receiver_phone_number) {
  let db;

  // Open the IndexedDB database
  const DBOpen = indexedDB.open("transactionDb", 3);

  DBOpen.addEventListener("error", (err) => {
    console.warn(err);
  });

  DBOpen.addEventListener("upgradeneeded", (ev) => {
    db = ev.target.result;
    console.log("Database upgraded", db);

    // Create an object store if it doesn't exist
    if (!db.objectStoreNames.contains("storeTransactions")) {
      const transactions = db.createObjectStore("storeTransactions", {
        keyPath: "id",
      });
    }
  });

  DBOpen.addEventListener("success", (ev) => {
    db = ev.target.result;

    // Start the transaction and add data
    transact();
    localStorage.setItem("sync status", false);
  });

  function transact() {
    const currentTime = Date.now();
    const isoTime = new Date(currentTime).toISOString();
    const offlineBalance = localStorage.getItem("offlineBalance");
    const decOfflineBalance = decryptNumber(offlineBalance);
    const value = parseFloat(decOfflineBalance);
    const amountInt = parseInt(amount);
    const username = localStorage.getItem("username");
    const wm_id = localStorage.getItem("receiver_wmId");
    const newAmount = value - amountInt;
    const classificationText = localStorage.getItem("classification");

    const transfer = {
      id: uid(), // Generate a unique ID for the transaction
      user_id: userId,
      username: username,
      user_wallet_phoneNumber: userPhoneNumber,
      transaction_reference: reference,
      balance_before_transaction: value,
      amount: amount,
      balance_after_transaction: newAmount,
      description: descText,
      receiver_wmId: wm_id,
      type: "Debit",
      classification: classificationText,
      synced: 0,
      name: name,
      receiver_phoneNumber: receiver_phone_number,
      time: `${time.getDayName()}, ${time.getFormattedDateTime()}`,
    };

    // Update the offline balance
    const encryptOfflineBalance = encryptNumber(newAmount);
    localStorage.setItem("offlineBalance", encryptOfflineBalance);

    // Start a transaction
    const tx = db.transaction("storeTransactions", "readwrite");

    tx.oncomplete = (ev) => {
      console.log("Transaction completed", ev);
    };

    tx.onerror = (err) => {
      console.warn("Transaction error", err);
    };

    const store = tx.objectStore("storeTransactions");
    const addRequest = store.add(transfer);

    addRequest.onsuccess = (ev) => {
      console.log("Data added to object store", ev);
    };

    addRequest.onerror = (err) => {
      console.log("Failed to add data to object store", err);
    };
  }
};

// Function to generate and display a QR code for a sender
function showQR() {
  if (localStorage.getItem("correctPin") === "true") {
    const reference = generateReferenceNumber();
    const newAmount = localStorage.getItem("newAmount");
    const newDescription = localStorage.getItem("newDescription");
    const newName = localStorage.getItem("username");
    const recipient = localStorage.getItem("newName");
    const receiver_phone_number = localStorage.getItem("receiver_phone_number");

    const firstValue = encryptString("true");

    const jsonPay = {
      firstValue,
      sender_username: newName,
      amount: newAmount,
      description: newDescription,
      id: userId,
      reference,
      sender_phone_number: userPhoneNumber,
    };
    const stringJsonPay = JSON.stringify(jsonPay);
    generateQR(stringJsonPay); // Generate and display the QR code
    debit(recipient, newAmount, newDescription, reference, receiver_phone_number); // Perform the debit transaction
    localStorage.removeItem("correctPin"); // Remove the "correctPin" flag
  }
}

showQR();
