export const apiResponse = {
  success: (data = {}, message = "Success") => ({
    status: "success",
    message,
    data,
  }),

  error: (message = "Something went wrong") => ({
    status: "error",
    message,
  }),

  validationError: (message = "Validation error", errors = []) => ({
    status: "fail",
    message,
    errors,
  }),

  unauthorized: (message = "Unauthorized") => ({
    status: "fail",
    message,
  }),
};
