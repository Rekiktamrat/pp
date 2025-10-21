import React, { useState, useEffect } from "react";
import { FiEye, FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-modal";
import { getAllPropertytypes } from "../../../store/PropertyType/propertytypeSlice";
import ViewPropertyType from "./ViewPropertyType";
import EditPropertyType from "./EditPropertyType";
import DeletePropertyType from "./DeletePropertyType";
import AddPropertyType from "./AddPropertyType";

const customModalStyles = {
  content: {
    top: "50%", // Center the modal
    left: "50%", // Center the modal
    right: "auto", // Reset right
    bottom: "auto", // Reset bottom
    transform: "translate(-50%, -50%)", // Center the modal
    width: "90%", // Responsive width
    maxWidth: "600px", // Max width for larger screens
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

const PropertyType = () => {
  const dispatch = useDispatch();
  const { propertyTypes } = useSelector((state) => state.propertyType);

  const [localPropertyTypes, setLocalPropertyTypes] = useState([]);
  const [isView, setIsView] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Load property types into local state for editing
  useEffect(() => {
    dispatch(getAllPropertytypes()); // Keep original dispatch
  }, [dispatch]); // Keep original dependency

  // This effect correctly syncs local state when Redux state changes
  const handleView = (property) => {
    setSelectedProperty(property);
    setIsView(true);
  };

  const handleEdit = (property) => {
    setSelectedProperty(property);
    setIsEdit(true);
  };

  const handleDelete = (property) => {
    setSelectedProperty(property);
    setIsDelete(true);
  };

  const handleAdd = () => {
    setIsAdd(true);
  };

  return (
    <div className="pt-24 px-6 md:px-8 pb-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Property Type Management
          </h1>
          <button
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300"
          >
            <FiPlus className="w-5 h-5" />
            Add New Type
          </button>
        </div>

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
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {propertyTypes?.map((property, index) => (
                  <tr
                    key={property._id}
                    className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                      {property.name}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(property.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-3">
                      <button
                        onClick={() => handleView(property)}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        aria-label="View property type"
                      >
                        <FiEye className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      </button>
                      <button
                        onClick={() => handleEdit(property)}
                        className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                        aria-label="Edit property type"
                      >
                        <FiEdit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(property)}
                        className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                        aria-label="Delete property type"
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

      {/* View Property Modal */}
      <Modal
        isOpen={isView}
        onRequestClose={() => setIsView(false)}
        style={customModalStyles}
        contentLabel="View Type"
      >
        <ViewPropertyType
          setIsView={setIsView}
          selectedProperty={selectedProperty}
        />
      </Modal>

      {/* Edit Property Modal */}
      <Modal
        isOpen={isEdit}
        onRequestClose={() => setIsEdit(false)}
        style={customModalStyles}
        contentLabel="Edit Type"
      >
        {selectedProperty && (
          <EditPropertyType
            setIsEdit={setIsEdit}
            selectedPropertyType={selectedProperty}
          />
        )}
      </Modal>

      {/* Delete Property Modal */}
      <Modal
        isOpen={isDelete}
        onRequestClose={() => setIsDelete(false)}
        style={customModalStyles}
        contentLabel="Delete Type"
      >
        <DeletePropertyType
          setIsDelete={setIsDelete}
          selectedProperty={selectedProperty}
        />
      </Modal>

      {/* Add Property Modal */}
      <Modal
        isOpen={isAdd}
        onRequestClose={() => setIsAdd(false)}
        style={customModalStyles}
        contentLabel="Add Property"
      >
        <AddPropertyType setIsAdd={setIsAdd} />
      </Modal>
    </div>
  );
};

export default PropertyType;
