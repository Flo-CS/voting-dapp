export default function Header({ children }: { children: React.ReactNode }) {
  return (
    <header className="flex justify-between px-8 py-4">
      <h1 className="text-xl font-bold lg:text-2xl">Voting Dapp</h1>
      <div>{children}</div>
    </header>
  );
}
