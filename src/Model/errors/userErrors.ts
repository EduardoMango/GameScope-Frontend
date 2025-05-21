export class UserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserError";
  }
}

export class InactiveUserError extends UserError {
  constructor() {
    super("El usuario está inactivo");
    this.name = "InactiveUserError";
  }
}

export class BannedUserError extends UserError {
  constructor() {
    super("El usuario está baneado");
    this.name = "BannedUserError";
  }
}
