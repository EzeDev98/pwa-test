// Import required modules
const qrCode = require("qrcode"); // Import the QR code generation library
const { AES, enc } = require("crypto-js"); // Import the crypto-js library for encryption

// Get references to HTML elements
const display = document.getElementById("qrDisplay"); // Reference to the HTML element where the QR code will be displayed
const amount = localStorage.getItem("amount"); // Get the stored 'amount' from local storage
const description = localStorage.getItem("description"); // Get the stored 'description' from local storage
const userId = localStorage.getItem("wm_id"); // Get the stored 'wm_id' from local storage
const displayName = localStorage.getItem("username"); // Get the stored 'username' from local storage
const phoneNumber = localStorage.getItem("phone_number");

const encryptionKey = "open"; // Encryption key used for data security

// Function to encrypt a string using the encryption key
function encrypString(data) {
  const encryptedData = AES.encrypt(data, encryptionKey).toString();
  return encryptedData;
}

// Function to generate a QR code from the provided text
const generateQRCode = (text) => {
  qrCode.toCanvas(display, text, {
    width: 250,
    height: 250,
  });
};

// Function to display the QR code
function showQRCode() {
  const firstValue = encrypString("true"); // Encrypt the value "true" for the QR code
  const timeDate = new Date(); // Create a new Date object for time calculations
  const newDate = new Date(timeDate.setMinutes(timeDate.getMinutes() + 3)); // Add 10 minutes to the current time

  // Extract the day, month, year, hours, and minutes
  const day = newDate.getDate(); // Day of the month (1-31)
  const month = newDate.getMonth() + 1; // Month (0-11, so we add 1 to get 1-12)
  const year = newDate.getFullYear().toString().substr(-2); // Last two digits of the year
  const hours = newDate.getHours(); // Hours (0-23)
  const minutes = newDate.getMinutes(); // Minutes (0-59)

  // Format the date and time as dd-mm-yy hh:mm
  const formattedDateTime = `${day.toString().padStart(2, "0")}-${month
    .toString()
    .padStart(2, "0")}-${year} ${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;

  console.log(formattedDateTime);

  // Assemble the payment information to be encoded in the QR code
  const newPay = {
    firstValue,
    displayName,
    amount,
    description,
    userId,
    time: formattedDateTime,
    phoneNumber,
  };
  // Check if the QR code generation is requested
  if (localStorage.getItem("generateQRCode") === "true") {
    const jsonPay = JSON.stringify(newPay);

    generateQRCode(jsonPay); // Generate and display the QR code
    localStorage.removeItem("generateQRCode"); // Remove the 'generateQRCode' flag from local storage
    localStorage.removeItem("description"); // Remove the 'description' from local storage
    localStorage.removeItem("amount"); // Remove the 'amount' from local storage
  } else {
    console.log("false"); // Output "false" if QR code generation is not requested
  }
}

showQRCode(); // Call the function to display the QR code
