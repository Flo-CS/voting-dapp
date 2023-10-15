import { isError } from "ethers/utils";
import { toast } from "react-toastify";

export function handleContractOperationError(error: unknown) {
  let message = "";
  if (isError(error, "CALL_EXCEPTION")) {
    message = error.reason ?? "Call exception";
  } else if (isError(error, "UNSUPPORTED_OPERATION")) {
    message = error.operation ?? "Unsupported operation";
  } else if (isError(error, "ACTION_REJECTED")) {
    message = "Action rejected";
  } else if (isError(error, "UNKNOWN_ERROR")) {
    message = "Unknown error";
  }
  console.error(message, error);
  toast.error(message);
}
