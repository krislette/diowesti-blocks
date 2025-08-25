import { useState } from "react";
import type { AuditArea } from "../services/auditAreaService";

interface TreeNodeProps {
  area: AuditArea;
  level: number;
  onEdit?: (area: AuditArea) => void;
}

function TreeNode({ area, level, onEdit }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(area.isExpanded || false);

  // Max out at 80px
  const indent = Math.min(level * 20, 80);

  const hasChildren = area.subAreas && area.subAreas.length > 0;

  const handleRowClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on the expand/collapse button
    if ((e.target as HTMLElement).closest("button")) return;

    if (onEdit) {
      onEdit(area);
    }
  };

  return (
    <>
      <tr
        className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
        onClick={handleRowClick}
      >
        {/* First column: name only for level 0 */}
        <td className="px-4 py-3 align-top w-1/2">
          {level === 0 && (
            <div className="flex items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className="mr-2 w-4 h-4 flex items-center justify-center cursor-pointer text-dost-blue hover:text-dost-blue-dark"
                disabled={!hasChildren}
              >
                {hasChildren ? (isExpanded ? "▼" : "▶") : ""}
              </button>
              <span className="text-sm text-dost-black font-medium">
                {area.name}
              </span>
            </div>
          )}
        </td>

        {/* Second column for Sub-Audit Areas (for level > 0) */}
        <td className="px-4 py-3 align-top w-1/2">
          {level === 0 ? (
            <div className="w-full text-right">
              {typeof area.entriesCount === "number" && (
                <span className="text-sm text-gray-500">
                  {area.entriesCount}{" "}
                  {area.entriesCount > 1 ? "entries" : "entry"}
                </span>
              )}
            </div>
          ) : (
            <div
              className="flex items-center"
              style={{ paddingLeft: `${indent}px` }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className="mr-2 w-4 h-4 flex items-center justify-center cursor-pointer text-dost-blue hover:text-dost-blue-dark"
                disabled={!hasChildren}
              >
                {hasChildren ? (isExpanded ? "▼" : "▶") : ""}
              </button>
              <span className="text-sm text-dost-black">{area.name}</span>
            </div>
          )}
        </td>
      </tr>

      {/* Recursive rendering */}
      {isExpanded &&
        hasChildren &&
        area.subAreas!.map((subArea: AuditArea) => (
          <TreeNode
            key={subArea.id}
            area={subArea}
            level={level + 1}
            onEdit={onEdit}
          />
        ))}
    </>
  );
}

export default TreeNode;
