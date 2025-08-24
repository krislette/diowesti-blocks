import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { agencyService, type Agency } from "../services/agencyService";
import Table from "../components/Table";
import AgencyModal from "../components/AgencyModal";
import type { TabProps } from "../types/libraryTypes";

const AgenciesTab: React.FC<TabProps> = ({ searchTerm, onDataCount }) => {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingAgency, setEditingAgency] = useState<Agency | null>(null);

  useEffect(() => {
    loadAgencies();
  }, []);

  const loadAgencies = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await agencyService.getAgencies();
      setAgencies(data);
      onDataCount(data.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load agencies");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAgency = () => {
    setEditingAgency(null);
    setShowModal(true);
  };

  const handleEditAgency = (agency: Agency) => {
    setEditingAgency(agency);
    setShowModal(true);
  };

  const handleDeleteAgency = async (id: number) => {
    try {
      await agencyService.deleteAgency(id);
      setAgencies((prev) => prev.filter((agency) => agency.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete agency");
    }
  };

  const handleSaveAgency = async (agencyData: any) => {
    try {
      if (editingAgency) {
        const updated = await agencyService.updateAgency(
          editingAgency.id,
          agencyData
        );
        setAgencies((prev) =>
          prev.map((agency) =>
            agency.id === editingAgency.id ? updated : agency
          )
        );
      } else {
        const created = await agencyService.createAgency(agencyData);
        setAgencies((prev) => [...prev, created]);
      }
      setShowModal(false);
      setEditingAgency(null);
    } catch (err) {
      throw err;
    }
  };

  // Filter data based on search term
  const filteredData = agencies.filter(
    (agency) =>
      agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.acronym.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.classificationGroup
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      agency.headOfAgency.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Update data count when filtered data changes
  useEffect(() => {
    onDataCount(filteredData.length);
  }, [filteredData.length, onDataCount]);

  const formatDataForTable = (data: Agency[]) => {
    return data.map((agency) => ({
      name: (
        <div
          className="flex items-center cursor-pointer"
          onClick={() => handleEditAgency(agency)}
        >
          <div className="w-8 h-8 bg-dost-blue rounded mr-3 flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {agency.name.charAt(0)}
            </span>
          </div>
          <span className="text-dost-black">{agency.name}</span>
        </div>
      ),
      contactDetails: (
        <div
          className="text-dost-black whitespace-pre-line cursor-pointer"
          onClick={() => handleEditAgency(agency)}
        >
          {agency.contactDetails}
        </div>
      ),
      headOfAgencyPosition: (
        <div
          className="text-dost-black cursor-pointer"
          onClick={() => handleEditAgency(agency)}
        >
          <div className="font-medium">{agency.headOfAgency}</div>
          <div className="text-sm text-gray-600">{agency.position}</div>
        </div>
      ),
      classificationGroup: (
        <span
          className="text-dost-black cursor-pointer"
          onClick={() => handleEditAgency(agency)}
        >
          {agency.classificationGroup}
        </span>
      ),
    }));
  };

  const headers = [
    "Name",
    "Contact Details",
    "Head of Agency & Position",
    "Classification/Group",
  ];

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

      <div className="py-4">
        <div className="flex justify-end">
          <button
            onClick={handleAddAgency}
            className="bg-dost-black text-dost-white p-2 rounded-full hover:bg-dost-blue transition-colors cursor-pointer disabled:opacity-50"
            disabled={loading}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <Table headers={headers} data={formatDataForTable(filteredData)} />

      {showModal && (
        <AgencyModal
          agency={editingAgency}
          onSave={handleSaveAgency}
          onClose={() => {
            setShowModal(false);
            setEditingAgency(null);
          }}
          onDelete={handleDeleteAgency}
        />
      )}
    </>
  );
};

export default AgenciesTab;
