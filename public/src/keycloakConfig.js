// change the client-id to offline-pay-app when want to be used online
// change the client-id to pwa when to be tested locally

import Keycloak from "keycloak-js";
class KeycloakManager {
  constructor() {
    this.keycloak = new Keycloak({
      url: "https://kauth.thewealthmarket.com",
      realm: "wealthmarket",
      clientId: "wm-offline-pay",
      // clientId: "pwa",
      cors: true,
    });
  }

  async isAuthenticated() {
    return this.keycloak.authenticated;
  }

  // async logIn() {
  //   try {
  //     await this.keycloak.login().then(() => {
  //       this.keycloak.loadUserProfile().then((userProfile) => {
  //         console.log(JSON.stringify(userProfile));
  //         localStorage.setItem(
  //           "keycloakUserProfile",
  //           JSON.stringify(userProfile)
  //         );
  //         // const wmid = localStorage.getItem("wm_id");
  //         // this.getAccountNumber(wmid);
  //       });
  //       localStorage.setItem("keycloak-token", this.keycloak.token);
  //     });
  //   } catch (error) {
  //     console.error("Keycloak initialization failed:", error);
  //   }
  // }

  async logIn() {
    try {
      if (this.keycloak && !this.keycloak.authenticated) {
        await this.keycloak.login({
          redirectUri: "https://https://qr-pwa-54768.web.app", // Replace with your actual redirect URI
        });

        // Check if login was successful before loading user profile
        if (this.keycloak.authenticated) {
          this.keycloak.loadUserProfile().then((userProfile) => {
            console.log(JSON.stringify(userProfile));
            localStorage.setItem(
              "keycloakUserProfile",
              JSON.stringify(userProfile)
            );
            localStorage.setItem("keycloak-token", this.keycloak.token);
          });
        }
      } else {
        console.log(
          "User is already authenticated or Keycloak instance is not initialized"
        );
      }
    } catch (error) {
      console.error("Keycloak login failed:", error);
    }
  }

  async initializeKeycloak() {
    try {
      await this.keycloak.init({
        onLoad: "check-sso",
        checkLoginIframe: false,
      });

      if (this.keycloak.authenticated) {
        this.keycloak.loadUserProfile().then((userProfile) => {
          console.log(JSON.stringify(userProfile));
          const user = userProfile;
          const wmId = user.attributes["wm-unique-id"][0];
          localStorage.setItem(
            "keycloakUserProfile",
            JSON.stringify(userProfile)
          );
          // const wmid = localStorage.getItem("wm_id");
          localStorage.setItem("marketAccountWmId", wmId);
          this.getAccountNumber(wmId);
        });
        localStorage.setItem("keycloak-token", this.keycloak.token);
      } else {
        console.log("User is not authenticated");
        window.location.href = this.keycloak.createLoginUrl();
        this.keycloak.loadUserProfile().then((userProfile) => {
          const user = userProfile;
          const wmId = user.attributes["wm-unique-id"][0];
          localStorage.setItem("marketAccount", wmId);
          console.log(JSON.stringify(userProfile));
          localStorage.setItem(
            "keycloakUserProfile",
            JSON.stringify(userProfile)
          );
          // const wmid = localStorage.getItem("wm_id");
          localStorage.setItem("marketAccountWmId", wmId);
          this.getAccountNumber(wmId);
        });
        localStorage.setItem("keycloak-token", this.keycloak.token);
      }
    } catch (error) {
      console.error("Keycloak initialization failed:", error);
    }
  }

  async logOut() {
    try {
      if (this.keycloak.authenticated) {
        await this.keycloak.logout();
        console.log("Logout successful");
      } else {
        console.log("Keycloak instance is not initialized");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  // async displayProfile() {
  //   if (this.keycloak.authenticated) {
  //     this.keycloak.loadUserProfile().then((userProfile) => {
  //       console.log(JSON.stringify(userProfile));
  //       localStorage.setItem(
  //         "keycloakUserProfile",
  //         JSON.stringify(userProfile)
  //       );
  //     });
  //     localStorage.setItem("keycloak-token", this.keycloak.token);
  //   }
  // }

  async getAccountNumber(wmid) {
    try {
      const endpointUrl = `https://users.thewealthmarket.com/api/v1/marketaccount/number/${wmid}`;
      const headers = {
        Authorization: `Bearer ${this.keycloak.token}`,
      };
      const response = await fetch(endpointUrl, {
        method: "GET",
        headers,
      });
      if (response.ok) {
        const result = await response.json();
        const accountNumber = result.data;
        localStorage.setItem("accountNumber", accountNumber);
        console.log(`Account Number: ${accountNumber}`);
      } else {
        console.error(`Error: ${response.status}, ${await response.text()}`);
      }
    } catch (error) {
      console.error("Error during API request:", error.message);
    }
  }
}

export const keycloakManager = new KeycloakManager();
