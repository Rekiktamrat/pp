import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../store/auth/authSlices";
import {
  FiEdit2,
  FiSave,
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState({
    personal: false,
    address: false,
  });

  const [profile, setProfile] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || "User",
    dob: user?.dob || "",
    country: user?.country || "",
    city: user?.city || "",
    postalCode: user?.postalCode || "",
    avatar: user?.avatar || "/default-avatar.png",
  });

  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleSubmit = (section) => {
    dispatch(updateProfile(profile));
    setIsEditing({ ...isEditing, [section]: false });
  };

  return (
    <div className="pt-24 px-4 md:px-6 pb-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="relative">
            <img
              src={profile.avatar}
              alt="Avatar"
              className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
            />
            <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              <FiEdit2 className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{`${profile.firstName} ${profile.lastName}`}</h2>
            <p className="text-gray-500 dark:text-gray-400">{profile.role}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center justify-center sm:justify-start gap-1.5">
              <FiMapPin className="w-4 h-4" />
              {profile.city}, {profile.country}
            </p>
          </div>
        </div>

      {/* Personal Info Section */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Personal Information
            </h3>
            {!isEditing.personal && (
              <button
                onClick={() => setIsEditing({ ...isEditing, personal: true })}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-blue-600 bg-blue-100 dark:bg-blue-900/50 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors"
              >
                <FiEdit2 className="w-4 h-4" /> Edit
              </button>
            )}
          </div>

        {!isEditing.personal ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <InfoItem label="First Name" value={profile.firstName} />
              <InfoItem label="Last Name" value={profile.lastName} />
              <InfoItem label="Date of Birth" value={profile.dob} />
              <InfoItem label="Email Address" value={profile.email} icon={<FiMail />} />
              <InfoItem label="Phone Number" value={profile.phone} icon={<FiPhone />} />
              <InfoItem label="Role" value={profile.role} icon={<FiUser />} />
            </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit("personal");
            }}
            className="space-y-4"
          >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="First Name" type="text" value={profile.firstName} onChange={(e) => handleChange("firstName", e.target.value)} />
                <FormInput label="Last Name" type="text" value={profile.lastName} onChange={(e) => handleChange("lastName", e.target.value)} />
                <FormInput label="Date of Birth" type="date" value={profile.dob} onChange={(e) => handleChange("dob", e.target.value)} />
                <FormInput label="Email Address" type="email" value={profile.email} onChange={(e) => handleChange("email", e.target.value)} />
                <FormInput label="Phone Number" type="text" value={profile.phone} onChange={(e) => handleChange("phone", e.target.value)} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsEditing({ ...isEditing, personal: false })} className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50" disabled={loading}>
                  <FiSave className="w-4 h-4" />
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
          </form>
        )}
      </div>

      {/* Address Section */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Address</h3>
            {!isEditing.address && (
              <button
                onClick={() => setIsEditing({ ...isEditing, address: true })}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-blue-600 bg-blue-100 dark:bg-blue-900/50 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors"
              >
                <FiEdit2 className="w-4 h-4" /> Edit
              </button>
            )}
          </div>

        {!isEditing.address ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <InfoItem label="Country" value={profile.country} />
              <InfoItem label="City" value={profile.city} />
              <InfoItem label="Postal Code" value={profile.postalCode} />
            </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit("address");
            }}
            className="space-y-4"
          >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="Country" type="text" value={profile.country} onChange={(e) => handleChange("country", e.target.value)} />
                <FormInput label="City" type="text" value={profile.city} onChange={(e) => handleChange("city", e.target.value)} />
                <FormInput label="Postal Code" type="text" value={profile.postalCode} onChange={(e) => handleChange("postalCode", e.target.value)} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsEditing({ ...isEditing, address: false })} className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50" disabled={loading}>
                  <FiSave className="w-4 h-4" />
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
          </form>
        )}
      </div>
      </div>
    </div>
  );
};

// Helper component for displaying info items
const InfoItem = ({ label, value, icon }) => (
  <div>
    <label className="text-xs text-gray-500 dark:text-gray-400">{label}</label>
    <p className="flex items-center gap-2 text-gray-800 dark:text-gray-200 font-medium">
      {icon}
      {value || "N/A"}
    </p>
  </div>
);

// Helper component for form inputs
const FormInput = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    />
  </div>
);

export default Profile;
