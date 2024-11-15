import React, { ReactNode, useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";

export interface SidebarMenuItemProps {
  icon: ReactNode;
  label: string;
  subSidebarMenus?: Array<string>;
}

export interface SidebarProps {
  sidebarMenus: Array<SidebarMenuItemProps>;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarMenus }) => {
  const [openMenus, setOpenMenus] = useState<{ [key: number]: boolean }>({});

  const toggleMenu = (index: number) => {
    setOpenMenus((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  return (
    <div className="w-60 bg-white border rounded-md shadow-lg mb-auto flex-shrink-0">
      {sidebarMenus.map((sidebarMenu: SidebarMenuItemProps, index: number) => (
        <div key={index} className="border-b last:border-b-0">
          <button
            className="w-full flex items-center justify-between p-4 cursor-pointer focus:outline-none hover:bg-gray-100"
            onClick={() => toggleMenu(index)}
          >
            <div className="flex items-center gap-2">
              {sidebarMenu.icon}
              <p className="text-sm font-medium text-gray-700">
                {sidebarMenu.label}
              </p>
            </div>
            {sidebarMenu.subSidebarMenus?.length ? (
              openMenus[index] ? (
                <FaAngleUp className="text-gray-500" />
              ) : (
                <FaAngleDown className="text-gray-500" />
              )
            ) : null}
          </button>
          {sidebarMenu.subSidebarMenus?.length && openMenus[index] ? (
            <div className="flex flex-col gap-2 pl-10 pr-4 py-2 bg-gray-50">
              {sidebarMenu.subSidebarMenus.map((subSidebarMenu, index2) => (
                <p
                  className="text-sm text-gray-600 hover:text-gray-800"
                  key={index2}
                >
                  {subSidebarMenu}
                </p>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
