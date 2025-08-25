import { useState, useEffect } from "react";
import { auditorService, type Auditor } from "../services/auditorService";
import Table from "../components/Table";
import AuditorProfile from "../components/AuditorProfile";
import AuditorModal from "../components/AuditorModal";
import type { TabProps } from "../types/libraryTypes";

const AuditorsTab: React.FC<TabProps> = ({
  searchTerm,
  onDataCount,
  setAddAction,
  onShowingProfile,
}) => {
  const [auditors, setAuditors] = useState<Auditor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAuditor, setSelectedAuditor] = useState<Auditor | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadAuditors();
  }, []);

  useEffect(() => {
    if (setAddAction) {
      setAddAction(() => handleAddAuditor);
      return () => setAddAction(null);
    }
  }, [setAddAction]);

  useEffect(() => {
    // Cleanup function to reset profile state when component unmounts
    return () => {
      onShowingProfile(false);
    };
  }, [onShowingProfile]);

  const loadAuditors = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await auditorService.getAuditors();
      setAuditors(data);
      onDataCount(data.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load auditors");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAuditor = () => {
    setShowAddModal(true);
  };

  const handleSelectAuditor = (auditor: Auditor) => {
    setSelectedAuditor(auditor);
    onShowingProfile(true);
  };

  const handleBackToTable = () => {
    setSelectedAuditor(null);
    onShowingProfile(false);
  };

  const handleAuditorUpdated = (updatedAuditor: Auditor) => {
    setAuditors((prev) =>
      prev.map((auditor) =>
        auditor.id === updatedAuditor.id ? updatedAuditor : auditor
      )
    );
    setSelectedAuditor(updatedAuditor);
  };

  const handleAuditorDeleted = (deletedId: number) => {
    setAuditors((prev) => prev.filter((auditor) => auditor.id !== deletedId));
    setSelectedAuditor(null);
    onShowingProfile(false);
  };

  const handleAuditorCreated = async (auditorData: any) => {
    try {
      const created = await auditorService.createAuditor(auditorData);
      setAuditors((prev) => [...prev, created]);
      setShowAddModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create auditor");
      throw err;
    }
  };

  // Helper function to get full name
  const getFullName = (auditor: Auditor) => {
    const parts = [
      auditor.namePrefix,
      auditor.firstName,
      auditor.middleName,
      auditor.lastName,
      auditor.nameSuffix,
    ].filter(Boolean);
    return parts.join(" ");
  };

  // Filter data based on search term
  const filteredData = auditors.filter((auditor) => {
    const fullName = getFullName(auditor);
    const searchLower = searchTerm.toLowerCase();

    return (
      fullName.toLowerCase().includes(searchLower) ||
      (auditor.email && auditor.email.toLowerCase().includes(searchLower)) ||
      (auditor.position &&
        auditor.position.toLowerCase().includes(searchLower)) ||
      (auditor.expertise &&
        auditor.expertise.toLowerCase().includes(searchLower)) ||
      (auditor.contactNo &&
        auditor.contactNo.toLowerCase().includes(searchLower))
    );
  });

  // Update data count when filtered data changes
  useEffect(() => {
    onDataCount(filteredData.length);
  }, [filteredData.length, onDataCount]);

  const formatDataForTable = (data: Auditor[]) => {
    return data.map((auditor) => ({
      name: (
        <div
          className="flex items-center cursor-pointer"
          onClick={() => handleSelectAuditor(auditor)}
        >
          <div className="min-w-8 max-w-8 w-8 h-8 bg-dost-blue rounded mr-3 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">
              {(auditor.firstName || "").charAt(0)}
              {(auditor.lastName || "").charAt(0)}
            </span>
          </div>
          <span className="text-dost-black">{getFullName(auditor)}</span>
        </div>
      ),
      agencyPosition: (
        <div
          className="text-dost-black cursor-pointer"
          onClick={() => handleSelectAuditor(auditor)}
        >
          <div className="font-medium">
            {auditor.agencyId ? `${auditor.agencyName}` : "No Agency"}
          </div>
          <div className="text-sm text-gray-600">
            {auditor.position || "No Position"}
          </div>
        </div>
      ),
      contactDetails: (
        <div
          className="text-dost-black cursor-pointer"
          onClick={() => handleSelectAuditor(auditor)}
        >
          <div className="text-sm">{auditor.email}</div>
          <div className="text-sm text-gray-600">
            {auditor.contactNo || "No contact"}
          </div>
        </div>
      ),
      birthdate: (
        <span
          className="text-dost-black cursor-pointer"
          onClick={() => handleSelectAuditor(auditor)}
        >
          {auditor.birthdate
            ? new Date(auditor.birthdate).toLocaleDateString()
            : "N/A"}
        </span>
      ),
      expertise: (
        <span
          className="text-dost-black cursor-pointer"
          onClick={() => handleSelectAuditor(auditor)}
        >
          {auditor.expertise || "N/A"}
        </span>
      ),
      engagements: (
        <span
          className="text-dost-black cursor-pointer"
          onClick={() => handleSelectAuditor(auditor)}
        >
          {/* Mock data since this is from other modules */}
          {Math.floor(Math.random() * 10) + 1}
        </span>
      ),
      rating: (
        <div
          className="text-dost-black cursor-pointer"
          onClick={() => handleSelectAuditor(auditor)}
        >
          {/* Mock data since this is from other modules */}
          <div className="flex items-center">
            <span className="text-yellow-500">★</span>
            <span className="ml-1">{(Math.random() * 2 + 3).toFixed(1)}</span>
          </div>
        </div>
      ),
    }));
  };

  const headers = [
    "Name",
    "Agency & Position",
    "Contact Details",
    "Birthdate",
    "Expertise",
    "Engagements",
    "Rating",
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <span className="loader"></span>
      </div>
    );
  }

  // Show profile view if an auditor is selected
  if (selectedAuditor) {
    return (
      <AuditorProfile
        auditor={selectedAuditor}
        onBack={handleBackToTable}
        onAuditorUpdated={handleAuditorUpdated}
        onAuditorDeleted={handleAuditorDeleted}
      />
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

      {showAddModal && (
        <AuditorModal
          auditor={null}
          onSave={handleAuditorCreated}
          onClose={() => setShowAddModal(false)}
          onDelete={() => Promise.resolve()}
        />
      )}
    </>
  );
};

export default AuditorsTab;
