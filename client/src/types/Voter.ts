export interface Voter {
  isRegistered: boolean;
  hasVoted: boolean;
  address: string;
  votedProposalIds: number[];
}
