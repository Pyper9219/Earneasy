export class AppError extends Error { statusCode: number; constructor(message: string, statusCode: number = 500) { super(message); this.statusCode = statusCode; this.name = 'AppError'; } }
export function handleError(error: any) { console.error('App Error:', error); return { message: error.message || 'Internal server error', statusCode: error.statusCode || 500 }; }
export function toErrorResponse(error: any) {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';
  return new Response(JSON.stringify({ error: message }), { status: statusCode });
}