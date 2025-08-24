import { useState } from "react";
import { X } from "lucide-react";

interface AddOptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (value: string) => Promise<void> | void;
  title: string;
  placeholder?: string;
  label?: string;
}

const AddOptionModal: React.FC<AddOptionModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  title,
  placeholder = "Enter new option",
  label = "Name",
}) => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) {
      setError("This field is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onAdd(value.trim());
      setValue("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add option");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setValue("");
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-500/75 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-dost-black font-manrope">
            Add {title}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            type="button"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-2">{label}</label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-dost-blue focus:border-dost-blue outline-none text-sm"
              autoFocus
            />
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !value.trim()}
              className="px-6 py-2 bg-dost-blue text-white rounded-md hover:bg-dost-blue-dark transition-colors disabled:opacity-50 cursor-pointer text-sm"
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOptionModal;
