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
  auditCriteria: string;
  auditArea: string;
  reference: string;
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
  description?: string;
  subControls?: InternalControl[];
  isExpanded?: boolean;
}

export interface DocumentType {
  id: number;
  typeOfDocument: string;
}

export interface UserAccount {
  id: number;
  name: string;
  agency: string;
  emailAddress: string;
  levelOfAccess: string;
  loggedIn: boolean;
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
      auditCriteria:
        "EO 128, s. 1987: Reorganization Act of the National Science and Technology Authority",
      auditArea: "Strategic Planning and Management",
      reference:
        "EO 128, s. 1987: Reorganization Act of the National Science and Technology...\nHarmonized National R&D Agenda (HNRDA)",
    },
    {
      id: 2,
      auditCriteria:
        "EO 784, s. 1982: Reorganizing the National Science Development Board and its Agencies into a National Science and Technology Authority",
      auditArea: "Strategic Planning and Management",
      reference:
        "EO 784, s. 1982: Reorganizing the National Science Development Board and its...",
    },
    {
      id: 3,
      auditCriteria:
        'DOST A.O. No. 17, s. 2022: Amendments to DOST Administrative Order No. 011, series of 2020, otherwise known as the "Guidelines for the Grants-in-Aid (GIA) Program of the Department of Science and Technology (DOST) and its agencies',
      auditArea: "Program/Project Management",
      reference: "",
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
      name: "Control Environment",
      description:
        "It is a product of management's philosophy, style, and supportive attitude, as well as the competence, ethical values, integrity, and morale of the organization's people. The organizational structure and accountability relationships are key factors in the control environment.",
      isExpanded: true,
      subControls: [],
    },
    {
      id: 2,
      name: "Information and Communication",
      description:
        "Include the records system which will ensure the transfer of the required information to employees and Head of Agency to the public it serves, to other public service organizations, and to its network of organizations and sectors that need the information",
      isExpanded: true,
      subControls: [
        {
          id: 21,
          name: "There is a mechanism for the user department to inform the IT Office/Unit of the reports/information needed to be generated from the information systems that are critical to achieving the agency's objectives, including information relative to critical factors.",
        },
        {
          id: 22,
          name: "The agency ensures and monitors user involvement in the development of programs, including the design of internal control checks and balances.",
        },
        {
          id: 23,
          name: "There is a clearly identifiable transaction trail on every information system operation.",
        },
      ],
    },
  ],
  documentTypes: [
    {
      id: 1,
      typeOfDocument: "Administrative Order",
    },
    {
      id: 2,
      typeOfDocument: "Letter",
    },
    {
      id: 3,
      typeOfDocument: "Manual",
    },
    {
      id: 4,
      typeOfDocument: "Memorandum",
    },
    {
      id: 5,
      typeOfDocument: "Special Order",
    },
  ],
  userAccounts: [
    {
      id: 1,
      name: "Dr. Justin Case",
      agency: "DOST-CO",
      emailAddress: "jcase@dost.gov.ph",
      levelOfAccess: "System Administrator",
      loggedIn: true,
    },
    {
      id: 2,
      name: "Ms. Casey A. Chambers",
      agency: "DOST-NCR",
      emailAddress: "casey.chambers@gmail.com",
      levelOfAccess: "Internal Auditor",
      loggedIn: false,
    },
    {
      id: 3,
      name: "Mr. Sebastian C. Philips",
      agency: "TAPI",
      emailAddress: "sphilips@dost.gov.ph",
      levelOfAccess: "External Auditor (inactive)",
      loggedIn: false,
    },
  ],
};
