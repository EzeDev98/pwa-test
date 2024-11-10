//import dialog box

const payment = document.getElementById("payment");
const generate = document.getElementById("generate");
const classification = document.getElementById("inputField");

generate.addEventListener("click", (e) => {
  const amount = payment.amount.value;
  const description = payment.description.value;
  if (!amount || amount.trim() === "") {
    alert("error, provide amount");
  } else {
    window.location.href = "confirmation-page-request.html";
    localStorage.setItem("amount", amount);
    localStorage.setItem("description", description);
  }
});
