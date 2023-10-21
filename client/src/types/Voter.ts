export interface Voter {
  isRegistered: boolean;
  hasVoted: boolean;
  votedProposalId: number;
  address: string;
}
