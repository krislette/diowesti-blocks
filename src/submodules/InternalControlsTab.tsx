// InternalControlTab.tsx
import { useState, useEffect } from "react";
import {
  internalControlService,
  type InternalControl,
} from "../services/internalControlService";
import InternalControlModal from "../components/InternalControlModal";
import NumberedTreeNode from "../components/NumberedTreeNode";
import type { TabProps } from "../types/libraryTypes";

const InternalControlTab: React.FC<TabProps> = ({
  searchTerm,
  onDataCount,
  setAddAction,
}) => {
  const [internalControls, setInternalControls] = useState<InternalControl[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingControl, setEditingControl] = useState<InternalControl | null>(
    null
  );

  useEffect(() => {
    loadInternalControls();
  }, []);

  useEffect(() => {
    if (setAddAction) {
      setAddAction(() => handleAddControl);
      return () => setAddAction(null);
    }
  }, [setAddAction]);

  const loadInternalControls = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await internalControlService.getInternalControls();
      setInternalControls(data);
      onDataCount(data.length);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load internal controls"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddControl = () => {
    setEditingControl(null);
    setShowModal(true);
  };

  const handleEditControl = (control: InternalControl) => {
    setEditingControl(control);
    setShowModal(true);
  };

  const handleDeleteControl = async (id: number) => {
    try {
      await internalControlService.deleteInternalControl(id);
      setInternalControls((prev) =>
        prev.filter((control) => control.id !== id)
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete internal control"
      );
    }
  };

  const handleSaveControl = async (controlData: any) => {
    try {
      if (editingControl) {
        const updated = await internalControlService.updateInternalControl(
          editingControl.id,
          controlData
        );
        setInternalControls((prev) =>
          prev.map((control) =>
            control.id === editingControl.id ? updated : control
          )
        );
      } else {
        const created = await internalControlService.createInternalControl(
          controlData
        );
        setInternalControls((prev) => [...prev, created]);
      }
      setShowModal(false);
      setEditingControl(null);
    } catch (err) {
      throw err;
    }
  };

  // Filter data based on search term
  const filteredData = internalControls.filter(
    (control) =>
      control.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      control.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      control.auditAreaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      control.components.some((comp) =>
        comp.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  // Update data count when filtered data changes
  useEffect(() => {
    onDataCount(filteredData.length);
  }, [filteredData.length, onDataCount]);

  // Transform internal controls into tree node format
  const formatDataForTree = (data: InternalControl[]) => {
    return data.map((control) => ({
      id: control.id,
      name: control.category,
      description: control.description,
      auditAreaName: control.auditAreaName,
      isExpanded: false,
      subControls: control.components.map((comp) => ({
        id: control.id + comp.sequenceNumber / 10, // Create unique ID for components
        name: comp.description,
        sequenceNumber: comp.sequenceNumber,
      })),
      onClick: () => handleEditControl(control),
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="mx-4 mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-dost-white">
            <tr>
              <th className="px-4 py-2 text-left text-xs text-dost-blue-dark tracking-wider border-b border-gray border-r border-gray-200 font-manrope font-[700]">
                Internal Control Components
              </th>
            </tr>
          </thead>
          <tbody>
            {formatDataForTree(filteredData).map((control) => (
              <NumberedTreeNode key={control.id} control={control} level={0} />
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td className="px-4 py-8 text-center text-gray-500">
                  No internal controls found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <InternalControlModal
          internalControl={editingControl}
          onSave={handleSaveControl}
          onClose={() => {
            setShowModal(false);
            setEditingControl(null);
          }}
          onDelete={handleDeleteControl}
        />
      )}
    </>
  );
};

export default InternalControlTab;
