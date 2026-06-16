import { useCallback, useMemo, useState, type ChangeEvent, type ReactElement } from 'react';
import { Table } from './components/Table';
import { RoleSwitcher } from './components/RoleSwitcher';
import { FpsCounter } from './components/FpsCounter';
import { EditEmployeeModal } from './components/EditEmployeeModal';
import { useDebounce } from './hooks/useDebounce';
import { useSortableData } from './hooks/useSortableData';
import { EMPLOYEES, DEPARTMENTS } from './data/generateEmployees';
import type { Employee } from './types/employee.types';
import { sanitizeDisplayString } from './utils/sanitize';

const SEARCH_DEBOUNCE_MS = 300;
const ALL_DEPARTMENTS = 'all';
const numberFormatter = new Intl.NumberFormat('en-IN');

export default function App(): ReactElement {
  const [query, setQuery] = useState<string>('');
  const [department, setDepartment] = useState<string>(ALL_DEPARTMENTS);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_MS);

  const handleQueryChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value);
  }, []);

  const handleDepartmentChange = useCallback((event: ChangeEvent<HTMLSelectElement>): void => {
    setDepartment(event.target.value);
  }, []);

  const filtered = useMemo((): Employee[] => {
    const needle = sanitizeDisplayString(debouncedQuery).toLowerCase();
    return EMPLOYEES.filter((employee): boolean => {
      const matchesDept = department === ALL_DEPARTMENTS || employee.department === department;
      const matchesQuery = needle === '' || employee.name.toLowerCase().includes(needle);
      return matchesDept && matchesQuery;
    });
  }, [debouncedQuery, department]);

  const { sortedData, sortKey, sortDirection, requestSort } = useSortableData<Employee>(
    filtered,
    'id',
  );

  const handleSort = useCallback(
    (key: keyof Employee): void => {
      requestSort(key);
    },
    [requestSort],
  );

  const handleEdit = useCallback((employee: Employee): void => {
    setEditingEmployee(employee);
  }, []);

  const handleCloseEdit = useCallback((): void => {
    setEditingEmployee(null);
  }, []);

  return (
    <div className="min-h-full bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Employee Directory</h1>
            <p className="text-sm text-slate-500">Virtualized table with role-based access</p>
          </div>
          <div className="flex items-center gap-4">
            <FpsCounter />
            <RoleSwitcher />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-6">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <input
            type="search"
            value={query}
            onChange={handleQueryChange}
            placeholder="Search by name…"
            className="w-64 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <label className="sr-only" htmlFor="department-filter">
            Filter by department
          </label>
          <select
            id="department-filter"
            value={department}
            onChange={handleDepartmentChange}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value={ALL_DEPARTMENTS}>All departments</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          <span className="ml-auto text-sm text-slate-500">
            Showing {numberFormatter.format(sortedData.length)} of{' '}
            {numberFormatter.format(EMPLOYEES.length)}
          </span>
        </div>

        <Table.Virtual
          employees={sortedData}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={handleSort}
          onEdit={handleEdit}
        />
      </main>

      {editingEmployee !== null ? (
        <EditEmployeeModal employee={editingEmployee} onClose={handleCloseEdit} />
      ) : null}
    </div>
  );
}
