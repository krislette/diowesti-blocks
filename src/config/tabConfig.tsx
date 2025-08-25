import AgenciesTab from "../submodules/AgenciesTab";
import AuditAreasTab from "../submodules/AuditAreasTab";
import AuditCriteriaTab from "../submodules/AuditCriteriaTab";
import AuditorsTab from "../submodules/AuditorsTab";
import AuditTypeTab from "../submodules/AuditTypeTab";
import DocumentTypeTab from "../submodules/DocumentTypeTab";
import InternalControlsTab from "../submodules/InternalControlsTab";
import GenericTableTab from "../submodules/GenericTableTab";
import type { TabComponent, TabProps } from "../types/libraryTypes";

// Wrapper components for generic tables
const UserAccountsTab: React.FC<TabProps> = (props) => (
  <GenericTableTab
    {...props}
    tabKey="userAccounts"
    headers={[
      "Name",
      "Agency",
      "Email Address",
      "Level of Access",
      "Logged In",
    ]}
    columnKeys={["name", "agency", "emailAddress", "levelOfAccess", "loggedIn"]}
  />
);

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
