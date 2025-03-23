
import * as jose from "jose";

const ALG = "RS256";

// TODO token cache until expiry
export async function getToken() {
    const pk = await jose.importPKCS8(process.env.google_auth_private_key!, ALG);
    const jwt = await new jose.SignJWT({ scope: "https://www.googleapis.com/auth/spreadsheets" })
        .setProtectedHeader({ alg: "RS256", typ: "JWT", kid: process.env.google_auth_private_key_id })
        .setIssuedAt()
        .setExpirationTime("1h")
        .setAudience("https://oauth2.googleapis.com/token")
        .setIssuer(process.env.google_auth_client_email!)
        .sign(pk);

    const tokenResp = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
            assertion: jwt,
        }),
    });

    if (!tokenResp.ok) {
        console.error("Error fetching token:", await tokenResp.text());
        throw new Error("Failed to fetch token");
    }

    const tokenData = await tokenResp.json();
    if (!tokenData.access_token) {
        console.error("No access token received:", tokenData);
        throw new Error("No access token received");
    }
    return tokenData.access_token;
}
