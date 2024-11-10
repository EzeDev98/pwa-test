import config from "./config/config";

const pin = document.getElementById("pin");
const checkPin = document.getElementById("checkPin");
const submitButton = document.getElementById("submitButton");
const phoneNumber = localStorage.getItem("phone_number");
const token = localStorage.getItem("token");

function showLoadingSpinner() {
  let loadingSpinner = document.getElementById("loadingSpinner");
  loadingSpinner.classList.remove("d-none");
}

function hideLoadingSpinner() {
  let loadingSpinner = document.getElementById("loadingSpinner");
  loadingSpinner.classList.add("d-none");
}

function checkPinEquality() {
  showLoadingSpinner();

  const enteredPin = pin.value;
  const enteredCheckPin = checkPin.value;

  if (enteredPin === enteredCheckPin) {
    console.log("Pins match!");

    const requestData = {
      pin: parseInt(enteredPin),
      phoneNumber: phoneNumber,
    };
    console.log(requestData);

    if (navigator.onLine) {
      fetch(`${config.baseURL}/user/set-pin`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("PUT request successful:", data);
          localStorage.setItem("pin", requestData.pin);
          $("#successModal").modal("show");
          window.location.href = "homepage.html";
        })
        .catch((error) => {
          console.error("Error making PUT request:", error);
          alert("Error making PUT request:", error);
        })
        .finally(() => {
          hideLoadingSpinner();
        });
    } else {
      alert("No internet connection. Please connect to the internet to proceed.");
      hideLoadingSpinner();
    }
  } else {
    console.log("Pins do not match!");
    alert("Pins do not match!");
    hideLoadingSpinner();
  }
}

submitButton.addEventListener("click", () => {
  checkPinEquality();
});