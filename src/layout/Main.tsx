import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { clearActiveUser, getActiveUser } from "../data/localStorage";
import type { UserModel } from "../data/localStorage";

function MainLayout() {
  const [objActiveUser, setActiveUser] = useState<UserModel | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const objData = getActiveUser();
    if (objData == null) {
      navigate("/login");
      return;
    }

    setActiveUser(objData);
  }, [navigate]);

  const handleLogout = () => {
    clearActiveUser();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  if (!objActiveUser) {
    // TODO: Implement a spinner here DONT FORGET okay
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex font-inter">
      {/* Sidebar */}
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header
          userName={objActiveUser.strName ?? "Unknown"}
          onLogout={handleLogout}
        />

        {/* Page Content */}
        <main className="flex-1 p-6 bg-dost-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
