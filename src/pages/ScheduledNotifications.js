import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllScheduledNotifications,
  createScheduledNotification,
  updateScheduledNotification,
  deleteScheduledNotification,
  runManualScheduledNotification,
} from "../store/notification/scheduledNotificationSlice";
import { Plus, Edit, Trash2, PlayCircle, MoreVertical, X } from "lucide-react";
import settingService from "../store/setting/settingService"; // Re-using cron helpers

const ScheduledNotifications = () => {
  const dispatch = useDispatch();
  const { jobs, isLoading, isSubmitting } = useSelector(
    (state) => state.scheduledNotification
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);

  useEffect(() => {
    dispatch(getAllScheduledNotifications());
  }, [dispatch]);

  const openModal = (job = null) => {
    setCurrentJob(
      job || {
        name: "",
        title: "",
        body: "",
        schedule: "0 9 * * *",
        enabled: true,
      }
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentJob(null);
  };

  const handleSave = (formData) => {
    if (formData._id) {
      dispatch(
        updateScheduledNotification({ id: formData._id, data: formData })
      );
    } else {
      dispatch(createScheduledNotification(formData));
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this scheduled job?")) {
      dispatch(deleteScheduledNotification(id));
    }
  };

  const handleRunManual = (id) => {
    if (
      window.confirm(
        "Are you sure you want to manually run this job now? This will send a notification to all users."
      )
    ) {
      dispatch(runManualScheduledNotification(id));
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Scheduled Notifications
        </h1>
        <button
          onClick={() => openModal()}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Scheduled Notification
        </button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Name / Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Last Run
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {job.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {job.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {job.enabled ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Enabled
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Disabled
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {settingService.parseCronExpression(job.schedule)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {job.lastRun
                      ? new Date(job.lastRun).toLocaleString()
                      : "Never"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleRunManual(job._id)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                      title="Run Now"
                    >
                      <PlayCircle className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => openModal(job)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                      title="Edit"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <JobModal
          job={currentJob}
          onClose={closeModal}
          onSave={handleSave}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

const JobModal = ({ job, onClose, onSave, isSubmitting }) => {
  const [formData, setFormData] = useState(job);
  const [scheduleOptions] = useState(settingService.getScheduleOptions());

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full mx-4 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {job._id ? "Edit" : "Create"} Scheduled Notification
          </h2>
          <button onClick={onClose}>
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full input-style"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full input-style"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Body</label>
            <textarea
              name="body"
              value={formData.body}
              onChange={handleChange}
              required
              rows="3"
              className="mt-1 block w-full input-style"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium">Schedule</label>
            <select
              name="schedule"
              value={formData.schedule}
              onChange={handleChange}
              className="mt-1 block w-full input-style"
            >
              {scheduleOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} ({opt.value})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Current: {settingService.parseCronExpression(formData.schedule)}
            </p>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="enabled"
              checked={formData.enabled}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm">Enabled</label>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduledNotifications;
