import crypto from 'crypto';

export async function deleteFromCloudinary(url: string) {
    if (!url || !url.includes('cloudinary.com')) return;
    
    // Extract everything between /upload/ (and optional /v.../) and the file extension
    const matches = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
    const publicId = matches ? matches[1] : null;
    if (!publicId) return;

    const timestamp = Math.floor(Date.now() / 1000).toString();
    
    // Using .env securely
    const apiKey = process.env.CLOUDINARY_API_KEY!;
    const apiSecret = process.env.CLOUDINARY_API_SECRET!;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;

    // Required by Cloudinary: string to sign must be alphabetically sorted params with secret appended
    const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

    const formData = new URLSearchParams();
    formData.append("public_id", publicId);
    formData.append("timestamp", timestamp);
    formData.append("api_key", apiKey);
    formData.append("signature", signature);

    try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
            method: "POST",
            body: formData,
        });
        const data = await res.json();
        console.log(`Cloudinary destroy ${publicId}:`, data);
    } catch (e) {
        console.error("Cloudinary connection error during destroy:", e);
    }
}
