import { Chart, DoughnutController, ArcElement, Legend, Title } from "chart.js";
Chart.register(DoughnutController, ArcElement, Legend, Title);
const classificationName = document.getElementById("classificationName");
const transactionsName = document.getElementById("transactionsName");
const debitTotalAmount = document.getElementById("debitTotalAmount");
const yesterdayButton = document.querySelector(".yesterdayButton");

function calculatePercentage(value1, value2) {
  const percentage = (value1 / value2) * 100;
  return percentage;
}

// gdtting trasnsaction time
function sortTransactionsByTodayAndYesterday(transactions) {
  const today = new Date();
  const yesterday = new Date();
  const thisMonth = new Date();
  const lastMonth = new Date();
  yesterday.setDate(today.getDate() - 1);
  lastMonth.setDate(thisMonth.getMonth() - 1);

  const todayTransactions = [];
  const yesterdayTransactions = [];
  const thisMonthTransactions = [];
  const lastMonthTransactions = [];

  transactions.forEach((transaction) => {
    const trimmedTime = transaction.time.trim();

    const parts = trimmedTime.split(/[,\s:-]+/);
    const year = parseInt(parts[3], 10) + 2000;
    const month = parseInt(parts[2], 10) - 1;
    const day = parseInt(parts[1], 10);
    const hours = parseInt(parts[4], 10);
    const minutes = parseInt(parts[5], 10);
    const seconds = parseInt(parts[6], 10);

    const transactionDate = new Date(year, month, day, hours, minutes, seconds);
    console.log(transactionDate.getMonth());
    console.log(thisMonth.getMonth());
    console.log(lastMonth.getMonth());
    if (
      transactionDate.getFullYear() === today.getFullYear() &&
      transactionDate.getMonth() === today.getMonth() &&
      transactionDate.getDate() === today.getDate()
    ) {
      todayTransactions.push(transaction);
    } else if (
      transactionDate.getFullYear() === yesterday.getFullYear() &&
      transactionDate.getMonth() === yesterday.getMonth() &&
      transactionDate.getDate() === yesterday.getDate()
    ) {
      yesterdayTransactions.push(transaction);
    } else if (transactionDate.getMonth() === thisMonth.getMonth()) {
      thisMonthTransactions.push(transaction);
    } else if (transactionDate.getMonth() === lastMonth.getMonth()) {
      lastMonthTransactions.push(transaction);
    }
  });

  return {
    todayTransactions,
    yesterdayTransactions,
    lastMonthTransactions,
    thisMonthTransactions,
  };
}

