import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type {
  Agency,
  CreateAgencyData,
  UpdateAgencyData,
} from "../services/agencyService";

interface AgencyModalProps {
  agency: Agency | null;
  onSave: (data: CreateAgencyData | UpdateAgencyData) => Promise<void>;
  onClose: () => void;
  onDelete?: (id: number) => Promise<void>;
}

// Hardcoded agency groupings first cause IM NOT making an API endpoint for ts
const AGENCY_GROUPINGS = [
  { code: "A1", name: "National Government Agencies" },
  { code: "A2", name: "Local Government Units" },
  { code: "A3", name: "State Universities and Colleges" },
  { code: "A4", name: "Government-Owned and Controlled Corporations" },
  { code: "A5", name: "Constitutional Bodies" },
];

function AgencyModal({ agency, onSave, onClose, onDelete }: AgencyModalProps) {
  const [formData, setFormData] = useState({
    agn_id: 0,
    agn_name: "",
    agn_acronym: "",
    agn_grp_code: "",
    agn_address: "",
    agn_head_name: "",
    agn_head_position: "",
    agn_contact_details: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (agency) {
      setFormData({
        agn_id: agency.id,
        agn_name: agency.name,
        agn_acronym: agency.acronym,
        agn_grp_code: agency.groupCode,
        agn_address: agency.address,
        agn_head_name: agency.headOfAgency,
        agn_head_position: agency.position,
        agn_contact_details: agency.contactDetails,
      });
    } else {
      // Reset form for new agency
      setFormData({
        agn_id: 0,
        agn_name: "",
        agn_acronym: "",
        agn_grp_code: "",
        agn_address: "",
        agn_head_name: "",
        agn_head_position: "",
        agn_contact_details: "",
      });
    }
  }, [agency]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (agency) {
        // Update existing agency (exclude agn_id from update data)
        const { agn_id, ...updateData } = formData;
        await onSave(updateData);
      } else {
        // Create new agency
        await onSave(formData as CreateAgencyData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!agency || !onDelete) return;

    if (!window.confirm("Are you sure you want to delete this agency?")) {
      return;
    }

    setLoading(true);
    try {
      await onDelete(agency.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete agency");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "agn_id" ? parseInt(value) || 0 : value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-500/75 bg-opacity-20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-dost-white z-50">
          <h2 className="text-lg font-bold text-dost-black font-manrope">
            Agency
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

          {/* Logo placeholder and Active toggle */}
          <div className="flex items-center justify-between mb-4">
            {agency ? (
              <div className="w-12 h-12 bg-dost-blue rounded flex items-center justify-center">
                <span className="text-white text-lg font-bold">
                  {agency.name.charAt(0)}
                </span>
              </div>
            ) : (
              <div className="w-12 h-12 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                <span className="text-xs text-gray-400">Logo</span>
              </div>
            )}
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
                name="agn_name"
                value={formData.agn_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-dost-blue focus:border-dost-blue outline-none text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Short Name / Acronym
                </label>
                <input
                  type="text"
                  name="agn_acronym"
                  value={formData.agn_acronym}
                  onChange={handleChange}
                  maxLength={30}
                  required
                  className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-dost-blue focus:border-dost-blue outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Classification/Group
                </label>
                <select
                  name="agn_grp_code"
                  value={formData.agn_grp_code}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-dost-blue focus:border-dost-blue outline-none text-sm cursor-pointer"
                >
                  <option value="">Select</option>
                  {AGENCY_GROUPINGS.map((group) => (
                    <option key={group.code} value={group.code}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Address
              </label>
              <textarea
                name="agn_address"
                value={formData.agn_address}
                onChange={handleChange}
                required
                rows={2}
                className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-dost-blue focus:border-dost-blue outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Name of Head of Agency
              </label>
              <input
                type="text"
                name="agn_head_name"
                value={formData.agn_head_name}
                onChange={handleChange}
                maxLength={150}
                required
                className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-dost-blue focus:border-dost-blue outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Position of Head of Agency
              </label>
              <input
                type="text"
                name="agn_head_position"
                value={formData.agn_head_position}
                onChange={handleChange}
                maxLength={150}
                required
                className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-dost-blue focus:border-dost-blue outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Contact Details
              </label>
              <textarea
                name="agn_contact_details"
                value={formData.agn_contact_details}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-dost-blue focus:border-dost-blue outline-none text-sm"
              />
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex justify-end items-center pt-2 space-x-4">
            {agency ? (
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

export default AgencyModal;
