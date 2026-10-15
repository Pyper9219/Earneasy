export class AppError extends Error {
  status: number;
  code: string;
  constructor(message: string, status = 400, code = "APP_ERROR") {
    super(message);
    this.status = status;
    this.code = code;
    this.name = "AppError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403, "FORBIDDEN");
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super(message, 404, "NOT_FOUND");
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed") {
    super(message, 422, "VALIDATION_ERROR");
  }
}

export function toErrorResponse(err: unknown) {
  if (err instanceof AppError) {
    return Response.json(
      { error: err.message, code: err.code },
      { status: err.status }
    );
  }
  console.error("[Unhandled Error]", err);
  return Response.json(
    { error: "Internal server error", code: "INTERNAL" },
    { status: 500 }
  );
}