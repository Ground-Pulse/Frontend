/**
 * One error shape for every API failure (API spec section 8).
 * The NestJS exception filter returns { code, message, statusCode } and the
 * client turns it into a GroundPulseError so UI code can switch on `code`.
 */
export type GroundPulseErrorCode =
  | "PROPERTY_NOT_FOUND"
  | "PROPERTY_ADDRESS_REQUIRED"
  | "FORBIDDEN_NOT_OWNER"
  | "INSPECTION_NOT_FOUND"
  | "PAST_DATE_NOT_ALLOWED"
  | "CHECKLIST_INCOMPLETE"
  | "INSPECTION_ALREADY_SUBMITTED"
  | "ISSUE_NOT_FOUND"
  | "ISSUE_MEDIA_REQUIRED"
  | "ISSUE_ALREADY_DECIDED"
  | "PROVIDER_NOT_VERIFIED"
  | "INSPECTOR_NOT_VERIFIED"
  | "REPAIR_NOT_FOUND"
  | "REPAIR_INVALID_TRANSITION"
  | "COMPLETION_NOTE_REQUIRED"
  | "INVALID_CREDENTIALS"
  | "EMAIL_TAKEN"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "NETWORK_ERROR"
  | "UNKNOWN";

export class GroundPulseError extends Error {
  constructor(
    public code: GroundPulseErrorCode,
    message: string,
    public statusCode: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = "GroundPulseError";
  }
}

export function errorMessage(err: unknown, fallback = "Something went wrong."): string {
  if (err instanceof GroundPulseError) return err.message;
  if (err instanceof Error) return err.message;
  return fallback;
}
