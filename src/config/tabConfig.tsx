import AgenciesTab from "../submodules/AgenciesTab";
import AuditorsTab from "../submodules/AuditorsTab";
import AuditAreasTab from "../submodules/AuditAreasTab";
import InternalControlsTab from "../submodules/InternalControlsTab";
import GenericTableTab from "../submodules/GenericTableTab";
import type { TabComponent, TabProps } from "../types/libraryTypes";

// Wrapper components for generic tables
const AuditCriteriaTab: React.FC<TabProps> = (props) => (
  <GenericTableTab
    {...props}
    tabKey="auditCriteria"
    headers={["Audit Criteria", "Audit Area", "Reference"]}
    columnKeys={["auditCriteria", "auditArea", "reference"]}
  />
);

const TypesOfAuditTab: React.FC<TabProps> = (props) => (
  <GenericTableTab
    {...props}
    tabKey="typesOfAudit"
    headers={["Name", "Description", "Duration"]}
    columnKeys={["name", "description", "duration"]}
  />
);

const DocumentTypesTab: React.FC<TabProps> = (props) => (
  <GenericTableTab
    {...props}
    tabKey="documentTypes"
    headers={["Type of Document"]}
    columnKeys={["typeOfDocument"]}
  />
);

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
  { key: "typesOfAudit", label: "Types of Audit", component: TypesOfAuditTab },
  {
    key: "internalControls",
    label: "Internal Controls",
    component: InternalControlsTab,
  },
  {
    key: "documentTypes",
    label: "Types of Document",
    component: DocumentTypesTab,
  },
  { key: "userAccounts", label: "User Accounts", component: UserAccountsTab },
];
