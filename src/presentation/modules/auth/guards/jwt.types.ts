/**
 * JWT Token payload structure
 */
export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

/**
 * Current authenticated user payload from JWT
 */
export interface CurrentUserPayload {
  id: string;
  email: string;
  role: string;
}
