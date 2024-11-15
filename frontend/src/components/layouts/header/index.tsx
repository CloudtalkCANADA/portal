import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppStore } from "../../../lib/zustand/store";

const Header = () => {
  const { uiData, setSelectMenuItem, setUserData, userData } = useAppStore();
  const location = useLocation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const menus: Array<{ name: string; to: string }> = [
    { name: "Home", to: "/admin" },
    { name: "Users", to: "/admin/users/default" },
    { name: "Domains", to: "/admin/domains/default" },
    { name: "Extensions", to: "/admin/extensions/default" },
    // { name: "Settings", to: "/customer" },
    { name: "Settings", to: "/#" },
  ];

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    setUserData(false, false, "", "", "", "", "", 0, 0);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    let currentPath = location.pathname;
    if (currentPath[currentPath.length - 1] === "/")
      currentPath = currentPath.substring(0, currentPath.length - 1);

    const currentMenu = menus.find((menu) => menu.to === currentPath);
    if (currentMenu && currentMenu.name !== uiData.selectMenuItem) {
      setSelectMenuItem(currentMenu.name);
    }
  }, [location.pathname, menus, uiData.selectMenuItem, setSelectMenuItem]);

  // Function to get initials from first and last name
  const getInitials = (
    contact_name_given: string,
    contact_name_family: string
  ) => {
    if (!contact_name_given || !contact_name_family) return "";
    return `${contact_name_given.charAt(0)}${contact_name_family.charAt(
      0
    )}`.toUpperCase();
  };

  const initials = getInitials(
    userData.contact_name_given,
    userData.contact_name_family
  );

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          <Link to="/admin">
            <img src="/logo.png" alt="CloudTalk" className="w-48" />
          </Link>
          <div className="relative flex items-center gap-4" ref={dropdownRef}>
            <div>
              <div
                className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer"
                onClick={toggleDropdown}
              >
                <span className="font-bold text-gray-700">{initials}</span>
              </div>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </a>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-between border-b">
          <nav className="flex gap-8 mt-auto">
            {menus.map((menu, index) => (
              <Link
                className={`${
                  uiData.selectMenuItem === menu.name
                    ? "border-b-2 border-blue-500 text-blue-500 px-1 py-2"
                    : "px-1 py-2"
                }`}
                onClick={() => setSelectMenuItem(menu.name)}
                to={menu.to}
                key={index}
              >
                {menu.name}
              </Link>
            ))}
          </nav>
          <div className="w-72 relative pb-2">
            <input
              type="text"
              placeholder="Search settings, users, or help articles"
              className="border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-xs"
            />
            <div className="absolute top-0 bottom-0 right-0 grid place-items-center w-8">
              <svg
                width="16px"
                height="16px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#e62828"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
                    stroke="#666"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
