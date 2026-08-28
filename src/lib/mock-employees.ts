export type MockEmployeeStatus = "Active" | "On Leave" | "Terminated";

export type MockEmployee = {
  id: string;
  name: string;
  email: string;
  phone: string;
  code: string;
  department: string;
  jobTitle: string;
  hireDate: string;
  status: MockEmployeeStatus;
};

export const MOCK_EMPLOYEES: MockEmployee[] = [
  {
    id: "emp-001",
    name: "Adaeze Okafor",
    email: "adaeze.okafor@paynest.local",
    phone: "+234 803 111 2233",
    code: "EMP-001",
    department: "Finance",
    jobTitle: "Chief Financial Officer",
    hireDate: "2018-04-02",
    status: "Active",
  },
  {
    id: "emp-002",
    name: "Chinedu Adeyemi",
    email: "chinedu.adeyemi@paynest.local",
    phone: "+234 802 222 3344",
    code: "EMP-002",
    department: "Engineering",
    jobTitle: "Senior Backend Engineer",
    hireDate: "2021-07-19",
    status: "Active",
  },
  {
    id: "emp-003",
    name: "Fatima Bello",
    email: "fatima.bello@paynest.local",
    phone: "+234 805 333 4455",
    code: "EMP-003",
    department: "Finance",
    jobTitle: "Accountant",
    hireDate: "2022-01-10",
    status: "Active",
  },
  {
    id: "emp-004",
    name: "Tunde Bakare",
    email: "tunde.bakare@paynest.local",
    phone: "+234 806 444 5566",
    code: "EMP-004",
    department: "Operations",
    jobTitle: "Operations Manager",
    hireDate: "2019-11-04",
    status: "On Leave",
  },
  {
    id: "emp-005",
    name: "Ngozi Eze",
    email: "ngozi.eze@paynest.local",
    phone: "+234 701 555 6677",
    code: "EMP-005",
    department: "Engineering",
    jobTitle: "Frontend Engineer",
    hireDate: "2023-03-13",
    status: "Active",
  },
  {
    id: "emp-006",
    name: "Ibrahim Musa",
    email: "ibrahim.musa@paynest.local",
    phone: "+234 803 666 7788",
    code: "EMP-006",
    department: "HR",
    jobTitle: "HR Officer",
    hireDate: "2020-09-21",
    status: "Active",
  },
  {
    id: "emp-007",
    name: "Amara Osei",
    email: "amara.osei@paynest.local",
    phone: "+234 805 777 8899",
    code: "EMP-007",
    department: "Finance",
    jobTitle: "Payroll Analyst",
    hireDate: "2022-06-27",
    status: "Active",
  },
  {
    id: "emp-008",
    name: "Emeka Obi",
    email: "emeka.obi@paynest.local",
    phone: "+234 802 888 9900",
    code: "EMP-008",
    department: "Operations",
    jobTitle: "Logistics Coordinator",
    hireDate: "2017-05-15",
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
