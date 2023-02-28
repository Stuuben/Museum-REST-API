exports.catchErrors = (fn) => {
  return function (req, res, next) {
    return fn(req, res, next).catch(next);
  };
};

class CustomAPIError extends Error {
  constructor(message) {
    super(message);
  }
}

class notFoundError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = 404;
    this.name = "NotFound";
  }
}

class BadRequestError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    this.name = "BadRequest";
  }
}
class ValidationError extends BadRequestError {
  constructor(message, validationErrors) {
    super(message);
    this.validationErrors = validationErrors;
  }
}

class UnauthenticatedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = 401;
    this.name = "UnauthenticatedError";
  }
}

class UnauthorizedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = 403;
    this.name = "UnauthorizedError";
  }
}

module.exports = {
  CustomAPIError,
  notFoundError,
  BadRequestError,
  ValidationError,
  UnauthorizedError,
  UnauthenticatedError,
};
