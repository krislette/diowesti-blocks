import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  BookOpenCheck,
  LibraryBig,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import imgDostLogo from "../assets/blocks.png";

interface SidebarItem {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  path: string;
}

const sidebarItems: SidebarItem[] = [
  {
    icon: Home,
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: BookOpenCheck,
    label: "Audit",
    path: "/audit",
  },
  {
    icon: LibraryBig,
    label: "Library",
    path: "/library",
  },
  {
    icon: HelpCircle,
    label: "Help",
    path: "/help",
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <aside
      className={`${
        isCollapsed ? "w-16" : "w-64"
      } bg-dost-blue h-screen transition-all duration-300 top-0 sticky border-r-3 border-dost-blue`}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-5 bg-white border border-gray-300 rounded-full p-1 cursor-pointer text-dost-blue"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* Logo Section */}
      <div className="p-4 border-b border-dost-blue/30 bg-dost-white">
        <div className="flex items-center space-x-3">
          <img
            alt="DOST Logo"
            src={imgDostLogo}
            className="h-8 w-auto flex-shrink-0"
          />
          {!isCollapsed && (
            <span className="font-[1000] truncate text-dost-black font-manrope">
              DOST IAIMS
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6">
        <div className={`${isCollapsed ? "px-2" : "px-4"} space-y-2`}>
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center cursor-pointer 
                  ${isCollapsed ? "justify-center px-2" : "space-x-3 px-4"}
                  py-3 text-left rounded-lg transition-all duration-200
                  ${
                    isActive
                      ? "bg-white text-dost-blue font-bold"
                      : "hover:bg-dost-blue/70 text-white"
                  }
                `}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 ${
                    isActive ? "text-dost-blue" : "text-white"
                  }`}
                />
                {!isCollapsed && (
                  <span
                    className={`text-sm truncate ${
                      isActive ? "font-bold text-dost-blue" : "text-white"
                    }`}
                  >
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
