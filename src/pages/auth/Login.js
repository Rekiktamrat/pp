import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useDispatch, useSelector } from "react-redux";
import { FiMail, FiLock, FiLogIn, FiAlertTriangle } from "react-icons/fi";
import { adminLogin } from "../../store/auth/authSlices";

const Login = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { isSuccess } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    dispatch(
      adminLogin({
        email,
        password,
      })
      // .then(navigate("/admin/user-management"))
    );
  };

  // Redirect to sign-up page
  const handleSignUp = () => {
    navigate("/signup"); // Redirect to Signup page
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/admin/user-management");
    }
  }, [isSuccess]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Panel
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Please sign in to continue
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-8">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30 p-3 rounded-lg mb-6 flex items-center gap-3">
              <FiAlertTriangle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="•••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gray-900 dark:bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-gray-800 dark:hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-blue-500 focus:ring-offset-2"
            >
              <FiLogIn />
              Sign In
            </button>
          </form>

          <div className="mt-4 text-center"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
