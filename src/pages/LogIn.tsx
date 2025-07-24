import { useState } from "react";
import imgDostLogo from "../assets/dost.png";
import { getUser, updateActiveUser } from "../data/localStorage";
import { useNavigate } from "react-router-dom";

interface LoginModel {
  strEmail: string;
  strPassword: string;
}

function LogIn() {
  const [objData, setData] = useState<LoginModel>({
    strEmail: "",
    strPassword: "",
  });
  const [strMessage, setMessage] = useState<string>("");
  const navigate = useNavigate();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const strId = event.target.id;
    const strValue = event.target.value;
    setData({ ...objData, [strId]: strValue });
    setMessage("");
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (objData.strEmail == "" || objData.strPassword == "") {
      setMessage("Please complete the required fields.");
      return;
    }

    const objUser = getUser(objData.strEmail, objData.strPassword);

    if (objUser == null) {
      setMessage("Username or password is not correct.");
      return;
    }

    updateActiveUser(objUser);
    navigate("/");
  };

  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-6 py-16 lg:px-8 font-noto">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="DOST Logo"
            src={imgDostLogo}
            className="mx-auto h-25 w-auto"
          />
          <h2 className="mt-8 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-20 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-4" onSubmit={handleFormSubmit}>
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
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="https://github.com/krislette/diowesti-blocks"
                    className="font-semibold text-dost-blue hover:text-dost-blue-dark"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
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
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm/6 text-gray-500">
            Need an account?{" "}
            <a
              href="/register"
              className="font-semibold text-dost-blue hover:text-dost-blue-dark"
            >
              Register
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

export default LogIn;
