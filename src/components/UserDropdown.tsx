import { useState, useRef, useEffect } from "react";
import { Users } from "lucide-react";
import Button from "./Button";

interface UserDropdownProps {
  name: string;
  role: string;
  onLogout: () => void;
}

function UserDropdown({ name, role, onLogout }: UserDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setOpen(!open)}
        className="cursor-pointer flex items-center justify-center"
      >
        <Users
          className="w-7 h-7 text-dost-black transition-colors"
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--color-dost-blue)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--color-dost-black)")
          }
        />
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <div className="px-4 py-2 text-sm text-gray-700">{name}</div>
          <div className="px-4 py-2 text-sm text-gray-500">{role}</div>
          <div className="px-4 py-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={onLogout}
            >
              LOGOUT
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDropdown;
