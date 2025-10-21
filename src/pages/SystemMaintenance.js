import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCleanupStatus,
  updateCleanupConfig,
  runManualCleanup,
  getCleanupStats,
  clearError,
} from "../store/setting/settingSlice"; // Corrected import path

import settingService from "../store/setting/settingService";

const CleanupConfigCard = ({
  type,
  title,
  config,
  stats,
  isUpdating,
  isRunningCleanup,
}) => {
  const dispatch = useDispatch();
  const [localConfig, setLocalConfig] = useState({
    enabled: false,
    retentionDays: 90,
    schedule: "0 3 * * *",
  });
  const [scheduleOptions] = useState(settingService.getScheduleOptions());
  const [customSchedule, setCustomSchedule] = useState("");

  useEffect(() => {
    if (config) {
      setLocalConfig({
        enabled: config.enabled || false,
        retentionDays: config.retentionDays || 90,
        schedule: config.schedule || "0 3 * * *",
      });
      setCustomSchedule(
        scheduleOptions.find((opt) => opt.value === config.schedule)
          ? ""
          : config.schedule || ""
      );
    }
  }, [config, scheduleOptions]);

  const handleConfigChange = (field, value) => {
    setLocalConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleScheduleChange = (value) => {
    if (value === "custom") return;
    handleConfigChange("schedule", value);
    setCustomSchedule("");
  };

  const handleCustomScheduleChange = (value) => {
    setCustomSchedule(value);
    if (value && settingService.validateCronExpression(value).isValid) {
      handleConfigChange("schedule", value);
    }
  };

  const handleSaveConfig = () => {
    dispatch(updateCleanupConfig({ type, config: localConfig }));
  };

  const handleManualCleanup = () => {
    dispatch(runManualCleanup(type));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (config) => {
    if (!config)
      return (
        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
          Unknown
        </span>
      );
    if (config.enabled && config.isRunning) {
      return (
        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
          Active
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
          Disabled
        </span>
      );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>
        {getStatusBadge(config)}
      </div>
      <div className="space-y-6">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-300">
            Enable Automatic Cleanup
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={localConfig.enabled}
              onChange={(e) => handleConfigChange("enabled", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Retention Period */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Retention Period (days)
          </label>
          <input
            type="number"
            min="1"
            max="365"
            value={localConfig.retentionDays}
            onChange={(e) =>
              handleConfigChange("retentionDays", parseInt(e.target.value))
            }
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Records older than this will be deleted. (1-365 days)
          </p>
        </div>

        {/* Schedule */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Cleanup Schedule
          </label>
          <select
            value={
              scheduleOptions.find((opt) => opt.value === localConfig.schedule)
                ?.value || "custom"
            }
            onChange={(e) => handleScheduleChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            {scheduleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {(scheduleOptions.find((opt) => opt.value === localConfig.schedule)
            ?.value === "custom" ||
            !scheduleOptions.find(
              (opt) => opt.value === localConfig.schedule
            )) && (
            <div className="mt-2">
              <input
                type="text"
                placeholder="Enter cron expression (e.g., 0 3 * * *)"
                value={customSchedule}
                onChange={(e) => handleCustomScheduleChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              />
            </div>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Current: {settingService.parseCronExpression(localConfig.schedule)}
          </p>
        </div>

        {/* Last Run Info */}
        <div className="text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
          <p>
            <span className="font-medium">Last Run:</span>{" "}
            {formatDate(config?.lastRun)}
          </p>
          <p>
            <span className="font-medium">Last Run Result:</span>{" "}
            {config?.lastRunResult?.message || "N/A"}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={handleSaveConfig}
            disabled={isUpdating}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isUpdating ? "Saving..." : "Save Configuration"}
          </button>
          <button
            onClick={handleManualCleanup}
            disabled={isRunningCleanup}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
          >
            {isRunningCleanup ? "Running..." : "Run Cleanup Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

const SystemMaintenance = () => {
  const dispatch = useDispatch();
  const { configs, stats, isLoading, isUpdating, isRunningCleanup, error } =
    useSelector((state) => state.setting);

  useEffect(() => {
    dispatch(getAllCleanupStatus());
    dispatch(getCleanupStats());
  }, [dispatch]);

  if (isLoading && !configs?.searchHistory) {
    return <div className="text-center p-10">Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        System Maintenance
      </h1>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <span
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => dispatch(clearError())}
          >
            <svg
              className="fill-current h-6 w-6 text-red-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </span>
        </div>
      )}

      {/* Statistics */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Data Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow col-span-1">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Search Records
            </h3>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {stats.searchHistory?.count ?? "..."}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow col-span-1">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Oldest Search
            </h3>
            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
              {stats.searchHistory?.oldestDate ?? "..."}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow col-span-1">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Notification Records
            </h3>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {stats.notificationHistory?.count ?? "..."}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow col-span-1">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Oldest Notification
            </h3>
            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
              {stats.notificationHistory?.oldestDate ?? "..."}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow col-span-1">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Rejected Properties
            </h3>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {stats.staleRejectedProperties?.count ?? "..."}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow col-span-1">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Oldest Rejection
            </h3>
            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
              {stats.staleRejectedProperties?.oldestDate ?? "..."}
            </p>
          </div>
        </div>
      </div>

      {/* Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CleanupConfigCard
          type="searchHistory"
          title="Search History Cleanup"
          config={configs.searchHistory}
          stats={stats.searchHistory}
          isUpdating={isUpdating}
          isRunningCleanup={isRunningCleanup}
        />
        <CleanupConfigCard
          type="notificationHistory"
          title="Notification History Cleanup"
          config={configs.notificationHistory}
          stats={stats.notificationHistory}
          isUpdating={isUpdating}
          isRunningCleanup={isRunningCleanup}
        />
        <CleanupConfigCard
          type="staleRejectedProperties"
          title="Stale Rejected Properties Cleanup"
          config={configs.staleRejectedProperties}
          stats={stats.staleRejectedProperties}
          isUpdating={isUpdating}
          isRunningCleanup={isRunningCleanup}
        />
      </div>
    </div>
  );
};

export default SystemMaintenance;
