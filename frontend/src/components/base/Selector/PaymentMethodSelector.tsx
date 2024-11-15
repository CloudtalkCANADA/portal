import React from "react";

import { ArrowDownIcon, PaymentCardLogo } from "../../components/icons";

export interface IPaymentMethodSelector {
  onAddCard: () => void;
}

const PaymentMethodSelector: React.FC<IPaymentMethodSelector> = ({
  onAddCard,
}) => {
  const paymentMethods = [
    {
      cardType: 0,
      masterCard: "8854",
      balance: 80700,
      isChecked: true,
    },
    {
      cardType: 1,
      masterCard: "5952",
      balance: 4230,
      isChecked: false,
    },
  ];

  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        <div className="flex items-center justify-between px-4 py-2.5 bg-grey-1 rounded-xl">
          <p className="font-medium text-15 leading-custom-20">
            Payment Method
          </p>
          <ArrowDownIcon />
        </div>
        <div className="flex flex-col gap-5 p-4">
          {paymentMethods.map((paymentMethod, index) => (
            <div className="flex flex-col gap-4">
              <div className="flex gap-2" key={index}>
                <div
                  className={`w-95 h-60 flex flex-col justify-between p-2 ${
                    paymentMethod.cardType === 0
                      ? "bg-payment-card-1-radial-gradient rounded-lg"
                      : "bg-payment-card-2-radial-gradient rounded-lg"
                  }`}
                >
                  <div className="flex justify-end">
                    <PaymentCardLogo />
                  </div>
                  <p className="font-medium text-14 leading-19 flex items-center text-white">
                    {paymentMethod.masterCard}
                  </p>
                </div>
                <div className="w-full flex justify-between">
                  <div className="flex flex-col justify-between p-2">
                    <p className="font-medium text-15 leading-custom-20 text-heading">
                      MasterCard *{paymentMethod.masterCard}
                    </p>
                    <p className="font-medium text-15 leading-custom-20 text-body-light">
                      Balance: $
                      {Intl.NumberFormat("en-US", {
                        style: "decimal",
                        minimumFractionDigits: 2,
                      }).format(paymentMethod.balance)}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-5 h-5 bg-accent border rounded-full"
                    />
                  </div>
                </div>
              </div>
              {index !== paymentMethods.length - 1 ? (
                <div className="w-full pl-24">
                  <div className="w-full border-b" />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
      <button
        className="bg-grey-1 hover:bg-gray-300 rounded-custom px-6 py-3.5 duration-150"
        onClick={onAddCard}
      >
        <p className="font-medium text-15 leading-custom-20 text-center text-heading">
          Add Card
        </p>
      </button>
    </div>
  );
};

export default PaymentMethodSelector;
