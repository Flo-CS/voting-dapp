export default function Header({ children }: { children: React.ReactNode }) {
  return (
    <header className="flex">
      <h1 className="text-4xl font-bold">Voting Dapp</h1>
      <div>{children}</div>
    </header>
  );
}
