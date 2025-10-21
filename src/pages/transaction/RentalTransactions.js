import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllTransactions } from "../../store/transaction/transactionSlice";
import Modal from "react-modal";
import {
  FiEye,
  FiSearch,
  FiFilter,
  FiX,
  FiHome,
  FiUser,
  FiDollarSign,
} from "react-icons/fi";

Modal.setAppElement("#root");

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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

const RentalTransactions = () => {
  const dispatch = useDispatch();
  const { transactions, loading, error } = useSelector(
    (state) => state.transaction
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [isView, setIsView] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    dispatch(getAllTransactions());
  }, [dispatch]);

  // Filter transactions by search and price
  const filteredTransactions = transactions?.filter((transaction) => {
    const propertyName = transaction?.property?.title?.toLowerCase() || "";
    const renterName = transaction?.buyer?.name?.toLowerCase() || "";
    const searchMatch =
      propertyName.includes(searchQuery.toLowerCase()) ||
      renterName.includes(searchQuery.toLowerCase());

    const price = transaction.amount;
    let priceMatch = true;
    if (priceFilter === "low") priceMatch = price < 500;
    if (priceFilter === "medium") priceMatch = price >= 500 && price <= 1500;
    if (priceFilter === "high") priceMatch = price > 1500;

    return searchMatch && priceMatch;
  });

  return (
    <div className="pt-24 px-6 md:px-8 pb-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          Rental Transactions
        </h1>

        {/* Search + Price Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Property or Renter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="w-full md:w-auto pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none"
            >
              <option value="">All Prices</option>
              <option value="low">Low (&lt; $500)</option>
              <option value="medium">Medium ($500 - $1500)</option>
              <option value="high">High (&gt; $1500)</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Property Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Renter Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions?.map((transaction) => (
                    <tr
                      key={transaction._id}
                      className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                        {transaction?.property?.title}
                      </td>
                      <td className="px-6 py-4">{transaction?.buyer?.name}</td>
                      <td className="px-6 py-4">${transaction.amount}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setIsView(true);
                          }}
                          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          aria-label="View transaction"
                        >
                          <FiEye className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      <Modal
        isOpen={isView}
        onRequestClose={() => setIsView(false)}
        style={customModalStyles}
        contentLabel="View Transaction"
      >
        {selectedTransaction && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Transaction Details
              </h2>
              <button
                onClick={() => setIsView(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FiX className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <FiHome className="w-4 h-4 text-gray-500" />
                <span className="text-gray-500 dark:text-gray-400">
                  Property:
                </span>
                <span className="font-semibold text-gray-800 dark:text-white">
                  {selectedTransaction?.property?.title}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <FiUser className="w-4 h-4 text-gray-500" />
                <span className="text-gray-500 dark:text-gray-400">Renter:</span>
                <span className="font-semibold text-gray-800 dark:text-white">
                  {selectedTransaction?.buyer?.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <FiDollarSign className="w-4 h-4 text-gray-500" />
                <span className="text-gray-500 dark:text-gray-400">Amount:</span>
                <span className="font-semibold text-gray-800 dark:text-white">
                  ${selectedTransaction.amount}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RentalTransactions;

