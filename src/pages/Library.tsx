import { useState } from "react";
import { Search } from "lucide-react";
import { tabConfig } from "../config/tabConfig";
import type { TabKey } from "../types/libraryTypes";

function Library() {
  const [activeTab, setActiveTab] = useState<TabKey>("agencies");
  const [searchTerm, setSearchTerm] = useState("");
  const [dataCount, setDataCount] = useState(0);

  const handleDataCount = (count: number) => {
    setDataCount(count);
  };

  const currentTabConfig = tabConfig.find((tab) => tab.key === activeTab);
  const CurrentTabComponent = currentTabConfig?.component;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-dost-black font-manrope">
        Library
      </h1>

      <div className="bg-dost-white rounded-lg">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex flex-wrap">
            {tabConfig.map((tab) => (
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

        {/* Search and Data Count */}
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
            <span className="text-sm text-dost-blue-dark font-bold">
              {dataCount} entries
            </span>
          </div>
        </div>

        {/* Tab Content */}
        {CurrentTabComponent && (
          <CurrentTabComponent
            searchTerm={searchTerm}
            onDataCount={handleDataCount}
          />
        )}
      </div>
    </div>
  );
}

export default Library;
