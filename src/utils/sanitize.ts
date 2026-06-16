/**
 * Removes any HTML tags from a string by stripping `<...>` sequences.
 *
 * This is a defense-in-depth helper: React already escapes text nodes, but
 * stripping tags before rendering ensures stored markup never reaches the DOM
 * even if a value is later passed somewhere less safe.
 *
 * @param input - The raw string that may contain HTML markup.
 * @returns The string with all `<...>` tag sequences removed.
 */
export function stripHtmlTags(input: string): string {
  return input.replace(/<[^>]*>/g, '');
}

/**
 * Produces a display-safe string for rendering as a React text node.
 *
 * Strips HTML tags, collapses surrounding whitespace, and neutralizes a few
 * characters commonly used in injection attempts. The result is plain text and
 * is never passed to `dangerouslySetInnerHTML`.
 *
 * @param input - The raw value to sanitize for display.
 * @returns A trimmed, tag-free string safe to render as text.
 */
export function sanitizeDisplayString(input: string): string {
  return stripHtmlTags(input).replace(/[<>]/g, '').trim();
}
