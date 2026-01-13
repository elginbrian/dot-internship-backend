export class DomainException extends Error {
  constructor(
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'DomainException';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class UserAlreadyExistsException extends DomainException {
  constructor(email: string) {
    super(`User with email ${email} already exists`, 'USER_ALREADY_EXISTS');
  }
}

export class UserNotFoundException extends DomainException {
  constructor(identifier: string) {
    super(`User ${identifier} not found`, 'USER_NOT_FOUND');
  }
}

export class InvalidCredentialsException extends DomainException {
  constructor() {
    super('Invalid credentials', 'INVALID_CREDENTIALS');
  }
}

export class LaporanNotFoundException extends DomainException {
  constructor(id: string) {
    super(`Laporan ${id} not found`, 'LAPORAN_NOT_FOUND');
  }
}

export class UnauthorizedAccessException extends DomainException {
  constructor() {
    super('Unauthorized access to resource', 'UNAUTHORIZED_ACCESS');
  }
}
