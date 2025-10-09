import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	sendNotification,
	sendAutomaticNotification,
	getNotifications,
	reset,
} from "../store/notification/notificationSlice";
import axios from "axios";
import { base_url } from "../api/axiosConfig";

const NotificationPage = () => {
	const dispatch = useDispatch();
	const { notifications, isLoading, isSuccess, isError, message } = useSelector((state) => state.notification);
	const [tab, setTab] = useState("manual");
	const [type, setType] = useState("info");
	const [title, setTitle] = useState("");
	const [msg, setMsg] = useState("");
	const [schedule, setSchedule] = useState("");
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [users, setUsers] = useState([]);
	const [autoTitle, setAutoTitle] = useState("");
	const [autoMsg, setAutoMsg] = useState("");

	// Fetch users from backend (replace endpoint as needed)
	useEffect(() => {
		async function fetchUsers() {
			try {
				const token = localStorage.getItem("token");
				const res = await axios.get(`${base_url}/admin/users`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setUsers(res.data);
			} catch (err) {
				setUsers([]);
			}
		}
		fetchUsers();
	}, []);

	// Fetch notifications from backend
	useEffect(() => {
		dispatch(getNotifications());
		return () => { dispatch(reset()); };
	}, [dispatch]);

	// Manual notification
	const handleManualSend = () => {
		if (!title || !msg || selectedUsers.length === 0) return;
		dispatch(sendNotification({ type, title, message: msg, users: selectedUsers, scheduledTime: schedule }));
	};

	// Automatic notification (custom)
	const handleAutoSend = () => {
		if (!autoTitle || !autoMsg) return;
		dispatch(sendAutomaticNotification({ type: "info", title: autoTitle, message: autoMsg, users: "all" }));
	};

	// Automatic notification (quick)
	const handleQuickAuto = (quickType) => {
		let quick = { type: "info", title: "", message: "", users: "all" };
		if (quickType === "welcome") quick = { type: "success", title: "Welcome", message: "Welcome to our platform!", users: "all" };
		if (quickType === "inactive") quick = { type: "warning", title: "Inactive Alert", message: "You haven't logged in recently.", users: "all" };
		if (quickType === "promotion") quick = { type: "info", title: "Promotion", message: "Check out our latest offers!", users: "all" };
		dispatch(sendAutomaticNotification(quick));
	};

	// User selection
	const toggleUser = (id) => {
		setSelectedUsers((prev) => prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]);
	};
	const selectAll = () => setSelectedUsers(users.map((u) => u._id));
	const deselectAll = () => setSelectedUsers([]);

	// UI helpers
	const typeColors = {
		info: "bg-blue-100 text-blue-800",
		success: "bg-green-100 text-green-800",
		warning: "bg-yellow-100 text-yellow-800",
		error: "bg-red-100 text-red-800",
	};

	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold mb-2 text-gray-800">Admin Notifications</h1>
				<p className="mb-8 text-gray-600">Send manual or automatic notifications to users.</p>

				<div className="flex space-x-4 mb-6">
					<button className={`px-4 py-2 rounded-t-lg font-medium ${tab === "manual" ? "bg-white shadow text-blue-600" : "bg-gray-100 text-gray-500"}`} onClick={() => setTab("manual")}>Manual</button>
					<button className={`px-4 py-2 rounded-t-lg font-medium ${tab === "automatic" ? "bg-white shadow text-green-600" : "bg-gray-100 text-gray-500"}`} onClick={() => setTab("automatic")}>Automatic</button>
					<button className={`px-4 py-2 rounded-t-lg font-medium ${tab === "active" ? "bg-white shadow text-purple-600" : "bg-gray-100 text-gray-500"}`} onClick={() => setTab("active")}>Active</button>
				</div>

				{/* Feedback */}
				{(isLoading || isSuccess || isError) && (
					<div className="mb-4">
						{isLoading && <div className="text-blue-500">Sending...</div>}
						{isSuccess && <div className="text-green-500">Notification sent!</div>}
						{isError && <div className="text-red-500">Error: {message}</div>}
					</div>
				)}

				{/* Manual Notification Tab */}
				{tab === "manual" && (
					<div className="bg-white rounded-lg shadow p-6">
						<h2 className="text-xl font-semibold mb-4 text-gray-800">Send Manual Notification</h2>
						<div className="mb-4">
							<label className="block mb-2 text-gray-700">Type</label>
							<div className="flex space-x-2">
								{Object.keys(typeColors).map((t) => (
									<button key={t} className={`px-4 py-2 rounded capitalize ${type === t ? typeColors[t] : "bg-gray-100 text-gray-700"}`} onClick={() => setType(t)}>{t}</button>
								))}
							</div>
						</div>
						<div className="mb-4">
							<label className="block mb-2 text-gray-700">Title</label>
							<input type="text" className="w-full border px-4 py-2 rounded" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Notification title" />
						</div>
						<div className="mb-4">
							<label className="block mb-2 text-gray-700">Message</label>
							<textarea className="w-full border px-4 py-2 rounded" rows={3} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Notification message" />
						</div>
						<div className="mb-4">
							<label className="block mb-2 text-gray-700">Schedule (optional)</label>
							<input type="datetime-local" className="w-full border px-4 py-2 rounded" value={schedule} onChange={(e) => setSchedule(e.target.value)} />
						</div>
						<div className="mb-4">
							<div className="flex justify-between items-center mb-2">
								<label className="block text-gray-700">Select Users</label>
								<div className="space-x-2">
									<button className="text-sm text-blue-600 hover:underline" onClick={selectAll}>All</button>
									<button className="text-sm text-blue-600 hover:underline" onClick={deselectAll}>None</button>
								</div>
							</div>
							<div className="border rounded divide-y max-h-40 overflow-y-auto">
								{users.length === 0 ? (
									<div className="p-2 text-gray-500">No users found.</div>
								) : (
									users.map((u) => (
										<div key={u._id} className={`p-2 flex items-center cursor-pointer hover:bg-gray-50 ${selectedUsers.includes(u._id) ? "bg-blue-50" : ""}`} onClick={() => toggleUser(u._id)}>
											<div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${selectedUsers.includes(u._id) ? "bg-blue-500 border-blue-500" : "border-gray-300"}`}>{selectedUsers.includes(u._id) && <span className="text-white text-sm">✓</span>}</div>
											<div>
												<div className="font-medium">{u.name}</div>
												<div className="text-sm text-gray-500">{u.email}</div>
											</div>
										</div>
									))
								)}
							</div>
						</div>
						<button className="w-full bg-blue-600 text-white py-3 rounded font-medium hover:bg-blue-700" onClick={handleManualSend} disabled={isLoading}>Send Notification</button>
					</div>
				)}

				{/* Automatic Notification Tab */}
				{tab === "automatic" && (
					<div className="bg-white rounded-lg shadow p-6">
						<h2 className="text-xl font-semibold mb-4 text-gray-800">Automatic Notifications</h2>
						<div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
							<button className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-green-50" onClick={() => handleQuickAuto("welcome")} disabled={isLoading}><span>Welcome Message</span><span>👋</span></button>
							<button className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-yellow-50" onClick={() => handleQuickAuto("inactive")} disabled={isLoading}><span>Notify Inactive</span><span>💤</span></button>
							<button className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-blue-50" onClick={() => handleQuickAuto("promotion")} disabled={isLoading}><span>Promotion</span><span>🎉</span></button>
						</div>
						<div className="mb-4 border-t pt-4">
							<h3 className="font-semibold mb-2 text-gray-700">Custom System Notification</h3>
							<input type="text" className="w-full border px-4 py-2 rounded mb-2" value={autoTitle} onChange={(e) => setAutoTitle(e.target.value)} placeholder="Title" />
							<textarea className="w-full border px-4 py-2 rounded mb-2" rows={2} value={autoMsg} onChange={(e) => setAutoMsg(e.target.value)} placeholder="Message" />
							<button className="w-full bg-green-600 text-white py-2 rounded font-medium hover:bg-green-700" onClick={handleAutoSend} disabled={isLoading}>Send System Notification</button>
						</div>
					</div>
				)}

				{/* Active Notifications Tab */}
				{tab === "active" && (
					<div className="bg-white rounded-lg shadow p-6">
						<h2 className="text-xl font-semibold mb-4 text-gray-800">Active Notifications</h2>
						<div className="space-y-4">
							{notifications.length === 0 ? (
								<div className="p-2 text-gray-500">No notifications found.</div>
							) : (
								notifications.map((n) => (
									<div key={n._id} className="border rounded-lg p-4">
										<div className="flex items-start">
											<span className="text-xl mr-3">{n.type === "success" ? "✅" : n.type === "warning" ? "⚠️" : n.type === "error" ? "❌" : "ℹ️"}</span>
											<div>
												<h3 className="font-medium">{n.title}</h3>
												<p className="text-gray-600">{n.message}</p>
												<p className="text-sm text-gray-500 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
											</div>
										</div>
									</div>
								))
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default NotificationPage;
