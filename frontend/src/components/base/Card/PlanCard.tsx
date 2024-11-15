import React from "react";

export interface IPlanCard {}

const PlanCard: React.FC<IPlanCard> = () => {
  return (
    <div className="flex justify-between p-7 bg-white rounded-2xl shadow-md">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <p className="font-bold text-custom-h1 text-center text-heading">
            Essentials
          </p>
          <div className="flex items-center bg-dark-green bg-opacity-10 rounded-custom-10 px-3.5 py-2">
            <p className="font-medium text-xs text-dark-green">Active</p>
          </div>
        </div>
        <p className="font-normal text-body-light text-15 leading-custom-20">
          Elevate your subscription with access to discounted instant delivery
          and extendable validity.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <button className="w-268 h-12 bg-accent hover:bg-sky-300 rounded-custom px-6 py-3.5 duration-100">
          <p className="font-medium text-white text-15 leading-custom-20 text-center">
            Upgrade Plan
          </p>
        </button>
        <button className="w-268 h-12 bg-grey-1 hover:bg-gray-300 rounded-custom px-6 py-3.5 duration-100">
          <p className="font-medium text-heading text-15 leading-custom-20 text-center">
            Pause Subscription
          </p>
        </button>
      </div>
    </div>
  );
};

export default PlanCard;
