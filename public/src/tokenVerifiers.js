import { jwtDecode } from 'jwt-decode';

export class TokenVerifier {
  constructor(token) {
    this.token = token;
  }

  isTokenExpired() {
    const tokenExpirationTimestamp = this.getTokenExpirationTimestamp();
    if (!tokenExpirationTimestamp) {
      return true; // Token has no valid expiration timestamp
    }

    const currentTimestamp = Math.floor(Date.now() / 1000); // Current time in seconds
    return currentTimestamp > tokenExpirationTimestamp;
  }

  getTokenExpirationTimestamp() {
    try {
      const payload = this.decodeTokenPayload();
      if (payload && payload.exp) {
        return parseInt(payload.exp, 10);
      }
    } catch (error) {
      console.error("Error decoding token payload: " + error);
    }
    return null;
  }

  decodeTokenPayload() {
    if (!this.token) {
      return null; // No token to decode
    }

    try {
      const payload = jwtDecode(this.token);
      return payload;
    } catch (error) {
      console.error("Error decoding token payload: " + error);
    }
    return null;
  }

  async refreshToken() {
    try {
      const response = await fetch('localhost:5050/api/v1/refresh-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: this.token }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      this.token = data.token; // Update the token
      localStorage.setItem('token', this.token); // Update token in local storage
      return this.token;
    } catch (error) {
      console.error("Error refreshing token: ", error);
      return null;
    }
  }
}

export default TokenVerifier;
