import { Proposal } from "../types/Proposal";

type VotersProps = {
  voters: {
    address: string;
    vote?: Proposal;
  }[];
};

export default function Voters({ voters }: VotersProps) {
  return (
    <>
      <h3 className="text-2xl font-medium">Voters</h3>
      <ul>
        {voters.map((voter) => (
          <li key={voter.address}>
            <span className="font-semibold">{voter.address}</span>
            {voter.vote && (
              <span>
                {" "}
                has voted for{" "}
                <span className="font-semibold">{voter.vote.description}</span>
              </span>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
