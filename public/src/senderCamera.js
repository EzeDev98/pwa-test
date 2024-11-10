// Get references to HTML elements
const openCamera = document.getElementById("openQR"); // Reference to the HTML element that opens the camera
const camera = document.getElementById("camera"); // Reference to the HTML element where the camera view is displayed
const encryptionKey = "open"; // Encryption key used for data security
const { AES, enc } = require("crypto-js"); // Import the crypto-js library for encryption
//import dialog box
import { DialogBox } from "./dialogBox";

// Check for token validation
import { TokenVerifier } from "./tokenVerifiers"; // Import a module for token verification

const tokenVerifier = new TokenVerifier(
  localStorage.getItem("token") // Get the token from local storage // Set the token expiration time
);

if (tokenVerifier.isTokenExpired()) {
  console.log("Token expired"); // Log a message indicating that the token has expired
  window.location.href = "./login-page.html"; // Redirect to the login page
} else {
  console.log("Token is valid"); // Log a message indicating that the token is valid
}

// Function to decrypt a string using the encryption key
function decryptString(encryptedData) {
  const decryptedData = AES.decrypt(encryptedData, encryptionKey).toString(
    enc.Utf8
  );
  return decryptedData;
}

// Event listener for opening or closing the camera view
openCamera.addEventListener("click", () => {
  if (camera.style.display === "block") {
    camera.style.display = "none"; // Hide the camera view
    console.log("Camera off"); // Log that the camera is turned off
  } else {
    camera.style.display = "block"; // Show the camera view
    console.log("Camera on"); // Log that the camera is turned on
  }
});

// Function to handle a successful QR code scan
function onScanSuccess(qrCodeMessage) {
  const scannedMessage = JSON.parse(qrCodeMessage);
  console.log(scannedMessage);

  const firstValue = scannedMessage.firstValue;
  const time = scannedMessage.time;

  const dec = decryptString(firstValue);
  console.log(dec);

  const timeDate = new Date(); // Create a new Date object for time calculations
  const newDate = new Date(); // Add 10 minutes to the current time

  // Extract the day, month, year, hours, and minutes
  const day = newDate.getDate(); // Day of the month (1-31)
  const month = newDate.getMonth() + 1; // Month (0-11, so we add 1 to get 1-12)
  const year = newDate.getFullYear().toString().substr(-2); // Last two digits of the year
  const hours = newDate.getHours(); // Hours (0-23)
  const minutes = newDate.getMinutes(); // Minutes (0-59) 

  // Format the date and time as dd-mm-yy hh:mm
  const currentDate = `${day.toString().padStart(2, "0")}-${month
    .toString()
    .padStart(2, "0")}-${year} ${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;

  console.log(currentDate);
  console.log(time);


  if (dec === "true") {
    if (currentDate > time) {
      console.log("expired");
      const dialog = new DialogBox("QR code has expired", () => {
        console.log("Callback function called.");
      });
      dialog.displayDialogBox();
      qrCodeMessage.clear(); // Clear the QR code message (Note: 'clear()' should likely be 'qrCodeScanner.clear()')
      qrCodeScanner.stop();
    } else {
      console.log("not expired");
      const name = scannedMessage.displayName;
      const amount = scannedMessage.amount;
      const description = scannedMessage.description;
      const wm_id = scannedMessage.userId;
      const receiver_phone_number = scannedMessage.phoneNumber;

      // Set data in local storage for later use
      localStorage.setItem("newName", name);
      localStorage.setItem("newAmount", amount);
      localStorage.setItem("newDescription", description);
      localStorage.setItem("receiver_wmId", wm_id);
      localStorage.setItem("receiver_phone_number", receiver_phone_number);

      window.location.href = "../pages/senders-confirmation.html"; // Redirect to the sender's confirmation page
      console.log(qrCodeMessage);
      localStorage.setItem("ScanSuccess", "true"); // Set a flag to indicate successful scan
      qrCodeMessage.clear(); // Clear the QR code message (Note: 'clear()' should likely be 'qrCodeScanner.clear()')
      qrCodeScanner.stop();
    }
  } else {
    console.log("Wrong QR"); // Log that the scanned QR code is incorrect
  }
}

function onScanError() {
  // Function to handle scan errors
  // console.log("Error scanning");
}

console.log("QR code test"); // Log a test message
var qrCodeScanner = new Html5QrcodeScanner("reader", {
  fps: 60, // Frames per second for the camera view
  qrbox: 200, // Size of the QR code box
});

qrCodeScanner.render(onScanSuccess, onScanError); // Start rendering the QR code scanner
