import { useState, useEffect } from "react";
import { X, Plus, Minus, GripVertical } from "lucide-react";
import { auditAreaService, type AuditArea } from "../services/auditAreaService";
import type {
  InternalControl,
  CreateInternalControlData,
  UpdateInternalControlData,
} from "../services/internalControlService";

interface InternalControlModalProps {
  internalControl: InternalControl | null;
  onSave: (
    data: CreateInternalControlData | UpdateInternalControlData
  ) => Promise<void>;
  onClose: () => void;
  onDelete?: (id: number) => Promise<void>;
}

interface ComponentItem {
  sequenceNumber: number;
  description: string;
}

function InternalControlModal({
  internalControl,
  onSave,
  onClose,
  onDelete,
}: InternalControlModalProps) {
  const [formData, setFormData] = useState({
    auditAreaId: internalControl?.auditAreaId,
    category: "",
    description: "",
    active: 1,
  });
  const [components, setComponents] = useState<ComponentItem[]>([]);
  const [auditAreas, setAuditAreas] = useState<AuditArea[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    loadAuditAreas();
  }, []);

  useEffect(() => {
    if (internalControl) {
      setFormData({
        auditAreaId: internalControl.auditAreaId,
        category: internalControl.category,
        description: internalControl.description,
        active: internalControl.active ? 1 : 0,
      });
      setIsActive(internalControl.active);
      setComponents(internalControl.components || []);
    } else {
      // Reset form for new internal control
      setFormData({
        auditAreaId: 0,
        category: "",
        description: "",
        active: 1,
      });
      setIsActive(true);
      setComponents([]);
    }
  }, [internalControl]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      active: isActive ? 1 : 0,
    }));
  }, [isActive]);

  const loadAuditAreas = async () => {
    setLoadingAreas(true);
    try {
      const areas = await auditAreaService.getAuditAreas();
      setAuditAreas(areas.filter((area) => area.active));
    } catch (err) {
      console.error("Failed to load audit areas:", err);
    } finally {
      setLoadingAreas(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const componentsData = components.map((comp, index) => ({
        com_seqnum: index + 1,
        com_desc: comp.description,
      }));

      if (internalControl) {
        // Update existing internal control
        await onSave({
          ic_ara_id: formData.auditAreaId,
          ic_category: formData.category,
          ic_desc: formData.description,
          ic_active: formData.active,
          components: componentsData,
        });
      } else {
        // Create new internal control
        await onSave({
          ic_ara_id: formData.auditAreaId,
          ic_category: formData.category,
          ic_desc: formData.description,
          ic_active: formData.active,
          components: componentsData,
        } as CreateInternalControlData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!internalControl || !onDelete) return;

    if (
      !window.confirm(
        `Are you sure you want to delete "${internalControl.category}"?`
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      await onDelete(internalControl.id);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete internal control"
      );
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
      [name]: name === "auditAreaId" ? parseInt(value) || 0 : value,
    }));
  };

  const addComponent = () => {
    setComponents((prev) => [
      ...prev,
      {
        sequenceNumber: prev.length + 1,
        description: "",
      },
    ]);
  };

  const removeComponent = (index: number) => {
    setComponents((prev) => prev.filter((_, i) => i !== index));
  };

  const updateComponent = (index: number, description: string) => {
    setComponents((prev) =>
      prev.map((comp, i) => (i === index ? { ...comp, description } : comp))
    );
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const newComponents = [...components];
    const draggedComponent = newComponents[draggedIndex];
    newComponents.splice(draggedIndex, 1);
    newComponents.splice(targetIndex, 0, draggedComponent);

    setComponents(newComponents);
    setDraggedIndex(null);
  };

  return (
    <div className="fixed inset-0 bg-gray-500/75 bg-opacity-20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-dost-white z-50">
          <h2 className="text-lg font-bold text-dost-black font-manrope">
            Internal Control
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
            {/* Audit Area */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Audit Area
              </label>
              <select
                name="auditAreaId"
                value={formData.auditAreaId}
                onChange={handleChange}
                required
                disabled={loadingAreas}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-dost-blue focus:border-dost-blue outline-none text-sm cursor-pointer"
              >
                <option value={0}>Select Audit Area</option>
                {auditAreas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-dost-blue focus:border-dost-blue outline-none text-sm"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={2}
                className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-dost-blue focus:border-dost-blue outline-none text-sm resize-vertical"
              />
            </div>

            {/* Components Section */}
            <div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Components
                </label>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {components.map((component, index) => (
                    <div
                      key={index}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      className="flex items-start gap-2 p-2  rounded cursor-move hover:bg-gray-100 transition-colors"
                    >
                      <GripVertical className="w-4 h-4 text-gray-400 mt-2 flex-shrink-0" />
                      <input
                        type="text"
                        value={component.description}
                        onChange={(e) => updateComponent(index, e.target.value)}
                        placeholder="Enter component description..."
                        className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-dost-blue focus:border-dost-blue outline-none text-sm"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => removeComponent(index)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded-full transition-colors flex-shrink-0 cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {/* Add new component row */}
                  <div className="flex items-start gap-2 p-2 rounded">
                    <GripVertical className="w-4 h-4 text-gray-300 mt-2 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Add new component..."
                      disabled
                      className="flex-1 px-2 py-1 border border-gray-200 rounded bg-gray-100 text-gray-400 cursor-not-allowed text-sm"
                    />
                    <button
                      type="button"
                      onClick={addComponent}
                      className="p-1 text-dost-blue hover:bg-dost-blue/10 rounded-full transition-colors flex-shrink-0 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex justify-end items-center pt-2 space-x-4">
            {internalControl ? (
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

export default InternalControlModal;
