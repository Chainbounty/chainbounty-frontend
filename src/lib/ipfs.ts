/**
 * Simulated IPFS upload utilities
 * In production, integrate with a real IPFS service like:
 * - web3.storage
 * - pinata
 * - infura IPFS gateway
 */

export interface IPFSUploadResult {
  cid: string
  url: string
  size: number
}

/**
 * Simulated file upload to IPFS
 * Returns a mock CID and gateway URL
 */
export async function uploadToIPFS(file: File): Promise<IPFSUploadResult> {
  // Simulate upload delay
  await new Promise(res => setTimeout(res, 1500))

  // Generate mock CID (in real app, this comes from IPFS node)
  const mockCid = `Qm${Array.from({ length: 44 }, () =>
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[
      Math.floor(Math.random() * 62)
    ]
  ).join('')}`

  return {
    cid: mockCid,
    url: `https://ipfs.io/ipfs/${mockCid}`,
    size: file.size,
  }
}

/**
 * Validate file size and type for upload
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  const MAX_SIZE = 10 * 1024 * 1024 // 10MB
  const ALLOWED_TYPES = [
    'application/pdf',
    'application/zip',
    'application/x-zip-compressed',
    'text/plain',
    'text/markdown',
    'image/png',
    'image/jpeg',
  ]

  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'File size must be under 10MB' }
  }

  if (!ALLOWED_TYPES.includes(file.type) && !file.name.endsWith('.md')) {
    return {
      valid: false,
      error: 'Unsupported file type. Allowed: PDF, ZIP, TXT, MD, PNG, JPG',
    }
  }

  return { valid: true }
}

/**
 * Format bytes to human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
