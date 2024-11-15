import React, { Dispatch, SetStateAction } from "react";

export interface CollapseItem {
  label: string;
  content: string;
}

export interface ICollapse {
  items: Array<CollapseItem>;
  active: number;
  setActive: Dispatch<SetStateAction<number>>;
}

const Collapse: React.FC<ICollapse> = ({ items, active, setActive }) => {
  const toggleItem = (index: number) => {
    setActive(active === index ? -1 : index);
  };

  return (
    <div className="flex flex-col gap-4">
      {items.map((item, index) => (
        <div
          className="flex flex-col gap-2 p-4 bg-white rounded-2xl shadow-md"
          key={index}
        >
          <button
            className="flex gap-4 items-center justify-between w-full"
            onClick={() => toggleItem(index)}
            type="button"
          >
            <p className="font-semibold text-lg leading-6 text-heading">
              {item.label}
            </p>
            {/* {active === index ? <MinusCircleIcon /> : <PlusCircleIcon />} */}
          </button>
          <div
            className={`transition-height duration-500 ease-in-out overflow-hidden ${
              active === index ? "max-h-96" : "max-h-0"
            }`}
          >
            <p className="text-gray-700">{item.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Collapse;
