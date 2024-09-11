// src/app/utils/query-utils.ts

/**
 * Generates a query string from a filter object, including only non-empty values.
 * @param filter - The filter object containing key-value pairs for query parameters.
 * @returns A query string that can be appended to a URL.
 */
export function generateQueryFilter(filter: any): string {
    const queryParts: string[] = [];
    const filterEntries: any[] = Object.entries(filter); // Get filter object entries
  
    filterEntries.forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        // Check if the key is a date field and format it
        if (key.toLowerCase().includes('date') || key.toLowerCase().includes('from') || key.toLowerCase().includes('to')) {
          value = formatDate(value); // Format date
        }
        queryParts.push(`${key}=${encodeURIComponent(value)}`);
      }
    });
  
    return queryParts.length ? `${queryParts.join('&')}` : '';
  }
  
  function formatDate(date: string | Date): string {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Add leading zero
    const day = String(d.getDate()).padStart(2, '0'); // Add leading zero
    return `${year}-${month}-${day}`;
  }