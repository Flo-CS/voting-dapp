import classNames from "classnames";

type StepperProps = {
  children: React.ReactNode[];
};

function Stepper({ children }: StepperProps) {
  return <ul className="flex flex-col">{children}</ul>;
}

type ItemProps = {
  completed: boolean;
  children: React.ReactNode;
  index: number;
  isLast?: boolean;
};

function Item({ completed, children, index, isLast }: ItemProps) {
  return (
    <li
      className={classNames("", {
        "text-blue-500": completed,
        "text-black": !completed,
      })}
    >
      <div className="flex ">
        <div className="flex flex-col items-center">
          <div
            className={classNames(
              "h-7 w-7 rounded-full text-white flex items-center justify-center font-semibold",
              {
                "bg-blue-500": completed,
                "bg-black": !completed,
              }
            )}
          >
            {index}
          </div>
          {!isLast && (
            <span className="inline-block h-5 w-0.5 bg-slate-200"></span>
          )}
        </div>
        <span className="text ml-3 mt-0.5">{children}</span>
      </div>
    </li>
  );
}

Stepper.Item = Item;

export default Stepper;
