/**
 * Date formatting utilities
 */

export interface FormatDateOptions {
  format?: 'short' | 'medium' | 'long';
  locale?: string;
}

/**
 * Formats a date string for display in the UI
 * @param date - The date to format (Date object or ISO string)
 * @param options - Formatting options
 * @returns Formatted date string
 * @example
 * formatDate(new Date(), { format: 'long' }) // "December 25, 2023"
 * formatDate('2023-12-25', { format: 'short' }) // "12/25/23"
 */
export const formatDate = (
  date: Date | string,
  options: FormatDateOptions = {}
): string => {
  const { format = 'medium', locale = 'en-US' } = options;
  
  console.log('Formatting date:', date, 'with options:', options);
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      console.error('Invalid date provided:', date);
      return 'Invalid date';
    }

    const formatOptions: Intl.DateTimeFormatOptions = {
      short: { year: '2-digit' as const, month: 'numeric' as const, day: 'numeric' as const },
      medium: { year: 'numeric' as const, month: 'short' as const, day: 'numeric' as const },
      long: { year: 'numeric' as const, month: 'long' as const, day: 'numeric' as const },
    }[format];

    const formatted = new Intl.DateTimeFormat(locale, formatOptions).format(dateObj);
    console.log('Date formatted successfully:', formatted);
    
    return formatted;
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Error formatting date';
  }
};

/**
 * Gets relative time string (e.g., "2 hours ago", "in 3 days")
 * @param date - The date to compare against current time
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Relative time string
 * @example
 * getRelativeTime(new Date(Date.now() - 3600000)) // "1 hour ago"
 */
export const getRelativeTime = (date: Date | string, locale = 'en-US'): string => {
  console.log('Getting relative time for:', date);
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    
    const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    
    const units = [
      { unit: 'year', ms: 31536000000 },
      { unit: 'month', ms: 2628000000 },
      { unit: 'day', ms: 86400000 },
      { unit: 'hour', ms: 3600000 },
      { unit: 'minute', ms: 60000 },
      { unit: 'second', ms: 1000 },
    ] as const;
    
    for (const { unit, ms } of units) {
      const diff = Math.round(diffMs / ms);
      if (Math.abs(diff) >= 1) {
        return formatter.format(-diff, unit);
      }
    }
    
    return formatter.format(0, 'second');
  } catch (error) {
    console.error('Error getting relative time:', error);
    return 'Unknown time';
  }
}; 