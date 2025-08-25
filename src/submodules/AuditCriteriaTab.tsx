import { useState, useEffect } from "react";
import {
  auditCriteriaService,
  type AuditCriteria,
} from "../services/auditCriteriaService";
import Table from "../components/Table";
import AuditCriteriaModal from "../components/AuditCriteriaModal";
import type { TabProps } from "../types/libraryTypes";

const AuditCriteriaTab: React.FC<TabProps> = ({
  searchTerm,
  onDataCount,
  setAddAction,
}) => {
  const [auditCriteria, setAuditCriteria] = useState<AuditCriteria[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCriteria, setEditingCriteria] = useState<AuditCriteria | null>(
    null
  );

  useEffect(() => {
    loadAuditCriteria();
  }, []);

  useEffect(() => {
    if (setAddAction) {
      setAddAction(() => handleAddCriteria);
      return () => setAddAction(null);
    }
  }, [setAddAction]);

  const loadAuditCriteria = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await auditCriteriaService.getAuditCriteria();
      setAuditCriteria(data);
      onDataCount(data.length);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load audit criteria"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddCriteria = () => {
    setEditingCriteria(null);
    setShowModal(true);
  };

  const handleEditCriteria = (criteria: AuditCriteria) => {
    setEditingCriteria(criteria);
    setShowModal(true);
  };

  const handleDeleteCriteria = async (id: number) => {
    try {
      await auditCriteriaService.deleteAuditCriterion(id);
      setAuditCriteria((prev) => prev.filter((criteria) => criteria.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete audit criteria"
      );
    }
  };

  const handleSaveCriteria = async (criteriaData: any) => {
    try {
      if (editingCriteria) {
        const updated = await auditCriteriaService.updateAuditCriterion(
          editingCriteria.id,
          criteriaData
        );
        setAuditCriteria((prev) =>
          prev.map((criteria) =>
            criteria.id === editingCriteria.id ? updated : criteria
          )
        );
      } else {
        const { id, ...dataWithoutId } = criteriaData;
        const created = await auditCriteriaService.createAuditCriterion(
          dataWithoutId
        );
        setAuditCriteria((prev) => [...prev, created]);
      }
      setShowModal(false);
      setEditingCriteria(null);
    } catch (err) {
      throw err;
    }
  };

  // Filter data based on search term
  const filteredData = auditCriteria.filter(
    (criteria) =>
      criteria.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      criteria.areas.toLowerCase().includes(searchTerm.toLowerCase()) ||
      criteria.references.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Update data count when filtered data changes
  useEffect(() => {
    onDataCount(filteredData.length);
  }, [filteredData.length, onDataCount]);

  const formatList = (text: string) => {
    return (
      <div className="text-sm text-dost-black whitespace-pre-line">
        {text.split(",").map((item, index) => (
          <div key={index}>{item.trim()}</div>
        ))}
      </div>
    );
  };

  const formatDataForTable = (data: AuditCriteria[]) => {
    return data.map((criteria) => ({
      name: (
        <div
          className="cursor-pointer text-dost-black"
          onClick={() => handleEditCriteria(criteria)}
        >
          {criteria.name}
        </div>
      ),
      areas: (
        <div
          className="cursor-pointer"
          onClick={() => handleEditCriteria(criteria)}
        >
          {formatList(criteria.areas)}
        </div>
      ),
      references: (
        <div
          className="cursor-pointer"
          onClick={() => handleEditCriteria(criteria)}
        >
          {formatList(criteria.references)}
        </div>
      ),
    }));
  };

  const headers = ["Audit Criteria", "Audit Area", "Reference"];

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
        <AuditCriteriaModal
          criteria={editingCriteria}
          onSave={handleSaveCriteria}
          onClose={() => {
            setShowModal(false);
            setEditingCriteria(null);
          }}
          onDelete={handleDeleteCriteria}
        />
      )}
    </>
  );
};

export default AuditCriteriaTab;
