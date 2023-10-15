type InputProps = {
  RightEl?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;

function Input({ RightEl, ...props }: InputProps) {
  return (
    <>
      <div className="flex border-2 border-blue-200 border-solid rounded-lg focus-within:border-blue-500">
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
      className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-r-md hover:bg-blue-600"
      {...props}
    >
      {Icon}
    </button>
  );
}

Input.RightIconButton = RightIconButton;

export default Input;
