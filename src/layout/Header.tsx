import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import UserDropdown from "../components/UserDropdown";
import imgDostLogo from "../assets/blocks.png";

function Header() { 
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header
      className={`bg-dost-white sticky top-0 z-50 transition-shadow ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm flex items-center gap-4">
              <img alt="DOST Logo" src={imgDostLogo} className="h-10 w-auto" />
              <span className="text-sm border border-gray-300 px-4 py-2 rounded text-dost-black font-manrope font-[700] whitespace-nowrap">
                Internal Audit Information Management System
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-8">
              <Bell
                className="w-7 h-7 cursor-pointer transition-colors text-dost-black"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--color-dost-blue)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--color-dost-black)")
                }
              />
              <UserDropdown
                name={user?.name || "User"}
                role="Administrator"
                onLogout={handleLogout}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
