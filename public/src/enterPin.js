// Select DOM elements
const generate = document.getElementById("generate"); // Button element for generating action (likely PIN entry)
const showPin = document.getElementById("showPin"); // Element containing PIN input fields

// Get data from local storage
const offlineBalance = localStorage.getItem("offlineBalance"); // Encrypted offline balance data (if available)
//import dialog box
import { DialogBox } from "./dialogBox";

// Import encryption library functions
const { AES, enc } = require("crypto-js"); // Importing decryption functions from crypto-js library

// Define encryption key (consider this a placeholder, using a weak key for demonstration)
const encryptionKey = "open"; // This should be a strong, secret key in a real application

// Function to decrypt an encrypted string using AES with the defined key
function decryptNumber(encryptedData) {
  try {
    // Decrypt the data using AES with the encryption key
    const decryptedBytes = AES.decrypt(encryptedData, encryptionKey);
    // Convert the decrypted bytes to a UTF-8 string
    const decryptedDataString = decryptedBytes.toString(enc.Utf8);
    // Parse the decrypted string into a floating-point number
    const decryptedData = parseFloat(decryptedDataString);
    // Return the decrypted number
    return decryptedData;
  } catch (error) {
    console.error("Decryption error:", error);
    // Return null if decryption fails
    return null;
  }
}

// Add click event listener to the generate button
generate.addEventListener("click", () => {
  // Get all input elements within the "showPin" element
  var inputs = showPin.getElementsByTagName("input");
  // Initialize an empty string to store the combined PIN
  var joinInputs = "";
  // Loop through each input element
  for (var i = 0; i < inputs.length; i++) {
    // Get the value of the current input element
    var inputValue = inputs[i].value;
    // Concatenate the input value to the joinInputs string
    joinInputs += inputValue;
  }
  // Log the combined PIN to the console for debugging purposes
  console.log(joinInputs);

  // Decrypt the offline balance (if it exists in local storage)
  const decOfflineBalance = decryptNumber(offlineBalance);

  // Check if the entered PIN matches the value stored in local storage
  if (localStorage.getItem("pin") == joinInputs) {
    console.log("true"); // Log for debugging (PIN match)
    // Check if the decrypted offline balance is greater than zero
    if (decOfflineBalance > 0) {
      // Redirect the user to the "senders-QR-code.html" page if there's a positive balance
      window.location.href = "./senders-QR-code.html";
    } else {
      // Redirect the user to the "warning.html" page if the balance is zero or negative
      window.location.href = "./warning.html";
    }
    // Store a flag ("true") in local storage indicating a successful PIN entry (likely for further actions)
    localStorage.setItem("correctPin", "true");
  } else {
    console.log("false"); // Log for debugging (PIN mismatch)
    const dialog = new DialogBox("Wrong  transactional pin", () => {
      console.log("Callback function called.");
    });
    dialog.displayDialogBox();
  }
});