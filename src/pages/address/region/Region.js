import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-modal";
import { FiPlus, FiEdit2, FiTrash2, FiTrash } from "react-icons/fi";
import AddRegion from "./AddRegion";
import EditRegion from "./EditRegion";
import DeleteRegion from "./DeleteRegion";
import { getAllRegions } from "../../../store/address/region/regionSlice";
const customModalStyles = {
  content: {
    top: "50%", // Center the modal
    left: "50%", // Center the modal
    right: "auto", // Reset right
    bottom: "auto", // Reset bottom
    transform: "translate(-50%, -50%)", // Center the modal
    width: "90%", // Responsive width
    maxWidth: "500px", // Max width for larger screens
    maxHeight: "90vh",
    overflow: "auto",
    borderRadius: "1rem", // rounded-xl
    padding: "0", // Padding will be handled by the inner component
    border: "none",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(4px)",
    zIndex: 50,
  },
};

const Region = () => {
  const dispatch = useDispatch();
  const [isAdd, setIsAdd] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isDeleteAll, setIsDeleteAll] = useState(false);
  const [modifyRegion, setModifyRegion] = useState(null);

  useEffect(() => {
    dispatch(getAllRegions());
  }, [dispatch]);

  const { regions } = useSelector((state) => state.regions);

  return (
    <div className="pt-24 px-6 md:px-8 pb-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Region Management
        </h1>
        <div className="flex space-x-3">
          <button
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200"
            onClick={() => setIsAdd(true)}
          >
            <FiPlus className="mr-2" />
            Add Region
          </button>
          {regions?.length > 0 && (
            <button
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors duration-200"
              onClick={() => setIsDeleteAll(true)}
            >
              <FiTrash className="mr-2" />
              Delete All
            </button>
          )}
        </div>
      </div>

      {regions?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {regions.map((region) => (
            <div
              key={region.id}
              className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {region.region_name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Created:{" "}
                    <span className="font-medium">
                      {new Date(region.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                </div>

                {/* Hover actions */}
                <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => {
                      setModifyRegion(region);
                      setIsEdit(true);
                    }}
                    className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 hover:scale-110 transition-transform"
                    aria-label="Edit region"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setModifyRegion(region);
                      setIsDelete(true);
                    }}
                    className="p-2 rounded-full bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 hover:scale-110 transition-transform"
                    aria-label="Delete region"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
          <div className="text-6xl text-gray-300 dark:text-gray-600 mb-4">
            🗺️
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No regions found.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            Click the "Add Region" button to create one.
          </p>
        </div>
      )}

      {/* Add Region Modal */}
      <Modal
        isOpen={isAdd}
        onRequestClose={() => setIsAdd(false)}
        style={customModalStyles}
        contentLabel="Add Region"
      >
        <AddRegion setIsAdd={setIsAdd} />
      </Modal>

      {/* Edit Region Modal */}
      <Modal
        isOpen={isEdit}
        onRequestClose={() => setIsEdit(false)}
        style={customModalStyles}
        contentLabel="Edit Region"
      >
        <EditRegion setIsEdit={setIsEdit} selectedRegion={modifyRegion} />
      </Modal>

      {/* Delete Region Modal */}
      <Modal
        isOpen={isDelete}
        onRequestClose={() => setIsDelete(false)}
        style={customModalStyles}
        contentLabel="Delete Region"
      >
        <DeleteRegion setIsDelete={setIsDelete} selectedRegion={modifyRegion} />
      </Modal>
    </div>
  );
};

export default Region;
