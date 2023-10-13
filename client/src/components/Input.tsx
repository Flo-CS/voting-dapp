type InputProps = {
  RightEl?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;

function Input({ RightEl, ...props }: InputProps) {
  return (
    <>
      <div className="border-blue-200 border-solid border-2 rounded-lg focus-within:border-blue-500 flex">
        <input
          className="w-full focus:outline-none my-2 mx-3"
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
      className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-r-md  hover:bg-blue-600"
      {...props}
    >
      {Icon}
    </button>
  );
}

Input.RightIconButton = RightIconButton;

export default Input;
