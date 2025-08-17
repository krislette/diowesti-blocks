import { useState } from "react";

function TreeNode({
  area,
  level,
  onClick,
}: {
  area: any;
  level: number;
  onClick?: (id: number) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(area.isExpanded || false);

  // Max out at 80px
  const indent = Math.min(level * 20, 80);

  return (
    <>
      <tr className="border-b border-gray-200 hover:bg-gray-50">
        {/* First column for Audit Area name (only for level 0) */}
        <td className="px-4 py-3 align-top w-1/2">
          {level === 0 && (
            <div className="flex items-center">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mr-2 w-4 h-4 flex items-center justify-center cursor-pointer"
              >
                {area.subAreas && area.subAreas.length > 0
                  ? isExpanded
                    ? "▼"
                    : "▶"
                  : ""}
              </button>
              <span
                className="text-sm text-dost-black font-medium cursor-pointer hover:text-dost-blue"
                onClick={() => onClick?.(area.id)}
              >
                {area.name}
              </span>
              {area.entriesCount && (
                <span className="ml-2 text-sm text-gray-500">
                  {area.entriesCount} entries
                </span>
              )}
            </div>
          )}
        </td>

        {/* Second column for Sub-Audit Areas (for level > 0) */}
        <td className="px-4 py-3 align-top w-1/2">
          {level > 0 && (
            <div
              className="flex items-center"
              style={{ paddingLeft: `${indent}px` }}
            >
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mr-2 w-4 h-4 flex items-center justify-center cursor-pointer"
              >
                {area.subAreas && area.subAreas.length > 0
                  ? isExpanded
                    ? "▼"
                    : "▶"
                  : ""}
              </button>
              <span
                className="text-sm text-dost-black cursor-pointer hover:text-dost-blue"
                onClick={() => onClick?.(area.id)}
              >
                {area.name}
              </span>
            </div>
          )}
        </td>
      </tr>

      {/* Recursive rendering */}
      {isExpanded &&
        area.subAreas &&
        area.subAreas.map((subArea: any) => (
          <TreeNode key={subArea.id} area={subArea} level={level + 1} />
        ))}
    </>
  );
}

export default TreeNode;
