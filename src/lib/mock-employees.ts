export type MockEmployeeStatus = "Active" | "On Leave" | "Terminated";

export type MockEmployee = {
  id: string;
  name: string;
  email: string;
  code: string;
  department: string;
  jobTitle: string;
  status: MockEmployeeStatus;
};

export const MOCK_EMPLOYEES: MockEmployee[] = [
  {
    id: "emp-001",
    name: "Adaeze Okafor",
    email: "adaeze.okafor@paynest.local",
    code: "EMP-001",
    department: "Finance",
    jobTitle: "Chief Financial Officer",
    status: "Active",
  },
  {
    id: "emp-002",
    name: "Chinedu Adeyemi",
    email: "chinedu.adeyemi@paynest.local",
    code: "EMP-002",
    department: "Engineering",
    jobTitle: "Senior Backend Engineer",
    status: "Active",
  },
  {
    id: "emp-003",
    name: "Fatima Bello",
    email: "fatima.bello@paynest.local",
    code: "EMP-003",
    department: "Finance",
    jobTitle: "Accountant",
    status: "Active",
  },
  {
    id: "emp-004",
    name: "Tunde Bakare",
    email: "tunde.bakare@paynest.local",
    code: "EMP-004",
    department: "Operations",
    jobTitle: "Operations Manager",
    status: "On Leave",
  },
  {
    id: "emp-005",
    name: "Ngozi Eze",
    email: "ngozi.eze@paynest.local",
    code: "EMP-005",
    department: "Engineering",
    jobTitle: "Frontend Engineer",
    status: "Active",
  },
  {
    id: "emp-006",
    name: "Ibrahim Musa",
    email: "ibrahim.musa@paynest.local",
    code: "EMP-006",
    department: "HR",
    jobTitle: "HR Officer",
    status: "Active",
  },
  {
    id: "emp-007",
    name: "Amara Osei",
    email: "amara.osei@paynest.local",
    code: "EMP-007",
    department: "Finance",
    jobTitle: "Payroll Analyst",
    status: "Active",
  },
  {
    id: "emp-008",
    name: "Emeka Obi",
    email: "emeka.obi@paynest.local",
    code: "EMP-008",
    department: "Operations",
    jobTitle: "Logistics Coordinator",
    status: "Terminated",
  },
];

export const DEPARTMENTS = [
  "Finance",
  "Engineering",
  "Operations",
  "HR",
];

export const EMPLOYEE_STATUSES: MockEmployeeStatus[] = [
  "Active",
  "On Leave",
  "Terminated",
];
