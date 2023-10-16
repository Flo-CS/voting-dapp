import { ContractTransactionReceipt, EventLog } from "ethers";

export function getEventsArgs(receipt?: ContractTransactionReceipt | null) {
  return receipt?.logs.flatMap((log) => {
    return (log as EventLog).args;
  });
}
