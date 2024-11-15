import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import Sidebar, {
  SidebarMenuItemProps,
} from "../../../components/advanced/layouts/Sidebar";
import Modal from "../../../components/base/Modal";
import Table from "../../../components/base/Table";
import Toggle from "../../../components/base/Toggle";

import Footer from "../../../components/layouts/footer";
import Header from "../../../components/layouts/header";

import { useAppStore } from "../../../lib/zustand/store";

import { AiOutlineSearch } from "react-icons/ai";
import { BsPlusLg } from "react-icons/bs";
import { FaHatWizard, FaUserGroup } from "react-icons/fa6";

interface TableItemProps {
  status: boolean;
  username: string;
  fullName: string;
  role: string;
  domain: string;
  api: string;
}

interface InputRowProps {
  status?: boolean;
  username: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email?: string;
  password?: string;
  confirm_password?: string;
  role: string;
  domain: string;
  api?: string;
}

const CustomersDashboard = () => {
  const { userData } = useAppStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roles, setRoles] = useState<Array<{ name: string; id: string }>>([]);
  const [domains, setDomains] = useState<Array<{ name: string; id: string }>>([]);
  // const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [inputRows, setInputRows] = useState<Array<InputRowProps>>([
    {
      status: true,
      username: "",
      firstName: "",
      lastName: "",
      fullName: "",
      email: "",
      password: "",
      confirm_password: "",
      role: "",
      domain: "",
    },
  ]);
  const [editUser, setEditUser] = useState<InputRowProps | null>(null);
  const [viewUser, setViewUser] = useState<InputRowProps | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [userStatus, setUserStatus] = useState<boolean>(true);

  const sidebarMenus: Array<SidebarMenuItemProps> = [
    {
      icon: <FaUserGroup />,
      label: "User List",
      subSidebarMenus: ["Users with Extensions", "Unassigned Extensions"],
    },
    {
      icon: <FaHatWizard />,
      label: "Wizard for Extensions",
    },
  ];

  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [userIds, setUserIds] = useState<Array<string>>([]);
  const [tableItems, setTableItems] = useState<Array<TableItemProps>>([]);

  const handleUserStatusChange = async (status: boolean) => {
    try {
      const response = await fetch(
        // @ts-ignore
        `${import.meta.env.VITE_API_URL}/admin/user_set_status/${userIds[selectedItemIndex]}`,
        {
          method: "PUT",
          headers: {
            authorization: userData.token,
          },
        }
      );

      if (response.ok) {
        setUserStatus(status);
        await fetchUserList(currentPage, pageSize, searchTerm);
      } else {
        toast.warn(`Can not set this user as ${userStatus}`);
      }
    } catch (e) {
      toast.error("User status fetch error");
    }
  };

  const onAddUser = async () => {
    await fetchUserList(currentPage, pageSize, searchTerm);
  };

  const handlePageIndexChange = async (index: number) => {
    setCurrentPage(index);
    await fetchUserList(index, pageSize);
  };

  const handlePageSizeChange = async (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    await fetchUserList(1, newPageSize);
  };

  const handleSearchTermChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    fetchUserList(currentPage, pageSize, e.target.value);
  };

  // const handleViewUser = async (index: number) => {
  //   setViewUser({
  //     username: "don3",
  //     firstName: "",
  //     lastName: "",
  //     email: "",
  //     role: "",
  //     domain: "",
  //   });
  //   setIsViewModalOpen(true);
  // };

  const handleEditUser = async (index: number) => {
    try {
      const response = await fetch(
        // @ts-ignore
        `${import.meta.env.VITE_API_URL}/admin/user_update/${userIds[index]}`,
        {
          headers: {
            authorization: userData.token,
          },
        }
      );
      const data = await response.json();
      const user = tableItems[index];
      setEditUser({
        ...user,
        username: data.data.user.username ?? "",
        firstName: data.data.user.contact_name_given ?? "",
        lastName: data.data.user.contact_name_family ?? "",
        fullName: data.data.user.contact_name ?? "",
        email: data.data.user.user_email ?? "",
        password: "",
        confirm_password: "",
        role: data.data.user.group_uuids ?? "",
        domain: data.data.user.domain_uuid ?? "",
      });

      const booleanMap: { [key: string]: boolean } = {
        true: true,
        false: false,
      };
      setUserStatus(booleanMap[data.data.user.user_enabled.toLowerCase()]);

      setSelectedItemIndex(index);
      setIsEditModalOpen(true);
    } catch (e) {
      toast("Can't found the selected user", { type: "warning" });
    }
  };

  const handleAddUser = async () => {
    for (const row of inputRows) {
      if (row.password !== row.confirm_password) {
        toast("Password and confirm password are not match!", {
          type: "warning",
        });
        return;
      }

      let newRole = roles.find((item) => item.id === row.role);
      if (!newRole && roles.length) {
        newRole = roles[0];
      }

      let newDomain = domains.find((item) => item.id === row.domain);
      if (!newDomain && domains.length) {
        newDomain = domains[0];
      }

      try {
        // @ts-ignore
        const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/user_create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: userData.token,
          },
          body: JSON.stringify({
            status: true,
            username: row.username,
            firstName: row.firstName,
            lastName: row.lastName,
            email: row.email,
            password: row.password,
            group: row.role !== "" ? row.role : roles[0].id,
            domain: row.domain !== "" ? row.domain : domains[0].id,
          }),
        });

        if (response.ok) {
          await onAddUser();
          setIsModalOpen(false);
          setInputRows([
            {
              status: true,
              username: "",
              firstName: "",
              lastName: "",
              fullName: "",
              email: "",
              password: "",
              confirm_password: "",
              role: roles[0].id,
              domain: domains[0].id,
            },
          ]);
          toast("The user created successfully", { type: "success" });
        } else {
          const errorData = await response.json();
          toast(errorData.msg, { type: "warning" });
        }
      } catch (error) {
        console.error("Error creating user:", error);
      }
    }
  };

  const handleUpdateUser = async () => {
    if (editUser) {
      if (editUser.password !== editUser.confirm_password) {
        toast("Password and confirm password are not match!", {
          type: "warning",
        });
        return;
      }

      try {
        const response = await fetch(
          // @ts-ignore
          `${import.meta.env.VITE_API_URL}/admin/user_update/${userIds[selectedItemIndex]}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              authorization: userData.token,
            },
            body: JSON.stringify({
              status: true,
              username: editUser.username,
              firstName: editUser.firstName,
              lastName: editUser.lastName,
              fullName: `${editUser.firstName} ${editUser.lastName}`,
              email: editUser.email,
              password: editUser.password,
              group: editUser.role,
              domain: editUser.domain,
              api: editUser.api as string,
            }),
          }
        );
        const data = await response.json();
        if (!response.ok) {
          toast(data.msg, { type: "warning" });
          return;
        }

        await fetchUserList(currentPage, pageSize, searchTerm);
        setInputRows([
          {
            status: true,
            username: "",
            firstName: "",
            lastName: "",
            fullName: "",
            email: "",
            password: "",
            confirm_password: "",
            role: "",
            domain: "",
          },
        ]);
        toast.success("Successed Updated", { type: "success" });
        setIsEditModalOpen(false);
      } catch (e) {
        toast("Fetch error", { type: "warning" });
        console.warn("Fetch error", e);
      }
    }
  };

  const updateInputRow = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const rows = [...inputRows];
    rows[index] = { ...rows[index], [field]: value };
    setInputRows(rows);
  };

  const fetchRoleAndDomainResponse = useCallback(async () => {
    // @ts-ignore
    const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/user_create`, {
      headers: {
        authorization: userData.token,
      },
    });
    const data = await response.json();

    const roleItems: Array<{ name: string; id: string }> = [];
    const domainItems: Array<{ name: string; id: string }> = [];

    data?.data.groups.forEach(
      (item: { group_uuid: string; group_name: string }) => {
        roleItems.push({
          name: item.group_name,
          id: item.group_uuid,
        });
      }
    );

    data?.data.domains.forEach(
      (item: { domain_name: string; domain_uuid: string }) => {
        domainItems.push({
          name: item.domain_name,
          id: item.domain_uuid,
        });
      }
    );

    setRoles(roleItems);
    setDomains(domainItems);
  }, [userData.token]);

  const fetchUserList = useCallback(
    async (page?: number, count?: number, search?: string) => {
      try {
        const response = await fetch(
          // @ts-ignore
          `${import.meta.env.VITE_API_URL}/admin/user_list?search=${search ?? searchTerm}&page=${
            page ?? currentPage
          }&pageSize=${count ?? pageSize}`,
          {
            headers: {
              authorization: userData.token,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          const userIdData = data.data.users.map((user: any) => user.user_uuid);
          const users: TableItemProps[] = data.data.users.map((user: any) => ({
            status: user.user_enabled,
            username: user.username,
            fullName: user.contact_name,
            role: user.group_names,
            domain: user.domain_name,
            api: "",
          }));
          setUserIds(userIdData);
          setTableItems(users);
          setTotalPages(data.data.totalPages);
          setTotalCount(data.data.totalCount);
        } else {
          console.error("Failed to fetch users:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    [userData.token]
  );

  const handleViewUser = async (index: number) => {
    try {
      const response = await fetch(
          // @ts-ignore
        `${import.meta.env.VITE_API_URL}/admin/user_read/${userIds[index]}`,
        {
          headers: {
            authorization: userData.token,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setViewUser({
          username: data.data.username,
          firstName: data.data.contact_name_given,
          lastName: data.data.contact_name_family,
          email: data.data.user_email,
          role: data.data.group_names,
          domain: data.data.domain_name,
        });
        setIsViewModalOpen(true);
      } else {
        console.error("Failed to fetch user details:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  // const handleDeleteUser = async (index: number) => {
  //   setSelectedItemIndex(index);
  //   setConfirmModalOpen(true);
  // };

  // const handleConfirmCancel = () => {
  //   setConfirmModalOpen(false);
  // };

  // const handleConfirm = async () => {
  //   setConfirmModalOpen(false);
  //   try {
  //     const response = await fetch(
  //       `${import.meta.env.VITE_API_URL}/admin/user_delete/${userIds[selectedItemIndex]}`,
  //       {
  //         method: "DELETE",
  //         headers: {
  //           authorization: userData.token,
  //         },
  //       }
  //     );

  //     if (response.ok) {
  //       toast.success("Deleted Successfully");

  //       const updatedUsers = tableItems.filter(
  //         (_, i) => i !== selectedItemIndex
  //       );
  //       setTableItems(updatedUsers);
  //     } else {
  //       toast.error("Failed to Delete");
  //     }
  //   } catch (error) {
  //     console.error("Error deleting user:", error);
  //     toast.error("An error occurred while deleting the user.");
  //   }
  // };

  useEffect(() => {
    fetchRoleAndDomainResponse();
    fetchUserList();
  }, [fetchRoleAndDomainResponse, fetchUserList]);

  return (
    <>
      <ToastContainer />
      <div className="w-full h-screen flex flex-col bg-white font-nunito">
        <Header />
        <main className="flex-1 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-4 h-full">
            <Sidebar sidebarMenus={sidebarMenus} />
            <div className="flex-1">
              <div className="w-full bg-white rounded-md shadow-md">
                <div className="flex justify-between items-center p-4">
                  <h1 className="text-2xl font-semibold text-gray-800">
                    Users
                  </h1>
                </div>
                <div className="flex justify-between items-center bg-gray-50 border-b p-5">
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={handleSearchTermChange}
                      className="px-4 py-1 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="bg-gray-200 text-gray-600 grid place-items-center px-2 border-gray-200 cursor-pointer">
                      <AiOutlineSearch className="" />
                    </div>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-2 py-1 border border-gray-200 flex items-center bg-gray-200 text-blue-400"
                  >
                    <BsPlusLg className="mr-2" /> Add User
                  </button>
                </div>
                <Table
                  headerItems={[
                    "Status",
                    "User Name",
                    "Full Name",
                    "Role",
                    "Domain",
                    "API",
                  ]}
                  tableItems={tableItems}
                  totalPages={totalPages}
                  currentPage={currentPage}
                  pageSize={pageSize}
                  totalCount={totalCount}
                  onViewUser={handleViewUser}
                  onEditUser={handleEditUser}
                  // onDeleteUser={handleDeleteUser}
                  onPageIndexChange={handlePageIndexChange}
                  onPageSizeChange={handlePageSizeChange}
                />
                {/* <ConfirmModal
                  isOpen={confirmModalOpen}
                  onRequestClose={handleConfirmCancel}
                  onConfirm={handleConfirm}
                  message="Are you sure you want to delete this item?"
                /> */}
                <Modal
                  width="w-[1100px]"
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                >
                  <div>
                    <h2 className="text-xl text-gray-500 mb-4 bg-gray-100 border-b-2 border-gray-300 p-4 text-center">
                      Add User
                    </h2>
                    <div className="p-6 space-y-6">
                      {inputRows.map((row, index) => (
                        <div key={index} className="grid grid-cols-4 gap-4">
                          <div>
                            {index === 0 && (
                              <label className="block text-sm font-medium text-gray-700">
                                User Name
                              </label>
                            )}
                            <input
                              type="text"
                              className="mt-1 p-2 border rounded-lg w-full"
                              value={row.username}
                              onChange={(e) =>
                                updateInputRow(
                                  index,
                                  "username",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div>
                            {index === 0 && (
                              <label className="block text-sm font-medium text-gray-700">
                                First Name
                              </label>
                            )}
                            <input
                              type="text"
                              className="mt-1 p-2 border rounded-lg w-full"
                              value={row.firstName}
                              onChange={(e) =>
                                updateInputRow(
                                  index,
                                  "firstName",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div>
                            {index === 0 && (
                              <label className="block text-sm font-medium text-gray-700">
                                Last Name
                              </label>
                            )}
                            <input
                              type="text"
                              className="mt-1 p-2 border rounded-lg w-full"
                              value={row.lastName}
                              onChange={(e) =>
                                updateInputRow(
                                  index,
                                  "lastName",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div>
                            {index === 0 && (
                              <label className="block text-sm font-medium text-gray-700">
                                Email
                              </label>
                            )}
                            <input
                              type="text"
                              className="mt-1 p-2 border rounded-lg w-full"
                              value={row.email}
                              onChange={(e) =>
                                updateInputRow(index, "email", e.target.value)
                              }
                            />
                          </div>
                          <div>
                            {index === 0 && (
                              <label className="block text-sm font-medium text-gray-700">
                                Password
                              </label>
                            )}
                            <input
                              type="password"
                              className="mt-1 p-2 border rounded-lg w-full"
                              value={row.password}
                              onChange={(e) =>
                                updateInputRow(
                                  index,
                                  "password",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div>
                            {index === 0 && (
                              <label className="block text-sm font-medium text-gray-700">
                                Confirm Password
                              </label>
                            )}
                            <input
                              type="password"
                              className="mt-1 p-2 border rounded-lg w-full"
                              value={row.confirm_password}
                              onChange={(e) =>
                                updateInputRow(
                                  index,
                                  "confirm_password",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="text-sm">
                            {index === 0 && (
                              <label className="block text-sm font-medium text-gray-700">
                                Role
                              </label>
                            )}
                            <select
                              className="mt-1 p-2 border rounded-lg w-full"
                              value={row.role}
                              onChange={(e) =>
                                updateInputRow(index, "role", e.target.value)
                              }
                            >
                              {roles.map((item, index) => (
                                <option key={index} value={item.id}>
                                  {item.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="text-sm">
                            {index === 0 && (
                              <label className="block text-sm font-medium text-gray-700">
                                Domain
                              </label>
                            )}
                            <select
                              className="mt-1 p-2 border rounded-lg w-full"
                              value={row.domain}
                              onChange={(e) =>
                                updateInputRow(index, "domain", e.target.value)
                              }
                            >
                              {domains.map((item, index) => (
                                <option key={index} value={item.id}>
                                  {item.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end p-4 border-t border-gray-200">
                      <button
                        className="px-4 py-2 mr-2 bg-gray-300 rounded-lg"
                        onClick={() => {
                          setInputRows([
                            {
                              status: true,
                              username: "",
                              firstName: "",
                              lastName: "",
                              fullName: "",
                              email: "",
                              password: "",
                              confirm_password: "",
                              role: "",
                              domain: ".pbx1.cloudtalk.ca",
                            },
                          ]);
                          setIsModalOpen(false);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg"
                        onClick={handleAddUser}
                      >
                        OK
                      </button>
                    </div>
                  </div>
                </Modal>
                {editUser && (
                  <Modal
                    width="w-[1100px]"
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                  >
                    <div>
                      <h2 className="text-xl text-gray-500 mb-4 bg-gray-100 border-b-2 border-gray-300 p-4 text-center">
                        Edit User
                      </h2>
                      <div className="p-6 space-y-6">
                        <div className="grid grid-cols-4 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              User Name
                            </label>
                            <input
                              type="text"
                              className="mt-1 p-2 border rounded-lg w-full"
                              value={editUser.username}
                              onChange={(e) =>
                                setEditUser({
                                  ...editUser,
                                  username: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              First Name
                            </label>
                            <input
                              type="text"
                              className="mt-1 p-2 border rounded-lg w-full"
                              value={editUser.firstName}
                              onChange={(e) =>
                                setEditUser({
                                  ...editUser,
                                  firstName: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Last Name
                            </label>
                            <input
                              type="text"
                              className="mt-1 p-2 border rounded-lg w-full"
                              value={editUser.lastName}
                              onChange={(e) =>
                                setEditUser({
                                  ...editUser,
                                  lastName: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Email
                            </label>
                            <input
                              type="text"
                              className="mt-1 p-2 border rounded-lg w-full"
                              value={editUser.email}
                              onChange={(e) =>
                                setEditUser({
                                  ...editUser,
                                  email: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Password
                            </label>
                            <input
                              type="password"
                              className="mt-1 p-2 border rounded-lg w-full"
                              value={editUser.password}
                              onChange={(e) =>
                                setEditUser({
                                  ...editUser,
                                  password: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Confirm Password
                            </label>
                            <input
                              type="password"
                              className="mt-1 p-2 border rounded-lg w-full"
                              value={editUser.confirm_password}
                              onChange={(e) =>
                                setEditUser({
                                  ...editUser,
                                  confirm_password: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Role
                            </label>
                            <select
                              className="mt-1 p-2 border rounded-lg w-full"
                              value={editUser.role}
                              onChange={(e) =>
                                setEditUser({
                                  ...editUser,
                                  role: e.target.value,
                                })
                              }
                            >
                              {roles.map((item, index) => (
                                <option key={index} value={item.id}>
                                  {item.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Domain
                            </label>
                            <select
                              className="mt-1 p-2 border rounded-lg w-full"
                              value={editUser.domain}
                              onChange={(e) =>
                                setEditUser({
                                  ...editUser,
                                  domain: e.target.value,
                                })
                              }
                            >
                              {domains.map((item, index) => (
                                <option key={index} value={item.id}>
                                  {item.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between p-4 border-t border-gray-200">
                        <Toggle
                          status={userStatus}
                          onChange={handleUserStatusChange}
                        />
                        <div className="flex gap-2">
                          <button
                            className="px-4 py-2 mr-2 bg-gray-300 rounded-lg"
                            onClick={() => setIsEditModalOpen(false)}
                          >
                            Cancel
                          </button>
                          <button
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg"
                            onClick={handleUpdateUser}
                          >
                            Update
                          </button>
                        </div>
                      </div>
                    </div>
                  </Modal>
                )}
                {viewUser && (
                  <Modal
                    width="w-[1100px]"
                    isOpen={isViewModalOpen}
                    onClose={() => setIsViewModalOpen(false)}
                  >
                    <div>
                      <h2 className="text-xl text-gray-500 mb-4 bg-gray-100 border-b-2 border-gray-300 p-4 text-center">
                        View User
                      </h2>
                      <div className="p-6 space-y-6">
                        <div className="grid grid-cols-4 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-500">
                              User Name
                            </label>
                            <p className="p-2 text-xl w-full">
                              {viewUser.username}
                            </p>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500">
                              First Name
                            </label>
                            <p className="p-2 text-xl w-full">
                              {viewUser.firstName}
                            </p>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500">
                              Last Name
                            </label>
                            <p className="p-2 text-xl w-full">
                              {viewUser.lastName}
                            </p>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500">
                              Email
                            </label>
                            <p className="p-2 text-xl w-full">
                              {viewUser.email}
                            </p>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500">
                              Role
                            </label>
                            <p className="p-2 text-xl w-full">
                              {viewUser.role}
                            </p>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500">
                              Domain
                            </label>
                            <p className="p-2 text-xl w-full">
                              {viewUser.domain}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end p-4 border-t border-gray-200">
                        <button
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg"
                          onClick={() => setIsViewModalOpen(false)}
                        >
                          OK
                        </button>
                      </div>
                    </div>
                  </Modal>
                )}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default CustomersDashboard;
