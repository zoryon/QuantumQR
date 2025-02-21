// lib/middlewareHelpers.ts
export async function verifySession(sessionToken: string) {
    console.log("Verifying session token:", sessionToken);

    if (!sessionToken) {
        console.error("No session token provided");
        return null;
    }

    const [encodedData, signature] = sessionToken.split(".");
    if (!encodedData || !signature) {
        console.error("Invalid session token format");
        return null;
    }

    try {
        // Verify the signature using Web Crypto API
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
            "raw",
            encoder.encode(process.env.SESSION_SECRET!),
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["verify"]
        );

        const isValid = await crypto.subtle.verify(
            "HMAC",
            key,
            encoder.encode(signature),
            encoder.encode(encodedData)
        );

        if (!isValid) {
            console.error("Invalid session token signature");
            return null;
        }

        // Decode the session data
        const sessionData = JSON.parse(
            Buffer.from(encodedData, "base64").toString()
        );

        // Check expiration
        if (new Date(sessionData.expires) < new Date()) {
            console.error("Session token expired");
            return null;
        }

        console.log("Session verified successfully:", sessionData);
        return sessionData;
    } catch (error) {
        console.error("Error verifying session token:", error);
        return null;
    }
}