export type TabKey =
  | "agencies"
  | "auditors"
  | "auditAreas"
  | "auditCriteria"
  | "typesOfAudit"
  | "internalControls"
  | "documentTypes"
  | "userAccounts";

export interface TabComponent {
  key: TabKey;
  label: string;
  component: React.ComponentType<TabProps>;
}

export interface TabProps {
  searchTerm: string;
  onDataCount: (count: number) => void;
  setAddAction?: (action: (() => void) | null) => void;
  onShowingProfile: (showing: boolean) => void;
}
