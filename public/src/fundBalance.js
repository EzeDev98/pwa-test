// Import necessary modules
const { AES, enc } = require("crypto-js");
import { DialogBox } from "./dialogBox";
import { TokenVerifier } from "./tokenVerifiers";

// Initialization
const token = localStorage.getItem("token");
const wmId = localStorage.getItem("wm_id");
const localBalance = localStorage.getItem("offlineBalance");
const tokenVerifier = new TokenVerifier(token);
const encryptionKey = "open";

// DOM Elements
const togglePinVisibilitySpan = document.getElementById("togglePinVisibility");
const requestMoney = document.getElementById("requestMoney");
const userPin = document.getElementById("userPin");
const getMoney = document.getElementById("getMoney");
const accountNumberInput = document.getElementById("accountNumberInput");

// Utility Functions
function showLoadingSpinner() {
  const loadingSpinner = document.getElementById("loadingSpinner");
  loadingSpinner.classList.remove("d-none");
}

function hideLoadingSpinner() {
  const loadingSpinner = document.getElementById("loadingSpinner");
  loadingSpinner.classList.add("d-none");
}

function formatDate(date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const year = date.getFullYear();

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

function encryptNumber(data) {
  try {
    const dataString = data.toString();
    const utf8Data = enc.Utf8.parse(dataString);
    return AES.encrypt(utf8Data, encryptionKey).toString();
  } catch (error) {
    console.error("Encryption error:", error);
    return null;
  }
}

function decryptNumber(encryptedData) {
  try {
    const decryptedBytes = AES.decrypt(encryptedData, encryptionKey);
    const decryptedDataString = decryptedBytes.toString(enc.Utf8);
    return parseFloat(decryptedDataString);
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
}

// Token Validation and Redirect
function checkTokenAndRedirect() {
  if (tokenVerifier.isTokenExpired()) {
    console.log("Token expired");
    window.location.href = "./login-page.html";
  } else {
    console.log("Token is valid");
  }
}

// API Requests
async function retrieveAccountNumber(wmId) {
  try {
    const endpointUrl = `https://users.thewealthmarket.com/api/v1/marketaccount/number/${wmId}`;
    const headers = { Authorization: `Bearer ${token}` };
    
    const response = await fetch(endpointUrl, { method: "GET", headers });
    if (response.ok) {
      const result = await response.json();
      const accountNumber = result.data;
      
      if (accountNumber) {
        localStorage.setItem("accountNumber", accountNumber);
        return accountNumber;
      } else {
        console.warn("Account number not found in response.");
      }
    } else {
      console.error(`Error: ${response.status}, ${await response.text()}`);
    }
  } catch (error) {
    console.error("Error during API request:", error.message);
  }
  return null;
}

// Initialization Function
async function initializeForm() {
  showLoadingSpinner();
  
  let userAccountNumber = localStorage.getItem("accountNumber");
  if (!userAccountNumber) {
    userAccountNumber = await retrieveAccountNumber(wmId);
  }
  
  accountNumberInput.value = userAccountNumber;
  hideLoadingSpinner();
  return userAccountNumber;
}

// Toggle PIN Visibility
togglePinVisibilitySpan.addEventListener("click", () => {
  userPin.type = userPin.type === "password" ? "number" : "password";
});

// Local Storage for Transactions
function saveTransactionToLocalStorage(transaction) {
  const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Balance Update
function updateOfflineBalance(amount) {
  const decryptedBalance = decryptNumber(localBalance) || 0;
  const newBalance = decryptedBalance + amount;
  localStorage.setItem("offlineBalance", encryptNumber(newBalance));
}

// Transaction Functionality
async function handleTransaction(e) {
  e.preventDefault();
  
  const warrant = requestMoney.value;
  const pin = userPin.value;
  const userWalletId = localStorage.getItem("wallet_id");
  const userAccountNumber = await initializeForm();

  const requestData = {
    warrant: parseInt(warrant),
    customerWmId: wmId,
    walletId: userWalletId,
    accountNumber: userAccountNumber,
    transactionPin: pin,
  };

  try {
    showLoadingSpinner();
    const response = await fetch(`https://wmpay.thewealthmarket.com/api/v1/warrant-audit/outbound-transfer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestData),
    });

    const data = await response.json();

    if (response.ok && data.transactionReference) {

      if (data.description === "Insufficient warrant balance") {
        console.log("Insufficient balance");
        alert("Insufficient balance");
      }

      const transaction = {
        time: formatDate(new Date()),
        amount: warrant,
        reference: data.transactionReference,
        name: data.description || "Wallet funded successfully",
        type: "credit",
      };

      saveTransactionToLocalStorage(transaction);
      updateOfflineBalance(parseInt(warrant));
      
      window.location.href = "../pages/offline-wallet-success.html";
    } else {
      const dialog = new DialogBox(data.detail, () => {});
      dialog.displayDialogBox();
    }
  } catch (err) {
    console.error("An error occurred during the transaction:", err);
  } finally {
    hideLoadingSpinner();
  }
}

// Event Listeners
getMoney.addEventListener("click", handleTransaction);

// Initialization Calls
checkTokenAndRedirect();
initializeForm();
