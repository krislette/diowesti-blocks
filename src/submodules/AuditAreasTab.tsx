import { useState, useEffect } from "react";
import { libraryData } from "../data/libraryData";
import TreeNode from "../components/TreeNode";
import type { TabProps } from "../types/libraryTypes";

const AuditAreasTab: React.FC<TabProps> = ({ searchTerm, onDataCount }) => {
  const [data] = useState(libraryData.auditAreas);

  useEffect(() => {
    onDataCount(data.length);
  }, [data.length, onDataCount]);

  return (
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
          {data.map((area) => (
            <TreeNode key={area.id} area={area} level={0} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditAreasTab;
