/**
 * Simple HTML sanitizer to prevent XSS attacks
 * Allows basic formatting tags but strips dangerous elements and attributes
 */
export function sanitizeHtml(html: string): string {
  // Create a temporary div to parse the HTML
  const temp = document.createElement('div');
  temp.textContent = html;

  // Return the text content which is automatically escaped
  return temp.innerHTML;
}
