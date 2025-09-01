import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';

// Utility function to merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

// Format date
export function formatDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM dd, yyyy');
  } catch {
    return dateString;
  }
}

// Format date for input fields
export function formatDateForInput(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, 'yyyy-MM-dd');
  } catch {
    return dateString;
  }
}

// Get category color
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'Food & Dining': 'bg-orange-100 text-orange-800 border-orange-200',
    Transportation: 'bg-blue-100 text-blue-800 border-blue-200',
    Shopping: 'bg-purple-100 text-purple-800 border-purple-200',
    Entertainment: 'bg-pink-100 text-pink-800 border-pink-200',
    Healthcare: 'bg-green-100 text-green-800 border-green-200',
    Utilities: 'bg-gray-100 text-gray-800 border-gray-200',
    Housing: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    Education: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Travel: 'bg-red-100 text-red-800 border-red-200',
    Other: 'bg-slate-100 text-slate-800 border-slate-200',
  };

  return colors[category] || colors['Other'];
}

// Get category icon
export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'Food & Dining': '🍽️',
    Transportation: '🚗',
    Shopping: '🛍️',
    Entertainment: '🎬',
    Healthcare: '🏥',
    Utilities: '⚡',
    Housing: '🏠',
    Education: '📚',
    Travel: '✈️',
    Other: '📝',
  };

  return icons[category] || icons['Other'];
}

// Generate random ID
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
