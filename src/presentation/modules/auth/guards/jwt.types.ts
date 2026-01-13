export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export interface CurrentUserPayload {
  id: string;
  email: string;
  role: string;
}
