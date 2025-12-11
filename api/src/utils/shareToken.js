import crypto from "crypto";

const KEY = Buffer.from(process.env.SHARE_KEY, "hex"); 

export function encryptUserId(userId) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", KEY, iv);
    
    const payload = JSON.stringify({ uid: userId });

    let encrypted = cipher.update(payload, "utf8", "base64");
    encrypted += cipher.final("base64");

    const tag = cipher.getAuthTag().toString("base64");

    return Buffer.from(
        JSON.stringify({
            iv: iv.toString("base64"),
            data: encrypted,
            tag
        })
    ).toString("base64url");
}

export function decryptToken(token) {
    const decoded = JSON.parse(Buffer.from(token, "base64url").toString("utf8"));

    const iv = Buffer.from(decoded.iv, "base64");
    const tag = Buffer.from(decoded.tag, "base64");

    const decipher = crypto.createDecipheriv("aes-256-gcm", KEY, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(decoded.data, "base64", "utf8");
    decrypted += decipher.final("utf8");

    const payload = JSON.parse(decrypted);
    return payload.uid;
}