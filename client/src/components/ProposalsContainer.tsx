type ProposalsContainerProps = {
  children: React.ReactNode;
};

export default function ProposalsContainer({
  children,
}: ProposalsContainerProps) {
  return (
    <div className="grid grid-cols-1 gap-6 gap-x-12 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
      {children}
    </div>
  );
}
