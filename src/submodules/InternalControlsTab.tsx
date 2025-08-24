import { useState, useEffect } from "react";
import { libraryData } from "../data/libraryData";
import NumberedTreeNode from "../components/NumberedTreeNode";
import type { TabProps } from "../types/libraryTypes";

const InternalControlsTab: React.FC<TabProps> = ({
  searchTerm,
  onDataCount,
}) => {
  const [data] = useState(libraryData.internalControls);

  useEffect(() => {
    onDataCount(data.length);
  }, [data.length, onDataCount]);

  return (
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
          {data.map((control) => (
            <NumberedTreeNode key={control.id} control={control} level={0} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InternalControlsTab;
