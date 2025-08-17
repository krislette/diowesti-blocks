import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type {
  Auditor,
  CreateAuditorData,
  UpdateAuditorData,
} from "../services/auditorService";

interface AuditorModalProps {
  auditor: Auditor | null;
  onSave: (data: CreateAuditorData | UpdateAuditorData) => Promise<void>;
  onClose: () => void;
  onDelete?: (id: number) => Promise<void>;
}

// Expertise areas for auditors
const EXPERTISE_AREAS = [
  "Financial Audit",
  "Performance Audit",
  "Compliance Audit",
  "IT Audit",
  "Environmental Audit",
  "Procurement Audit",
  "Risk Management",
  "Internal Controls",
  "Fraud Investigation",
  "Management Systems",
];

function AuditorModal({
  auditor,
  onSave,
  onClose,
  onDelete,
}: AuditorModalProps) {
  const [formData, setFormData] = useState({
    aur_id: 0,
    aur_last_name: "",
    aur_first_name: "",
    aur_middle_name: "",
    aur_name_suffix: "",
    aur_prefix_title: "",
    aur_position: "",
    aur_salary_grade: "", // keep as string; we coerce on change
    aur_agency: "",
    aur_expertise: [] as string[],
    aur_email: "",
    aur_tin: "",
    aur_birthdate: "",
    aur_contact_no: "",
    aur_status: "",
    aur_is_internal: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (auditor) {
      // Parse the full name back into components for editing (best-effort)
      const nameParts = auditor.name.split(" ");
      setFormData({
        aur_id: auditor.id,
        aur_last_name: nameParts[0] || "",
        aur_first_name: nameParts[1] || "",
        aur_middle_name: nameParts[2] || "",
        aur_name_suffix: "",
        aur_prefix_title: "",
        aur_position: auditor.position,
        aur_salary_grade: "",
        aur_agency: auditor.agency,
        aur_expertise: auditor.expertise ? auditor.expertise.split(", ") : [],
        aur_email: "",
        aur_tin: "",
        aur_birthdate: auditor.birthdate,
        aur_contact_no: auditor.contactDetails,
        aur_status: "",
        aur_is_internal: true,
      });
    } else {
      // Reset form for new auditor
      setFormData({
        aur_id: 0,
        aur_last_name: "",
        aur_first_name: "",
        aur_middle_name: "",
        aur_name_suffix: "",
        aur_prefix_title: "",
        aur_position: "",
        aur_salary_grade: "",
        aur_agency: "",
        aur_expertise: [],
        aur_email: "",
        aur_tin: "",
        aur_birthdate: "",
        aur_contact_no: "",
        aur_status: "",
        aur_is_internal: true,
      });
    }
  }, [auditor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const combinedName =
        `${formData.aur_last_name}, ${formData.aur_first_name} ${formData.aur_middle_name}`.trim();
      const apiData = {
        ...formData,
        aur_name: combinedName,
        aur_expertise: formData.aur_expertise.join(", "),
        aur_contact_details: formData.aur_contact_no,
        aur_salary_grade:
          formData.aur_salary_grade === ""
            ? 0
            : parseInt(String(formData.aur_salary_grade), 10) || 0,
      };

      if (auditor) {
        const { aur_id, ...updateData } = apiData;
        await onSave(updateData as UpdateAuditorData);
      } else {
        await onSave(apiData as CreateAuditorData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!auditor || !onDelete) return;
    if (!window.confirm("Are you sure you want to delete this auditor?"))
      return;

    setLoading(true);
    try {
      await onDelete(auditor.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete auditor");
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
    if (name === "aur_is_internal") {
      setFormData((prev) => ({ ...prev, [name]: value === "internal" }));
    } else if (name === "aur_id" || name === "aur_salary_grade") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? "" : String(parseInt(value, 10) || 0),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleExpertiseChange = (expertise: string) => {
    setFormData((prev) => ({
      ...prev,
      aur_expertise: prev.aur_expertise.includes(expertise)
        ? prev.aur_expertise.filter((exp) => exp !== expertise)
        : [...prev.aur_expertise, expertise],
    }));
  };

  const addExpertise = () => {
    const newExpertise = prompt("Enter new expertise:");
    if (newExpertise && !formData.aur_expertise.includes(newExpertise)) {
      handleExpertiseChange(newExpertise);
    }
  };

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="fixed inset-0 bg-gray-500/75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-dost-white z-50">
          <h2 className="text-lg font-bold text-dost-black font-manrope">
            Auditor
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            type="button"
            aria-label="Close"
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

          {/* Internal/External toggle and Active toggle */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="aur_is_internal"
                  value="internal"
                  checked={formData.aur_is_internal === true}
                  onChange={handleChange}
                  className="w-4 h-4 text-dost-blue border-gray-300 focus:ring-dost-blue"
                />
                <span className="ml-2 text-sm text-gray-700">Internal</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="aur_is_internal"
                  value="external"
                  checked={formData.aur_is_internal === false}
                  onChange={handleChange}
                  className="w-4 h-4 text-dost-blue border-gray-300 focus:ring-dost-blue"
                />
                <span className="ml-2 text-sm text-gray-700">External</span>
              </label>
            </div>
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

          {/* Form fields container */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="aur_last_name"
                  value={formData.aur_last_name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-dost-blue focus:border-dost-blue outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="aur_first_name"
                  value={formData.aur_first_name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-dost-blue focus:border-dost-blue outline-none text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Middle Name
                </label>
                <input
                  type="text"
                  name="aur_middle_name"
                  value={formData.aur_middle_name}
                  onChange={handleChange}
                  className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-dost-blue focus:border-dost-blue outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Name Suffix
                </label>
                <input
                  type="text"
                  name="aur_name_suffix"
                  value={formData.aur_name_suffix}
                  onChange={handleChange}
                  placeholder="Jr, Sr, III"
                  className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-dost-blue focus:border-dost-blue outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Prefix/Title
                </label>
                <input
                  type="text"
                  name="aur_prefix_title"
                  value={formData.aur_prefix_title}
                  onChange={handleChange}
                  placeholder="Dr, Atty, Engr"
                  className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-dost-blue focus:border-dost-blue outline-none text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Position
                </label>
                <input
                  type="text"
                  name="aur_position"
                  value={formData.aur_position}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-dost-blue focus:border-dost-blue outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Salary Grade
                </label>
                <input
                  type="number"
                  name="aur_salary_grade"
                  value={formData.aur_salary_grade}
                  onChange={handleChange}
                  className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-dost-blue focus:border-dost-blue outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Agency</label>
              <div className="flex items-center space-x-2">
                <select
                  name="aur_agency"
                  value={formData.aur_agency}
                  onChange={handleChange}
                  required
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-dost-blue focus:border-dost-blue outline-none text-sm cursor-pointer"
                >
                  <option value="">Select Agency</option>
                  <option value="DOST">
                    Department of Science and Technology
                  </option>
                  <option value="DENR">
                    Department of Environment and Natural Resources
                  </option>
                  <option value="DOH">Department of Health</option>
                  <option value="DepEd">Department of Education</option>
                </select>
                <button
                  type="button"
                  className="px-3 py-1.5 bg-dost-blue text-white rounded-md hover:bg-dost-blue-dark text-sm cursor-pointer"
                  onClick={() => {
                    /* Add agency modal logic */
                  }}
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Expertise
              </label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {formData.aur_expertise.map((exp, index) => (
                    <span
                      key={`${exp}-${index}`}
                      className="inline-flex items-center px-2 py-1 bg-dost-blue text-dost-white text-xs rounded-full"
                    >
                      {exp}
                      <button
                        type="button"
                        onClick={() => handleExpertiseChange(exp)}
                        className="ml-1 text-dost-white hover:text-dost-black cursor-pointer"
                        aria-label={`Remove ${exp}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleExpertiseChange(e.target.value);
                        e.target.value = "";
                      }
                    }}
                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-dost-blue focus:border-dost-blue outline-none text-sm cursor-pointer"
                  >
                    <option value="">Add Expertise</option>
                    {EXPERTISE_AREAS.filter(
                      (exp) => !formData.aur_expertise.includes(exp)
                    ).map((expertise) => (
                      <option key={expertise} value={expertise}>
                        {expertise}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={addExpertise}
                    className="px-3 py-1.5 bg-dost-blue text-white rounded-md hover:bg-dost-blue-dark text-sm cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="aur_email"
                  value={formData.aur_email}
                  onChange={handleChange}
                  className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-dost-blue focus:border-dost-blue outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">TIN</label>
                <input
                  type="text"
                  name="aur_tin"
                  value={formData.aur_tin}
                  onChange={handleChange}
                  placeholder="000-000-000-000"
                  className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-dost-blue focus:border-dost-blue outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Birthdate
                </label>
                <input
                  type="date"
                  name="aur_birthdate"
                  value={formatDateForInput(formData.aur_birthdate)}
                  onChange={handleChange}
                  className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-dost-blue focus:border-dost-blue outline-none text-sm cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Contact No.
                </label>
                <input
                  type="text"
                  name="aur_contact_no"
                  value={formData.aur_contact_no}
                  onChange={handleChange}
                  className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-dost-blue focus:border-dost-blue outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Status
                </label>
                <select
                  name="aur_status"
                  value={formData.aur_status}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-dost-blue focus:border-dost-blue outline-none text-sm cursor-pointer"
                >
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end items-center pt-2 space-x-4">
            {auditor && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="px-6 py-1 text-gray-600 border border-gray-300 rounded-md hover:bg-dost-black hover:text-dost-white transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
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

export default AuditorModal;
