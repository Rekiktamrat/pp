import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  FiUser,
  FiMail,
  FiLock,
  FiLogIn,
  FiAlertTriangle,
} from "react-icons/fi";
import { adminRegister } from "../../store/auth/authSlices";

const Signup = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate(); // For navigation

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const data = {
      name,
      email,
      password,
    };
    try {
      dispatch(adminRegister(data))
        .unwrap()
        .then(() => {
          navigate("/login");
        });
    } catch (error) {
      setError("Signup failed. Please try again.");
      console.error(error);
    }
  };

  const redirectToLogin = () => {
    // Redirect to the login page with a state to open Manager Login
    navigate("/login", { state: { isManager: true } });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create an Admin Account
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Get started by creating a new account.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-8">
          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30 p-3 rounded-lg flex items-center gap-3">
                <FiAlertTriangle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <p className="text-green-500 dark:text-green-400">{success}</p>
            )}

            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Full name"
                required
              />
            </div>

            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Email Address"
                required
              />
            </div>

            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Password"
                required
              />
            </div>

            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Confirm Password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gray-900 dark:bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-gray-800 dark:hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-blue-500 focus:ring-offset-2"
            >
              <FiLogIn />
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Already a user?{" "}
              <button
                onClick={redirectToLogin} // Navigate to the login page with Manager mode
                className="font-semibold text-blue-600 hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
