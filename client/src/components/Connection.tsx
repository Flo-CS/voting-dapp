import classnames from "classnames";
import { MdLogin, MdPerson } from "react-icons/md";

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
        " font-semibold py-2 px-2 lg:py-2 lg:px-4 lg:rounded text-sm lg:text w-10 h-10 rounded-full lg:w-auto lg:h-auto flex items-center justify-center relative group ",
        {
          "hover:bg-gray-700 bg-gray-0 text-gray-700 hover:text-white border-gray-700 border":
            !isConnected,
        },
        {
          "border border-gray-500 text-black cursor-pointer lg:cursor-default":
            isConnected,
        }
      )}
      {...props}
    >
      <span className="hidden lg:inline-block absolute lg:relative bottom-0 right-0 -translate-x-2/4 lg:translate-x-0 group-hover:block group-focus:block group-active:block">
        {textToDisplay}
      </span>
      {isConnected ? (
        <MdPerson className="block lg:hidden w-full h-full" />
      ) : (
        <MdLogin className="block lg:hidden w-full h-full" />
      )}
    </button>
  );
}
