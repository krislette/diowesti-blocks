import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Clock,
  Home,
  BookOpenCheck,
  LibraryBig,
  Bell,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import Card from "../components/Card";
import StatusBadge from "../components/StatusBadge";
import Table from "../components/Table";
import Dropdown from "../components/Dropdown";
import UserDropdown from "../components/UserDropdown";

import { complianceData } from "../data/complianceData";
import { auditData } from "../data/auditData";
import { complianceRatings } from "../data/complianceRatings";
import { unaddressedFindings } from "../data/unaddressedFindings";

import type { UserModel } from "../data/localStorage";
import { clearActiveUser, getActiveUser } from "../data/localStorage";
import imgDostLogo from "../assets/dost.png";

// Color scheme
const colors = {
  "dost-blue": "#48c4d3",
  "dost-white": "#fff",
  "dost-black": "#222222",
};

function Dashboard() {
  const [objActiveUser, setActiveUser] = useState<UserModel>();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAuditArea, setSelectedAuditArea] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const objData = getActiveUser();
    if (objData == null) {
      navigate("/login");
    }

    setActiveUser(objData);
  }, []);

  const handleLogout = () => {
    clearActiveUser();
    navigate("login");
  };

  const auditTableHeaders = [
    "Auditee",
    "Entry",
    "Exit",
    "For Mgmt Action",
    "Date of Notice",
    "Deadline",
    "Action Remarks",
    "No. of Unaddressed IA Findings",
    "No. of CLOSED IA Findings",
    "Date of Closing Letter",
    "Presentation to Secretary",
    "Compliance Rate (%)",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-dost-white shadow-sm">
        <div className="px-6 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="sm:mx-auto sm:w-full sm:max-w-sm flex items-center gap-4">
                <img
                  alt="DOST Logo"
                  src={imgDostLogo}
                  className="h-10 w-auto"
                />
                <span className="text-sm font-medium text-gray-700 border border-gray-300 px-2 py-2 rounded">
                  Internal Audit Information Management System
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-8">
                <Home className="w-7 h-7 text-dost-black cursor-pointer" />
                <BookOpenCheck className="w-7 h-7 text-dost-black cursor-pointer" />
                <LibraryBig className="w-7 h-7 text-dost-black cursor-pointer" />
                <Bell className="w-7 h-7 text-dost-black cursor-pointer" />
                <Clock className="w-7 h-7 text-dost-black cursor-pointer" />
                <UserDropdown
                  name={objActiveUser?.strName ?? "Unknown"}
                  role="Administrator"
                  onLogout={handleLogout}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center space-x-4 ml-14">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-1 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dost-blue"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6 space-y-6 bg-dost-white">
        {/* Audit Conference Section */}
        <Table headers={auditTableHeaders} data={auditData} />

        {/* Charts and Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Compliance Rate Chart */}
          <Card title="Internal Audit Findings Compliance Rates">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={complianceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" tick={{ fill: colors["dost-black"] }} />
                  <YAxis tick={{ fill: colors["dost-black"] }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke={colors["dost-blue"]}
                    strokeWidth={2}
                    dot={{ fill: colors["dost-blue"], strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Unaddressed Findings */}
          <Card title="Unaddressed IA Findings">
            <div className="mb-4 flex justify-between items-center">
              <Dropdown
                options={[
                  { label: "All Areas", value: "all" },
                  { label: "Audit Area", value: "audit" },
                ]}
                value={selectedAuditArea}
                onChange={(e) => setSelectedAuditArea(e.target.value)}
                placeholder="Audience"
                className="w-80 mb-0"
              />
              <Dropdown
                options={[
                  { label: "All Areas", value: "all" },
                  { label: "Specific Area", value: "specific" },
                ]}
                value=""
                onChange={() => {}}
                placeholder="Audit Area"
                className="w-80 mb-0"
              />
            </div>

            <div className="space-y-3">
              {unaddressedFindings.map((finding, index) => (
                <div key={index} className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium">
                      {finding.deadline}
                    </span>
                    <StatusBadge
                      status={finding.status}
                      color={finding.status === "Open" ? "green" : "blue"}
                    />
                  </div>
                  <p className="text-sm text-gray-600">{finding.finding}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar/Schedule */}
          <Card title="August 2019">
            <div className="bg-blue-50 p-4 rounded">
              <div className="grid grid-cols-7 gap-1 text-xs text-center mb-2">
                <div className="font-medium">Sun</div>
                <div className="font-medium">Mon</div>
                <div className="font-medium">Tue</div>
                <div className="font-medium">Wed</div>
                <div className="font-medium">Thu</div>
                <div className="font-medium">Fri</div>
                <div className="font-medium">Sat</div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-xs">
                {Array.from({ length: 31 }, (_, i) => (
                  <div
                    key={i}
                    className={`p-1 text-center ${
                      i === 12 || i === 20
                        ? "bg-dost-blue text-white rounded"
                        : ""
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-2">
                <div className="bg-dost-blue-dark text-white p-2 rounded text-xs">
                  Planning Exercise Prep
                </div>
                <div className="bg-dost-blue text-white p-2 rounded text-xs">
                  Mid-year Review
                </div>
              </div>
            </div>
          </Card>

          {/* News & Updates */}
          <Card title="News & Updates">
            <div className="space-y-3">
              <div className="border-l-4 border-dost-blue-dark pl-3">
                <h4 className="text-sm font-medium">
                  Strategic Planning Meeting
                </h4>
                <p className="text-xs text-gray-600">
                  21st August 2017 | 1:30 PM - 5:00 PM
                </p>
                <p className="text-xs text-gray-600">
                  Strategic meeting for planning the next department activities.
                  All top-level staff required.
                </p>
              </div>

              <div className="border-l-4 border-green-300 pl-3">
                <h4 className="text-sm font-medium">Announcement</h4>
                <p className="text-xs text-gray-600">
                  Technology Transfer and Commercialization of DOSTVI in line
                  with Republic Act (RA) 8749...
                </p>
              </div>

              <div className="border-l-4 border-orange-300 pl-3">
                <h4 className="text-sm font-medium">ITDI Symposium 2025</h4>
                <p className="text-xs text-gray-600">
                  12th March 2025 | 10:00 AM - 12:00 PM
                </p>
                <p className="text-xs text-gray-600">
                  A symposium on innovations and research breakthroughs
                  organized by ITDI. Open to the public.
                </p>
              </div>

              <div className="border-l-4 border-red-300 pl-3">
                <h4 className="text-sm font-medium">
                  System Maintenance Notice
                </h4>
                <p className="text-xs text-gray-600">
                  5th April 2025 | 8:00 PM - 12:00 AM
                </p>
                <p className="text-xs text-gray-600">
                  The internal network will be undergoing scheduled maintenance.
                  Please save all work beforehand.
                </p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-6">
            {/* Compliance Ratings */}
            <Card title="Compliance Ratings">
              <div className="space-y-3">
                {complianceRatings.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm font-medium">{item.name}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-81 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${item.value}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">
                        {item.value}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Auditor Ratings */}
            <Card title="Auditor Ratings">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-dost-blue rounded-full flex items-center justify-center text-white text-sm font-medium">
                    A
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      Acelle Krislette L. Rosales
                    </div>
                    <div className="text-xs text-dost-black">STUDENT</div>
                  </div>
                </div>
                <div className="flex items-center space-x-1 ml-8">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div
                      key={star}
                      className={`w-8 h-8 ${
                        star <= 3 ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      ★
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
