export interface Agency {
  id: number;
  name: string;
  contactDetails: string;
  headOfAgency: string;
  position: string;
  classificationGroup: string;
}

export interface Auditor {
  id: number;
  name: string;
  agencyPosition: string;
  contactDetails: string;
  birthdate: string;
  expertise: string;
  engagements: string;
  rating: number;
}

export interface AuditArea {
  id: number;
  name: string;
  subAreas?: AuditArea[];
  entriesCount?: number;
  isExpanded?: boolean;
}

export interface AuditCriteria {
  id: number;
  name: string;
  description: string;
  type: string;
}

export interface TypeOfAudit {
  id: number;
  name: string;
  description: string;
  duration: string;
}

export interface InternalControl {
  id: number;
  name: string;
  description: string;
  category: string;
}

export interface DocumentType {
  id: number;
  name: string;
  description: string;
  required: boolean;
}

export interface UserAccount {
  id: number;
  username: string;
  fullName: string;
  role: string;
  status: string;
}

export type LibraryData = {
  agencies: Agency[];
  auditors: Auditor[];
  auditAreas: AuditArea[];
  auditCriteria: AuditCriteria[];
  typesOfAudit: TypeOfAudit[];
  internalControls: InternalControl[];
  documentTypes: DocumentType[];
  userAccounts: UserAccount[];
};

export type TabKey = keyof LibraryData;

export const libraryData: LibraryData = {
  agencies: [
    {
      id: 1,
      name: "Philippine Council for Agriculture, Aquatic, Natural Resources Research and Development (PCAARRD)",
      contactDetails:
        "Paseo de Valmayor, Timugan, Economic Garden, Los Baños, Laguna 4030, Philippines\nPlot No. : +63 49 554 9670, Fax No. : +63 49 536 0016, 536 7922",
      headOfAgency: "Dr. Reynaldo V. Ebora",
      position: "Executive Director",
      classificationGroup: "Sectoral Planning Councils",
    },
    {
      id: 2,
      name: "Philippine Council for Health Research & Development (PCHRD)",
      contactDetails:
        "Saltalk Building, DOST Compound, Gen. Santos Ave., Bicutan Taguig City 1631 Philippines\nTelephone: 8837-2931, 8837-8087, 8837-2924\nDirect Lines: 8837-7535, 8837-2942, 8837-7536, 8837-0031, 8837-7535, 8837-7534, 8837-7537",
      headOfAgency: "Dr. Jaime C. Montoya",
      position: "Executive Director",
      classificationGroup: "Sectoral Planning Councils",
    },
  ],
  auditors: [
    {
      id: 1,
      name: "Dr. Justin Case",
      agencyPosition: "PCAARRD\nExecutive Director",
      contactDetails: "jcase@dost.gov.ph\n+63 09192345678",
      birthdate: "20 Jan 1970",
      expertise: "Project Management, Technology Transfer",
      engagements:
        "13 Jan 2023 - 20 Apr 2023\nNational Research Council of the Philippines (NRCP) Audit",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Ms. Casey A. Chambers",
      agencyPosition: "DOST-NCR\nDivision Chief",
      contactDetails: "casey.chambers@gmail.com\n+63 09493344980",
      birthdate: "13 Sep 1968",
      expertise: "Information Technology",
      engagements:
        "25 May 2023 - 5 Jan 2024\nAudit on DOST Sectoral Planning Councils\n(+3 more...)",
      rating: 4.5,
    },
  ],
  auditAreas: [
    {
      id: 1,
      name: "Management and Planning",
      entriesCount: 2,
      isExpanded: true,
      subAreas: [
        { id: 31, name: "R&D Roadmap" },
        {
          id: 32,
          name: "Identification and Conceptualization of Programs/Projects",
        },
      ],
    },
    {
      id: 2,
      name: "Program/Project Management",
      entriesCount: 4,
      isExpanded: true,
      subAreas: [
        {
          id: 21,
          name: "Small Enterprise Technology Upgrading Program (SETUP)",
          isExpanded: true,
          subAreas: [
            { id: 211, name: "Technology Needs Assessment" },
            { id: 212, name: "Memorandum of Agreement" },
            {
              id: 213,
              name: "Project Monitoring and Evaluation Reports",
              isExpanded: true,
              subAreas: [],
            },
            { id: 214, name: "Grants-in-Aid (GIA) Program" },
          ],
        },
      ],
    },
    {
      id: 3,
      name: "Research and Development (R&D) Management",
      entriesCount: 5,
      isExpanded: true,
      subAreas: [
        { id: 31, name: "R&D Roadmap" },
        {
          id: 32,
          name: "Identification and Conceptualization of Programs/Projects",
        },
        { id: 33, name: "Implementation of R&D Projects" },
        { id: 34, name: "Submission of Project Terminal Reports" },
        { id: 35, name: "Contract Research / Collaborative R&D" },
      ],
    },
  ],
  auditCriteria: [
    {
      id: 1,
      name: "Government Auditing Standards",
      description: "Standards set by COA for government auditing",
      type: "Legal Requirement",
    },
    {
      id: 2,
      name: "Internal Control Framework",
      description: "COSO framework for internal controls",
      type: "Best Practice",
    },
  ],
  typesOfAudit: [
    {
      id: 1,
      name: "Financial Audit",
      description: "Examination of financial statements and records",
      duration: "2-3 months",
    },
    {
      id: 2,
      name: "Performance Audit",
      description: "Assessment of efficiency and effectiveness",
      duration: "3-6 months",
    },
  ],
  internalControls: [
    {
      id: 1,
      name: "Segregation of Duties",
      description: "Separation of responsibilities to prevent fraud",
      category: "Preventive",
    },
    {
      id: 2,
      name: "Authorization Controls",
      description: "Proper approval processes for transactions",
      category: "Preventive",
    },
  ],
  documentTypes: [
    {
      id: 1,
      name: "Audit Report",
      description: "Final audit findings and recommendations",
      required: true,
    },
    {
      id: 2,
      name: "Working Papers",
      description: "Supporting documentation for audit procedures",
      required: true,
    },
  ],
  userAccounts: [
    {
      id: 1,
      username: "admin",
      fullName: "System Administrator",
      role: "Administrator",
      status: "Active",
    },
    {
      id: 2,
      username: "auditor1",
      fullName: "John Auditor",
      role: "Auditor",
      status: "Active",
    },
  ],
};
