interface FilterDropdownsProps {
  options: string[];
  selected: string;
  onChange: (val: string) => void;
  label?: string;
}

export default function FilterDropdowns({ options, selected, onChange, label }: FilterDropdownsProps) {
  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>}
      <select 
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
