import { useState } from "react";

interface NumberedTreeNodeProps {
  control: {
    id: number;
    name: string;
    description?: string;
    auditAreaName?: string;
    sequenceNumber?: number;
    subControls?: {
      id: number;
      name: string;
      sequenceNumber?: number;
    }[];
    isExpanded?: boolean;
    onClick?: () => void;
  };
  level: number;
}

function NumberedTreeNode({ control, level }: NumberedTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(control.isExpanded || false);

  const hasSubControls = control.subControls && control.subControls.length > 0;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleRowClick = () => {
    if (control.onClick && level === 0) {
      control.onClick();
    }
  };

  return (
    <>
      <tr
        className={`border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${
          level === 0 ? "cursor-pointer" : ""
        }`}
        onClick={handleRowClick}
      >
        <td className="px-4 py-3 align-top w-1/2">
          <div
            className={`flex items-start justify-between ${
              level > 0 ? "ml-8" : ""
            }`}
          >
            <div className="flex items-start flex-1">
              {level === 0 && (
                <button
                  onClick={handleToggle}
                  className={`mr-2 w-4 h-4 flex items-center justify-center text-dost-blue hover:text-dost-blue-dark cursor-pointer ${
                    hasSubControls ? "" : "invisible"
                  }`}
                >
                  {hasSubControls ? (isExpanded ? "▼" : "▶") : null}
                </button>
              )}

              {level > 0 && (
                <span className="text-sm font-medium text-dost-blue mr-2 mt-0.5 min-w-[20px]">
                  {control.sequenceNumber || level}.
                </span>
              )}

              <span
                className={`${
                  level === 0
                    ? "text-sm text-dost-black font-medium"
                    : "text-sm text-gray-800"
                }`}
              >
                {control.name}
              </span>
            </div>

            {control.description && level === 0 && (
              <div className="ml-4 flex-1 max-w-md">
                <p className="text-sm text-gray-600 italic">
                  {control.description}
                </p>
              </div>
            )}
          </div>
        </td>
      </tr>

      {level === 0 &&
        isExpanded &&
        hasSubControls &&
        control.subControls!.map((subControl) => (
          <NumberedTreeNode
            key={subControl.id}
            control={subControl}
            level={level + 1}
          />
        ))}
    </>
  );
}

export default NumberedTreeNode;
