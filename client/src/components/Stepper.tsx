import classNames from "classnames";

type StepperProps = {
  children: React.ReactNode[];
};

function Stepper({ children }: StepperProps) {
  return (
    <div className="flex flex-col items-center w-full mb-6 lg:mb-20 lg:flex-row">
      {children}
    </div>
  );
}

type ItemProps = {
  completed: boolean;
  children: React.ReactNode;
  index: number;
  isFirst?: boolean;
};

function Item({ completed, children, index, isFirst }: ItemProps) {
  return (
    <>
      {!isFirst && (
        <div
          className={classNames(
            "flex-auto border-l-2 lg:border-t-2 h-4 lg:h-0 mr-32 lg:mr-0",
            {
              "border-green-300": completed,
              "border-gray-300": !completed,
            }
          )}
        ></div>
      )}
      <div className="relative flex items-center mr-32 lg:mr-0">
        <div
          className={classNames(
            "flex items-center justify-center w-10 h-10 py-3 font-semibold text-white rounded-full ",
            {
              "bg-green-500": completed,
              "bg-black": !completed,
            }
          )}
        >
          {index}
        </div>
        <div className="absolute left-0 w-48 ml-12 font-medium text-black lg:text-center lg:top-0 lg:w-32 lg:mt-12 lg:-ml-10 text">
          {children}
        </div>
      </div>
    </>
  );
}

Stepper.Item = Item;

export default Stepper;
