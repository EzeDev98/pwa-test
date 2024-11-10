import { CurrentDateInfo } from "./time";
const time = new CurrentDateInfo();

const doneTransfer = document.getElementById("done");
const timeDisplay = document.getElementById("date");
const amountDispplay = document.getElementById("amount");
const descriptionDisplay = document.getElementById("description");
const successDisplay = document.getElementById("success");
const idDisplay = document.getElementById("wm-id");
const name = document.getElementById("name");

const newName = localStorage.getItem("newName");
const newAmount = localStorage.getItem("newAmount");
const newDescription = localStorage.getItem("newDescription");
const newReceivedId = localStorage.getItem("receiver_wmId");
const receiver_phoneNumber = localStorage.getItem("receiver_phone_number");

function showReceipt() {
  name.innerHTML = `${newName}, ${receiver_phoneNumber}`;
  successDisplay.innerHTML = newAmount;
  timeDisplay.innerHTML = `${time.getFormattedDate()}, ${time.getDayName()}`;
  amountDispplay.innerHTML = newAmount;
  descriptionDisplay.innerHTML = newDescription;
  idDisplay.innerHTML = newReceivedId;
}

doneTransfer.addEventListener("click", () => {
  localStorage.removeItem("newAmount");
  localStorage.removeItem("newDescription");
});

showReceipt();

console.log(showReceipt()); 
