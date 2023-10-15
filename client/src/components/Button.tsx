import classnames from "classnames";
import ButtonSpinner from "./ButtonSpinner";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
};

export default function Button({ isLoading, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={classnames(
        "bg-blue-500 text-white py-2 px-4 rounded font-semibold hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed space-x-2"
      )}
    >
      {isLoading && <ButtonSpinner />}
      {props.children}
    </button>
  );
}
