import config from './config/config.js';


// Function for displaying a modal dialog
function syncDialog(message, callback) {
  const overlay = document.getElementById("overlay");
  overlay.style.display = "block";

  const dialogContainer = document.createElement("div");
  dialogContainer.classList.add(
    "dialog-container",
    "show",
    "rounded-3",
    "col-11"
  );

  const content = document.createElement("div");
  content.classList.add("content", "py-4", "h3", "text-center");
  content.textContent = message;

  const button = document.createElement("button");
  button.classList.add("btn", "my-btn", "float-rt");
  button.textContent = "Close";

  button.addEventListener("click", () => {
    if (callback && typeof callback === "function") {
      callback();
    }
    dialogContainer.remove();
    overlay.style.display = "none";
    // close()x
  });

  dialogContainer.appendChild(content);
  dialogContainer.appendChild(button);
  document.body.appendChild(dialogContainer);
}
function mandatorySync() {
  const currentSync = new Date();
  const nextSync = new Date(currentSync.getTime());

  nextSync.setHours(nextSync.getHours() + 30);
  localStorage.setItem("mandatorySync", nextSync);
}

async function changeSyncStatus() {
  try {
    const DBOpen = indexedDB.open("transactionDb", 3);
    const db = await new Promise((resolve, reject) => {
      DBOpen.onupgradeneeded = (ev) => {
        const db = ev.target.result;
        if (!db.objectStoreNames.contains("storeTransactions")) {
          db.createObjectStore("storeTransactions", { keyPath: "id" });
        }
      };
      DBOpen.onsuccess = (ev) => resolve(ev.target.result);
      DBOpen.onerror = (err) => reject(err);
    });

    if (navigator.onLine) {
      await changeSync(db);
    } else {
      console.log("No internet connection. Sync status change skipped.");
    }
  } catch (err) {
    console.error("Error during changeSyncStatus:", err);
  }
}

// function to change sync status
async function changeSync(db) {
  return new Promise((resolve, reject) => {
    let tx = db.transaction("storeTransactions", "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = (err) => reject(err);

    let store = tx.objectStore("storeTransactions");
    let getHistory = store.getAll();
    getHistory.onsuccess = (ev) => {
      let history = ev.target.result;

      // Map and update the sync status of each transaction
      const mappedHistory = history.map((item) => ({
        ...item,
        synced: 1,
      }));
      mappedHistory.forEach((mappedHistory) => {
        store.put(mappedHistory);
      });
    };
    getHistory.onerror = (err) => reject(err);
  });
}
const token = localStorage.getItem("token");

// Function to send data to a remote server
async function sendData(data) {
  try {
    const response = await fetch(`${config.baseURL}/sync/transactions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    console.log(result);
    console.log(result.mirror_balance);
    if (result.mirror_balance != null) {
      localStorage.setItem(
        "online_mirror_balance",
        JSON.stringify(result.mirror_balance)
      );
    }
    document.getElementById("syncButton").classList.remove("rotate-on-sync");
    // syncDialog("Successfully Synced");
    mandatorySync();
    changeSyncStatus();
    const currentTime = new Date();
    localStorage.setItem("lastSyncTime", currentTime);
    localStorage.setItem("sync status", true);
  } catch (err) {
    console.log("error: did not sync. \n" + err);
    // syncDialog("Unsuccessful synced");
  }
}

console.log("Updated the recipient's phone number for deployment");

// Function to synchronize data
async function syncNow(db) {
  try {
    let tx = db.transaction("storeTransactions", "readonly");
    let store = tx.objectStore("storeTransactions");
    let getHistory = store.getAll();

    const history = await new Promise((resolve, reject) => {
      getHistory.onsuccess = () => resolve(getHistory.result);
      getHistory.onerror = (err) => reject(err);
    });

    const mappedHistory = history.map((item) => ({
      username: item.username,
      receiver_name: item.name,
      recipient_phone_number: item.receiver_phoneNumber,
      user_wallet_phoneNumber: item.user_wallet_phoneNumber,
      user_wmId: item.user_id,
      balance_before_transfer: item.balance_before_transaction,
      amount: item.amount,
      balance_after_transfer: item.balance_after_transaction,
      transaction_reference: item.transaction_reference,
      description: item.description,
      receiver_wmId: item.receiver_wmId,
      classification: item.classification,
      type: item.type,
      date: item.time,
    }));

    console.log(mappedHistory); // Log the transaction data
    await sendData(mappedHistory); // Send the data for synchronization
  } catch (err) {
    console.log(err); // Log an error in case of a history retrieval error
    syncDialog("Error Syncing: " + err.message);
  }
}

// Exported function for automatic synchronization
export async function autoSync() {
  try {
    const DBOpen = indexedDB.open("transactionDb", 3);
    const db = await new Promise((resolve, reject) => {
      DBOpen.onupgradeneeded = (ev) => {
        const db = ev.target.result;
        if (!db.objectStoreNames.contains("storeTransactions")) {
          db.createObjectStore("storeTransactions", { keyPath: "id" });
        }
      };
      DBOpen.onsuccess = (ev) => resolve(ev.target.result);
      DBOpen.onerror = (err) => reject(err);
    });

    if (navigator.onLine) {
      await syncNow(db);
    } else {
      syncDialog("Error Syncing: No network connection");
    }
  } catch (err) {
    console.warn(err); // Log a warning in case of an error
    syncDialog("Error Syncing: " + err.message);
  }
}