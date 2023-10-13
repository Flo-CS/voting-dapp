import classnames from "classnames";

export default function Connection({
  text,
  connectionText,
  isConnected,
  onConnect,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  text?: string;
  connectionText?: string;
  isConnected?: boolean;
  onConnect?: () => Promise<void>;
}) {
  function handleClick() {
    if (!isConnected) {
      onConnect?.();
    }
  }

  const textToDisplay = isConnected ? connectionText : text;

  return (
    <button
      onClick={handleClick}
      className={classnames(
        "bg-blue-500 text-white font-semibold py-2 px-4 rounded",
        { "hover:bg-blue-700": !isConnected }
      )}
      {...props}
    >
      {textToDisplay}
    </button>
  );
}
