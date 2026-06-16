import type { Employee, EmployeeStatus } from '../types/employee.types';

export const DEPARTMENTS: readonly string[] = [
  'Engineering',
  'HR',
  'Sales',
  'Marketing',
  'Finance',
] as const;

const ROLES: readonly string[] = ['Junior', 'Senior', 'Lead', 'Principal', 'Manager'] as const;

const STATUSES: readonly EmployeeStatus[] = ['active', 'inactive', 'on-leave'] as const;

const FIRST_NAMES: readonly string[] = [
  'Aarav', 'Vivaan', 'Aditya', 'Diya', 'Ananya', 'Ishaan', 'Kabir', 'Saanvi',
  'Riya', 'Arjun', 'Meera', 'Rohan', 'Neha', 'Karan', 'Pooja', 'Sahil',
];

const LAST_NAMES: readonly string[] = [
  'Sharma', 'Verma', 'Patel', 'Reddy', 'Nair', 'Gupta', 'Iyer', 'Singh',
  'Das', 'Mehta', 'Kapoor', 'Bose', 'Rao', 'Joshi', 'Malik', 'Chopra',
];

/**
 * Deterministic pseudo-random generator (mulberry32) so the dataset is stable
 * across reloads, which keeps demos and FPS comparisons reproducible.
 *
 * @param seed - Initial seed value.
 * @returns A function returning floats in the range [0, 1).
 */
function createRng(seed: number): () => number {
  let state = seed >>> 0;
  return (): number => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(items: readonly T[], rng: () => number): T {
  return items[Math.floor(rng() * items.length)] as T;
}

/**
 * Generates an in-memory list of mock employees for the directory.
 *
 * @param count - Number of employee records to create.
 * @returns An array of {@link Employee} records of length `count`.
 */
export function generateEmployees(count: number): Employee[] {
  const rng = createRng(0xc0ffee);
  const employees: Employee[] = new Array<Employee>(count);

  for (let i = 0; i < count; i += 1) {
    const firstName = pick(FIRST_NAMES, rng);
    const lastName = pick(LAST_NAMES, rng);
    const salary = 300_000 + Math.floor(rng() * 2_200_000);

    employees[i] = {
      id: i + 1,
      name: `${firstName} ${lastName}`,
      department: pick(DEPARTMENTS, rng),
      role: pick(ROLES, rng),
      salary,
      status: pick(STATUSES, rng),
    };
  }

  return employees;
}

/** Single shared dataset, generated once at module load. */
export const EMPLOYEES: Employee[] = generateEmployees(10_000);
