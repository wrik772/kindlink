import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'fallback_key_that_should_not_be_used_ever'; // Must be 32 bytes (64 hex characters)

export function encrypt(text: string): string {
    // We generate a random Initialization Vector per message for high security
    const iv = crypto.randomBytes(16); 
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    
    // We store the IV + the encrypted hash separated by a colon so we can decode it later
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text: string): string {
    if (!text || !text.includes(':')) {
        // Fallback for old unencrypted plain-text messages or corrupted data
        return text; 
    }

    try {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift() as string, 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        
        const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        
        return decrypted.toString();
    } catch(err) {
        // If decryption fails, it's either an old message that happened to contain a colon
        // or a genuinely corrupted hash.
        return "[Encrypted/Unreadable Content]";
    }
}
