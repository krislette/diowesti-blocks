import { useState } from "react";
import imgDostLogo from "../assets/blocks.png";
import {
  addNewUser,
  isUserRegistered,
  type UserModel,
} from "../data/localStorage";

function Register() {
  const [objData, setData] = useState<UserModel>({
    strName: "",
    strEmail: "",
    strPassword: "",
  });

  const [strMessage, setMessage] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const strId = event.target.id;
    const strValue = event.target.value;
    setData({ ...objData, [strId]: strValue });
    setMessage("");
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // If fields are empty upon submit, just return
    if (
      objData.strName == "" ||
      objData.strEmail == "" ||
      objData.strPassword == ""
    ) {
      setMessage("Please complete the required fields.");
      return;
    }

    // Or if the user is already registered
    if (isUserRegistered(objData.strEmail)) {
      setMessage("User already exists.");
      return;
    }

    // Finally add the user after passing all checks
    addNewUser(objData);
    setMessage("User successfully created.");

    setData({
      strName: "",
      strEmail: "",
      strPassword: "",
    });
  };

  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-6 py-16 lg:px-8 font-inter">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="DOST Logo"
            src={imgDostLogo}
            className="mx-auto h-25 w-auto"
          />
          <h2 className="mt-8 text-center text-2xl/9 font-bold tracking-tight text-dost-black font-manrope">
            Create an account
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-4" onSubmit={handleFormSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  id="strName"
                  name="name"
                  type="text"
                  value={objData.strName}
                  onChange={handleInputChange}
                  required
                  className="block w-full rounded-md bg-dost-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-dost-blue sm:text-sm/6"
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
                  id="strEmail"
                  name="email"
                  type="email"
                  value={objData.strEmail}
                  onChange={handleInputChange}
                  required
                  autoComplete="email"
                  className="block w-full rounded-md bg-dost-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-dost-blue sm:text-sm/6"
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
                  id="strPassword"
                  name="password"
                  type="password"
                  value={objData.strPassword}
                  onChange={handleInputChange}
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-dost-blue sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-dost-blue px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-dost-blue-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dost-blue cursor-pointer"
              >
                Register
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
            <span className="text-dost-blue">
              {strMessage && <p>{strMessage}</p>}
            </span>
          </p>
        </div>
      </div>
    </>
  );
}

export default Register;
