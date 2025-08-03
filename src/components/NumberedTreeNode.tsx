import { useState } from "react";

function InternalControlNode({
  control,
  level,
}: {
  control: any;
  level: number;
}) {
  const [isExpanded, setIsExpanded] = useState(control.isExpanded || false);

  return (
    <>
      <tr className="border-b border-gray-200 hover:bg-gray-50 text-sm">
        <td className="px-4 py-3">
          <div className={`flex items-start ml-${level * 6}`}>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mr-2 w-4 h-4 flex items-center justify-center mt-1 cursor-pointer"
            >
              {control.subControls && control.subControls.length > 0 ? (
                isExpanded ? (
                  "▼"
                ) : (
                  "▶"
                )
              ) : level > 0 ? (
                <span className="text-sm">
                  {control.id - Math.floor(control.id / 10) * 10}.
                </span>
              ) : (
                ""
              )}
            </button>
            <div>
              <span className="text-dost-black font-medium">
                {control.name}
              </span>
              {control.description && (
                <p className="text-sm text-gray-600 mt-1 italic">
                  {control.description}
                </p>
              )}
            </div>
          </div>
        </td>
      </tr>
      {isExpanded &&
        control.subControls &&
        control.subControls.map((subControl: any) => (
          <InternalControlNode
            key={subControl.id}
            control={subControl}
            level={level + 1}
          />
        ))}
    </>
  );
}

export default InternalControlNode;
