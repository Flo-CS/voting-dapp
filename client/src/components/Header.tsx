export default function Header({ children }: { children: React.ReactNode }) {
  return (
    <header className=" px-4 py-4 lg:px-8">
      <div className="w-full max-w-6xl flex justify-between mx-auto">
        <h1 className="text-xl font-bold lg:text-2xl">Voting Dapp</h1>
        <div>{children}</div>
      </div>
    </header>
  );
}
