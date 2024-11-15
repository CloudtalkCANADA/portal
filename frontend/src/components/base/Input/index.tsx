import React from "react";

export interface IInput {
  label: string;
}

const Input: React.FC<IInput> = ({ label }) => {
  return (
    <div className="w-full flex flex-col gap-2">
      <label className="font-medium text-15 leading-custom-20 text-heading">
        {label}
      </label>
      <input className="font-normal text-base leading-custom-20 text-body-dark border rounded-custom focus:outline-none px-4 py-2.5" />
    </div>
  );
};

export default Input;
