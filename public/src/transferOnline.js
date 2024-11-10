// Import necessary modules from crypto-js library
const { AES, enc } = require("crypto-js");

// Import TokenVerifier module for token validation
import { TokenVerifier } from "./tokenVerifiers";

//import dialog box
import { DialogBox } from "./dialogBox";

// bringing in values from the front
const accountNumberInput = document.getElementById("accountNumberInput");
const requestMoney = document.getElementById("requestMoney");
const pin = document.getElementById("pinInput");
const wmId = localStorage.getItem("wm_id");
const offlineBalance = localStorage.getItem("offlineBalance");
const sendWarrant = document.getElementById("sendWarrant");
const userWalletId = localStorage.getItem("wallet_id");
const token = localStorage.getItem("token");

console.log(pin);

function showLoadingSpinner() {
  // Display your loading spinner
  let loadingSpinner = document.getElementById("loadingSpinner");
  console.log("found spinner");
  loadingSpinner.classList.remove("d-none");
}

// Create a TokenVerifier instance and validate the token
const tokenVerifier = new TokenVerifier(token);

// // Check if the token has expired
if (tokenVerifier.isTokenExpired()) {
  console.log("Token expired");
  window.location.href = "./login-page.html"; // Redirect to login page
} else {
  console.log("Token is valid");
}

// // Set an encryption key
const encryptionKey = "open";

// // Function to decrypt an encrypted numeric value
function decryptNumber(encryptedData) {
  try {
    // Decrypt the encrypted data using the encryption key
    const decryptedBytes = AES.decrypt(encryptedData, encryptionKey);

    // Convert the decrypted data to a UTF-8 string
    const decryptedDataString = decryptedBytes.toString(enc.Utf8);

    // Parse the decrypted data as a floating-point number
    const decryptedData = parseFloat(decryptedDataString);

    return decryptedData;
  } catch (error) {
    console.error("Decryption error:", error);
    return null; // Return null if there's an error during decryption
  }
}
// //encryption
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

function hideLoadingSpinner() {
  // Hide your loading spinner or scroll bar here
  let loadingSpinner = document.getElementById("loadingSpinner");
  loadingSpinner.classList.add("d-none");
}
//account number
const userAccountNumber = localStorage.getItem("accountNumber");
document.addEventListener("DOMContentLoaded", function () {
  if (userAccountNumber) {
    accountNumberInput.value = userAccountNumber;
  }
});

sendWarrant.addEventListener("click", async (e) => {

  e.preventDefault();

  try {

    // Check if offlineBalance is available in local storage
    if (offlineBalance === null) {
      console.log("Balance not available in local storage");
      return;
    }

    const decryptedNumberOfflineBalance = decryptNumber(offlineBalance);

    if (decryptedNumberOfflineBalance < parseInt(requestMoney.value)) {
      console.log("Insufficient balance");
      const dialog = new DialogBox("Insufficient balance", () => {
        console.log("Callback function called.");
      });
      dialog.displayDialogBox();
      return;
    }

    const apiUrl =
      "https://wmpay.thewealthmarket.com/api/v1/warrant-audit/inbound-transfer";

    // Example data to send in the request body
    const requestData = {
      warrant: parseInt(requestMoney.value),
      customerWmId: wmId,
      walletId: userWalletId,
      transactionPin: pin.value,
      accountNumber: userAccountNumber,
    };

    // Example headers
    const requestHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      // Add any other headers as needed
    };

    // Log request details
    console.log("Request URL:", apiUrl);
    console.log("Request Method:", "POST");
    console.log("Request Headers:", requestHeaders);
    console.log("Request Body:", JSON.stringify(requestData));

    showLoadingSpinner();

    // Perform API call using the obtained access token
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: requestHeaders,
      body: JSON.stringify(requestData),
    });

    const res = await response.json();

    if (response.status === 400) {
      console.log(res);
      const dialog = new DialogBox(res.detail, () => {
        console.log("Callback function called");
      });
      dialog.displayDialogBox();
    } else {
      console.log(res);
      console.log(res.description);
      const moneyRequest = parseInt(requestMoney.value);
      const updatedOfflineBalance =
        decryptedNumberOfflineBalance - moneyRequest;
      const encryptedOfflineBalance = encryptNumber(updatedOfflineBalance);
      localStorage.setItem("offlineBalance", encryptedOfflineBalance);
      window.location.href = "online-wallet-success.html";
    }
  } catch (error) {
    console.error("Error: ", error);
  } finally {
    hideLoadingSpinner();
  }
});

