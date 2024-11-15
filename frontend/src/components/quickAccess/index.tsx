import React from "react";
import CustomerIcon from "../icons/customer";
import ExtensionIcon from "../icons/extension";
import SettingIcon from "../icons/setting";
import UserIcon from "../icons/user";

const QuickAccess: React.FC = () => {
  const sections = [
    {
      title: "Customers",
      icon: <CustomerIcon />,
      links: [
        { text: "Create Customer", href: "#" },
        { text: "Manage Customers", href: "#" },
        { text: "Wizard for Extensions", href: "#" },
      ],
    },
    {
      title: "Extensions",
      icon: <ExtensionIcon />,
      links: [
        { text: "Create Extension", href: "#" },
        { text: "Manage Extension", href: "#" },
      ],
    },
    {
      title: "Users",
      icon: <UserIcon />,
      links: [
        { text: "Create User", href: "#" },
        { text: "Manage Users", href: "#" },
      ],
    },
    {
      title: "Settings",
      icon: <SettingIcon />,
      links: [
        { text: "Change PBX Address", href: "#" },
        { text: "Manage API KEY", href: "#" },
        { text: "Edit Email", href: "#" },
      ],
    },
  ];

  return (
    <div className="bg-white border rounded-lg shadow-sm w-full">
      <h2 className="text-lg font-bold mb-4 border-b p-6 bg-gray-50">
        Quick Access
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 pl-10 pb-6">
        {sections.map((section) => (
          <div key={section.title} className="p-4">
            <h3 className="text-lg font-semibold flex items-center">
              <span className="mr-2">{section.icon}</span> {section.title}
            </h3>
            <ul className="mt-4 space-y-2">
              {section.links.map((link) => (
                <li key={link.text}>
                  <a
                    href={link.href}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickAccess;
