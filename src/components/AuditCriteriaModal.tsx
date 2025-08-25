import { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import type {
  AuditCriteria,
  CreateAuditCriteriaData,
  UpdateAuditCriteriaData,
} from "../services/auditCriteriaService";
import AuditAreaModal from "./AuditAreaModal";
import AddOptionModal from "./AddOptionModal";
import { auditAreaService, type AuditArea } from "../services/auditAreaService";

interface AuditCriteriaModalProps {
  criteria: AuditCriteria | null;
  onSave: (
    data: CreateAuditCriteriaData | UpdateAuditCriteriaData
  ) => Promise<void>;
  onClose: () => void;
  onDelete?: (id: number) => Promise<void>;
}

function AuditCriteriaModal({
  criteria,
  onSave,
  onClose,
  onDelete,
}: AuditCriteriaModalProps) {
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    areas: "",
    references: "",
    active: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);

  // For audit areas management
  const [areaTags, setAreaTags] = useState<string[]>([]);
  const [availableAreas, setAvailableAreas] = useState<AuditArea[]>([]);
  const [showAreaModal, setShowAreaModal] = useState(false);

  // For references management
  const [referenceTags, setReferenceTags] = useState<string[]>([]);
  const [showReferenceModal, setShowReferenceModal] = useState(false);
  const availableReferences: string[] = [
    "RA 6713 - Code of Conduct and Ethical Standards for Public Officials",
    "RA 9184 - Government Procurement Reform Act",
    "CSC MC No. 38, s. 2017 - Revised Rules on Administrative Cases",
    "RA 10173 - Data Privacy Act, RA 8792 - E-Commerce Act",
    "PD 1445 - Government Auditing Code of the Philippines",
    "COA Circular No. 2019-004 - Manual on Property, Plant and Equipment",
    "EO 79 - Creating the Environmental Impact Assessment System",
    "RA 9470 - National Archives Act, NARA Issuances",
    "CSC MC No. 06, s. 2017 - Performance Evaluation System",
    "COA Circular No. 2009-006 - Internal Control Standards",
    "RA 11032 - Ease of Doing Business Act, CC-2018-001",
    "IRR of RA 9184, GPPB Resolution No. 09-2020",
  ];

  useEffect(() => {
    loadAvailableAreas();
  }, []);

  useEffect(() => {
    if (criteria) {
      setFormData({
        id: criteria.id,
        name: criteria.name,
        areas: criteria.areas,
        references: criteria.references,
        active: criteria.active ? 1 : 0,
      });
      setIsActive(criteria.active);

      // Parse areas and references into tags
      setAreaTags(
        criteria.areas
          ? criteria.areas
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s)
          : []
      );
      setReferenceTags(
        criteria?.references
          ? criteria.references
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : []
      );
    } else {
      // Reset form for new criteria
      setFormData({
        id: 0,
        name: "",
        areas: "",
        references: "",
        active: 1,
      });
      setIsActive(true);
      setAreaTags([]);
      setReferenceTags([]);
    }
  }, [criteria]);

  // Update form data when tags change
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      areas: areaTags.join(", "),
      references: referenceTags.join(", "),
      active: isActive ? 1 : 0,
    }));
  }, [areaTags, referenceTags, isActive]);

  const loadAvailableAreas = async () => {
    try {
      const areas = await auditAreaService.getAuditAreas();
      setAvailableAreas(areas);
    } catch (err) {
      console.error("Failed to load audit areas:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitData = {
        cra_name: formData.name,
        cra_areas: formData.areas,
        cra_references: formData.references,
        cra_active: formData.active,
      };

      if (criteria) {
        // Update existing criteria
        await onSave(submitData);
      } else {
        await onSave(submitData as CreateAuditCriteriaData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!criteria || !onDelete) return;

    if (
      !window.confirm(`Are you sure you want to delete "${criteria.name}"?`)
    ) {
      return;
    }

    setLoading(true);
    try {
      await onDelete(criteria.id);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete audit criteria"
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

  // Area tag management
  const addAreaTag = (areaName: string) => {
    if (areaName && !areaTags.includes(areaName)) {
      setAreaTags([...areaTags, areaName]);
    }
  };

  const removeAreaTag = (tag: string) => {
    setAreaTags(areaTags.filter((t) => t !== tag));
  };

  const handleAreaSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      addAreaTag(e.target.value);
      e.target.value = "";
    }
  };

  const addReferenceTag = (reference: string) => {
    if (reference && !referenceTags.includes(reference)) {
      setReferenceTags([...referenceTags, reference]);
    }
  };

  const removeReferenceTag = (tag: string) => {
    setReferenceTags(referenceTags.filter((t) => t !== tag));
  };

  const handleReferenceSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      addReferenceTag(e.target.value);
      e.target.value = "";
    }
  };

  // Handle new audit area creation
  const handleNewAreaSave = async (areaData: any) => {
    try {
      const newArea = await auditAreaService.createAuditArea({
        name: areaData.name,
        parentId: areaData.parentId,
        active: areaData.active,
      });

      // Refresh available areas
      await loadAvailableAreas();

      // Add the new area to tags
      addAreaTag(newArea.name);

      setShowAreaModal(false);
    } catch (err) {
      throw err;
    }
  };

  const handleAddReferece = (referenceName: string) => {
    addReferenceTag(referenceName);
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-500/75 bg-opacity-20 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-dost-white z-50">
            <h2 className="text-lg font-bold text-dost-black font-manrope">
              Audit Criteria
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
                <label className="block text-sm text-gray-600 mb-1">
                  Name/Title
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-dost-blue focus:border-dost-blue outline-none text-sm"
                />
              </div>

              {/* Audit Area with capsules */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Audit Area
                </label>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {areaTags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 bg-dost-blue text-dost-white text-xs rounded-full"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeAreaTag(tag)}
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
                      onChange={handleAreaSelect}
                      className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-dost-blue focus:border-dost-blue outline-none text-sm cursor-pointer"
                    >
                      <option value="">Select Audit Area</option>
                      {availableAreas.map((area) => (
                        <option key={area.id} value={area.name}>
                          {area.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowAreaModal(true)}
                      className="p-1.5 bg-dost-blue text-white rounded-md hover:bg-dost-blue-dark cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Reference with capsules */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Reference
                </label>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {referenceTags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 bg-dost-blue text-dost-white text-xs rounded-full"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeReferenceTag(tag)}
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
                      onChange={handleReferenceSelect}
                      className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-dost-blue focus:border-dost-blue outline-none text-sm cursor-pointer"
                    >
                      <option value="">Select Reference</option>
                      {availableReferences.map((ref, idx) => (
                        <option key={idx} value={ref}>
                          {ref}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowReferenceModal(true)}
                      className="p-1.5 bg-dost-blue text-white rounded-md hover:bg-dost-blue-dark cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="flex justify-end items-center pt-2 space-x-4">
              {criteria ? (
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

      {/* Audit Area Modal */}
      {showAreaModal && (
        <AuditAreaModal
          auditArea={null}
          parentAuditAreas={availableAreas.filter(
            (area) => area.parentId === null
          )}
          onSave={handleNewAreaSave}
          onClose={() => setShowAreaModal(false)}
        />
      )}

      {/* Add Expertise Modal */}
      <AddOptionModal
        isOpen={showReferenceModal}
        onClose={() => setShowReferenceModal(false)}
        onAdd={handleAddReferece}
        title="Expertise"
        placeholder="Enter expertise area"
        label="Expertise Area"
      />
    </>
  );
}

export default AuditCriteriaModal;
