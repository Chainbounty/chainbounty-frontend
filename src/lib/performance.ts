/**
 * Performance monitoring utilities for ChainBounty frontend
 * 
 * These utilities help track Core Web Vitals and other performance metrics
 * in development and production environments.
 */

/**
 * Measure and log Core Web Vitals
 * Install web-vitals package: npm install web-vitals
 */
export function initWebVitals() {
  if (typeof window === 'undefined' || import.meta.env.PROD === false) {
    return
  }

  // Dynamic import to avoid bundling in development
  import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
    onCLS(console.log) // Cumulative Layout Shift
    onFID(console.log) // First Input Delay
    onFCP(console.log) // First Contentful Paint
    onLCP(console.log) // Largest Contentful Paint
    onTTFB(console.log) // Time to First Byte
  })
}

/**
 * Mark a performance measurement point
 * @param name - Name of the mark (e.g., 'bounty-list-render-start')
 */
export function mark(name: string) {
  if (typeof window !== 'undefined' && window.performance) {
    performance.mark(name)
  }
}

/**
 * Measure time between two marks
 * @param name - Name of the measurement
 * @param startMark - Start mark name
 * @param endMark - End mark name (defaults to current time)
 * @returns Duration in milliseconds
 */
export function measure(name: string, startMark: string, endMark?: string): number | null {
  if (typeof window === 'undefined' || !window.performance) {
    return null
  }

  try {
    if (endMark) {
      performance.measure(name, startMark, endMark)
    } else {
      performance.measure(name, startMark)
    }

    const measures = performance.getEntriesByName(name, 'measure')
    const lastMeasure = measures[measures.length - 1]
    
    if (import.meta.env.DEV) {
      console.log(`⏱️ ${name}: ${lastMeasure.duration.toFixed(2)}ms`)
    }

    return lastMeasure.duration
  } catch (error) {
    console.warn('Performance measurement failed:', error)
    return null
  }
}

/**
 * Log render time of a component
 * Usage: 
 * ```tsx
 * useEffect(() => {
 *   logRenderTime('BountyListPage')
 * }, [])
 * ```
 */
export function logRenderTime(componentName: string) {
  if (import.meta.env.DEV && typeof window !== 'undefined') {
    const navigationStart = performance.timing?.navigationStart || 0
    const now = performance.now()
    console.log(`🎨 ${componentName} rendered in ${(now - navigationStart).toFixed(2)}ms`)
  }
}

/**
 * Track long tasks (> 50ms) that block the main thread
 */
export function trackLongTasks() {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return
  }

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          console.warn(`⚠️ Long task detected: ${entry.duration.toFixed(2)}ms`, entry)
        }
      }
    })

    observer.observe({ entryTypes: ['longtask'] })
  } catch (error) {
    // Long task API not supported
  }
}

/**
 * Measure bundle size impact
 */
export function logBundleSize() {
  if (typeof window === 'undefined' || !performance.getEntriesByType) {
    return
  }

  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
  
  const scripts = resources.filter(r => r.name.endsWith('.js'))
  const totalSize = scripts.reduce((acc, r) => acc + (r.transferSize || 0), 0)
  
  if (import.meta.env.DEV) {
    console.log('📦 JavaScript bundle size:', {
      totalKB: (totalSize / 1024).toFixed(2),
      chunks: scripts.length,
      scripts: scripts.map(s => ({
        name: s.name.split('/').pop(),
        size: `${((s.transferSize || 0) / 1024).toFixed(2)} KB`,
      })),
    })
  }
}

/**
 * Monitor memory usage (Chrome only)
 */
export function logMemoryUsage() {
  if (typeof window === 'undefined') {
    return
  }

  const memory = (performance as any).memory
  if (!memory) {
    return
  }

  const used = (memory.usedJSHeapSize / 1048576).toFixed(2)
  const total = (memory.totalJSHeapSize / 1048576).toFixed(2)
  const limit = (memory.jsHeapSizeLimit / 1048576).toFixed(2)

  console.log(`💾 Memory: ${used}MB / ${total}MB (limit: ${limit}MB)`)
}

/**
 * Report custom performance metric to analytics
 * @param metric - Metric name
 * @param value - Metric value
 * @param unit - Unit of measurement (default: 'ms')
 */
export function reportMetric(metric: string, value: number, unit = 'ms') {
  // In production, send to your analytics service
  // Example: Google Analytics, Datadog, New Relic, etc.
  
  if (import.meta.env.DEV) {
    console.log(`📊 ${metric}: ${value}${unit}`)
  }

  // TODO: Implement production analytics
  // Example with Google Analytics:
  // gtag('event', 'performance_metric', {
  //   metric_name: metric,
  //   metric_value: value,
  //   metric_unit: unit,
  // })
}

/**
 * usePerformance hook - measure component render time
 * 
 * Usage:
 * ```tsx
 * function MyComponent() {
 *   usePerformance('MyComponent')
 *   // ... rest of component
 * }
 * ```
 */
export function usePerformance(componentName: string) {
  if (import.meta.env.DEV && typeof window !== 'undefined') {
    const markName = `${componentName}-render`
    
    // Mark start of render
    mark(`${markName}-start`)
    
    // Mark end of render (after paint)
    setTimeout(() => {
      mark(`${markName}-end`)
      measure(componentName, `${markName}-start`, `${markName}-end`)
    }, 0)
  }
}

/**
 * Debounce helper for performance optimization
 * Useful for search inputs, resize handlers, etc.
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle helper for performance optimization
 * Useful for scroll handlers, mousemove, etc.
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * Preload a lazy-loaded route
 * Call this when hovering over a link to preload the page
 * 
 * Usage:
 * ```tsx
 * <Link 
 *   to="/bounties/123"
 *   onMouseEnter={() => preloadRoute(() => import('@/pages/BountyDetailPage'))}
 * >
 * ```
 */
export function preloadRoute(importFn: () => Promise<any>) {
  importFn().catch(() => {
    // Ignore preload errors - route will load normally on navigation
  })
}
