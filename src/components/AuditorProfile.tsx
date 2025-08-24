import { useState } from "react";
import { ChevronLeft, Edit } from "lucide-react";
import { auditorService, type Auditor } from "../services/auditorService";
import AuditorModal from "./AuditorModal";
import Table from "./Table";

interface AuditorProfileProps {
  auditor: Auditor;
  onBack: () => void;
  onAuditorUpdated: (updatedAuditor: Auditor) => void;
  onAuditorDeleted: (deletedId: number) => void;
}

const AuditorProfile: React.FC<AuditorProfileProps> = ({
  auditor,
  onBack,
  onAuditorUpdated,
  onAuditorDeleted,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleSaveAuditor = async (auditorData: any) => {
    try {
      // Sanitize numeric fields before sending
      const cleanedData = {
        ...auditorData,
        aur_salary_grade: auditorData.aur_salary_grade
          ? Number(auditorData.aur_salary_grade)
          : null,
        aur_external: auditorData.aur_external ? 1 : 0,
        aur_agn_id: auditorData.aur_agn_id
          ? Number(auditorData.aur_agn_id)
          : null,
        aur_status: auditorData.aur_status ? Number(auditorData.aur_status) : 1,
        aur_active: auditorData.aur_active ? 1 : 0,
        // Convert empty strings to null for optional fields
        aur_name_middle: auditorData.aur_name_middle || null,
        aur_name_prefix: auditorData.aur_name_prefix || null,
        aur_name_suffix: auditorData.aur_name_suffix || null,
        aur_position: auditorData.aur_position || null,
        aur_expertise: auditorData.aur_expertise || null,
        aur_birthdate: auditorData.aur_birthdate || null,
        aur_contact_no: auditorData.aur_contact_no || null,
        aur_tin: auditorData.aur_tin || null,
        aur_photo: auditorData.aur_photo || null,
      };

      console.log("Updating auditor with payload:", cleanedData);

      const updated = await auditorService.updateAuditor(
        auditor.id,
        cleanedData
      );
      onAuditorUpdated(updated);
      setShowEditModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update auditor");
      throw err;
    }
  };

  const handleDeleteAuditor = async (id: number) => {
    try {
      await auditorService.deleteAuditor(id);
      onAuditorDeleted(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete auditor");
      throw err;
    }
  };

  // Mock engagement data
  const mockEngagements = [
    {
      id: 1,
      auditTitle: "Audit on DOST Sectoral Planning Councils",
      auditee: "PCASTRD, PCPERD, PCIEERD",
      duration: "25 May 2023 - 5 Jun 2024",
      auditArea: "Project Management",
      rating: 4.8,
    },
    {
      id: 2,
      auditTitle: "National Research Council of the Philippines (NRCP) Audit",
      auditee: "NRCP",
      duration: "13 Jan 2023 - 20 Apr 2023",
      auditArea: "Technology Transfer",
      rating: 4.5,
    },
  ];

  // Prepare data for the Table component
  const tableHeaders = [
    "#",
    "Audit Title",
    "Auditee",
    "Duration",
    "Audit Area",
    "Rating",
  ];
  const tableData = mockEngagements.map((engagement, index) => ({
    "#": index + 1,
    "Audit Title": engagement.auditTitle,
    Auditee: engagement.auditee,
    Duration: engagement.duration,
    "Audit Area": engagement.auditArea,
    Rating: (
      <div className="flex items-center">
        <span className="text-yellow-500 mr-1">★</span>
        <span>{engagement.rating}</span>
      </div>
    ),
  }));

  return (
    <div className="p-6">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-6 mb-6">
        {/* Back button */}
        <button
          onClick={onBack}
          className="bg-dost-black text-dost-white p-2 rounded-full hover:bg-dost-blue transition-colors cursor-pointer flex-shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Profile Card */}
        <div className="bg-white border border-gray-200 p-6 flex-1">
          <div className="flex items-start justify-start gap-32">
            <div className="flex items-center">
              {/* Avatar */}
              <div className="w-20 h-20 bg-dost-blue rounded-lg mr-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {(auditor.firstName || "").charAt(0)}
                  {(auditor.lastName || "").charAt(0)}
                </span>
              </div>

              {/* Basic Info */}
              <div>
                <div className="flex items-center mb-2">
                  <h1 className="text-xl font-bold text-dost-black mr-3">
                    {getFullName(auditor)}
                  </h1>
                  <button
                    onClick={handleEditClick}
                    className="p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                  >
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                <div className="space-y-1 text-sm">
                  <div>
                    <span className="font-medium text-dost-blue">
                      Position:
                    </span>
                    <span className="ml-2 text-gray-700">
                      {auditor.position || "Not specified"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-dost-blue">Agency:</span>
                    <span className="ml-2 text-gray-700">
                      {auditor.agencyName || "No agency assigned"}
                    </span>
                  </div>

                  <div>
                    <span className="font-medium text-dost-blue">
                      Expertise:
                    </span>
                    <span className="ml-2 text-gray-700">
                      {auditor.expertise || "Not specified"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status and Connected info */}
            <div className="flex flex-col space-y-2 text-left">
              <div>
                <span className="text-sm font-semibold text-dost-blue">
                  Status:
                </span>
                <span className="ml-2 text-sm text-gray-700">
                  {auditor.active ? "Active" : "Inactive"}
                </span>
              </div>
              <div>
                <span className="text-sm font-semibold text-dost-blue">
                  Birthdate:
                </span>
                <span className="ml-2 text-sm text-gray-700">
                  {auditor.birthdate
                    ? new Date(auditor.birthdate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "Not specified"}
                </span>
              </div>
              <div>
                <span className="text-sm font-semibold text-dost-blue">
                  Email Address:
                </span>
                <span className="ml-2 text-sm text-gray-700">
                  {auditor.email}
                </span>
              </div>
              <div>
                <span className="text-sm font-semibold text-dost-blue">
                  Contact No.:
                </span>
                <span className="ml-2 text-sm text-gray-700">
                  {auditor.contactNo || "Not specified"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Engagements Section */}
      <div className="bg-white border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-dost-black mb-4">ENGAGEMENTS</h2>

        {/* Use the reusable Table component */}
        <Table headers={tableHeaders} data={tableData} />
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <AuditorModal
          auditor={auditor}
          onSave={handleSaveAuditor}
          onClose={() => setShowEditModal(false)}
          onDelete={handleDeleteAuditor}
        />
      )}
    </div>
  );
};

export default AuditorProfile;
