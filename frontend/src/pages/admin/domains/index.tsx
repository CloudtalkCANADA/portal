import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Modal from "../../../components/base/Modal";
import Table from "../../../components/base/Table";
import Toggle from "../../../components/base/Toggle";

import Footer from "../../../components/layouts/footer";
import Header from "../../../components/layouts/header";

import { base_url } from "../../../config/setting";

import { useAppStore } from "../../../lib/zustand/store";

import { AiOutlineSearch } from "react-icons/ai";
import { BsPlusLg } from "react-icons/bs";
import { MdOutlineCloudSync } from "react-icons/md";

interface TableItemProps {
  status: boolean;
  domain_name: string;
  domain_description: string;
}

const DomainsDashboard = () => {
  const { userData } = useAppStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [inputRows, setInputRows] = useState<Array<TableItemProps>>([
    {
      status: true,
      domain_name: "",
      domain_description: "",
    },
  ]);
  const [editDomain, setEditDomain] = useState<TableItemProps | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [domainStatus, setDomainStatus] = useState<boolean>(true);

  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [domainIds, setDomainIds] = useState<Array<string>>([]);
  const [tableItems, setTableItems] = useState<Array<TableItemProps>>([]);

  const handleDomainStatusChange = async (status: boolean) => {
    try {
      const response = await fetch(
        // @ts-ignore
        `${import.meta.env.VITE_API_URL}/admin/domain_set_status/${domainIds[selectedItemIndex]}`,
        {
          method: "PUT",
          headers: {
            authorization: userData.token,
          },
        }
      );

      if (response.ok) {
        setDomainStatus(status);
        await fetchDomainList(currentPage, pageSize, searchTerm);
      } else {
        toast.warn(`Can not set this user as ${domainStatus}`);
      }
    } catch (e) {
      toast.error("User status fetch error");
    }
  };

  const onAddDomain = (newDomain: TableItemProps) => {
    setTableItems((prevItems) => [...prevItems, newDomain]);
  };

  const handlePageIndexChange = async (index: number) => {
    setCurrentPage(index);
    await fetchDomainList(index, pageSize);
  };

  const handlePageSizeChange = async (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    await fetchDomainList(1, newPageSize);
  };

  const handleSearchTermChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    fetchDomainList(currentPage, pageSize, e.target.value);
  };

  const handleEditDomain = async (index: number) => {
    try {
      const response = await fetch(
        // @ts-ignore
        `${import.meta.env.VITE_API_URL}/admin/domain_update/${domainIds[index]}`,
        {
          headers: {
            authorization: userData.token,
          },
        }
      );
      const data = await response.json();
      const domain = tableItems[index];
      console.log(data, "DDD");

      setEditDomain({
        ...domain,
        domain_name: data.data.domain_name ?? "",
        domain_description: data.data.domain_description ?? "",
      });

      setDomainStatus(data.data.domain_enabled);

      setSelectedItemIndex(index);
      setIsEditModalOpen(true);
    } catch (e) {
      toast("Can't found the selected domain", { type: "warning" });
    }
  };

  const handleAddDomain = async () => {
    for (const row of inputRows) {
      const newDomain: any = {
        status: true,
        domain_name: row.domain_name,
        domain_description: row.domain_description,
      };

      try {
        // @ts-ignore
        const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/domain_create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: userData.token,
          },
          body: JSON.stringify(newDomain),
        });

        if (response.ok) {
          onAddDomain(newDomain);
          setIsModalOpen(false);
          setInputRows([
            {
              status: true,
              domain_name: "",
              domain_description: "",
            },
          ]);
          
          await fetchDomainList(currentPage, pageSize, searchTerm);

          toast("The domain created successfully", { type: "success" });
        } else {
          console.log(response.status, response.ok);
          const errorData = await response.json();
          toast(errorData.msg, { type: "warning" });
        }
      } catch (error) {
        console.error("Error creating domain:", error);
      }
    }
  };

  const handleSyncGDMS = async () => {
    try {
      // @ts-ignore
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/sync_domain_to_site`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: userData.token,
        },
      });

      if (response.ok) {
        await fetchDomainList(currentPage, pageSize, searchTerm);
        toast("The domain was synced with GDMS successfully", { type: "success" });
      } else {
        console.log(response.status, response.ok);
        const errorData = await response.json();
        toast(errorData.msg, { type: "warning" });
      }
    } catch (error) {
      console.error("Error creating domain:", error);
    }
  };


  const handleUpdateDomain = async () => {
    if (editDomain) {
      try {
        const response = await fetch(
          // @ts-ignore
          `${import.meta.env.VITE_API_URL}/admin/domain_update/${domainIds[selectedItemIndex]}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              authorization: userData.token,
            },
            body: JSON.stringify({
              domain_name: editDomain.domain_name,
              domain_description: editDomain.domain_description,
            }),
          }
        );
        const data = await response.json();
        if (!response.ok) {
          toast(data.msg, { type: "warning" });
          return;
        }

        await fetchDomainList(currentPage, pageSize, searchTerm);

        const updatedDomain: TableItemProps = {
          status: domainStatus,
          domain_name: editDomain.domain_name,
          domain_description: editDomain.domain_description,
        };
        const updatedDomains = tableItems.map((domain, i) =>
          selectedItemIndex === i ? updatedDomain : domain
        );
        setTableItems(updatedDomains);
        setInputRows([
          {
            status: true,
            domain_name: "",
            domain_description: "",
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

  const fetchDomainList = useCallback(
    async (page?: number, count?: number, search?: string) => {
      try {
        const response = await fetch(
          // @ts-ignore
          `${import.meta.env.VITE_API_URL}/admin/domain_list?search=${search ?? searchTerm}&page=${
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

          const userIdDomain = data.data.domains.map(
            (domain: any) => domain.domain_uuid
          );
          const domains: TableItemProps[] = data.data.domains.map(
            (domain: any) => ({
              status: domain.domain_enabled,
              domain_name: domain.domain_name,
              domain_description: domain.domain_description,
            })
          );
          setDomainIds(userIdDomain);
          setTableItems(domains);
          setTotalPages(data.data.totalPages);
          setTotalCount(data.data.totalCount);
        } else {
          console.error("Failed to fetch domains:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching domains:", error);
      }
    },
    [userData.token]
  );

  useEffect(() => {
    fetchDomainList();
  }, [fetchDomainList]);

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
                    Domains
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
                  <div className=" flex gap-2">
                    <button
                      onClick={() => handleSyncGDMS()}
                      className="px-2 py-1 border border-gray-200 flex items-center bg-gray-200 text-blue-400"
                    >
                      <MdOutlineCloudSync className="mr-2" /> Sync GDMS
                    </button>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="px-2 py-1 border border-gray-200 flex items-center bg-gray-200 text-blue-400"
                    >
                      <BsPlusLg className="mr-2" /> Add Domain
                    </button>
                  </div>
                </div>
                <Table
                  headerItems={["Status", "Domain Name", "Domain Description"]}
                  tableItems={tableItems}
                  totalPages={totalPages}
                  currentPage={currentPage}
                  pageSize={pageSize}
                  totalCount={totalCount}
                  onEditUser={handleEditDomain}
                  onPageIndexChange={handlePageIndexChange}
                  onPageSizeChange={handlePageSizeChange}
                />
                <Modal
                  width="w-[1100px]"
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                >
                  <div>
                    <h2 className="text-xl text-gray-500 mb-4 bg-gray-100 border-b-2 border-gray-300 p-4 text-center">
                      Add Domain
                    </h2>
                    <div className="p-6 space-y-6">
                      {inputRows.map((row, index) => (
                        <div key={index} className="grid grid-cols-2 gap-4">
                          <div>
                            {index === 0 && (
                              <label className="block text-sm font-medium text-gray-700">
                                Domain Name
                              </label>
                            )}
                            <input
                              type="text"
                              className="mt-1 p-2 border rounded-lg w-full"
                              value={row.domain_name}
                              onChange={(e) =>
                                updateInputRow(
                                  index,
                                  "domain_name",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div>
                            {index === 0 && (
                              <label className="block text-sm font-medium text-gray-700">
                                Domain Description
                              </label>
                            )}
                            <input
                              type="text"
                              className="mt-1 p-2 border rounded-lg w-full"
                              value={row.domain_description}
                              onChange={(e) =>
                                updateInputRow(
                                  index,
                                  "domain_description",
                                  e.target.value
                                )
                              }
                            />
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
                              domain_name: "",
                              domain_description: "",
                              status: true,
                            },
                          ]);
                          setIsModalOpen(false);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg"
                        onClick={handleAddDomain}
                      >
                        OK
                      </button>
                    </div>
                  </div>
                </Modal>
                {editDomain && (
                  <Modal
                    width="w-[1100px]"
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                  >
                    <div>
                      <h2 className="text-xl text-gray-500 mb-4 bg-gray-100 border-b-2 border-gray-300 p-4 text-center">
                        Edit Domain
                      </h2>
                      <div className="p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Domain Name
                            </label>
                            <input
                              type="text"
                              className="mt-1 p-2 border rounded-lg w-full"
                              value={editDomain.domain_name}
                              onChange={(e) =>
                                setEditDomain({
                                  ...editDomain,
                                  domain_name: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Domain Description
                            </label>
                            <input
                              type="text"
                              className="mt-1 p-2 border rounded-lg w-full"
                              value={editDomain.domain_description}
                              onChange={(e) =>
                                setEditDomain({
                                  ...editDomain,
                                  domain_description: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="flex justify-between p-4 border-t border-gray-200">
                          <Toggle
                            status={domainStatus}
                            onChange={handleDomainStatusChange}
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
                              onClick={handleUpdateDomain}
                            >
                              Update
                            </button>
                          </div>
                        </div>
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

export default DomainsDashboard;
