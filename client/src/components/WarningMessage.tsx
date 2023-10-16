type WarningMessageProps = { message: string };

export default function WarningMessage({ message }: WarningMessageProps) {
  return <p className="text-lg  text-orange-600">{message}</p>;
}
