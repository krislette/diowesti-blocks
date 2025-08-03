import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { libraryData } from "../data/libraryData";
import type { TabKey } from "../data/libraryData";
import Table from "../components/Table";
import TreeNode from "../components/TreeNode";
import NumberedTreeNode from "../components/NumberedTreeNode";

const tabs = [
  { key: "agencies" as TabKey, label: "Agencies" },
  { key: "auditors" as TabKey, label: "Auditors" },
  { key: "auditAreas" as TabKey, label: "Audit Areas" },
  { key: "auditCriteria" as TabKey, label: "Audit Criteria" },
  { key: "typesOfAudit" as TabKey, label: "Types of Audit" },
  { key: "internalControls" as TabKey, label: "Internal Controls" },
  { key: "documentTypes" as TabKey, label: "Types of Document" },
  { key: "userAccounts" as TabKey, label: "User Accounts" },
];

function Library() {
  const [activeTab, setActiveTab] = useState<TabKey>("agencies");
  const [searchTerm, setSearchTerm] = useState("");

  const currentData = libraryData[activeTab];
  const entriesCount = currentData.length;

  const formatDataForTable = (data: any[], tabKey: TabKey) => {
    if (tabKey === "auditAreas") {
      // Audit areas will be rendered differently since this shis not a table
      return [];
    }

    if (tabKey === "agencies") {
      return data.map((agency) => ({
        name: (
          <div className="flex items-center">
            <div className="w-8 h-8 bg-dost-blue rounded mr-3 flex items-center justify-center">
              <span className="text-dost-white text-sm font-bold">
                {agency.name.charAt(0)}
              </span>
            </div>
            <span className="text-dost-black">{agency.name}</span>
          </div>
        ),
        contactDetails: (
          <div className="text-dost-black whitespace-pre-line">
            {agency.contactDetails}
          </div>
        ),
        headOfAgencyPosition: (
          <div className="text-dost-black">
            <div className="font-medium">{agency.headOfAgency}</div>
            <div className="text-sm text-gray-600">{agency.position}</div>
          </div>
        ),
        classificationGroup: agency.classificationGroup,
      }));
    }

    if (tabKey === "userAccounts") {
      return data.map((user) => ({
        name: user.name,
        agency: user.agency,
        emailAddress: user.emailAddress,
        levelOfAccess: (
          <span className="text-dost-black">
            {user.levelOfAccess.includes("inactive") ? (
              <>
                {user.levelOfAccess.replace(" (inactive)", "")}{" "}
                <span className="font-bold">(Inactive)</span>
              </>
            ) : (
              user.levelOfAccess
            )}
          </span>
        ),
        loggedIn: (
          <div className="flex items-center justify-center">
            <div
              className={`w-3 h-3 rounded-full ${
                user.loggedIn ? "bg-dost-blue" : "border-2 border-gray-400"
              }`}
            ></div>
          </div>
        ),
      }));
    }

    // For other tabs, format data based on column keys
    const columnKeys = getColumnKeys(tabKey);
    return data.map((item) => {
      const formattedItem: Record<string, any> = {};
      columnKeys.forEach((key) => {
        formattedItem[key] =
          typeof item[key] === "boolean"
            ? item[key]
              ? "Yes"
              : "No"
            : item[key];
      });
      return formattedItem;
    });
  };

  const getTableHeaders = (tabKey: TabKey) => {
    switch (tabKey) {
      case "agencies":
        return [
          "Name",
          "Contact Details",
          "Head of Agency & Position",
          "Classification/Group",
        ];
      case "auditors":
        return [
          "Name",
          "Agency & Position",
          "Contact Details",
          "Birthdate",
          "Expertise",
          "Engagements",
          "Rating",
        ];
      case "auditAreas":
        // Obsolete since there's custom component for this shi
        return ["Name", "Description", "Category"];
      case "auditCriteria":
        return ["Audit Criteria", "Audit Area", "Reference"];
      case "typesOfAudit":
        return ["Name", "Description", "Duration"];
      case "internalControls":
        return ["Name", "Description", "Category"];
      case "documentTypes":
        return ["Type of Document"];
      case "userAccounts":
        return [
          "Name",
          "Agency",
          "Email Address",
          "Level of Access",
          "Logged In",
        ];
      default:
        return [];
    }
  };

  const getColumnKeys = (tabKey: TabKey) => {
    switch (tabKey) {
      case "auditors":
        return [
          "name",
          "agencyPosition",
          "contactDetails",
          "birthdate",
          "expertise",
          "engagements",
          "rating",
        ];
      case "auditAreas":
        // Obsolete since there's custom component for this shi
        return ["name", "description", "category"];
      case "auditCriteria":
        return ["auditCriteria", "auditArea", "reference"];
      case "typesOfAudit":
        return ["name", "description", "duration"];
      case "internalControls":
        return ["name", "description", "category"];
      case "documentTypes":
        return ["typeOfDocument"];
      case "userAccounts":
        return ["name", "agency", "emailAddress", "levelOfAccess", "loggedIn"];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-dost-black font-manrope">
        Library
      </h1>

      <div className="bg-dost-white rounded-lg">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === tab.key
                    ? "border-dost-blue text-dost-blue"
                    : "border-transparent text-dost-black/60 hover:text-dost-black hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search and Add Button */}
        <div className="py-4">
          <div className="flex justify-between items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-dost-blue focus:border-transparent focus:outline-none"
              />
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-dost-blue-dark font-bold">
                {entriesCount} entries
              </span>
              <button className="bg-dost-black text-dost-white p-2 rounded-full hover:bg-dost-blue transition-colors cursor-pointer">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        {activeTab === "internalControls" ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-dost-white">
                <tr>
                  <th className="px-4 py-2 text-left text-xs text-dost-blue-dark uppercase tracking-wider border-b border-gray border-r border-gray-200 font-manrope font-[700]">
                    Internal Control Components
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-500 bg-dost-white">
                {currentData.map((control) => (
                  <NumberedTreeNode
                    key={control.id}
                    control={control}
                    level={0}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : activeTab === "auditAreas" ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-dost-white">
                <tr>
                  <th className="px-4 py-2 text-left text-xs text-dost-blue-dark tracking-wider border-b border-gray border-r border-gray-200 font-manrope font-[700]">
                    Audit Area
                  </th>
                  <th className="px-4 py-2 text-left text-xs text-dost-blue-dark tracking-wider border-b border-gray border-r border-gray-200 font-manrope font-[700]">
                    Sub-Audit Areas
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-500 bg-dost-white">
                {currentData.map((area) => (
                  <TreeNode key={area.id} area={area} level={0} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // Regular table for other tabs
          <Table
            headers={getTableHeaders(activeTab)}
            data={formatDataForTable(currentData, activeTab)}
          />
        )}
      </div>
    </div>
  );
}

export default Library;
