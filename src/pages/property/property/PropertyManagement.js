import React, { useState, useEffect, useMemo } from "react";
import {
  FiEye,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiFilter,
  FiChevronUp,
  FiChevronDown,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-modal";
import { getAllProperties } from "../../../store/property/propertySlice";
import PropertyViewModal from "./PropertyViewModal";
import EditProperty from "./EditProperty";
import DeleteProperty from "./DeleteProperty";

const customModalStyles = {
  content: {
    top: "50%", // Center the modal
    left: "50%", // Center the modal
    right: "auto", // Reset right
    bottom: "auto", // Reset bottom
    transform: "translate(-50%, -50%)", // Center the modal
    width: "90%", // Responsive width
    maxWidth: "800px", // Max width for larger screens
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

const PropertyManagement = () => {
  const dispatch = useDispatch();
  const { properties } = useSelector((state) => state.property);

  const [isView, setIsView] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRegion, setFilterRegion] = useState("all");
  const [filterSubregion, setFilterSubregion] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [filterPropertyType, setFilterPropertyType] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: "title", direction: "ascending" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    dispatch(getAllProperties());
  }, [dispatch]);

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

  const filterOptions = useMemo(() => {
    if (!properties)
      return { regions: [], subregions: [], locations: [], propertyTypes: [] };

    const regions = [
      ...new Set(properties.map((p) => p.address?.region).filter(Boolean)),
    ];
    const subregions = [
      ...new Set(
        properties.map((p) => p.address?.subregion?.subregion_name).filter(Boolean)
      ),
    ];
    const locations = [
      ...new Set(
        properties.map((p) => p.address?.location?.location).filter(Boolean)
      ),
    ];
    const propertyTypes = [
      ...new Set(properties.map((p) => p.propertyType?.name).filter(Boolean)),
    ];

    return { regions, subregions, locations, propertyTypes };
  }, [properties]);

  const processedProperties = useMemo(() => {
    let computedProperties = properties ? [...properties] : [];

    // 1. Filtering
    if (searchTerm) {
      computedProperties = computedProperties.filter((property) => {
        const nameMatch = property?.title
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        const locationMatch =
          property?.address?.subregion?.subregion_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          property?.address?.location?.location
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());
        return nameMatch || locationMatch;
      });
    }

    if (filterStatus !== "all") {
      computedProperties = computedProperties.filter(
        (property) => property.status === filterStatus
      );
    }

    if (filterRegion !== "all") {
      computedProperties = computedProperties.filter(
        (p) => p.address?.region === filterRegion
      );
    }
    if (filterSubregion !== "all") {
      computedProperties = computedProperties.filter(
        (p) => p.address?.subregion?.subregion_name === filterSubregion
      );
    }
    if (filterLocation !== "all") {
      computedProperties = computedProperties.filter(
        (p) => p.address?.location?.location === filterLocation
      );
    }
    if (filterPropertyType !== "all") {
      computedProperties = computedProperties.filter(
        (p) => p.propertyType?.name === filterPropertyType
      );
    }

    // 2. Sorting
    if (sortConfig.key) {
      computedProperties.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === "location") {
          aValue = `${a.address?.subregion?.subregion_name || ""} ${a.address?.location?.location || ""}`;
          bValue = `${b.address?.subregion?.subregion_name || ""} ${b.address?.location?.location || ""}`;
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return computedProperties;
  }, [
    properties,
    searchTerm,
    filterStatus,
    sortConfig,
    filterRegion,
    filterSubregion,
    filterLocation,
    filterPropertyType,
  ]);

  // 3. Pagination
  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedProperties.slice(startIndex, startIndex + itemsPerPage);
  }, [processedProperties, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(processedProperties.length / itemsPerPage);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const SortableHeader = ({ children, name }) => {
    const isSorted = sortConfig.key === name;
    return (
      <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort(name)}>
        <div className="flex items-center gap-1">
          {children}
          {isSorted ? (
            sortConfig.direction === "ascending" ? (
              <FiChevronUp className="w-4 h-4" />
            ) : (
              <FiChevronDown className="w-4 h-4" />
            )
          ) : null}
        </div>
      </th>
    );
  };

  return (
    <div className="pt-24 px-6 md:px-8 pb-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          Property Management
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="relative flex-grow">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or location..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
          <div className="relative flex-grow">
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-4 pr-10 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none"
            >
              <option value="all">All Statuses</option>
              <option value="available">Available</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="rented">Rented</option>
              <option value="sold">Sold</option>
            </select>
            <FiFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative flex-grow">
            <select
              value={filterRegion}
              onChange={(e) => {
                setFilterRegion(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-4 pr-10 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none"
            >
              <option value="all">All Regions</option>
              {filterOptions.regions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <FiFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative flex-grow">
            <select
              value={filterSubregion}
              onChange={(e) => {
                setFilterSubregion(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-4 pr-10 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none"
            >
              <option value="all">All Subregions</option>
              {filterOptions.subregions.map((sr) => (
                <option key={sr} value={sr}>{sr}</option>
              ))}
            </select>
            <FiFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative flex-grow">
            <select
              value={filterPropertyType}
              onChange={(e) => {
                setFilterPropertyType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-4 pr-10 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none"
            >
              <option value="all">All Types</option>
              {filterOptions.propertyTypes.map((pt) => (
                <option key={pt} value={pt}>{pt}</option>
              ))}
            </select>
            <FiFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                <tr>
                  <th scope="col" className="px-6 py-3">#</th>
                  <SortableHeader name="title">Name</SortableHeader>
                  <SortableHeader name="location">Location</SortableHeader>
                  <SortableHeader name="price">Price</SortableHeader>
                  <SortableHeader name="status">Status</SortableHeader>
                  <th scope="col" className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProperties.length > 0 ? (
                  paginatedProperties.map((property, index) => (
                    <tr
                      key={property._id}
                      className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                        {property.title}
                      </td>
                      <td className="px-6 py-4">
                        {property?.address?.subregion?.subregion_name}{" "}
                        {property?.address?.location?.location}
                      </td>
                      <td className="px-6 py-4">
                        ${property.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                            property.status === "available"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : property.status === "pending"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                              : property.status === "rejected"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                              : "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300"
                          }`}
                        >
                          {property.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-3">
                        <button
                          onClick={() => handleView(property)}
                          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          aria-label="View property"
                        >
                          <FiEye className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </button>
                        <button
                          onClick={() => handleEdit(property)}
                          className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                          aria-label="Edit property"
                        >
                          <FiEdit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </button>
                        <button
                          onClick={() => handleDelete(property)}
                          className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                          aria-label="Delete property"
                        >
                          <FiTrash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center text-gray-500 py-10"
                    >
                      No properties found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 0 && (
            <div className="flex flex-col md:flex-row justify-between items-center p-4 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700 dark:text-gray-400">
                  Items per page:
                </span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="pl-2 pr-6 py-1 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Property Modal */}
      <Modal
        isOpen={isView}
        onRequestClose={() => setIsView(false)}
        style={customModalStyles}
        contentLabel="View Property"
        ariaHideApp={false}
      >
        <PropertyViewModal
          property={selectedProperty}
          onClose={() => setIsView(false)}
        />
      </Modal>

      {/* Edit Property Modal */}
      <Modal
        isOpen={isEdit}
        onRequestClose={() => setIsEdit(false)}
        style={customModalStyles}
        contentLabel="Edit Property"
      >
        <EditProperty
          setIsEdit={setIsEdit}
          selectedProperty={selectedProperty}
        />
      </Modal>

      {/* Delete Property Modal */}
      <Modal
        isOpen={isDelete}
        onRequestClose={() => setIsDelete(false)}
        style={customModalStyles}
        contentLabel="Delete Property"
      >
        <DeleteProperty
          setIsDelete={setIsDelete}
          selectedProperty={selectedProperty}
        />
      </Modal>
    </div>
  );
};

export default PropertyManagement;
          