import { StatusCodes } from "../model/IStatusCodes";


interface IApplicationError {
  Text: string;
  Code: string;
}

export class BaseApplicationError {
  /**
   * Internal server error
   */
  static InternalServerError: IApplicationError = {
    Text: "Internal server error",
    Code: `${StatusCodes.InternalServerError}`,
  };

  /**
   * The error message for ~ Method not allowed
   */
  static MethodNotAllowed: IApplicationError = {
    Text: "Method Not Allowed",
    Code: `${StatusCodes.MethodNotAllowed}`,
  };

  /**
   * The error message for ~ Missing Required Parameters
   */
  static MissingRequiredParameters: IApplicationError = {
    Text: "Missing Required Parameters",
    Code: `${StatusCodes.BadRequest}`,
  };

  /**
   * The error message for ~ Not Authorized
   */
  static Unauthorized: IApplicationError = {
    Text: "Not Authorized",
    Code: `${StatusCodes.Unauthorized}`,
  };
}

/**
 * The ApplicationError class
 */
export class ApplicationError extends BaseApplicationError {
  //#region User Errors

  /**
   * The error message for ~ User with specified User ID not found
   */
  static UserWithIdNotFound: IApplicationError = {
    Text: "User with specified User ID not found",
    Code: "USER_1000",
  };

  //#endregion
}
