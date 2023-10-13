import classNames from "classnames";

type StepperProps = {
  children: React.ReactNode[];
};

function Stepper({ children }: StepperProps) {
  return <ul className="flex items-center space-x-2">{children}</ul>;
}

type ItemProps = {
  completed: boolean;
  children: React.ReactNode;
  isLast?: boolean;
};

function Item({ completed, children, isLast }: ItemProps) {
  return (
    <li
      className={classNames(
        "w-48 flex items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:inline-block after:mx-2",
        {
          "after:w-0 after:hidden": isLast,
          "text-blue-500": completed,
          "text-black": !completed,
        }
      )}
    >
      <div className="flex flex-col items-center">
        <div
          className={classNames("h-5 w-5 rounded-full", {
            "bg-blue-500": completed,
            "bg-black": !completed,
          })}
        />
        <span className="text text-center mt-3">{children}</span>
      </div>
    </li>
  );
}

Stepper.Item = Item;

export default Stepper;
