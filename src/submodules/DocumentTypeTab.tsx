import { useState, useEffect } from "react";
import {
  documentTypeService,
  type DocumentType,
} from "../services/documentTypeService";
import Table from "../components/Table";
import DocumentTypeModal from "../components/DocumentTypeModal";
import type { TabProps } from "../types/libraryTypes";

const DocumentTypeTab: React.FC<TabProps> = ({
  searchTerm,
  onDataCount,
  setAddAction,
}) => {
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingType, setEditingType] = useState<DocumentType | null>(null);

  useEffect(() => {
    loadDocumentTypes();
  }, []);

  useEffect(() => {
    if (setAddAction) {
      setAddAction(() => handleAddType);
      return () => setAddAction(null);
    }
  }, [setAddAction]);

  const loadDocumentTypes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await documentTypeService.getDocumentTypes();
      setDocumentTypes(data);
      onDataCount(data.length);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load document types"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddType = () => {
    setEditingType(null);
    setShowModal(true);
  };

  const handleEditType = (documentType: DocumentType) => {
    setEditingType(documentType);
    setShowModal(true);
  };

  const handleDeleteType = async (id: number) => {
    try {
      await documentTypeService.deleteDocumentType(id);
      setDocumentTypes((prev) => prev.filter((type) => type.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete document type"
      );
    }
  };

  const handleSaveType = async (typeData: any) => {
    try {
      if (editingType) {
        const updated = await documentTypeService.updateDocumentType(
          editingType.id,
          typeData
        );
        setDocumentTypes((prev) =>
          prev.map((type) => (type.id === editingType.id ? updated : type))
        );
      } else {
        const created = await documentTypeService.createDocumentType(typeData);
        setDocumentTypes((prev) => [...prev, created]);
      }
      setShowModal(false);
      setEditingType(null);
    } catch (err) {
      throw err;
    }
  };

  // Filter data based on search term
  const filteredData = documentTypes.filter((type) =>
    type.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Update data count when filtered data changes
  useEffect(() => {
    onDataCount(filteredData.length);
  }, [filteredData.length, onDataCount]);

  const formatDataForTable = (data: DocumentType[]) => {
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

  const headers = ["Types of Document"];

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
        <DocumentTypeModal
          documentType={editingType}
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

export default DocumentTypeTab;
