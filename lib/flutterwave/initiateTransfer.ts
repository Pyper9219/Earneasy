export async function initiateFlutterwaveTransfer(payload: any) {
  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
  const response = await fetch('https://api.flutterwave.com/v3/transfers', {
    method: 'POST',
    headers: { Authorization: `Bearer ${secretKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return await response.json();
}
