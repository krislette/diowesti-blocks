import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  type AuditArea,
  type AuditAreaFormData,
  auditAreaService,
} from "../services/auditAreaService";

interface AuditAreaModalProps {
  auditArea: AuditArea | null;
  onSave: (auditAreaData: AuditAreaFormData) => Promise<void>;
  onClose: () => void;
  onDelete?: (id: number) => Promise<void>;
}

const AuditAreaModal: React.FC<AuditAreaModalProps> = ({
  auditArea,
  onSave,
  onClose,
  onDelete,
}) => {
  const [formData, setFormData] = useState<AuditAreaFormData>({
    ara_name: "",
    ara_ara_id: null,
  });
  const [parentOptions, setParentOptions] = useState<AuditArea[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isActive, setIsActive] = useState(true);

  const isEditing = !!auditArea;

  useEffect(() => {
    if (auditArea) {
      setFormData({
        ara_name: auditArea.name,
        ara_ara_id: auditArea.parent_audit_area_id,
      });
    } else {
      setFormData({ ara_name: "", ara_ara_id: null });
    }
    loadParentOptions();
  }, [auditArea]);

  const loadParentOptions = async () => {
    try {
      const options = await auditAreaService.getParentOptions();
      const filteredOptions = auditArea
        ? options.filter((option) => option.id !== auditArea.id)
        : options;
      setParentOptions(filteredOptions);
    } catch (error) {
      console.error("Error loading parent options:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "ara_ara_id" ? (value === "" ? null : Number(value)) : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setErrors({});
      await onSave(formData);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const backendErrors: Record<string, string> = {};
        Object.entries(error.response.data.errors).forEach(([key, value]) => {
          backendErrors[key] = Array.isArray(value)
            ? value[0]
            : (value as string);
        });
        setErrors(backendErrors);
      } else {
        setErrors({ general: error.message || "Failed to save audit area" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!auditArea || !onDelete) return;
    if (!window.confirm(`Are you sure you want to delete "${auditArea.name}"?`))
      return;

    try {
      setLoading(true);
      await onDelete(auditArea.id);
      onClose();
    } catch (error: any) {
      setErrors({ general: error.message || "Failed to delete audit area" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500/75 bg-opacity-20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-dost-white z-50">
          <h2 className="text-lg font-bold text-dost-black font-manrope">
            Audit Area
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="p-6 space-y-4"
        >
          {errors.general && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {errors.general}
            </div>
          )}

          {/* Logo placeholder and Active toggle */}
          <div className="flex justify-end mb-4">
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

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="ara_name"
              value={formData.ara_name}
              onChange={handleInputChange}
              required
              className={`w-full px-3 py-1 border rounded-md focus:ring-2 focus:ring-dost-blue focus:border-dost-blue outline-none text-sm ${
                errors.ara_name ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter audit area name"
              disabled={loading}
            />
            {errors.ara_name && (
              <p className="mt-1 text-xs text-red-600">{errors.ara_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Parent Audit Area
            </label>
            <select
              name="ara_ara_id"
              value={formData.ara_ara_id || ""}
              onChange={handleInputChange}
              className={`w-full px-3 py-1.5 border rounded-md focus:ring-2 focus:ring-dost-blue focus:border-dost-blue outline-none text-sm cursor-pointer ${
                errors.ara_ara_id ? "border-red-300" : "border-gray-300"
              }`}
              disabled={loading}
            >
              <option value="">Select parent audit area (optional)</option>
              {parentOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
            {errors.ara_ara_id && (
              <p className="mt-1 text-xs text-red-600">{errors.ara_ara_id}</p>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end items-center pt-2 space-x-4">
            {isEditing && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="px-6 py-1 text-gray-600 border border-gray-300 rounded-md hover:bg-dost-black hover:text-dost-white transition-colors disabled:opacity-50 cursor-pointer"
              >
                Delete
              </button>
            )}
            <button
              type="submit"
              disabled={loading || !formData.ara_name.trim()}
              className="px-8 py-1 bg-dost-blue text-white rounded-md hover:bg-dost-blue-dark transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuditAreaModal;
