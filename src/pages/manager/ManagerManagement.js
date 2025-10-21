import React, { useState, useEffect } from "react";
import {
  FiEye,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiSearch,
  FiCalendar,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { getAllManagers } from "../../store/manager/managerSlice";
import EditManager from "./EditManager";
import ViewManager from "./ViewManager";
import DeleteManager from "./DeleteManager";
import AddManager from "./AddManager";
import Modal from "react-modal";

Modal.setAppElement("#root");

const customModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)", // Center the modal
    width: "90%",
    maxWidth: "600px",
    maxHeight: "90vh",
    overflow: "auto",
    borderRadius: "1rem", // rounded-xl
    padding: "0", // We'll handle padding inside the component
    border: "none",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)", // backdrop
    backdropFilter: "blur(4px)", // nice blur effect
    zIndex: 50,
  },
};

const ManagerManagement = () => {
  const dispatch = useDispatch();
  const { managers } = useSelector((state) => state.manager);

  const [isView, setIsView] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // ✅ Search + Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    dispatch(getAllManagers());
  }, [dispatch]);

  // ✅ Integrated filtering (works same as dummy data test)
  const filteredManagers = managers?.filter((user) => {
    const createdDate = new Date(user.createdAt || user.created_at)
      .toISOString()
      .split("T")[0];

    return (
      (user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone?.includes(searchQuery)) &&
      (filterDate ? createdDate === filterDate : true)
    );
  });

  return (
    <div className="pt-24 px-6 md:px-8 pb-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Managers Management
          </h1>
          <button
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300"
            onClick={() => setIsAdd(true)}
          >
            <FiPlus className="w-5 h-5" />
            Add Manager
          </button>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full md:w-auto pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    #
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Phone
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredManagers?.map((user, index) => (
                  <tr
                    key={user._id}
                    className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">{user?.name}</td>
                    <td className="px-6 py-4">{user?.email}</td>
                    <td className="px-6 py-4">{user?.phone}</td>
                    <td className="px-6 py-4">
                      {new Date(
                        user.createdAt || user.created_at
                      ).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-3">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setIsView(true);
                        }}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        aria-label="View manager"
                      >
                        <FiEye className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setIsEdit(true);
                        }}
                        className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                        aria-label="Edit manager"
                      >
                        <FiEdit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setIsDelete(true);
                        }}
                        className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                        aria-label="Delete manager"
                      >
                        <FiTrash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isView}
        onRequestClose={() => setIsView(false)}
        style={customModalStyles}
        contentLabel="View Manager"
      >
        <ViewManager setIsView={setIsView} selectedUser={selectedUser} />
      </Modal>

      <Modal
        isOpen={isEdit}
        onRequestClose={() => setIsEdit(false)}
        style={customModalStyles}
        contentLabel="Edit Manager"
      >
        <EditManager setIsEdit={setIsEdit} selectedUser={selectedUser} />
      </Modal>

      <Modal
        isOpen={isAdd}
        onRequestClose={() => setIsAdd(false)}
        style={customModalStyles}
        contentLabel="Add Manager"
      >
        <AddManager setIsAdd={setIsAdd} />
      </Modal>

      <Modal
        isOpen={isDelete}
        onRequestClose={() => setIsDelete(false)}
        style={customModalStyles}
        contentLabel="Delete Manager"
      >
        <DeleteManager setIsDelete={setIsDelete} selectedUser={selectedUser} />
      </Modal>
    </div>
  );
};

export default ManagerManagement;
