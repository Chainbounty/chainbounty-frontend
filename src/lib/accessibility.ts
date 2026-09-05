/**
 * Accessibility utility functions
 */

/**
 * Generate a unique ID for ARIA associations
 */
export function generateId(prefix: string = 'a11y'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Check if user prefers dark mode
 */
export function prefersDarkMode(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/**
 * Check if user prefers high contrast
 */
export function prefersHighContrast(): boolean {
  return window.matchMedia('(prefers-contrast: high)').matches
}

/**
 * Announce message to screen readers
 * Creates a temporary live region to announce dynamic content
 */
export function announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

/**
 * Trap focus within an element (for modals/dialogs)
 */
export function trapFocus(element: HTMLElement): () => void {
  const focusableSelectors = [
    'button',
    '[href]',
    'input',
    'select',
    'textarea',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',')

  const focusableElements = element.querySelectorAll<HTMLElement>(focusableSelectors)
  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  // Store previously focused element to restore later
  const previouslyFocused = document.activeElement as HTMLElement

  // Focus first element
  firstElement?.focus()

  function handleTabKey(e: KeyboardEvent) {
    if (e.key !== 'Tab') return

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        lastElement?.focus()
        e.preventDefault()
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        firstElement?.focus()
        e.preventDefault()
      }
    }
  }

  element.addEventListener('keydown', handleTabKey)

  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleTabKey)
    previouslyFocused?.focus()
  }
}

/**
 * Get descriptive error message for screen readers
 */
export function getAccessibleErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return `Error: ${error.message}`
  }
  if (typeof error === 'string') {
    return `Error: ${error}`
  }
  return 'An unknown error occurred'
}

/**
 * Format number for screen readers
 * e.g., 1500 -> "1,500" or "one thousand five hundred"
 */
export function formatNumberForSR(
  num: number,
  options: { spelled?: boolean; currency?: string } = {}
): string {
  if (options.spelled) {
    // Simple spelled-out numbers (extend as needed)
    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
    const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']

    if (num < 10) return ones[num]
    if (num < 20) return teens[num - 10]
    if (num < 100) return `${tens[Math.floor(num / 10)]}${ones[num % 10] ? '-' + ones[num % 10] : ''}`
    if (num < 1000) return `${ones[Math.floor(num / 100)]} hundred${num % 100 ? ' ' + formatNumberForSR(num % 100, options) : ''}`
    if (num < 1000000) return `${formatNumberForSR(Math.floor(num / 1000), options)} thousand${num % 1000 ? ' ' + formatNumberForSR(num % 1000, options) : ''}`
    return num.toLocaleString()
  }

  if (options.currency) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: options.currency,
    }).format(num)
  }

  return num.toLocaleString()
}

/**
 * Create accessible label for time-based content
 */
export function formatTimeForSR(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 7) {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }
  if (days > 0) return `${days} ${days === 1 ? 'day' : 'days'} ago`
  if (hours > 0) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  if (minutes > 0) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
  return 'just now'
}

/**
 * Check if element is visible (for conditional ARIA)
 */
export function isElementVisible(element: HTMLElement): boolean {
  return !!(
    element.offsetWidth ||
    element.offsetHeight ||
    element.getClientRects().length
  )
}

/**
 * Get appropriate ARIA role for status
 */
export function getStatusRole(
  type: 'success' | 'error' | 'warning' | 'info'
): 'status' | 'alert' {
  return type === 'error' || type === 'warning' ? 'alert' : 'status'
}
