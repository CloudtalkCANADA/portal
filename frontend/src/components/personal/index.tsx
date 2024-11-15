import React from "react";

const Personal: React.FC = () => {
  return (
    <div className="bg-white border rounded-lg shadow-sm w-[360px] p-4">
      <h2 className="text-sm text-gray-500 mb-1">Company name</h2>
      <h3 className="text-2xl font-bold mb-1">Personal</h3>
      <a
        href="/edit-company-info"
        className="text-blue-500 hover:underline text-sm mb-4 inline-block"
      >
        Edit company info
      </a>
      <div className="mb-4">
        <div className="text-sm text-gray-700 flex gap-2">
          <p className="font-medium">Main number: </p>(334) 659-1990
        </div>
        <div className="text-sm text-gray-700 flex gap-2">
          <p className="font-medium">Caller ID name: </p>PERSONAL
        </div>
        <div className="text-sm text-gray-700 flex gap-2">
          <p className="font-medium">Address: </p>405 Erindale Drive, B...
        </div>
      </div>
      <div className="border-t pt-4">
        <div className="text-sm text-blue-500 hover:underline mb-2 flex items-center">
          <i className="fas fa-clock mr-2"></i>
          <a href="/company-business-hours">Company’s business hours</a>
        </div>
        <div className="text-sm text-blue-500 hover:underline flex items-center">
          <i className="fas fa-phone-alt mr-2"></i>
          <a href="/company-call-handling">Company call handling</a>
        </div>
      </div>
    </div>
  );
};

export default Personal;
