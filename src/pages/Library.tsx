import { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import { agencyService, type Agency } from "../services/agencyService";
import { auditAreaService, type AuditArea } from "../services/auditAreaService";
import { auditorService, type Auditor } from "../services/auditorService";
import { libraryData } from "../data/libraryData";
import type { TabKey } from "../data/libraryData";
import Table from "../components/Table";
import TreeNode from "../components/TreeNode";
import NumberedTreeNode from "../components/NumberedTreeNode";
import AgencyModal from "../components/AgencyModal";
import AuditAreaModal from "../components/AuditAreaModal";
import AuditorModal from "../components/AuditorModal";

const tabs = [
  { key: "agencies" as TabKey, label: "Agencies" },
  { key: "auditors" as TabKey, label: "Auditors" },
  { key: "auditAreas" as TabKey, label: "Audit Areas" },
  { key: "auditCriteria" as TabKey, label: "Audit Criteria" },
  { key: "typesOfAudit" as TabKey, label: "Types of Audit" },
  { key: "internalControls" as TabKey, label: "Internal Controls" },
  { key: "documentTypes" as TabKey, label: "Types of Document" },
  { key: "userAccounts" as TabKey, label: "User Accounts" },
];

function Library() {
  const [activeTab, setActiveTab] = useState<TabKey>("agencies");
  const [searchTerm, setSearchTerm] = useState("");

  // Agency state
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [showAgencyModal, setShowAgencyModal] = useState(false);
  const [editingAgency, setEditingAgency] = useState<Agency | null>(null);

  // Auditor state
  const [auditors, setAuditors] = useState<Auditor[]>([]);
  const [showAuditorModal, setShowAuditorModal] = useState(false);
  const [editingAuditor, setEditingAuditor] = useState<Auditor | null>(null);

  // Common state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [auditAreas, setAuditAreas] = useState<AuditArea[]>([]);
  const [showAuditAreaModal, setShowAuditAreaModal] = useState(false);
  const [editingAuditArea, setEditingAuditArea] = useState<AuditArea | null>(
    null
  );

  // Load data when tab is active
  useEffect(() => {
    if (activeTab === "agencies") {
      loadAgencies();
    } else if (activeTab === "auditors") {
      loadAuditors();
    }
  }, [activeTab]);

  const loadAgencies = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await agencyService.getAgencies();
      setAgencies(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load agencies");
    } finally {
      setLoading(false);
    }
  };

  const loadAuditors = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await auditorService.getAuditors();
      setAuditors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load auditors");
    } finally {
      setLoading(false);
    }
  };

  // Agency handlers
  const handleAddAgency = () => {
    setEditingAgency(null);
    setShowAgencyModal(true);
  };

  const handleEditAgency = (agency: Agency) => {
    setEditingAgency(agency);
    setShowAgencyModal(true);
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
      setShowAgencyModal(false);
      setEditingAgency(null);
    } catch (err) {
      // Let the modal handle the error
      throw err;
    }
  };

  useEffect(() => {
    if (activeTab === "auditAreas") {
      loadAuditAreas();
    }
  }, [activeTab]);

  const loadAuditAreas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await auditAreaService.getAuditAreas();
      setAuditAreas(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load audit areas"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddAuditArea = () => {
    setEditingAuditArea(null);
    setShowAuditAreaModal(true);
  };

  const handleEditAuditArea = (auditArea: AuditArea) => {
    setEditingAuditArea(auditArea);
    setShowAuditAreaModal(true);
  };

  const handleDeleteAuditArea = async (id: number) => {
    try {
      await auditAreaService.deleteAuditArea(id);
      setAuditAreas((prev) => prev.filter((area) => area.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete audit area"
      );
    }
  };

  const handleSaveAuditArea = async (auditAreaData: any) => {
    try {
      if (editingAuditArea) {
        const updated = await auditAreaService.updateAuditArea(
          editingAuditArea.id,
          auditAreaData
        );
        setAuditAreas((prev) =>
          prev.map((area) => (area.id === editingAuditArea.id ? updated : area))
        );
      } else {
        const created = await auditAreaService.createAuditArea(auditAreaData);
        setAuditAreas((prev) => [...prev, created]);
      }
      setShowAuditAreaModal(false);
      setEditingAuditArea(null);
    } catch (err) {
      throw err;
    }
  };

  const buildAuditAreaHierarchy = (auditAreas: AuditArea[]): any[] => {
    const rootAreas = auditAreas.filter(
      (area) => area.parent_audit_area_id === area.id
    ); // Self-referencing items are roots

    const buildChildren = (parentId: number): any[] => {
      return auditAreas
        .filter(
          (area) =>
            area.parent_audit_area_id === parentId && area.id !== parentId
        ) // Exclude self-references
        .map((area) => ({
          id: area.id,
          name: area.name,
          subAreas: buildChildren(area.id),
          isExpanded: false,
          entriesCount: area.child_audit_areas?.length || 0,
        }));
    };

    return rootAreas.map((area) => ({
      id: area.id,
      name: area.name,
      subAreas: buildChildren(area.id),
      isExpanded: false,
      entriesCount: area.child_audit_areas?.length || 0,
    }));
  };

  const handleAuditAreaClick = (areaId: number) => {
    const auditArea = auditAreas.find((area) => area.id === areaId);
    if (auditArea) {
      handleEditAuditArea(auditArea);
    }
  };

  // Auditor handlers
  const handleAddAuditor = () => {
    setEditingAuditor(null);
    setShowAuditorModal(true);
  };

  const handleEditAuditor = (auditor: Auditor) => {
    setEditingAuditor(auditor);
    setShowAuditorModal(true);
  };

  const handleDeleteAuditor = async (id: number) => {
    try {
      await auditorService.deleteAuditor(id);
      setAuditors((prev) => prev.filter((auditor) => auditor.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete auditor");
    }
  };

  const handleSaveAuditor = async (auditorData: any) => {
    try {
      if (editingAuditor) {
        const updated = await auditorService.updateAuditor(
          editingAuditor.id,
          auditorData
        );
        setAuditors((prev) =>
          prev.map((auditor) =>
            auditor.id === editingAuditor.id ? updated : auditor
          )
        );
      } else {
        const created = await auditorService.createAuditor(auditorData);
        setAuditors((prev) => [...prev, created]);
      }
      setShowAuditorModal(false);
      setEditingAuditor(null);
    } catch (err) {
      // Let the modal handle the error
      throw err;
    }
  };

  const getCurrentData = () => {
    if (activeTab === "agencies") {
      return agencies;
    } 
    if (activeTab === "auditors") {
      return auditors;
    }
    if (activeTab === "auditAreas") {
      return auditAreas;
    }
    return libraryData[activeTab];
  };

  const currentData = getCurrentData();

  const formatDataForTable = (data: any[], tabKey: TabKey) => {
    if (tabKey === "auditAreas") {
      return [];
    }

    if (tabKey === "agencies") {
      return (data as Agency[]).map((agency) => ({
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
    }

    if (tabKey === "auditors") {
      return (data as Auditor[]).map((auditor) => ({
        name: (
          <div
            className="flex items-center cursor-pointer"
            onClick={() => handleEditAuditor(auditor)}
          >
            <span className="text-dost-black">{auditor.name}</span>
          </div>
        ),
        agencyPosition: (
          <div
            className="text-dost-black cursor-pointer"
            onClick={() => handleEditAuditor(auditor)}
          >
            <div className="font-medium">{auditor.agency}</div>
            <div className="text-sm text-gray-600">{auditor.position}</div>
          </div>
        ),
        contactDetails: (
          <div
            className="text-dost-black cursor-pointer"
            onClick={() => handleEditAuditor(auditor)}
          >
            {auditor.contactDetails}
          </div>
        ),
        birthdate: (
          <span
            className="text-dost-black cursor-pointer"
            onClick={() => handleEditAuditor(auditor)}
          >
            {new Date(auditor.birthdate).toLocaleDateString()}
          </span>
        ),
        expertise: (
          <span
            className="text-dost-black cursor-pointer"
            onClick={() => handleEditAuditor(auditor)}
          >
            {auditor.expertise}
          </span>
        ),
        engagements: (
          <span
            className="text-dost-black cursor-pointer"
            onClick={() => handleEditAuditor(auditor)}
          >
            {auditor.engagements || 0}
          </span>
        ),
        rating: (
          <div
            className="flex items-center cursor-pointer"
            onClick={() => handleEditAuditor(auditor)}
          >
            <div className="flex text-yellow-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={
                    star <= (auditor.rating || 0)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        ),
      }));
    }

    if (tabKey === "userAccounts") {
      return data.map((user) => ({
        name: user.name,
        agency: user.agency,
        emailAddress: user.emailAddress,
        levelOfAccess: (
          <span className="text-dost-black">
            {user.levelOfAccess.includes("inactive") ? (
              <>
                {user.levelOfAccess.replace(" (inactive)", "")}{" "}
                <span className="font-bold">(Inactive)</span>
              </>
            ) : (
              user.levelOfAccess
            )}
          </span>
        ),
        loggedIn: (
          <div className="flex items-center justify-center">
            <div
              className={`w-3 h-3 rounded-full ${
                user.loggedIn ? "bg-dost-blue" : "border-2 border-gray-400"
              }`}
            ></div>
          </div>
        ),
      }));
    }

    // For other tabs, format data based on column keys
    const columnKeys = getColumnKeys(tabKey);
    return data.map((item) => {
      const formattedItem: Record<string, any> = {};
      columnKeys.forEach((key) => {
        formattedItem[key] =
          typeof item[key] === "boolean"
            ? item[key]
              ? "Yes"
              : "No"
            : item[key];
      });
      return formattedItem;
    });
  };

  const getTableHeaders = (tabKey: TabKey) => {
    switch (tabKey) {
      case "agencies":
        return [
          "Name",
          "Contact Details",
          "Head of Agency & Position",
          "Classification/Group",
        ];
      case "auditors":
        return [
          "Name",
          "Agency & Position",
          "Contact Details",
          "Birthdate",
          "Expertise",
          "Engagements",
          "Rating",
        ];
      case "auditAreas":
        return ["Name", "Description", "Category"];
      case "auditCriteria":
        return ["Audit Criteria", "Audit Area", "Reference"];
      case "typesOfAudit":
        return ["Name", "Description", "Duration"];
      case "internalControls":
        return ["Name", "Description", "Category"];
      case "documentTypes":
        return ["Type of Document"];
      case "userAccounts":
        return [
          "Name",
          "Agency",
          "Email Address",
          "Level of Access",
          "Logged In",
        ];
      default:
        return [];
    }
  };

  const getColumnKeys = (tabKey: TabKey) => {
    switch (tabKey) {
      case "auditors":
        return [
          "name",
          "agencyPosition",
          "contactDetails",
          "birthdate",
          "expertise",
          "engagements",
          "rating",
        ];
      case "auditAreas":
        return ["name", "description", "category"];
      case "auditCriteria":
        return ["auditCriteria", "auditArea", "reference"];
      case "typesOfAudit":
        return ["name", "description", "duration"];
      case "internalControls":
        return ["name", "description", "category"];
      case "documentTypes":
        return ["typeOfDocument"];
      case "userAccounts":
        return ["name", "agency", "emailAddress", "levelOfAccess", "loggedIn"];
      default:
        return [];
    }
  };

  const handleAddClick = () => {
    if (activeTab === "agencies") {
      handleAddAgency();
    } else if (activeTab === "auditAreas") {
      handleAddAuditArea();
    } else if (activeTab === "auditors") {
      handleAddAuditor();
    }
    // TODO: Add handlers for other tabs in the future
  };

  // Filter data based on search term
  const filteredData = currentData.filter((item: any) => {
    if (activeTab === "agencies") {
      const agency = item as Agency;
      return (
        agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agency.acronym.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agency.classificationGroup
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        agency.headOfAgency.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (activeTab === "auditors") {
      const auditor = item as Auditor;
      return (
        (auditor.name ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (auditor.agency ?? "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (auditor.position ?? "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (auditor.expertise ?? "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    if (activeTab === "auditAreas") {
      const auditArea = item as AuditArea;
      return auditArea.name.toLowerCase().includes(searchTerm.toLowerCase());
    }

    // TODO: Add search logic for other tabs
    return true;
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-dost-black font-manrope">
        Library
      </h1>

      <div className="bg-dost-white rounded-lg">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === tab.key
                    ? "border-dost-blue text-dost-blue"
                    : "border-transparent text-dost-black/60 hover:text-dost-black hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-4 mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Search and Add Button */}
        <div className="py-4">
          <div className="flex justify-between items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-dost-blue focus:border-transparent focus:outline-none"
              />
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-dost-blue-dark font-bold">
                {loading ? "Loading..." : `${filteredData.length} entries`}
              </span>
              <button
                onClick={handleAddClick}
                className="bg-dost-black text-dost-white p-2 rounded-full hover:bg-dost-blue transition-colors cursor-pointer disabled:opacity-50"
                disabled={loading}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="fixed inset-0 flex justify-center items-center">
            <span className="loader"></span>
          </div>
        )}

        {/* Table */}
        {!loading && (
          <>
            {activeTab === "internalControls" ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-dost-white">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs text-dost-blue-dark uppercase tracking-wider border-b border-gray border-r border-gray-200 font-manrope font-[700]">
                        Internal Control Components
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-500 bg-dost-white">
                    {filteredData.map((control) => (
                      <NumberedTreeNode
                        key={control.id}
                        control={control}
                        level={0}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : activeTab === "auditAreas" ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-dost-white">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs text-dost-blue-dark tracking-wider border-b border-gray border-r border-gray-200 font-manrope font-[700]">
                        Audit Area
                      </th>
                      <th className="px-4 py-2 text-left text-xs text-dost-blue-dark tracking-wider border-b border-gray border-r border-gray-200 font-manrope font-[700]">
                        Sub-Audit Areas
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-500 bg-dost-white">
                    {buildAuditAreaHierarchy(filteredData as AuditArea[]).map(
                      (area) => (
                        <TreeNode
                          key={area.id}
                          area={area}
                          level={0}
                          onClick={handleAuditAreaClick}
                        />
                      )
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              // Regular table for other tabs
              <Table
                headers={getTableHeaders(activeTab)}
                data={formatDataForTable(filteredData, activeTab)}
              />
            )}
          </>
        )}
      </div>

      {/* Agency Modal */}
      {activeTab === "agencies" && showAgencyModal && (
        <AgencyModal
          agency={editingAgency}
          onSave={handleSaveAgency}
          onClose={() => {
            setShowAgencyModal(false);
            setEditingAgency(null);
          }}
          onDelete={handleDeleteAgency}
        />
      )}

      {/* Audit Area Modal */}
      {activeTab === "auditAreas" && showAuditAreaModal && (
        <AuditAreaModal
          auditArea={editingAuditArea}
          onSave={handleSaveAuditArea}
          onClose={() => {
            setShowAuditAreaModal(false);
            setEditingAuditArea(null);
          }}
          onDelete={handleDeleteAuditArea}
        />
      )}

      {/* Auditor Modal */}
      {activeTab === "auditors" && showAuditorModal && (
        <AuditorModal
          auditor={editingAuditor}
          onSave={handleSaveAuditor}
          onClose={() => {
            setShowAuditorModal(false);
            setEditingAuditor(null);
          }}
          onDelete={handleDeleteAuditor}
        />
      )}
    </div>
  );
}

export default Library;
