type BadgeColor = "green" | "blue" | "yellow" | "red" | "gray";

interface StatusBadgeProps {
  status: string;
  color?: BadgeColor;
  label?: string;
}

function StatusBadge({ status, color = "gray", label }: StatusBadgeProps) {
  const colors = {
    green: "bg-green-400",
    blue: "bg-blue-400",
    yellow: "bg-yellow-400",
    red: "bg-red-400",
    gray: "bg-gray-400",
  };

  return (
    <span
      className={`inline-flex items-center px-4 py-0.5 rounded-full text-xs font-medium ${colors[color]} text-dost-white`}
    >
      {label || status}
    </span>
  );
}

export default StatusBadge;
