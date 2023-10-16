import classNames from "classnames";
import ButtonSpinner from "./ButtonSpinner";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
  variant?: "secondary" | "primary";
};

export default function Button({
  isLoading,
  variant = "secondary",
  ...props
}: ButtonProps) {
  if (isLoading) {
    props.disabled = true;
  }

  return (
    <button
      {...props}
      className={classNames(
        "flex items-center justify-center py-2 px-4 rounded font-semibold  disabled:cursor-not-allowed space-x-2 transition duration-200",
        {
          "bg-blue-500  text-white hover:bg-blue-600 ": variant === "primary",
        },
        {
          "border-gray-700 border text-gray-700 bg-gray-0 hover:bg-gray-100 ":
            variant === "secondary",
        }
      )}
    >
      {isLoading && <ButtonSpinner className={classNames("text-gray-700")} />}
      {props.children}
    </button>
  );
}
