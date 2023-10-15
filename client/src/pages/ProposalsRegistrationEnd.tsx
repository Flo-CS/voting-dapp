import WarningMessage from "../components/WarningMessage";

export default function ProposalsRegistrationEnd() {
  return (
    <div className="flex flex-col items-center mt-12 space-y-8">
      <hr className="w-full" />
      <h3 className="text-3xl font-semibold">Proposals registration end</h3>
      <WarningMessage message="Proposals registration has ended. Wait for the owner to start the voting process." />
    </div>
  );
}
