import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import Modal from "../../../components/base/Modal";
import Table from "../../../components/base/Table";
import Toggle from "../../../components/base/Toggle";

import Footer from "../../../components/layouts/footer";
import Header from "../../../components/layouts/header";

import { useAppStore } from "../../../lib/zustand/store";

import { AiOutlineSearch } from "react-icons/ai";
import { BsPlusLg } from "react-icons/bs";

interface TableItemProps {
  firstName: string;
  lastName?: string;
  extension: number | null;
  callerId?: number | null;
  callerName?: string;
  disturb: boolean;
}

interface InputRowProps {
  extensionStatus: boolean;
  voicemailStatus: boolean;
  disturb: boolean;
  callerVisable: boolean; // 1
  callTimeout: number | null;
  firstName: string;
  lastName?: string; // 2
  extension: number | null;
  password?: string;
  description?: string;
  domain?: string; // 3
  callerId?: number | null;
  callerName?: string; // 4
  voicemail: string;
  voicemailPassword: string;
  voiceFile: string; // 5
}

const CustomersDashboard = () => {
  const { userData } = useAppStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [domains, setDomains] = useState<Array<{ name: string; id: string }>>([]);
  // const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [addExtension, setAddExtension] = useState<InputRowProps | null>(null);
  const [editExtension, setEditExtension] = useState<InputRowProps | null>(null);
  const [viewExtension, setViewExtension] = useState<InputRowProps | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [extensionIds, setExtensionIds] = useState<Array<string>>([]);
  const [tableItems, setTableItems] = useState<Array<TableItemProps>>([]);

  const handlePageIndexChange = async (index: number) => {
    setCurrentPage(index);
    await fetchExtensionList(index, pageSize);
  };

  const handlePageSizeChange = async (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    await fetchExtensionList(1, newPageSize);
  };

  const handleSearchTermChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    fetchExtensionList(currentPage, pageSize, e.target.value);
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

  const handleEditExtension = async (index: number) => {
    try {
      const response = await fetch(
        // @ts-ignore
        `${import.meta.env.VITE_API_URL}/admin/extension_update/${extensionIds[index]}`,
        {
          headers: {
            authorization: userData.token,
          },
        }
      );
      const data = await response.json();
      setEditExtension({
        extensionStatus: data.data.current_extension.enabled === 'true' ? true : false,
        voicemailStatus: data.data.voicemail_enabled === 'true' ? true : false,
        disturb: data.data.current_extension.do_not_disturb === 'true' ? true : false,
        callerVisable: true,
        callTimeout: data.data.current_extension.call_timeout ? parseInt(data.data.current_extension.call_timeout) : null,
        firstName: data.data.current_extension.directory_first_name,
        lastName: data.data.current_extension.directory_last_name,
        extension: data.data.current_extension.extension ? parseInt(data.data.current_extension.extension) : null,
        callerId: data.data.current_extension.effective_caller_id_number ? parseInt(data.data.current_extension.effective_caller_id_number) : null,
        callerName: data.data.current_extension.effective_caller_id_name,
        password: "",
        domain: data.data.current_extension.domain_uuid,
        voicemail: data.data.current_voicemail?.voicemail_mail_to ?? "",
        voicemailPassword: data.data.current_voicemail?.voicemail_password ?? "",
        voiceFile: data.data.current_voicemail?.voicemail_file ?? "",
        description:  data.data.current_extension.description,
      });

      setSelectedItemIndex(index);
      setIsEditModalOpen(true);
    } catch (e) {
      console.log(e)
      toast("Can't found the selected user", { type: "warning" });
    }
  };

  const handleAddExtension = async () => {
    try {
      if (!addExtension) return;
      // @ts-ignore
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/extension_create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: userData.token,
        },
        body: JSON.stringify({
          domain_uuid: addExtension.domain === "" ? domains[0].id: addExtension.domain,
          extension: addExtension.extension,
          password: addExtension.password,
          effective_caller_id_name: addExtension.callerName,
          effective_caller_id_number: addExtension.callerId,
          directory_first_name: addExtension.firstName,
          directory_last_name: addExtension.lastName,
          directory_visible: true,
          directory_exten_visible: true,
          call_timeout: addExtension.callTimeout,
          do_not_disturb: addExtension.disturb,
          description: addExtension.description,
          voicemail: addExtension.voicemail,
          email: '',
          voicemail_password: addExtension.voicemailPassword,
          voicemail_file: addExtension.voiceFile,
          extension_enable: addExtension.extensionStatus,
          voicemail_enabled: addExtension.voicemailStatus,
        }),
      });

      if (response.ok) {
        await fetchExtensionList(currentPage, pageSize, searchTerm);
        setIsModalOpen(false);
        toast("The extension created successfully", { type: "success" });
      } else {
        const errorData = await response.json();
        toast(errorData.msg, { type: "warning" });
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleUpdateExtension = async () => {
    if (editExtension) {
      try {
        const response = await fetch(
          // @ts-ignore
          `${import.meta.env.VITE_API_URL}/admin/extension_update/${extensionIds[selectedItemIndex]}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              authorization: userData.token,
            },
            body: JSON.stringify({
              domain_uuid: editExtension.domain,
              extension: editExtension.extension,
              password: editExtension.password,
              effective_caller_id_name: editExtension.callerName,
              effective_caller_id_number: editExtension.callerId,
              directory_first_name: editExtension.firstName,
              directory_last_name: editExtension.lastName,
              directory_visible: true,
              directory_exten_visible: true,
              call_timeout: editExtension.callTimeout,
              do_not_disturb: editExtension.disturb,
              description: editExtension.description,
              voicemail: editExtension.voicemail,
              email: '',
              voicemail_password: editExtension.voicemailPassword,
              voicemail_file: editExtension.voiceFile,
              extension_enable: editExtension.extensionStatus,
              voicemail_enabled: editExtension.voicemailStatus,
            }),
          }
        );
        const data = await response.json();
        console.log(data)
        if (!response.ok) {
          toast(data.msg, { type: "warning" });
          return;
        }

        await fetchExtensionList(currentPage, pageSize, searchTerm);

        toast.success("Successed Updated", { type: "success" });
        setIsEditModalOpen(false);
      } catch (e) {
        toast("Fetch error", { type: "warning" });
        console.warn("Fetch error", e);
      }
    }
  };

  const fetchDomainResponse = useCallback(async () => {
    // @ts-ignore
    const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/user_create`, {
      headers: {
        authorization: userData.token,
      },
    });
    const data = await response.json();

    const domainItems: Array<{ name: string; id: string }> = [];

    data?.data.domains.forEach(
      (item: { domain_name: string; domain_uuid: string }) => {
        domainItems.push({
          name: item.domain_name,
          id: item.domain_uuid,
        });
      }
    );

    setDomains(domainItems);
  }, [userData.token]);

  const fetchExtensionList = useCallback(
    async (page?: number, count?: number, search?: string) => {
      try {
        const response = await fetch(
          // @ts-ignore
          `${import.meta.env.VITE_API_URL}/admin/extension_list?search=${search ?? searchTerm}&page=${
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
          const extensionIdData = data.data.extensions.map((user: any) => user.extension_uuid);
          const extensions: TableItemProps[] = data.data.extensions.map((extension: any) => ({
            firstName: extension.directory_first_name,
            lastName: extension.directory_last_name,
            extension: extension.extension,
            callerId: extension.effective_caller_id_number,
            callerName: extension.effective_caller_id_name,
            disturb: extension.do_not_disturb
          }));
          setExtensionIds(extensionIdData);
          setTableItems(extensions);
          setTotalPages(data.data.totalPages);
          setTotalCount(data.data.totalCount);
        } else {
          console.error("Failed to fetch extensions:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching extensions:", error);
      }
    },
    [userData.token]
  );

  const handleViewExtension = async (index: number) => {
    try {
      const response = await fetch(
          // @ts-ignore
        `${import.meta.env.VITE_API_URL}/admin/user_rea/${userIds[index]}`,
        {
          headers: {
            authorization: userData.token,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        // setViewUser({
        //   username: data.data.username,
        //   firstName: data.data.contact_name_given,
        //   lastName: data.data.contact_name_family,
        //   email: data.data.user_email,
        //   role: data.data.group_names,
        //   domain: data.data.domain_name,
        // });
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
    fetchDomainResponse();
    fetchExtensionList();
  }, [fetchDomainResponse, fetchExtensionList]);

  return (
    <>
      <ToastContainer />
      <div className="w-full h-screen flex flex-col bg-white font-nunito">
        <Header />
        <main className="flex-1 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-4 h-full">
            <div className="flex-1">
              <div className="w-full bg-white rounded-md shadow-md">
                <div className="flex justify-between items-center p-4">
                  <h1 className="text-2xl font-semibold text-gray-800">
                    Extensions
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
                    onClick={() => {
                      setAddExtension({
                        extensionStatus: true,
                        voicemailStatus: true,
                        disturb: false,
                        callerVisable: true,
                        callTimeout: 60,
                        firstName: "",
                        lastName: "",
                        extension: 0,
                        password: "",
                        description: "",
                        domain: "",
                        callerId: 0,
                        callerName: "",
                        voicemail: "",
                        voicemailPassword: "",
                        voiceFile: ""
                      });
                      setIsModalOpen(true);
                    }}
                    className="px-2 py-1 border border-gray-200 flex items-center bg-gray-200 text-blue-400"
                  >
                    <BsPlusLg className="mr-2" /> Add Extension
                  </button>
                </div>
                <Table
                  headerItems={[
                    "First Name",
                    "Last Name",
                    "Extension",
                    "Caller ID",
                    "Caller Name",
                    "Disturb"
                  ]}
                  tableItems={tableItems}
                  totalPages={totalPages}
                  currentPage={currentPage}
                  pageSize={pageSize}
                  totalCount={totalCount}
                  onViewUser={handleViewExtension}
                  onEditUser={handleEditExtension}
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
                {addExtension && (
                  <Modal
                    width="w-[1100px]"
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                  >
                    <div>
                      <h2 className="text-xl text-gray-500 mb-4 bg-gray-100 border-b-2 border-gray-300 p-4 text-center">
                        Add Extension
                      </h2>
                      <div className="p-6 space-y-6">
                        <div className="grid grid-cols-4 gap-4">
                          <div className="flex flex-col gap-2 item-center">
                            <label className="block text-sm font-medium text-gray-700">
                              Extension Status
                            </label>
                            <Toggle
                              status={addExtension.extensionStatus}
                              onChange={async (status: boolean) => setAddExtension({ ...addExtension, extensionStatus: status })}
                            />
                          </div>
                          <div className="flex flex-col gap-2 item-center">
                            <label className="block text-sm font-medium text-gray-700">
                              Voicemail Status
                            </label>
                            <Toggle
                              status={addExtension.voicemailStatus}
                              onChange={async (status: boolean) => setAddExtension({ ...addExtension, voicemailStatus: status })}
                            />
                          </div>
                          <div className="flex flex-col gap-2 item-center">
                            <label className="block text-sm font-medium text-gray-700">
                              Do not Disturb
                            </label>
                            <Toggle
                              status={addExtension.disturb}
                              onChange={async (status: boolean) => setAddExtension({ ...addExtension, disturb: status })}
                            />
                          </div>
                          <div className="flex flex-col gap-2 item-center">
                            <label className="block text-sm font-medium text-gray-700">
                              Caller Visable
                            </label>
                            <Toggle
                              status={addExtension.callerVisable}
                              onChange={async (status: boolean) => setAddExtension({ ...addExtension, callerVisable: status })}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="flex flex-col gap-2 item-center">
                            <label className="block text-sm font-medium text-gray-700">
                              Call Timeout
                            </label>
                            <input
                              type="number"
                              className="mt-1 p-2 border rounded-lg w-full"
                              value={addExtension.callTimeout as number}
                              min={1}
                              max={99999}
                              onChange={(e) =>
                                setAddExtension({
                                  ...addExtension,
                                  callTimeout: parseInt(e.target.value)
                                })
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-2 item-center">
                            <label className="block text-sm font-medium text-gray-700">
                              First Name
                            </label>
                            <input
                              type="text"
                              className="mt-1 p-2 border rounded-lg w-full"
                              value={addExtension.firstName}
                              onChange={(e) =>
                                setAddExtension({
                                  ...addExtension,
                                  firstName: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-2 item-center">
                            <label className="block text-sm font-medium text-gray-700">
                              Last Name
                            </label>
                            <input
                              type="text"
                              className="mt-1 p-2 border rounded-lg w-full"
                              value={addExtension.lastName ?? ""}
                              onChange={(e) =>
                                setAddExtension({
                                  ...addExtension,
                                  lastName: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                          <div className="flex flex-col gap-2 item-center">
                            <label className="block text-sm font-medium text-gray-700">
                              Extension
                            </label>
                            <input
                              type="number"
                              className="mt-1 p-2 border rounded-lg w-full"
                              value={addExtension.extension as number ?? 0}
                              onChange={(e) =>
                                setAddExtension({
                                  ...addExtension,
                                  extension: parseInt(e.target.value ? e.target.value: "0"),
                                })
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-2 item-center">
                            <label className="block text-sm font-medium text-gray-700">
                              Password
                            </label>
                            <input
                              type="password"
                              className="mt-1 p-2 border rounded-lg w-full"
                              value={addExtension.password}
                              onChange={(e) =>
                                setAddExtension({
                                  ...addExtension,
                                  password: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-2 item-center">
                            <label className="block text-sm font-medium text-gray-700">
                              Description
                            </label>
                            <input
                              type="text"
                              className="mt-1 p-2 border rounded-lg w-full"
                              value={addExtension.description}
                              onChange={(e) =>
                                setAddExtension({
                                  ...addExtension,
                                  description: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-2 item-center">
                            <label className="block text-sm font-medium text-gray-700">
                              Domain
                            </label>
                            <select
                              className="mt-1 p-2 border rounded-lg w-full"
                              value={addExtension.domain}
                              onChange={(e) =>
                                setAddExtension({
                                  ...addExtension,
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
                        {addExtension.callerVisable ? (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2 item-center">
                              <label className="block text-sm font-medium text-gray-700">
                                Caller Id
                              </label>
                              <input
                                type="number"
                                className="mt-1 p-2 border rounded-lg w-full"
                                value={addExtension.callerId as number}
                                min={1}
                                max={99999}
                                onChange={(e) =>
                                  setAddExtension({
                                    ...addExtension,
                                    callerId: parseInt(e.target.value)
                                  })
                                }
                              />
                            </div>
                            <div className="flex flex-col gap-2 item-center">
                              <label className="block text-sm font-medium text-gray-700">
                                Caller Name
                              </label>
                              <input
                                type="text"
                                className="mt-1 p-2 border rounded-lg w-full"
                                value={addExtension.callerName ?? ""}
                                onChange={(e) =>
                                  setAddExtension({
                                    ...addExtension,
                                    callerName: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        ): null}
                        <div className="grid grid-cols-3 gap-4">
                          <div className="flex flex-col gap-2 item-center">
                            <label className="block text-sm font-medium text-gray-700">
                              Voicemail
                            </label>
                            <input
                              type="text"
                              className="mt-1 p-2 border rounded-lg w-full"
                              value={addExtension.voicemail}
                              onChange={(e) =>
                                setAddExtension({
                                  ...addExtension,
                                  voicemail: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-2 item-center">
                            <label className="block text-sm font-medium text-gray-700">
                              Voicemail Password
                            </label>
                            <input
                              type="password"
                              className="mt-1 p-2 border rounded-lg w-full"
                              value={addExtension.voicemailPassword}
                              onChange={(e) =>
                                setAddExtension({
                                  ...addExtension,
                                  voicemailPassword: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-2 item-center">
                            <label className="block text-sm font-medium text-gray-700">
                              Voice File
                            </label>
                            <input
                              type="text"
                              className="mt-1 p-2 border rounded-lg w-full"
                              value={addExtension.voiceFile}
                              onChange={(e) =>
                                setAddExtension({
                                  ...addExtension,
                                  voiceFile: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end p-4 border-t border-gray-200">
                        <div className="flex gap-2">
                          <button
                            className="px-4 py-2 mr-2 bg-gray-300 rounded-lg"
                            onClick={() => setIsModalOpen(false)}
                          >
                            Cancel
                          </button>
                          <button
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg"
                            onClick={handleAddExtension}
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </Modal>
                )}
                {editExtension && (
                  <Modal
                    width="w-[1100px]"
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                  >
                    <div>
                      <h2 className="text-xl text-gray-500 mb-4 bg-gray-100 border-b-2 border-gray-300 p-4 text-center">
                        Edit Extension
                      </h2>
                      <div className="p-6 space-y-6">
                        <div className="grid grid-cols-4 gap-4">
                          <div className="flex flex-col gap-2 item-center">
                            <label className="block text-sm font-medium text-gray-700">
                              Extension Status
                            </label>
                            <Toggle
                              status={editExtension.extensionStatus}
                              onChange={async (status: boolean) => setEditExtension({ ...editExtension, extensionStatus: status })}
                            />
                          </div>
                          <div className="flex flex-col gap-2 item-center">
                            <label className="block text-sm font-medium text-gray-700">
                              Voicemail Status
                            </label>
                            <Toggle
                              status={editExtension.voicemailStatus}
                              onChange={async (status: boolean) => setEditExtension({ ...editExtension, voicemailStatus: status })}
                            />
                          </div>
                          <div className="flex flex-col gap-2 item-center">
                            <label className="block text-sm font-medium text-gray-700">
                              Do not Disturb
                            </label>
                            <Toggle
                              status={editExtension.disturb}
                              onChange={async (status: boolean) => setEditExtension({ ...editExtension, disturb: status })}
                            />
                          </div>
                          <div className="flex flex-col gap-2 item-center">
                            <label className="block text-sm font-medium text-gray-700">
                              Caller Visable
                            </label>
                            <Toggle
                              status={editExtension.callerVisable}
                              onChange={async (status: boolean) => setEditExtension({ ...editExtension, callerVisable: status })}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="flex flex-col gap-2 item-center">
                            <label className="block text-sm font-medium text-gray-700">
                              Call Timeout
                            </label>
                            <input
                              type="number"
                              className="mt-1 p-2 border rounded-lg w-full"
                              value={editExtension.callTimeout as number}
                              min={1}
                              max={99999}
                              onChange={(e) =>
                                setEditExtension({
                                  ...editExtension,
                                  callTimeout: parseInt(e.target.value)
                                })
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-2 item-center">
                            <label className="block text-sm font-medium text-gray-700">
                              First Name
                            </label>
                            <input
                              type="text"
                              className="mt-1 p-2 border rounded-lg w-full"
                              value={editExtension.firstName}
                              onChange={(e) =>
                                setEditExtension({
                                  ...editExtension,
                                  firstName: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-2 item-center">
                            <label className="block text-sm font-medium text-gray-700">
                              Last Name
                            </label>
                            <input
                              type="text"
                              className="mt-1 p-2 border rounded-lg w-full"
                              value={editExtension.lastName ?? ""}
                              onChange={(e) =>
                                setEditExtension({
                                  ...editExtension,
                                  lastName: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                          <div className="flex flex-col gap-2 item-center">
                            <label className="block text-sm font-medium text-gray-700">
                              Extension
                            </label>
                            <input
                              type="number"
                              className="mt-1 p-2 border rounded-lg w-full"
                              value={editExtension.extension as number}
                              onChange={(e) =>
                                setEditExtension({
                                  ...editExtension,
                                  extension: parseInt(e.target.value),
                                })
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-2 item-center">
                            <label className="block text-sm font-medium text-gray-700">
                              Password
                            </label>
                            <input
                              type="password"
                              className="mt-1 p-2 border rounded-lg w-full"
                              value={editExtension.password}
                              onChange={(e) =>
                                setEditExtension({
                                  ...editExtension,
                                  password: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-2 item-center">
                            <label className="block text-sm font-medium text-gray-700">
                              Description
                            </label>
                            <input
                              type="text"
                              className="mt-1 p-2 border rounded-lg w-full"
                              value={editExtension.description}
                              onChange={(e) =>
                                setEditExtension({
                                  ...editExtension,
                                  description: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-2 item-center">
                            <label className="block text-sm font-medium text-gray-700">
                              Domain
                            </label>
                            <select
                              className="mt-1 p-2 border rounded-lg w-full"
                              value={editExtension.domain}
                              onChange={(e) =>
                                setEditExtension({
                                  ...editExtension,
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
                        {editExtension.callerVisable ? (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2 item-center">
                              <label className="block text-sm font-medium text-gray-700">
                                Caller Id
                              </label>
                              <input
                                type="number"
                                className="mt-1 p-2 border rounded-lg w-full"
                                value={editExtension.callerId as number}
                                min={1}
                                max={99999}
                                onChange={(e) =>
                                  setEditExtension({
                                    ...editExtension,
                                    callerId: parseInt(e.target.value)
                                  })
                                }
                              />
                            </div>
                            <div className="flex flex-col gap-2 item-center">
                              <label className="block text-sm font-medium text-gray-700">
                                Caller Name
                              </label>
                              <input
                                type="text"
                                className="mt-1 p-2 border rounded-lg w-full"
                                value={editExtension.callerName ?? ""}
                                onChange={(e) =>
                                  setEditExtension({
                                    ...editExtension,
                                    callerName: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        ): null}
                        <div className="grid grid-cols-3 gap-4">
                          <div className="flex flex-col gap-2 item-center">
                            <label className="block text-sm font-medium text-gray-700">
                              Voicemail
                            </label>
                            <input
                              type="text"
                              className="mt-1 p-2 border rounded-lg w-full"
                              value={editExtension.voicemail}
                              onChange={(e) =>
                                setEditExtension({
                                  ...editExtension,
                                  voicemail: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-2 item-center">
                            <label className="block text-sm font-medium text-gray-700">
                              Voicemail Password
                            </label>
                            <input
                              type="password"
                              className="mt-1 p-2 border rounded-lg w-full"
                              value={editExtension.voicemailPassword}
                              onChange={(e) =>
                                setEditExtension({
                                  ...editExtension,
                                  voicemailPassword: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-2 item-center">
                            <label className="block text-sm font-medium text-gray-700">
                              Voice File
                            </label>
                            <input
                              type="text"
                              className="mt-1 p-2 border rounded-lg w-full"
                              value={editExtension.voiceFile}
                              onChange={(e) =>
                                setEditExtension({
                                  ...editExtension,
                                  voiceFile: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end p-4 border-t border-gray-200">
                        <div className="flex gap-2">
                          <button
                            className="px-4 py-2 mr-2 bg-gray-300 rounded-lg"
                            onClick={() => setIsEditModalOpen(false)}
                          >
                            Cancel
                          </button>
                          <button
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg"
                            onClick={handleUpdateExtension}
                          >
                            Update
                          </button>
                        </div>
                      </div>
                    </div>
                  </Modal>
                )}
                {viewExtension && (
                  <Modal
                    width="w-[1100px]"
                    isOpen={isViewModalOpen}
                    onClose={() => setIsViewModalOpen(false)}
                  >
                    <div>
                      {/* <h2 className="text-xl text-gray-500 mb-4 bg-gray-100 border-b-2 border-gray-300 p-4 text-center">
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
                      </div> */}
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
