/**
 * Transaction utility helpers
 */

/**
 * Generate a Stellar Expert link for a transaction
 */
export function getStellarExpertTxUrl(txHash: string, network: 'testnet' | 'public' = 'testnet'): string {
  return `https://stellar.expert/explorer/${network}/tx/${txHash}`
}

/**
 * Generate a Stellar Expert link for an account
 */
export function getStellarExpertAccountUrl(address: string, network: 'testnet' | 'public' = 'testnet'): string {
  return `https://stellar.expert/explorer/${network}/account/${address}`
}

/**
 * Truncate transaction hash for display
 */
export function shortTxHash(hash: string): string {
  if (hash.length <= 16) return hash
  return `${hash.slice(0, 8)}...${hash.slice(-8)}`
}

/**
 * Parse Stellar SDK error into user-friendly message
 */
export function parseStellarError(error: any): string {
  if (typeof error === 'string') return error
  
  // Freighter rejection
  if (error?.message?.includes('User declined')) {
    return 'Transaction was rejected in wallet'
  }

  // Network errors
  if (error?.message?.includes('timeout')) {
    return 'Network timeout. Please try again.'
  }

  // Transaction errors
  const resultCodes = error?.response?.data?.extras?.result_codes
  if (resultCodes) {
    if (resultCodes.transaction === 'tx_insufficient_balance') {
      return 'Insufficient balance to complete transaction'
    }
    if (resultCodes.transaction === 'tx_bad_seq') {
      return 'Transaction sequence error. Please refresh and try again.'
    }
    if (resultCodes.operations) {
      return `Operation failed: ${resultCodes.operations.join(', ')}`
    }
  }

  // Default
  return error?.message || 'Transaction failed. Please try again.'
}

/**
 * Wait for transaction confirmation
 */
export async function waitForTransaction(
  txHash: string,
  timeoutMs: number = 30000
): Promise<{ confirmed: boolean; error?: string }> {
  const startTime = Date.now()
  
  while (Date.now() - startTime < timeoutMs) {
    try {
      // In production, poll Horizon for transaction status
      // const server = getStellarServer()
      // const tx = await server.transactions().transaction(txHash).call()
      // if (tx.successful) return { confirmed: true }
      
      await new Promise(res => setTimeout(res, 2000))
    } catch {
      // Transaction not found yet, continue polling
    }
  }

  return { confirmed: false, error: 'Transaction confirmation timeout' }
}
