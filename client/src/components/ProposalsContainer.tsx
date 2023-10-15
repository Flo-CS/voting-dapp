type ProposalsContainerProps = {
  children: React.ReactNode;
};

export default function ProposalsContainer({
  children,
}: ProposalsContainerProps) {
  return <div className="flex flex-wrap items-start gap-4">{children}</div>;
}
