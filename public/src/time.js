class CurrentDateInfo {
  constructor() {
    this.currentDate = new Date();
  }

  getFormattedDate() {
    const day = this.currentDate.getDate();
    const month = this.currentDate.getMonth() + 1;
    const year = this.currentDate.getFullYear() % 100;
    return `${day.toString().padStart(2, "0")}-${month
      .toString()
      .padStart(2, "0")}-${year.toString().padStart(2, "0")}`;
  }
  getFormattedTime() {
    const hours = this.currentDate.getHours();
    const minutes = this.currentDate.getMinutes();
    const seconds = this.currentDate.getSeconds();
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  getFormattedDateTime() {
    return `${this.getFormattedDate()} ${this.getFormattedTime()}`;
  }

  getDayName() {
    return this.currentDate.toLocaleString("en-US", { weekday: "long" });
  }
}

export { CurrentDateInfo };
