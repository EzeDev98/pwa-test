# QR Code Payment application documentation

The purpose of this application is to provide a proper structural understanding of the QR Code payment application code for the frontend.

Firstly, the point of this application is to allow users to be able to transfer warrants (the WealthMarket currency) in the form of money from one user to another (that is, from a buyer to a seller or a sender to a receiver).

The frontend part of the application is written in HTML, CSS, and vanilla JavaScript. The frontend uses webpack as a module bundler for the dependencies and packages that are installed via npm. It transforms the codes on the front for faster load times.

## list of functionalities

1. **login into the wallet** - src/loginPage.js  / pages/login-page.html
2. **funding wallet from the online market account** - src/fundBalance.js  / pages/fund-offline-bal.html
3. **creation of qr code (receiver)** - src/sellerGenerate.js  / pages/QR-code.html
4. **scanning of qr code (sender)** - src/senderCamera.js  / pages/camera.html
5. **creation of qr code (sender)** - src/senderQRcode.js  / pages/senders-qr-code.html
6. **scanning of qr code (receiver)** - src/receiverCamera.js  / pages/camera-receiver.html
7. **viewing transaction history** - src/homePage.js  / pages/homepage.html
8. **sending money from offline to online market account** - src/transferOnline.js  / pages/fund-main-acct.html
9. **Syncing of transactions (manual and automatic syncing)** - src/homePage.js, src/automaticSync.js / pages/homepage.html

## Files organization for Frontend

In the application, the "public" folder contains every file needed for the frontend.

- **ASSETS** contains the images
- **PAGES** are where the html and css files are store
- **DIST** are where the JavaScript bundles are stored
- **ICONS** are where the application ICONS are stored
- **SRC** contains the JavaScript files.

### SRC FOLDER

The src folder contains JavaScript files which are module to into the dist folder to be used in the HTML pages. I will list out the files and their importance.

- **automaticSyncing** file contains the logic for syncing automatically (once the web app is connected to the internet).
- **fundBalance** file contains the logic for funding the wallet locally
- **homePage** file contains many logics. It holds, the transaction history, the encryption and decryption. Also contains the sync functionality, contains the log out functionality
- **receiverCamera**: scans the sender's qrcode
- **enterPin**: this is for creating a transactional pin.
- **keycloakConfg**: the keycloak configuration of the application.
- **resetPin**: for resetting the transactional pin.
- **receiverInfo**: to create receiver information.
- **sellerGenerate**: to generate the the qr code for 
- **loginPage**: contains the login endpoint for the application.
- **senderCamera**: this is the sender's camera to scan the receiver's qr code.
- **senderQRcode**: to create the sender's qr code.
- **tokenVerifier**: This serves as a function to verify the token's validity on every page. The token is from the user log in on the PWA and the expiring date is 7 days.
- **transferOnline** : This file is for the the transferring back warrants from the offline pay back to the online market account.
- **uid**: This is used for generating the transaction reference.



### IMPORTANT FILES
- **sw.js**: This is where the Service workers logic is held. The "installation", "activation" and "fetch". It also has to do with the caching.
- **manifest.json**: This file is responsible for the mobile feel of the PWA.

### Creating the Dist folder
Since this is a plain HTML/JS file, webpack is used to build the application. Using ``npm run build`` in the command is to build the JavaScript files into the dist folder.

Frontend video https://1drv.ms/v/s!Amj_cpSEDlgSl4YNm-5ySlHhKU8pHg?e=72kbVc

**note**
I have fixed the qr code box scanner, I also added the timer of qr code expiration but the UI does not reflect the countdown on the receiver side but once it reaches 3 minutes the qr code will become expired. 