import { useState, useEffect } from "react";
import { libraryData } from "../data/libraryData";
import Table from "../components/Table";
import type { TabProps } from "../types/libraryTypes";
import type { TabKey } from "../data/libraryData";

interface GenericTableTabProps extends TabProps {
  tabKey: TabKey;
  headers: string[];
  columnKeys: string[];
}

const GenericTableTab: React.FC<GenericTableTabProps> = ({
  tabKey,
  headers,
  columnKeys,
  searchTerm,
  onDataCount,
}) => {
  const [data] = useState(libraryData[tabKey] || []);

  useEffect(() => {
    onDataCount(data.length);
  }, [data.length, onDataCount]);

  const formatDataForTable = (data: any[]) => {
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

  return <Table headers={headers} data={formatDataForTable(data)} />;
};

export default GenericTableTab;
