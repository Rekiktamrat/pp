import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-modal";
import { FiPlus, FiEdit2, FiTrash2, FiMapPin } from "react-icons/fi";
import AddSubRegion from "./AddSubRegion";
import EditSubRegion from "./EditSubRegion";
import DeleteSubRegion from "./DeleteSubRegion";

import { getAllSubRegions } from "../../../store/address/subRegion/subRegionSlice";


const customModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: "500px",
    maxHeight: "90vh",
    overflow: "auto",
    borderRadius: "1rem",
    padding: "0",
    border: "none",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(4px)",
    zIndex: 50,
  },
};
const SubRegion = () => {
  const dispatch = useDispatch();
  const [isAdd, setIsAdd] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isDeleteAll, setIsDeleteAll] = useState(false);
  const [modifySubRegion, setModifySubRegion] = useState(null);

  useEffect(() => {
    dispatch(getAllSubRegions());
  }, [dispatch]);

  const { subRegions } = useSelector((state) => state.subregions);

  // Remove grouping by country and region
  return (
    <div className="pt-24 px-6 md:px-8 pb-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          SubRegion Management
        </h1>
        <div className="flex gap-3">
          <button
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300"
            onClick={() => setIsAdd(true)}
          >
            <FiPlus className="mr-1" />
            Add SubRegion
          </button>
          {subRegions?.length > 0 && (
            <button
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300"
              onClick={() => setIsDeleteAll(true)}
            >
              <FiTrash2 className="mr-1" />
              Delete All
            </button>
          )}
        </div>
      </div>

      {subRegions?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {subRegions.map((subRegion) => (
            <div
              key={subRegion.id}
              className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
                {subRegion.subregion_name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-1">
                <FiMapPin className="w-3 h-3" />
                {subRegion.region?.region_name || "Uncategorized"}
              </p>
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => {
                    setModifySubRegion(subRegion);
                    setIsEdit(true);
                  }}
                  className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 hover:scale-110 transition-transform"
                  aria-label="Edit subregion"
                >
                  <FiEdit2 size={16} />
                </button>
                <button
                  onClick={() => {
                    setModifySubRegion(subRegion);
                    setIsDelete(true);
                  }}
                  className="p-2 rounded-full bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 hover:scale-110 transition-transform"
                  aria-label="Delete subregion"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 mt-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
          <div className="text-6xl text-gray-300 dark:text-gray-600 mb-4">
            📍
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No subregions found.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            Click the "Add SubRegion" button to create one.
          </p>
        </div>
      )}

      {/* Modals for adding/editing/deleting subregions */}
      <Modal isOpen={isAdd} onRequestClose={() => setIsAdd(false)} style={customModalStyles} contentLabel="Add SubRegion">
        <AddSubRegion setIsAdd={setIsAdd} />
      </Modal>

      <Modal isOpen={isEdit} onRequestClose={() => setIsEdit(false)} style={customModalStyles} contentLabel="Edit SubRegion">
        <EditSubRegion setIsEdit={setIsEdit} selectedSubRegion={modifySubRegion} />
      </Modal>

      <Modal isOpen={isDelete} onRequestClose={() => setIsDelete(false)} style={customModalStyles} contentLabel="Delete SubRegion">
        <DeleteSubRegion setIsDelete={setIsDelete} selectedSubRegion={modifySubRegion} />
      </Modal>

    </div>
  );
};

export default SubRegion;