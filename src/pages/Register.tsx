import { useState } from "react";
import { apiService } from "../services/api";
import imgDostLogo from "../assets/blocks.png";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

function Register() {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [message, setMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setMessage("");
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Basic form validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.password_confirmation
    ) {
      setMessage("Please complete all required fields.");
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setMessage("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      return;
    }

    setIsSubmitting(true);

    try {
      await apiService.registerOnly(formData);
      setMessage("Account created successfully. You can now log in.");

      setFormData({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
      });
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again."
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
          Create an account
        </h2>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-3" onSubmit={handleFormSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Name
            </label>
            <div className="mt-2">
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                className="block w-full rounded-md bg-dost-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-dost-blue sm:text-sm/6 disabled:opacity-50"
              />
            </div>
          </div>

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
                autoComplete="new-password"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-dost-blue sm:text-sm/6 disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password_confirmation"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Confirm Password
            </label>
            <div className="mt-2">
              <input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                value={formData.password_confirmation}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                autoComplete="new-password"
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
              {isSubmitting ? "Creating Account..." : "Register"}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm/6 text-gray-500">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold text-dost-blue hover:text-dost-blue-dark"
          >
            Sign in
          </a>
        </p>

        {message && (
          <div
            className={`mt-4 text-center text-sm font-semibold ${
              message.includes("successfully")
                ? "text-dost-blue"
                : "text-dots-black"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default Register;
