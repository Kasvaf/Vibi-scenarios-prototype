interface UserOptionsProps {
  options: string[];
  onSelectOption: (option: string) => void;
  disabled?: boolean;
}

export function UserOptions({ options, onSelectOption, disabled }: UserOptionsProps) {
  if (options.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 mb-4">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onSelectOption(option)}
          disabled={disabled}
          className="text-left px-4 py-3 bg-white border-2 border-blue-500 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {option}
        </button>
      ))}
    </div>
  );
}
