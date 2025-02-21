export async function createSignedSessionToken(userId: number): Promise<string> {
    try {
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);

        const sessionData = JSON.stringify({
            userId,
            expires: expires.toISOString(),
        });

        const encodedData = Buffer.from(sessionData).toString('base64');
        const signature = await crypto.subtle.sign(
            'HMAC',
            await crypto.subtle.importKey(
                'raw',
                new TextEncoder().encode(process.env.SESSION_SECRET!),
                { name: 'HMAC', hash: 'SHA-256' },
                false,
                ['sign']
            ),
            new TextEncoder().encode(encodedData)
        );

        const signatureHex = Buffer.from(signature).toString('hex');
        return `${encodedData}.${signatureHex}`;
    } catch (error) {
        console.error("Error creating session token: ", error);
        throw new Error("Failed to create session token");
    }
}