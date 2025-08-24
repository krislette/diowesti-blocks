import { useState } from "react";
import { useNavigate } from "react-router-dom";
import imgDostLogo from "../assets/blocks.png";
import { apiService } from "../services/authService";
import { useAuth } from "../context/AuthContext";

interface LoginFormData {
  email: string;
  password: string;
}

function LogIn() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setMessage("");
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.email || !formData.password) {
      setMessage("Please complete all required fields.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      // Call API service directly for error messages
      await apiService.login(formData);

      // This updates the auth context
      await login(formData);

      setMessage("Login successful. Redirecting...");
      navigate("/dashboard");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Login failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-10 lg:px-8 font-inter">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="DOST Logo"
          src={imgDostLogo}
          className="mx-auto h-25 w-auto"
        />
        <h2 className="mt-4 text-center text-2xl/9 font-bold tracking-tight text-dost-black font-manrope">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-22 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-3" onSubmit={handleFormSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Email
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                autoComplete="email"
                className="block w-full rounded-md bg-dost-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-dost-blue sm:text-sm/6 disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                autoComplete="current-password"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-dost-blue sm:text-sm/6 disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full justify-center rounded-md bg-dost-blue px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-dost-blue-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dost-blue cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm/6 text-gray-500">
          Don't have an account?{" "}
          <a
            href="/register"
            className="font-semibold text-dost-blue hover:text-dost-blue-dark"
          >
            Create one here
          </a>
        </p>

        {message && (
          <div
            className={`mt-4 text-center text-sm font-semibold ${
              message.includes("successfully")
                ? "text-dost-blue"
                : "text-dost-black"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default LogIn;
