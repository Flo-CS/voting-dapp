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
          "bg-green-500  text-white hover:bg-green-600 disabled:bg-green-400 border-green-500 border":
            variant === "primary",
        },
        {
          "border-gray-700 border text-gray-700 bg-gray-0 hover:bg-gray-100 disabled:bg-gray-100 disabled:border-gray-400":
            variant === "secondary",
        }
      )}
    >
      {isLoading && (
        <ButtonSpinner
          color={classNames({
            white: variant === "primary",
            "gray-700": variant === "secondary",
          })}
        />
      )}
      {props.children}
    </button>
  );
}
