import config from './config/config.js';
import { TokenVerifier } from "./tokenVerifiers";

// Get references to HTML elements
const email = document.getElementById("emailText");
const password = document.getElementById("passwordText");
const login = document.getElementById("login");
const errorMessage = document.getElementById("error-message");
const errorText = document.getElementById('error-text');

// Function to display error messages
function displayError(message) {
  errorText.textContent = message;
  errorMessage.classList.remove("d-none");
}

// Token validation on page load
const token = localStorage.getItem("token");
if (token) {
  const tokenVerifier = new TokenVerifier(token);
  if (tokenVerifier.isTokenExpired()) {
    console.log("Token expired");
  } else {
    console.log("Token is valid");
    window.location.href = "./homepage.html";
  }
}

function showLoadingSpinner() {
  const loadingSpinner = document.getElementById("loadingSpinner");
  loadingSpinner.classList.remove("d-none");
}

function hideLoadingSpinner() {
  const loadingSpinner = document.getElementById("loadingSpinner");
  loadingSpinner.classList.add("d-none");
}

function loginUser(data) {
  showLoadingSpinner();

  setTimeout(() => {
      fetch(`${config.baseURL}/user/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
      })
      .then((res) => {
          if (!res.ok) {
              throw new Error(`Server error: ${res.status}`);
          }
          return res.json();
      })
      .then((res) => {
          hideLoadingSpinner();
          if (res.error) {
              displayError(res.error);
          } else {

              // Handle successful login, save token, and redirect
              errorMessage.classList.add("d-none");

              localStorage.setItem("token", res.token);
              localStorage.setItem("user_id", res.payload.userId);
              localStorage.setItem("session_id", res.payload.sessionId);
              localStorage.setItem("phone_number", res.payload.phoneNumber);
              localStorage.setItem("username", res.payload.username);
              localStorage.setItem("wm_id", res.payload.wmId);
              localStorage.setItem("wallet_id", res.payload.walletId);
              localStorage.setItem("online_mirror_balance", res.payload.mirrorBalance);
              localStorage.setItem("email", res.payload.email);
              localStorage.setItem("pin", res.payload.pin);


              // ... other localStorage items
              window.location.href = "./homepage.html";
          }
      })
      .catch((err) => {
          hideLoadingSpinner();
          displayError("Invalid phone number or password!")
      });
  }, 500);  // Ensure at least 500ms delay
}


// Event listener for the login button
login.addEventListener("click", (event) => {

  event.preventDefault();

  const userPhoneNumber = email.value;
  const userPassword = password.value;

  if (!userPhoneNumber || !userPassword) {
    displayError("All fields are mandatory.Please input your phone number and password.");
  } else if (!navigator.onLine){
    displayError("You are offline. You need an internet connection to login successfully.");
  } else {
    errorMessage.classList.add("d-none");

    // Create user data object and attempt login
    const userData = { phoneNumber: userPhoneNumber, password: userPassword };
    loginUser(userData);
  }
});