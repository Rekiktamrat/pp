import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-modal";
import { FiPlus, FiEdit2, FiTrash2, FiMap } from "react-icons/fi";
import AddLocation from "./AddLocation";
import EditLocation from "./EditLocation";
import DeleteLocation from "./DeleteLocation";
import { getAllLocations } from "../../../store/address/location/locationSlice";

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
const Location = () => {
  const dispatch = useDispatch();
  const [isAdd, setIsAdd] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isDeleteAll, setIsDeleteAll] = useState(false);
  const [modifyLocation, setModifyLocation] = useState(null);

  useEffect(() => {
    dispatch(getAllLocations());
  }, [dispatch]);

  const handleDeleteAll = () => {
    setIsDeleteAll(true);
  };

  const { locations } = useSelector((state) => state.locations);

  // Group locations by region and country
  const groupedLocations = locations?.reduce((acc, location) => {
    const countryId = location.country?._id || "uncategorized";
    const regionId = location.region?._id || "uncategorized";
    const subregionId = location.subregion?._id || "uncategorized";
    const groupKey = `${countryId}-${regionId}-${subregionId}`;

    if (!acc[groupKey]) {
      acc[groupKey] = {
        country: location.country || { country_name: "Uncategorized" },
        region: location.region || { region_name: "Uncategorized" },
        subregion: location.subregion || { subregion_name: "Uncategorized" },
        locations: [],
      };
    }
    acc[groupKey].locations.push(location);
    return acc;
  }, {});

  return (
    <div className="pt-24 px-6 md:px-8 pb-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Location Management
          </h1>
          <div className="flex gap-3">
            <button
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300"
              onClick={() => setIsAdd(true)}
            >
              <FiPlus className="w-5 h-5" />
              Add Location
            </button>
            {locations?.length > 0 && (
              <button
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300"
                onClick={handleDeleteAll}
              >
                <FiTrash2 className="w-5 h-5" />
                Delete All
              </button>
            )}
          </div>
        </div>

        {locations?.length > 0 ? (
          <div className="space-y-8">
            {Object.values(groupedLocations).map((group) => (
              <div
                key={`${group.country._id}-${group.region._id}-${group.subregion._id}`}
              >
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <FiMap className="text-gray-400" />
                    <span>
                      {group.subregion.subregion_name}
                      <span className="text-gray-400 font-normal">
                        , {group.region.region_name}
                      </span>
                    </span>
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {group.locations.map((location) => (
                    <div
                      key={location._id}
                      className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                      <h3
                        className="text-lg font-semibold text-gray-800 dark:text-white truncate"
                        onClick={() => console.log(groupedLocations)}
                      >
                        {location.location}
                      </h3>
                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => {
                            setModifyLocation(location);
                            setIsEdit(true);
                          }}
                          className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 hover:scale-110 transition-transform"
                          aria-label="Edit location"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setModifyLocation(location);
                            setIsDelete(true);
                          }}
                          className="p-2 rounded-full bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 hover:scale-110 transition-transform"
                          aria-label="Delete location"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 mt-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
            <div className="text-6xl text-gray-300 dark:text-gray-600 mb-4">
              🌍
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No locations found.
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Click the "Add Location" button to create one.
            </p>
          </div>
        )}

        {/* Modals for adding/editing/deleting locations */}
        <Modal
          isOpen={isAdd}
          onRequestClose={() => setIsAdd(false)}
          style={customModalStyles}
          contentLabel="Add Location"
        >
          <AddLocation setIsAdd={setIsAdd} />
        </Modal>

        <Modal
          isOpen={isEdit}
          onRequestClose={() => setIsEdit(false)}
          style={customModalStyles}
          contentLabel="Edit Location"
        >
          <EditLocation
            setIsEdit={setIsEdit}
            selectedLocation={modifyLocation}
          />
        </Modal>

        <Modal
          isOpen={isDelete}
          onRequestClose={() => setIsDelete(false)}
          style={customModalStyles}
          contentLabel="Delete Location"
        >
          <DeleteLocation
            setIsDelete={setIsDelete}
            selectedLocation={modifyLocation}
          />
        </Modal>
      </div>
    </div>
  );
};

export default Location;
