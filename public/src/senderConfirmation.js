import { CurrentDateInfo } from "./time";
const time = new CurrentDateInfo();

const accept = document.getElementById("accept");

const amountDisplay = document.getElementById("amount");
const nameDisplay = document.getElementById("name");
const descriptionDisplay = document.getElementById("description");
const timeDisplay = document.getElementById("time");
const idDisplay = document.getElementById("wm_id");
const phoneNumberDisplay = document.getElementById("phoneNumber");

const newAmount = localStorage.getItem("newAmount");
const newName = localStorage.getItem("newName");
const newDescription = localStorage.getItem("newDescription");
const newId = localStorage.getItem("receiver_wmId");
const receiver_phone_number = localStorage.getItem("receiver_phone_number");

function showReceipt() {
  amountDisplay.innerHTML = newAmount;
  descriptionDisplay.innerHTML = newDescription;
  nameDisplay.innerHTML = newName;
  idDisplay.innerHTML = newId;
  phoneNumberDisplay.innerHTML = receiver_phone_number;
  timeDisplay.innerHTML = `${time.getDayName()}, ${time.getFormattedDateTime()}`;
}

showReceipt();

accept.addEventListener("click", () => {
  console.log("click");
  if (localStorage.getItem("classification") == null) {
    alert("Please select classification");
  } else {
    window.location = "./enter-pin-page.html";
  }
});

  