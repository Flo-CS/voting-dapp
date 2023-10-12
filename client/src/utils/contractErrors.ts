import { isError } from "ethers/utils";

export function handleContractOperationError(error: unknown) {
  if (isError(error, "CALL_EXCEPTION")) {
    console.error(`Call exception: ${error.reason}`);
  } else if (isError(error, "UNSUPPORTED_OPERATION")) {
    console.error(`Unsupported operation: ${error.operation}`);
  } else {
    console.error(error);
  }
}
