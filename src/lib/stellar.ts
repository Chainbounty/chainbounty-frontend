import * as StellarSdk from '@stellar/stellar-sdk'
import { signTransaction } from '@stellar/freighter-api'

// Network configuration
export const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET
export const HORIZON_URL = 'https://horizon-testnet.stellar.org'

// Contract address (placeholder - replace with deployed contract)
export const BOUNTY_CONTRACT_ID = 'CBOUNTY1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'

/**
 * Initialize Stellar Server
 */
export function getStellarServer() {
  return new StellarSdk.Horizon.Server(HORIZON_URL)
}

/**
 * Build and sign a transaction via Freighter
 */
export async function buildAndSignTransaction(params: {
  sourceAddress: string
  operations: StellarSdk.xdr.Operation[]
  memo?: string
}): Promise<string> {
  const { sourceAddress, operations, memo } = params
  const server = getStellarServer()

  // Load source account
  const account = await server.loadAccount(sourceAddress)

  // Build transaction
  const txBuilder = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })

  // Add operations
  operations.forEach(op => txBuilder.addOperation(op))

  // Add memo if provided
  if (memo) {
    txBuilder.addMemo(StellarSdk.Memo.text(memo))
  }

  // Set timeout and build
  const transaction = txBuilder.setTimeout(180).build()

  // Sign via Freighter
  const signedXdr = await signTransaction(transaction.toXDR(), {
    networkPassphrase: NETWORK_PASSPHRASE,
  })

  return signedXdr
}

/**
 * Submit a signed transaction to the network
 */
export async function submitTransaction(signedXdr: string): Promise<{
  hash: string
  success: boolean
  error?: string
}> {
  const server = getStellarServer()

  try {
    const transaction = StellarSdk.TransactionBuilder.fromXDR(
      signedXdr,
      NETWORK_PASSPHRASE
    )
    const result = await server.submitTransaction(transaction as StellarSdk.Transaction)

    return {
      hash: result.hash,
      success: result.successful,
    }
  } catch (err: any) {
    return {
      hash: '',
      success: false,
      error: err?.response?.data?.extras?.result_codes?.transaction || err.message,
    }
  }
}

/**
 * Invoke a Soroban contract (placeholder for contract interaction)
 * In production, use stellar-sdk's Soroban RPC methods
 */
export async function invokeBountyContract(params: {
  sourceAddress: string
  method: 'post_bounty' | 'claim_bounty' | 'submit_work' | 'approve' | 'reject' | 'dispute'
  args: any[]
}): Promise<{ txHash: string; success: boolean; error?: string }> {
  const { sourceAddress, method, args } = params

  try {
    // Build contract invocation operation
    // NOTE: This is a simplified example. Real Soroban contract calls require:
    // - Contract address
    // - Function name
    // - Encoded arguments (ScVal)
    // - Auth setup
    
    // For now, simulate with a payment operation as placeholder
    const operation = StellarSdk.Operation.payment({
      destination: BOUNTY_CONTRACT_ID,
      asset: StellarSdk.Asset.native(),
      amount: '0.0000001', // Minimal amount for testing
    })

    const signedXdr = await buildAndSignTransaction({
      sourceAddress,
      operations: [operation],
      memo: `${method}:${JSON.stringify(args).slice(0, 20)}`,
    })

    const result = await submitTransaction(signedXdr)

    return {
      txHash: result.hash,
      success: result.success,
      error: result.error,
    }
  } catch (err: any) {
    return {
      txHash: '',
      success: false,
      error: err.message || 'Transaction failed',
    }
  }
}

/**
 * Post a bounty on-chain
 */
export async function postBountyOnChain(params: {
  sourceAddress: string
  bountyId: string
  reward: number
  token: string
  issueUrl: string
}): Promise<{ txHash: string; success: boolean; error?: string }> {
  return invokeBountyContract({
    sourceAddress: params.sourceAddress,
    method: 'post_bounty',
    args: [params.bountyId, params.reward, params.token, params.issueUrl],
  })
}

/**
 * Claim a bounty on-chain
 */
export async function claimBountyOnChain(params: {
  sourceAddress: string
  bountyId: string
}): Promise<{ txHash: string; success: boolean; error?: string }> {
  return invokeBountyContract({
    sourceAddress: params.sourceAddress,
    method: 'claim_bounty',
    args: [params.bountyId],
  })
}

/**
 * Submit work on-chain
 */
export async function submitWorkOnChain(params: {
  sourceAddress: string
  bountyId: string
  prUrl: string
  ipfsCid: string
}): Promise<{ txHash: string; success: boolean; error?: string }> {
  return invokeBountyContract({
    sourceAddress: params.sourceAddress,
    method: 'submit_work',
    args: [params.bountyId, params.prUrl, params.ipfsCid],
  })
}

/**
 * Approve work on-chain
 */
export async function approveWorkOnChain(params: {
  sourceAddress: string
  bountyId: string
  feedback?: string
}): Promise<{ txHash: string; success: boolean; error?: string }> {
  return invokeBountyContract({
    sourceAddress: params.sourceAddress,
    method: 'approve',
    args: [params.bountyId, params.feedback || ''],
  })
}

/**
 * Reject work on-chain
 */
export async function rejectWorkOnChain(params: {
  sourceAddress: string
  bountyId: string
  feedback: string
}): Promise<{ txHash: string; success: boolean; error?: string }> {
  return invokeBountyContract({
    sourceAddress: params.sourceAddress,
    method: 'reject',
    args: [params.bountyId, params.feedback],
  })
}

/**
 * Raise dispute on-chain
 */
export async function raiseDisputeOnChain(params: {
  sourceAddress: string
  bountyId: string
  reason: string
  evidenceCid: string
}): Promise<{ txHash: string; success: boolean; error?: string }> {
  return invokeBountyContract({
    sourceAddress: params.sourceAddress,
    method: 'dispute',
    args: [params.bountyId, params.reason, params.evidenceCid],
  })
}
