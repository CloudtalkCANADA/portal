import React from "react";

export interface IToggle {
  status: boolean;
  onChange: (status: boolean) => Promise<void>;
}

const Toggle: React.FC<IToggle> = ({ status, onChange }) => {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={!!status}
        onChange={async (e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <div className="relative w-11 h-6 bg-red-500 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
      <span className="ms-3 text-sm font-medium text-gray-900">
        {status ? "Enabled" : "Disabled"}
      </span>
    </label>
  );
};

export default Toggle;
