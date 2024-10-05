import { IoClose } from "react-icons/io5";

export const FilterButton = ({ label, onRemove }) => {
  return (
    <button
      onClick={onRemove}
      className="bg-white/10 px-2 py-1 rounded-md flex items-center gap-2 hover:bg-white/20"
    >
      {label}
      <IoClose className="h-5 w-5 bg-white/10 p-0.5 rounded-md" />
    </button>
  );
};