function checkStore() {
  function deleteDatabase() {
    // Close the database before deleting
    request.result.close();

    const deleteRequest = indexedDB.deleteDatabase(dbName);

    deleteRequest.onsuccess = function () {
      console.log(`Database '${dbName}' deleted successfully.`);
      // You can take additional actions if needed
    };

    deleteRequest.onerror = function (event) {
      console.error(`Error deleting database '${dbName}':`, event.target.error);
    };
  }

  const dbName = "transactionDb";
  const dbVersion = 3;
  const objectStoreName = "storeTransactions";
  const request = indexedDB.open(dbName, dbVersion);
  request.onerror = function (event) {
    console.error("Error opening the database:", event.target.errorCode);
  };

  request.onsuccess = function (event) {
    const db = event.target.result;

    if (!db.objectStoreNames.contains(objectStoreName)) {
      console.log(
        `Object store '${objectStoreName}' does not exist. Deleting the database...`
      );
      deleteDatabase();
    } else {
      const transaction = db.transaction(["storeTransactions"], "readonly");
      const objectStore = transaction.objectStore("storeTransactions");
      const getAllRequest = objectStore.getAll();

      getAllRequest.onsuccess = function (event) {
        // all transactions
        const allData = event.target.result;

        if (allData.length > 0) {
          const timeTransaction = allData.filter(
            (item) =>
              item.time !== undefined && item.time !== null && item.time !== ""
          );
          //grouping transactions to dates
          const sorts = sortTransactionsByTodayAndYesterday(timeTransaction);
          console.log("this is the sorts", sorts);

          const debit = allData.filter((item) => item.type === "Debit");
          const credit = allData.filter((item) => item.type === "credit");

          //getting length of debits, credits and all transactions

          // console.log(`Number of credit transactions: ${credit.length}`);
          // console.log(`Number of debit transactions: ${debit.length}`);
          // console.log(`Number of transactions: ${allData.length}`);

          //credit and debit arrays
          const creditTransactions = [];
          const debitTransactions = [];
          // classifications
          const housing = [];
          const eatingOut = [];
          const repairMaint = [];
          const clothing = [];
          const genFuel = [];
          const education = [];
          const health = [];
          const groceries = [];
          const electricityBills = [];
          const charity = [];
          const religion = [];
          const lentOut = [];
          const transport = [];
          const eduSupplies = [];
          const personalCare = [];
          const furniture = [];
          const waterBill = [];

          // getting all credits and debits
          // credit.forEach((transaction) => {
          //   creditTransactions.push(transaction);
          // });
          // console.log("List of credits: ", creditTransactions);

          // debit.forEach((transaction) => {
          //   debitTransactions.push(transaction);
          //   console.log(transaction.classification);
          // });
          // console.log("List of debits: ", debitTransactions);
          //end of getting all credits and debits

          // calculating debits and credits
          //
          let totalDebitAmount = 0;

          yesterdayButton.addEventListener("click", () => {
            debit.forEach((transaction) => {
              totalDebitAmount += parseInt(transaction.amount);
              classificationName.textContent = transaction.classification;

              if ((debit.length = 1)) {
                transactionsName.textContent = `${debit.length} transaction`;
              } else {
                transactionsName.textContent = `${debit.length} transactions`;
              }

              debitTotalAmount.textContent = `₦${totalDebitAmount}`;
            });
          });

          const creditName = document.createElement("p");
          let totalCreditAmount = 0;

          // printing on screen
          console.log("before each");
          credit.forEach((transaction) => {
            console.log("here are the transactions:", transaction);
            // totalCreditAmount += parseInt(transaction.amount);
            // console.log(transaction.amount);
            creditName.textContent = transaction.classification;

            if (
              transaction.amount !== undefined &&
              transaction.classification !== undefined
            ) {
              totalCreditAmount += parseInt(transaction.amount);
              console.log(transaction.amount);
              creditName.textContent = transaction.classification;
            } else {
              console.error(
                "Undefined properties in transaction:",
                transaction
              );
            }
          });
          classificationName.append(creditName);
          console.log("total credit amount: " + totalCreditAmount);
          console.log("Total Debit Amount:", totalDebitAmount);
          // end of calculation

          //getting the percentage of credits
          const creditPercentage = calculatePercentage(
            credit.length,
            allData.length
          );
          // console.log(`Credit percentage is: ${creditPercentage.toFixed(2)}%`);

          //getting the percenatage of debits
          const debitPercentage = calculatePercentage(
            debit.length,
            allData.length
          );
          // console.log(`Debit percentage is: ${debitPercentage.toFixed(2)}%`);

          const houseClassification = allData.filter(
            (item) => item.classification === "HOUSING"
          );
          houseClassification.forEach((transaction) => {
            if (transaction != null) {
              housing.push(transaction);
            } else {
              console.log(null);
            }
          });

          const clothingClassification = allData.filter(
            (item) => item.classification === "CLOTHING"
          );
          clothingClassification.forEach((transaction) => {
            if (transaction != null) {
              clothing.push(transaction);
            } else {
              // console.log(null);
            }
          });
          const genClassification = allData.filter(
            (item) => item.genClassification === "GEN/FUEL"
          );
          genClassification.forEach((transaction) => {
            if (transaction != null) {
              genFuel.push(transaction);
            } else {
              console.log(null);
            }
          });
          const educClassification = allData.filter(
            (item) => item.classification === "EDUC SERVICE"
          );
          educClassification.forEach((transaction) => {
            if (transaction != null) {
              education.push(transaction);
            } else {
              console.log(null);
            }
          });
          const healthClassification = allData.filter(
            (item) => item.classification === "HEALTH SERVICE"
          );
          healthClassification.forEach((transaction) => {
            if (transaction != null) {
              health.push(transaction);
            } else {
              console.log(null);
            }
          });
          const groceriesClassification = allData.filter(
            (item) => item.classification === "GROCERIES"
          );
          groceriesClassification.forEach((transaction) => {
            if (transaction != null) {
              groceries.push(transaction);
            } else {
              console.log(null);
            }
          });
          const waterBillClassification = allData.filter(
            (item) => item.classification === "WATER BILL"
          );
          waterBillClassification.forEach((transaction) => {
            if (transaction != null) {
              waterBill.push(transaction);
            } else {
              console.log(null);
            }
          });
          const religionClassification = allData.filter(
            (item) => item.classification === "RELIGION"
          );
          religionClassification.forEach((transaction) => {
            if (transaction != null) {
              religion.push(transaction);
            } else {
              console.log(null);
            }
          });
          const lentOutClassification = allData.filter(
            (item) => item.classification === "LENT OUT"
          );
          lentOutClassification.forEach((transaction) => {
            if (transaction != null) {
              lentOut.push(transaction);
            } else {
              console.log(null);
            }
          });
          const furnitureClassification = allData.filter(
            (item) => item.classification === "FURNITURE EQUIP"
          );
          furnitureClassification.forEach((transaction) => {
            if (transaction != null) {
              furniture.push(transaction);
            } else {
              console.log(null);
            }
          });
          const electricClassification = allData.filter(
            (item) => item.classification === "ELECTRICITY BILLS"
          );
          electricClassification.forEach((transaction) => {
            if (transaction != null) {
              electricityBills.push(transaction);
            } else {
              console.log(null);
            }
          });
          const transportClassification = allData.filter(
            (item) => item.classification === "TRANSPORT"
          );
          transportClassification.forEach((transaction) => {
            if (transaction != null) {
              transport.push(transaction);
            } else {
              console.log(null);
            }
          });
          const repairMaintClassification = allData.filter(
            (item) => item.classification === "REPAIR/MAINT"
          );
          repairMaintClassification.forEach((transaction) => {
            if (transaction != null) {
              repairMaint.push(transaction);
            } else {
              console.log(null);
            }
          });
          const personalCareClassification = allData.filter(
            (item) => item.classification === "PERSONAL CARE"
          );
          personalCareClassification.forEach((transaction) => {
            if (transaction != null) {
              personalCare.push(transaction);
            } else {
              console.log(null);
            }
          });
          const charityClassification = allData.filter(
            (item) => item.classification === "CHARITY"
          );
          charityClassification.forEach((transaction) => {
            if (transaction != null) {
              charity.push(transaction);
            } else {
              console.log(null);
            }
          });
          const eatingClassification = allData.filter(
            (item) => item.classification === "EATING OUT"
          );
          eatingClassification.forEach((transaction) => {
            if (transaction != null) {
              eatingOut.push(transaction);
            } else {
              console.log(null);
            }
          });

          console.log("Eating classifications report: ", eatingClassification);
          console.log(
            "Number of eating out classifications: ",
            eatingClassification.length
          );
          const eduSuppliesClassification = allData.filter(
            (item) => item.classification === "EDU SUPPLIES"
          );
          eduSuppliesClassification.forEach((transaction) => {
            if (transaction != null) {
              eduSupplies.push(transaction);
            } else {
              console.log(null);
            }
          });

          const mychart = document.getElementById("doughnutChart");
          new Chart(mychart, {
            type: "doughnut",
            data: {
              labels: [
                `Debit ${debitPercentage.toFixed(2)}%`,
                `Credit ${creditPercentage.toFixed(2)}%`,
              ],
              datasets: [
                {
                  label: "Transaction type",
                  data: [debit.length, credit.length],
                  backgroundColor: [
                    "rgba(255, 99, 132, 0.7)",
                    "rgba(54, 162, 235, 0.7)",
                  ],
                  borderWidth: 1,
                },
              ],
            },
            options: {
              plugins: {
                title: {
                  display: true,
                  text: "Total Number of debits and credits",
                },
              },
              radius: "60%",
            },
          });
        } else {
          console.log("No transactions history");
        }
      };

      getAllRequest.onerror = function (event) {
        console.error(
          "Error retrieving data from object store:",
          event.target.error
        );
      };
    }
  };
}

checkStore();
// import Chart from "chart.js";
