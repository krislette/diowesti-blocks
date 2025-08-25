import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type {
  AuditType,
  CreateAuditTypeData,
  UpdateAuditTypeData,
} from "../services/auditTypeService";

interface AuditTypeModalProps {
  auditType: AuditType | null;
  onSave: (data: CreateAuditTypeData | UpdateAuditTypeData) => Promise<void>;
  onClose: () => void;
  onDelete?: (id: number) => Promise<void>;
}

function AuditTypeModal({
  auditType,
  onSave,
  onClose,
  onDelete,
}: AuditTypeModalProps) {
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    active: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (auditType) {
      setFormData({
        id: auditType.id,
        name: auditType.name,
        active: auditType.active ? 1 : 0,
      });
      setIsActive(auditType.active);
    } else {
      // Reset form for new audit type
      setFormData({
        id: 0,
        name: "",
        active: 1,
      });
      setIsActive(true);
    }
  }, [auditType]);

  // Update active when isActive changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      active: isActive ? 1 : 0,
    }));
  }, [isActive]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (auditType) {
        // Update existing audit type (exclude id from update data)
        const { id, ...updateData } = formData;
        await onSave({
          aud_typ_name: updateData.name,
          aud_typ_active: updateData.active,
        });
      } else {
        const { id, ...createData } = formData;
        await onSave({
          aud_typ_name: createData.name,
          aud_typ_active: createData.active,
        } as CreateAuditTypeData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!auditType || !onDelete) return;

    if (
      !window.confirm(`Are you sure you want to delete "${auditType.name}"?`)
    ) {
      return;
    }

    setLoading(true);
    try {
      await onDelete(auditType.id);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete audit type"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-500/75 bg-opacity-20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-dost-white z-50">
          <h2 className="text-lg font-bold text-dost-black font-manrope">
            Types of Audit
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-2">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          {/* Active toggle */}
          <div className="flex items-center justify-end mb-4">
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">ACTIVE</span>
              <div
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  isActive ? "bg-dost-blue" : "bg-gray-200"
                }`}
                onClick={() => setIsActive(!isActive)}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isActive ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Form fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-dost-blue focus:border-dost-blue outline-none text-sm"
              />
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex justify-end items-center pt-2 space-x-4">
            {auditType ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="px-6 py-1 text-gray-600 border border-gray-300 rounded-md hover:bg-dost-black hover:text-dost-white transition-colors disabled:opacity-50 cursor-pointer"
              >
                Delete
              </button>
            ) : (
              <div></div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-1 bg-dost-blue text-white rounded-md hover:bg-dost-blue-dark transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AuditTypeModal;
