const path = require("path");
const Dotenv = require("dotenv-webpack");

module.exports = {
  mode: "development",
  entry: {
    sellerGenerate: "./public/src/sellerGenerate.js",
    receiverInfo: "./public/src/receiverInfo.js",
    senderQRcode: "./public/src/senderQRcode.js",
    receiverCamera: "./public/src/receiverCamera.js",
    senderCamera: "./public/src/senderCamera.js",
    receiverSuccessPage: "./public/src/receiverSuccessPage.js",
    senderSuccessPage: "./public/src/senderSuccessPage.js",
    senderConfirmation: "./public/src/senderConfirmation.js",
    homePage: "./public/src/homePage.js",
    automaticSyncing: "./public/src/automaticSyncing.js",
    fundBalance: "./public/src/fundBalance.js",
    enterPin: "./public/src/enterPin.js",
    createPin: "./public/src/createPin.js",
    loginPage: "./public/src/loginPage.js",
    transferOnline: "./public/src/transferOnline.js",
    spendingReports: "./public/src/spendingReport.js",
  },
  output: {
    path: path.resolve(__dirname, "public/dist"),
    filename: "[name].bundle.js",
  },
  // resolve: {
  //   fallback: {
  //     buffer: require.resolve("buffer"),
  //     stream: require.resolve("stream-browserify"),
  //     util: require.resolve("util/"),
  //   },
  // },
  watch: true,
  plugins: [
    new Dotenv()
  ],
};
