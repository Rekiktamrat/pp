import React from "react";

const ViewUser = ({ setIsView, selectedUser }) => {
  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-2xl shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">User Details</h2>
        <button
          onClick={() => setIsView(false)}
          className="text-gray-400 hover:text-gray-600 transition"
        >
          ✕
        </button>
      </div>

      {/* User Info */}
      <div className="space-y-3 text-sm text-gray-700">
        <div className="flex justify-between">
          <span className="font-medium">Name:</span>
          <span>{selectedUser?.name ?? "N/A"}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium">Email:</span>
          <span>{selectedUser?.email ?? "N/A"}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium">Phone:</span>
          <span>{selectedUser?.phone ?? "N/A"}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium">Role:</span>
          <span className="capitalize">{selectedUser?.role ?? "N/A"}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium">Mode:</span>
          <span>{selectedUser?.mode ?? "N/A"}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium">Status:</span>
          <span
            className={`px-2 py-0.5 rounded text-xs font-medium ${
              selectedUser?.status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {selectedUser?.status ?? "N/A"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium">Seller Tab:</span>
          <span
            className={`px-2 py-0.5 rounded text-xs font-medium ${
              selectedUser?.seller_tab === "active"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {selectedUser?.seller_tab === "active"
              ? "Verified Seller"
              : "Not Verified"}
          </span>
        </div>

        <div>
          <span className="font-medium">Preference:</span>
          <p className="mt-1 text-gray-600 text-sm">
            Mode: {selectedUser?.preference?.mode ?? "N/A"} | Language:{" "}
            {selectedUser?.preference?.language ?? "N/A"}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => setIsView(false)}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewUser;
