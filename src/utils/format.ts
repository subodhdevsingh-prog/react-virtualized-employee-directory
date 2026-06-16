const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

/**
 * Formats a numeric salary as an Indian Rupee currency string.
 *
 * @param salary - The salary amount in whole rupees.
 * @returns A localized currency string, e.g. `₹12,34,567`.
 */
export function formatSalary(salary: number): string {
  return currencyFormatter.format(salary);
}
