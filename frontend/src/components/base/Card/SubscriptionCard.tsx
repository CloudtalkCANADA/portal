import React from "react";

import { GreenCheckIcon } from "../icons";

interface FeatureItem {
  name: string;
  isCommingSoon: boolean;
}

export interface ISubscriptionCard {
  plan: string;
  description: string;
  cost?: number;
  features: Array<FeatureItem>;
  viewType: string;
  onSelect?: () => void;
  isCurrentPlan?: true;
  isBestValue?: true;
}

const SubscriptionCard: React.FC<ISubscriptionCard> = ({
  plan,
  description,
  cost,
  features,
  viewType,
  onSelect,
  isCurrentPlan,
  isBestValue,
}) => {
  return (
    <div>
      {isBestValue ? (
        <div className="bg-accent text-white text-center rounded-t-2xl px-4 py-2.5">
          <p className="font-semibold text-base leading-5">Best Value</p>
        </div>
      ) : null}
      <div
        className={`w-full flex ${
          viewType === "Menu" ? "flex-col h-555" : "flex-row"
        } justify-between gap-2.5 bg-white shadow-md p-6 ${
          isBestValue ? "border-accent border rounded-b-2xl" : "rounded-2xl"
        }`}
      >
        <div
          className={`flex ${
            viewType === "Menu" ? "flex-col" : "flex-row"
          } gap-6`}
        >
          <div
            className={`flex flex-col gap-2 ${
              viewType === "Menu" ? "max-w-none" : "max-w-245"
            }`}
          >
            <p className="text-custom-h1 font-bold leading-[49px] text-heading">
              {plan}
            </p>
            <p className="text-body-light text-15 font-normal leading-5">
              {description}{" "}
              {cost === undefined ? (
                <span className="font-medium text-15 leading-5 text-heading">
                  Not for consumer use.
                </span>
              ) : null}
            </p>
          </div>
          {cost !== undefined && viewType === "Menu" ? (
            <div className="flex gap-1 items-center">
              <p className="text-custom-h1 font-bold leading-[49px] text-heading">
                ${cost}
              </p>
              <p className="text-body-light text-15 font-normal leading-5">
                / monthly
              </p>
            </div>
          ) : null}
          <div
            className={`${
              viewType === "Menu" ? "w-full border-b" : "h-full border-l"
            } border-divider`}
          />
          {viewType === "Menu" ? (
            <div className="flex flex-col gap-4">
              {features.map((feature, index) => (
                <div className="flex gap-4 items-center" key={index}>
                  <GreenCheckIcon />
                  <p className="text-body-dark text-15 font-normal leading-5">
                    {feature.name}{" "}
                    {feature.isCommingSoon ? (
                      <span className="text-15 leading-5 text-body-light">
                        (Coming Soon)
                      </span>
                    ) : null}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-4">
                {features
                  .slice(
                    0,
                    (features.length / 2) % 2
                      ? Math.floor(features.length / 2) + 1
                      : features.length / 2
                  )
                  .map((feature, index) => (
                    <div className="flex gap-4 items-center" key={index}>
                      <GreenCheckIcon />
                      <p className="text-body-dark text-15 font-normal leading-5">
                        {feature.name}{" "}
                        {feature.isCommingSoon ? (
                          <span className="text-15 leading-5 text-body-light">
                            (Coming Soon)
                          </span>
                        ) : null}
                      </p>
                    </div>
                  ))}
              </div>
              <div className="flex flex-col gap-4">
                {features
                  .slice(
                    (features.length / 2) % 2
                      ? Math.floor(features.length / 2) + 1
                      : features.length / 2,
                    features.length
                  )
                  .map((feature, index) => (
                    <div className="flex gap-4 items-center" key={index}>
                      <GreenCheckIcon />
                      <p className="text-body-dark text-15 font-normal leading-5">
                        {feature.name}{" "}
                        {feature.isCommingSoon ? (
                          <span className="text-15 leading-5 text-body-light">
                            (Coming Soon)
                          </span>
                        ) : null}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
        <div
          className={`flex flex-col ${
            viewType === "Menu" ? "w-auto" : "w-245"
          }`}
        >
          {cost !== undefined && viewType === "List" ? (
            <div className="flex gap-1 items-center justify-center">
              <p className="text-custom-h1 font-bold leading-[49px] text-heading">
                ${cost}
              </p>
              <p className="text-body-light text-15 font-normal leading-5">
                / monthly
              </p>
            </div>
          ) : null}
          <button
            className="flex items-center justify-center mt-4 text-heading hover:text-white disabled:text-body-light bg-grey-1 hover:bg-accent disabled:bg-divider shadow-none hover:shadow-md px-6 py-3.5 rounded-xl duration-150"
            onClick={onSelect}
            disabled={isCurrentPlan}
          >
            <p className="font-medium text-15 leading-5 text-center">
              {cost !== undefined
                ? isCurrentPlan
                  ? "Your plan"
                  : "Select"
                : "Contact us"}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCard;
