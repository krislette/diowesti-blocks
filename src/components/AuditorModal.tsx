import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Auditor } from "../services/auditorService";
import { agencyService, type Agency } from "../services/agencyService";
import AddOptionModal from "../components/AddOptionModal";
import AgencyModal from "../components/AgencyModal";

interface AuditorModalProps {
  auditor: Auditor | null;
  onSave: (data: any) => Promise<void>;
  onClose: () => void;
  onDelete: (id: number) => Promise<void>;
}

const AuditorModal: React.FC<AuditorModalProps> = ({
  auditor,
  onSave,
  onClose,
  onDelete,
}) => {
  const [formData, setFormData] = useState({
    aur_name_first: "",
    aur_name_last: "",
    aur_name_middle: "",
    aur_name_prefix: "",
    aur_name_suffix: "",
    aur_external: 0,
    aur_position: "",
    aur_salary_grade: 1,
    aur_agn_id: "",
    aur_expertise: "",
    aur_email: "",
    aur_birthdate: "",
    aur_contact_no: "",
    aur_tin: "",
    aur_status: 1,
    aur_photo: "",
    aur_active: 1,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [agenciesLoading, setAgenciesLoading] = useState(true);
  const [showAgencyModal, setShowAgencyModal] = useState(false);
  const [selectedAgencyForEdit, setSelectedAgencyForEdit] =
    useState<Agency | null>(null);
  const [showExpertiseModal, setShowExpertiseModal] = useState(false);

  // Fetch agencies on mount
  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const fetchedAgencies = await agencyService.getAgencies();
        setAgencies(fetchedAgencies);
      } catch (err) {
        console.error("Failed to fetch agencies:", err);
        setError("Failed to load agencies");
      } finally {
        setAgenciesLoading(false);
      }
    };

    fetchAgencies();
  }, []);

  useEffect(() => {
    if (auditor) {
      setFormData({
        aur_name_first: auditor.firstName || "",
        aur_name_last: auditor.lastName || "",
        aur_name_middle: auditor.middleName || "",
        aur_name_prefix: auditor.namePrefix || "",
        aur_name_suffix: auditor.nameSuffix || "",
        aur_external: auditor.external ? 1 : 0,
        aur_position: auditor.position || "",
        aur_salary_grade: auditor.salaryGrade || 1,
        aur_agn_id: auditor.agencyId?.toString() || "",
        aur_expertise: auditor.expertise || "",
        aur_email: auditor.email || "",
        aur_birthdate: auditor.birthdate || "",
        aur_contact_no: auditor.contactNo || "",
        aur_tin: auditor.tin || "",
        aur_status: auditor.status || 1,
        aur_photo: auditor.photo || "",
        aur_active: auditor.active ? 1 : 0,
      });
      setIsActive(Boolean(auditor.active));
    } else {
      // Reset form for new auditor
      setFormData({
        aur_name_first: "",
        aur_name_last: "",
        aur_name_middle: "",
        aur_name_prefix: "",
        aur_name_suffix: "",
        aur_external: 0,
        aur_position: "",
        aur_salary_grade: 1,
        aur_agn_id: "",
        aur_expertise: "",
        aur_email: "",
        aur_birthdate: "",
        aur_contact_no: "",
        aur_tin: "",
        aur_status: 1,
        aur_photo: "",
        aur_active: 1,
      });
      setIsActive(true);
    }
  }, [auditor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitData = {
        aur_name_first: formData.aur_name_first || null,
        aur_name_last: formData.aur_name_last || null,
        aur_name_middle: formData.aur_name_middle || null,
        aur_name_prefix: formData.aur_name_prefix || null,
        aur_name_suffix: formData.aur_name_suffix || null,
        aur_external: Number(formData.aur_external),
        aur_position: formData.aur_position || null,
        aur_salary_grade: Number(formData.aur_salary_grade),
        aur_agn_id: formData.aur_agn_id ? Number(formData.aur_agn_id) : null,
        aur_expertise:
          expertiseTags.length > 0 ? expertiseTags.join(", ") : null,
        aur_email: formData.aur_email || null,
        aur_birthdate: formData.aur_birthdate
          ? formData.aur_birthdate.slice(0, 10)
          : null,
        aur_contact_no: formData.aur_contact_no || null,
        aur_tin: formData.aur_tin || null,
        aur_status: Number(formData.aur_status),
        aur_photo: formData.aur_photo || null,
        aur_active: isActive ? 1 : 0,
      };

      console.log("Payload for save:", submitData);

      await onSave(submitData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!auditor) return;

    if (!window.confirm("Are you sure you want to delete this auditor?")) {
      return;
    }

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
    setFormData((prev) => ({
      ...prev,
      [name]: name === "aur_salary_grade" ? parseInt(value) || 1 : value,
    }));
  };

  // Split expertise into tags
  const expertiseTags = formData.aur_expertise
    ? formData.aur_expertise
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];

  const addExpertiseTag = (tag: string) => {
    if (tag && !expertiseTags.includes(tag)) {
      const newTags = [...expertiseTags, tag];
      setFormData((prev) => ({ ...prev, aur_expertise: newTags.join(", ") }));
    }
  };

  const removeExpertiseTag = (tagToRemove: string) => {
    const newTags = expertiseTags.filter((tag) => tag !== tagToRemove);
    setFormData((prev) => ({ ...prev, aur_expertise: newTags.join(", ") }));
  };

  const handleAddAgency = async (agencyData: any) => {
    try {
      console.log("Creating agency with data:", agencyData);

      // Call agency service to create new agency
      const newAgency = await agencyService.createAgency(agencyData);
      console.log("New agency created:", newAgency);

      // Add to local state and set as selected
      setAgencies((prev) => {
        const updated = [...prev, newAgency];
        console.log("Updated agencies list:", updated);
        return updated;
      });

      setFormData((prev) => {
        const updated = { ...prev, aur_agn_id: newAgency.id.toString() };
        console.log("Updated form data with agency ID:", updated.aur_agn_id);
        return updated;
      });

      // Close modal
      setShowAgencyModal(false);
      setSelectedAgencyForEdit(null);
    } catch (err) {
      console.error("Error creating agency:", err);
      throw new Error("Failed to add agency");
    }
  };

  const handleDeleteAgency = async (id: number) => {
    try {
      await agencyService.deleteAgency(id);
      setAgencies((prev) => prev.filter((agency) => agency.id !== id));
      // If the deleted agency was selected, clear the selection
      if (formData.aur_agn_id === id.toString()) {
        setFormData((prev) => ({ ...prev, aur_agn_id: "" }));
      }
    } catch (err) {
      throw new Error("Failed to delete agency");
    }
  };

  const handleAddExpertise = (expertiseName: string) => {
    addExpertiseTag(expertiseName);
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

          {/* External/Internal and Active toggle */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="aur_external"
                  value="0"
                  checked={formData.aur_external === 0}
                  onChange={() =>
                    setFormData((prev) => ({ ...prev, aur_external: 0 }))
                  }
                  className="w-4 h-4 text-dost-blue border-gray-300 focus:ring-dost-blue cursor-pointer"
                />
                <span className="ml-2 text-sm text-gray-700">Internal</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="aur_external"
                  value="1"
                  checked={formData.aur_external === 1}
                  onChange={() =>
                    setFormData((prev) => ({ ...prev, aur_external: 1 }))
                  }
                  className="w-4 h-4 text-dost-blue border-gray-300 focus:ring-dost-blue cursor-pointer"
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
                  name="aur_name_last"
                  value={formData.aur_name_last}
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
                  name="aur_name_first"
                  value={formData.aur_name_first}
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
                  name="aur_name_middle"
                  value={formData.aur_name_middle}
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
                <select
                  name="aur_name_prefix"
                  value={formData.aur_name_prefix}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-dost-blue focus:border-dost-blue outline-none text-sm cursor-pointer"
                >
                  <option value="">Select</option>
                  <option value="Dr.">Dr.</option>
                  <option value="Mr.">Mr.</option>
                  <option value="Ms.">Ms.</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Prof.">Prof.</option>
                </select>
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
                  min="1"
                  max="30"
                  className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-dost-blue focus:border-dost-blue outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Agency</label>
              <div className="flex items-center space-x-2">
                <select
                  name="aur_agn_id"
                  value={formData.aur_agn_id}
                  onChange={handleChange}
                  disabled={agenciesLoading}
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-dost-blue focus:border-dost-blue outline-none text-sm cursor-pointer disabled:bg-gray-100"
                >
                  <option value="">
                    {agenciesLoading ? "Loading agencies..." : "Select Agency"}
                  </option>
                  {agencies.map((agency) => (
                    <option key={agency.id} value={agency.id}>
                      {agency.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAgencyForEdit(null);
                    setShowAgencyModal(true);
                  }}
                  className="px-3 py-1.5 bg-dost-blue text-white rounded-md hover:bg-dost-blue-dark text-sm cursor-pointer"
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
                  {expertiseTags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-dost-blue text-dost-white text-xs rounded-full"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeExpertiseTag(tag)}
                        className="ml-1 text-dost-white hover:text-dost-black cursor-pointer"
                        aria-label={`Remove ${tag}`}
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
                        addExpertiseTag(e.target.value);
                        e.target.value = "";
                      }
                    }}
                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-dost-blue focus:border-dost-blue outline-none text-sm cursor-pointer"
                  >
                    <option value="">Select Expertise</option>
                    <option value="Information Technology">
                      Information Technology
                    </option>
                    <option value="Technology Transfer">
                      Technology Transfer
                    </option>
                    <option value="Project Management">
                      Project Management
                    </option>
                    <option value="Financial Management">
                      Financial Management
                    </option>
                    <option value="Human Resources">Human Resources</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowExpertiseModal(true)}
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
                  required
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
                  maxLength={12}
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
                  value={formData.aur_birthdate}
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
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end items-center pt-2 space-x-4">
            {auditor && (
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
        {/* Add Agency Modal */}
        {showAgencyModal && (
          <AgencyModal
            agency={selectedAgencyForEdit}
            onSave={handleAddAgency}
            onClose={() => {
              setShowAgencyModal(false);
              setSelectedAgencyForEdit(null);
            }}
            onDelete={handleDeleteAgency}
          />
        )}

        {/* Add Expertise Modal */}
        <AddOptionModal
          isOpen={showExpertiseModal}
          onClose={() => setShowExpertiseModal(false)}
          onAdd={handleAddExpertise}
          title="Expertise"
          placeholder="Enter expertise area"
          label="Expertise Area"
        />
      </div>
    </div>
  );
};

export default AuditorModal;
