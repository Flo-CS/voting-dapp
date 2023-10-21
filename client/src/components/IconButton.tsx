import ButtonSpinner from "./ButtonSpinner";
import { IconType } from "react-icons";
import classNames from "classnames";

type IconButtonProps = {
  Icon: IconType;
  isLoading?: boolean;
  variant?: "secondary" | "primary";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function IconButton({
  Icon,
  isLoading,
  variant = "secondary",
  ...props
}: IconButtonProps) {
  return (
    <button
      className={classNames(
        "flex items-center justify-center p-0.5 rounded font-semibold  disabled:cursor-not-allowed space-x-2 transition duration-200",
        {
          "bg-green-500  text-white hover:bg-green-600 ": variant === "primary",
        },
        {
          "border-gray-700 border text-gray-700 bg-gray-0 hover:bg-gray-100 ":
            variant === "secondary",
        }
      )}
      {...props}
    >
      {isLoading && (
        <ButtonSpinner
          color={classNames({
            white: variant === "primary",
            "gray-700": variant === "secondary",
          })}
        />
      )}
      {!isLoading && <Icon className="w-6 h-6" />}
    </button>
  );
}
