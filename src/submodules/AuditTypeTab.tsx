import { useState, useEffect } from "react";
import { auditTypeService, type AuditType } from "../services/auditTypeService";
import Table from "../components/Table";
import AuditTypeModal from "../components/AuditTypeModal";
import type { TabProps } from "../types/libraryTypes";

const AuditTypeTab: React.FC<TabProps> = ({
  searchTerm,
  onDataCount,
  setAddAction,
}) => {
  const [auditTypes, setAuditTypes] = useState<AuditType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingType, setEditingType] = useState<AuditType | null>(null);

  useEffect(() => {
    loadAuditTypes();
  }, []);

  useEffect(() => {
    if (setAddAction) {
      setAddAction(() => handleAddType);
      return () => setAddAction(null);
    }
  }, [setAddAction]);

  const loadAuditTypes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await auditTypeService.getAuditTypes();
      setAuditTypes(data);
      onDataCount(data.length);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load audit types"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddType = () => {
    setEditingType(null);
    setShowModal(true);
  };

  const handleEditType = (auditType: AuditType) => {
    setEditingType(auditType);
    setShowModal(true);
  };

  const handleDeleteType = async (id: number) => {
    try {
      await auditTypeService.deleteAuditType(id);
      setAuditTypes((prev) => prev.filter((type) => type.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete audit type"
      );
    }
  };

  const handleSaveType = async (typeData: any) => {
    try {
      if (editingType) {
        const updated = await auditTypeService.updateAuditType(
          editingType.id,
          typeData
        );
        setAuditTypes((prev) =>
          prev.map((type) => (type.id === editingType.id ? updated : type))
        );
      } else {
        const created = await auditTypeService.createAuditType(typeData);
        setAuditTypes((prev) => [...prev, created]);
      }
      setShowModal(false);
      setEditingType(null);
    } catch (err) {
      throw err;
    }
  };

  // Filter data based on search term
  const filteredData = auditTypes.filter((type) =>
    type.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Update data count when filtered data changes
  useEffect(() => {
    onDataCount(filteredData.length);
  }, [filteredData.length, onDataCount]);

  const formatDataForTable = (data: AuditType[]) => {
    return data.map((type) => ({
      name: (
        <div
          className="cursor-pointer text-dost-black"
          onClick={() => handleEditType(type)}
        >
          {type.name}
        </div>
      ),
    }));
  };

  const headers = ["Types of Audit"];

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

      <Table headers={headers} data={formatDataForTable(filteredData)} />

      {showModal && (
        <AuditTypeModal
          auditType={editingType}
          onSave={handleSaveType}
          onClose={() => {
            setShowModal(false);
            setEditingType(null);
          }}
          onDelete={handleDeleteType}
        />
      )}
    </>
  );
};

export default AuditTypeTab;
