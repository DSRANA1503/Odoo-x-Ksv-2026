interface StatusBadgeProps {
  status: string;
  type: "vehicle" | "driver" | "trip" | "maintenance";
}

export default function StatusBadge({ status, type }: StatusBadgeProps) {
  const getStyles = () => {
    switch(status) {
      case "Available":
      case "Active":
      case "Completed":
        return "bg-green-100 text-green-700";
      case "On Trip":
      case "Dispatched":
        return "bg-violet-100 text-violet-700";
      case "In Shop":
      case "Suspended":
      case "Cancelled":
      case "Retired":
        return "bg-red-100 text-red-700";
      case "Scheduled":
      case "In Progress":
      case "Draft":
        return "bg-yellow-100 text-yellow-700";
      case "Inactive":
      case "Off Duty":
        return "bg-gray-100 text-gray-700 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-700 dark:text-gray-300";
    }
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStyles()}`}>
      {status}
    </span>
  );
}
