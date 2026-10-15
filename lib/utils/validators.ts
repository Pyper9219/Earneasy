export function isValidEmail(email: string): boolean { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
export function isValidPhone(phone: string): boolean { return /^254[0-9]{9}$/.test(phone); }
export function sanitizeInput(input: string): string { return input.replace(/[<>]/g, '').trim(); }
