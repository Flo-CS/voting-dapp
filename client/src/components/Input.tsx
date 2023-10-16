type InputProps = {
  RightEl?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;

function Input({ RightEl, ...props }: InputProps) {
  return (
    <>
      <div className="flex border border-gray-300 border-solid rounded focus-within:border-gray-500">
        <input
          className="w-full mx-3 my-2 focus:outline-none"
          {...props}
        ></input>
        {RightEl}
      </div>
    </>
  );
}

type RightIconButtonProps = {
  Icon: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function RightIconButton({ Icon, ...props }: RightIconButtonProps) {
  return (
    <button
      className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-r-sm hover:bg-blue-600 transition duration-200 border-blue-500 border"
      {...props}
    >
      {Icon}
    </button>
  );
}

Input.RightIconButton = RightIconButton;

export default Input;
