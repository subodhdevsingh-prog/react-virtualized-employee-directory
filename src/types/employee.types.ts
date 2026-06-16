export type EmployeeStatus = 'active' | 'inactive' | 'on-leave';

export interface Employee {
  id: number;
  name: string;
  department: string;
  role: string;
  salary: number;
  status: EmployeeStatus;
}

/** Keys of {@link Employee} that the table allows sorting by. */
export type SortableEmployeeKey = keyof Employee;
