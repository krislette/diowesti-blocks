import AgenciesTab from "../submodules/AgenciesTab";
import AuditAreasTab from "../submodules/AuditAreasTab";
import AuditCriteriaTab from "../submodules/AuditCriteriaTab";
import AuditorsTab from "../submodules/AuditorsTab";
import AuditTypeTab from "../submodules/AuditTypeTab";
import DocumentTypeTab from "../submodules/DocumentTypeTab";
import InternalControlsTab from "../submodules/InternalControlsTab";
import UserAccountsTab from "../submodules/UserAccountsTab";
import type { TabComponent } from "../types/libraryTypes";

export const tabConfig: TabComponent[] = [
  { key: "agencies", label: "Agencies", component: AgenciesTab },
  { key: "auditors", label: "Auditors", component: AuditorsTab },
  { key: "auditAreas", label: "Audit Areas", component: AuditAreasTab },
  {
    key: "auditCriteria",
    label: "Audit Criteria",
    component: AuditCriteriaTab,
  },
  { key: "typesOfAudit", label: "Types of Audit", component: AuditTypeTab },
  {
    key: "internalControls",
    label: "Internal Controls",
    component: InternalControlsTab,
  },
  {
    key: "documentTypes",
    label: "Types of Document",
    component: DocumentTypeTab,
  },
  { key: "userAccounts", label: "User Accounts", component: UserAccountsTab },
];
