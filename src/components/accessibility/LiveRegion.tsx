import { useEffect, useState } from 'react'
import { VisuallyHidden } from '@/components/ui/visually-hidden'

interface LiveRegionProps {
  message: string
  politeness?: 'polite' | 'assertive' | 'off'
  clearDelay?: number
}

/**
 * LiveRegion component for announcing dynamic content to screen readers
 * Uses ARIA live regions to announce updates without moving focus
 * 
 * @param message - Message to announce
 * @param politeness - How urgent the announcement is (default: polite)
 * @param clearDelay - Auto-clear after ms (default: 5000)
 */
export function LiveRegion({ 
  message, 
  politeness = 'polite',
  clearDelay = 5000 
}: LiveRegionProps) {
  const [announcement, setAnnouncement] = useState(message)

  useEffect(() => {
    setAnnouncement(message)

    if (message && clearDelay > 0) {
      const timer = setTimeout(() => setAnnouncement(''), clearDelay)
      return () => clearTimeout(timer)
    }
  }, [message, clearDelay])

  return (
    <VisuallyHidden
      role="status"
      aria-live={politeness}
      aria-atomic="true"
    >
      {announcement}
    </VisuallyHidden>
  )
}

/**
 * Hook to manage live region announcements
 */
export function useAnnouncement() {
  const [message, setMessage] = useState('')

  const announce = (msg: string) => setMessage(msg)
  const clear = () => setMessage('')

  return { message, announce, clear }
}
