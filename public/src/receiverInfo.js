import { CurrentDateInfo } from "./time";

//checking for token validation
import { TokenVerifier } from "./tokenVerifiers";

const expirationInHour = 3;
const expirationTimeInSeconds = 3600 * expirationInHour;
const tokenVerifier = new TokenVerifier(
  localStorage.getItem("token"),
  expirationTimeInSeconds
);

if (tokenVerifier.isTokenExpired()) {
  console.log("Token expired");
  window.location.href = "./login-page.html";
} else {
  console.log("Token is valid");
}
const time = new CurrentDateInfo();

const amount = localStorage.getItem("amount");
const username = localStorage.getItem("username");
const description = localStorage.getItem("description");
const wmID = localStorage.getItem("wm_id");
const walletPhoneNumber = localStorage.getItem("phone_number");

const amountDisplay = document.getElementById("amount");
const descriptionDisplay = document.getElementById("description");
const nameDisplay = document.getElementById("name");
const timeDisplay = document.getElementById("time");
const idDisplay = document.getElementById("wm_Id");
const wallet_phone_numberDisplay = document.getElementById(
  "wallet_phone_number"
);

amountDisplay.innerHTML = amount;
descriptionDisplay.innerHTML = description;
nameDisplay.innerHTML = username;
timeDisplay.innerHTML = `${time.getDayName()}, ${time.getFormattedDateTime()}`;
idDisplay.innerHTML = wmID;
wallet_phone_numberDisplay.innerHTML = walletPhoneNumber;

const generate = document.getElementById("generate");
generate.addEventListener("click", () => {
  if (!amount || amount.trim() === "") {
    alert("No amount");
  } else {
    window.location.href = "QR-code.html";
    localStorage.setItem("generateQRCode", "true");
  }
});
