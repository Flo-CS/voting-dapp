type ProposalsContainerProps = {
  children: React.ReactNode;
};

export default function ProposalsContainer({
  children,
}: ProposalsContainerProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-5">
      {children}
    </div>
  );
}
