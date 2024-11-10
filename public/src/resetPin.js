import config from './config.js';

const password = document.getElementById("password");
const oldPin = document.getElementById("oldPin");
const newPin = document.getElementById("newPin");
const confirmPin = document.getElementById("checkPin");
const phoneNumber = localStorage.getItem("phone_number");
const changePin = document.getElementById("changePin");

function changePinRequest(data) {
  // Check if newPin and confirmPin match
  //   if (data.newPin !== confirmPin.value) {
  //     console.log(newPin.value, confirmPin.value);
  //     console.log("New PIN and Confirm PIN do not match");
  //     return;
  //   }
  console.log(data);

  
  const token = localStorage.getItem("token");


  fetch(`${config.baseURL}/user/change-pin`,
    {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((responseData) => {
      console.log(responseData);
    })
    .catch((err) => {
      console.log("Error: did not sync.\n" + err);
    });
}

changePin.addEventListener("click", () => {
  const requestData = {
    phoneNumber: phoneNumber,
    password: password.value,
    pin: parseInt(oldPin.value),
    newPin: parseInt(newPin.value),
  };
  changePinRequest(requestData);
});
