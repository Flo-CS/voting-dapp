import { isError } from "ethers/utils";
import { toast } from "react-toastify";

export function handleContractOperationError(error: unknown) {
  let message = "Unknown error";
  if (isError(error, "CALL_EXCEPTION")) {
    message = error.reason ?? "Call exception";
  } else if (isError(error, "UNSUPPORTED_OPERATION")) {
    message = "Unsupported operation " + error.operation;
  } else if (isError(error, "ACTION_REJECTED")) {
    message = "Action rejected";
  } else if (isError(error, "UNCONFIGURED_NAME")) {
    message = "Unconfigured name";
  } else if (isError(error, "NETWORK_ERROR")) {
    message = "Network error";
  } else if (isError(error, "BAD_DATA")) {
    message = "Bad data";
  } else if (isError(error, "UNKNOWN_ERROR")) {
    message = "Unknown error";
  }
  console.error(message, error);
  toast.error(message);
}
