import crypto from 'crypto';

export async function deleteFromCloudinary(url: string) {
    if (!url || !url.includes('cloudinary.com')) return;
    
    const matches = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
    const publicId = matches ? matches[1] : null;
    if (!publicId) return;

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const apiKey = process.env.CLOUDINARY_API_KEY!;
    const apiSecret = process.env.CLOUDINARY_API_SECRET!;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;

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
        await res.json();
    } catch (e) {
        console.error("Cloudinary destroy error:", e);
    }
}

export async function uploadToCloudinary(file: string, folder: string = "kindlink") {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", folder);

    try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: formData,
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error?.message || "Upload failed");
        }

        const data = await res.json();
        return data.secure_url;
    } catch (e) {
        console.error("Cloudinary upload error:", e);
        throw e;
    }
}
