export default function Header({ children }: { children: React.ReactNode }) {
  return (
    <header className="flex justify-between py-4 px-8">
      <h1 className="text-2xl font-bold">Voting Dapp</h1>
      <div>{children}</div>
    </header>
  );
}
