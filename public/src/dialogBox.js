class DialogBox {
  constructor(message, callback) {
    this.message = message;
    this.callback = callback;
    this.overlay = document.getElementById("overlay");
    this.dialogContainer = document.createElement("div");
    this.content = document.createElement("div");
    this.button1 = document.createElement("button");

    this.setupDialogBox();
  }

  setupDialogBox() {
    // Set up dialog container
    this.dialogContainer.classList.add(
      "dialog-container",
      "show",
      "rounded-3",
      "col-11"
    );

    // Set up content
    this.content.classList.add("content", "py-4", "h6", "text-center");
    this.content.textContent = this.message;

    // Set up "Close" button
    this.button1.classList.add("btn", "my-btn", "float-rt");
    this.button1.textContent = "Close";
    this.button1.addEventListener("click", () => {
      if (this.callback && typeof this.callback === "function") {
        this.callback();
      }
      this.closeDialogBox();
    });

    // Add elements to dialog container
    this.dialogContainer.appendChild(this.content);
    this.dialogContainer.appendChild(this.button1);
  }

  displayDialogBox() {
    // Display dialog box
    this.overlay.style.display = "block";
    document.body.appendChild(this.dialogContainer);
  }

  closeDialogBox() {
    // Close dialog box
    this.overlay.style.display = "none";
    this.dialogContainer.remove();
  }
}

export { DialogBox };

// Example usage:
// const dialog = new DialogBox("Your message here", () => {
//   console.log("Callback function called.");
// });
// dialog.displayDialogBox();
